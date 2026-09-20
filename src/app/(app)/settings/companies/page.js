"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { useProfile } from "@/components/ProfileProvider";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { createCompanyAndAdmin } from "@/app/actions/authActions";

export default function CompaniesSettings() {
  const { profile } = useProfile();
  const { addToast } = useToast();
  const supabase = createClient();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const isSuperAdmin = profile?.role?.includes('SUPER_ADMIN');

  useEffect(() => {
    if (isSuperAdmin) {
      fetchCompanies();
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdownId) setOpenDropdownId(null);
    };
    // Use a slight delay or capture phase to avoid immediate closing on the toggle button click itself
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openDropdownId]);

  const fetchCompanies = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('erp_companies').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setCompanies(data);
    }
    setLoading(false);
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!companyName || !adminEmail || !adminPassword) return;

    setActionLoading(true);
    const res = await createCompanyAndAdmin(companyName, adminEmail, adminPassword);
    
    if (res.success) {
      addToast("Company and Admin Account created successfully!", "success");
      setIsModalOpen(false);
      setCompanyName("");
      setAdminEmail("");
      setAdminPassword("");
      fetchCompanies();
    } else {
      addToast(res.error || "Failed to create company.", "error");
    }
    setActionLoading(false);
  };

  const toggleCompanyStatus = async (companyId, currentStatus) => {
    if (!confirm(`Are you sure you want to ${currentStatus === 'ACTIVE' ? 'suspend' : 'activate'} this company?`)) return;
    
    setActionLoading(true);
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const { error } = await supabase.from('erp_companies').update({ status: newStatus }).eq('id', companyId);
    
    if (error) {
      addToast("Failed to update company status.", "error");
    } else {
      addToast(`Company is now ${newStatus.toLowerCase()}.`, "success");
      fetchCompanies();
    }
    setActionLoading(false);
  };

  if (!isSuperAdmin) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <h2>Unauthorized</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>Manage Companies</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Global SaaS Dashboard: Onboard and manage client companies.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '12px 24px', backgroundColor: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', transition: 'all 0.3s ease'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_business</span>
          Onboard New Client
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'visible' }}>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading companies...</div>
        ) : companies.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>No companies found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)' }}>COMPANY NAME</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)' }}>STATUS</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)' }}>JOINED DATE</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(company => (
                <tr key={company.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: '500' }}>
                    {company.name}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600',
                      backgroundColor: company.status === 'ACTIVE' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(230, 57, 70, 0.1)',
                      color: company.status === 'ACTIVE' ? '#4caf50' : '#E63946'
                    }}>
                      {company.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {new Date(company.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', position: 'relative' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === company.id ? null : company.id);
                      }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                    >
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                    
                    {openDropdownId === company.id && (
                      <div style={{ 
                        position: 'absolute', right: '32px', top: '32px', backgroundColor: 'var(--bg-primary)', 
                        border: '1px solid var(--border-color)', borderRadius: '8px', zIndex: 10, 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)', minWidth: '160px', textAlign: 'left', overflow: 'hidden' 
                      }}>
                        <button 
                          onClick={() => { setOpenDropdownId(null); addToast("Company details view coming soon", "success"); }} 
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid var(--border-color)' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
                          View Details
                        </button>
                        <button 
                          onClick={() => { toggleCompanyStatus(company.id, company.status); setOpenDropdownId(null); }}
                          disabled={actionLoading}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', color: company.status === 'ACTIVE' ? '#FFB703' : '#4caf50', textAlign: 'left', cursor: actionLoading ? 'not-allowed' : 'pointer' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{company.status === 'ACTIVE' ? 'pause_circle' : 'play_circle'}</span>
                          {company.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', width: '100%', maxWidth: '500px', border: '1px solid var(--border-color)', overflow: 'hidden' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Onboard New Client</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <form onSubmit={handleCreateCompany} style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Company Name</label>
                  <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required style={{ width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Admin Email</label>
                  <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required style={{ width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px' }} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Admin Password</label>
                  <input type="text" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required style={{ width: '100%', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px' }} />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={actionLoading} style={{ padding: '12px 24px', backgroundColor: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>{actionLoading ? 'Creating...' : 'Provision Client'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
