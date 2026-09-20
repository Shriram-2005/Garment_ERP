"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { createEmployeeAccount, deleteEmployeeAccount, suspendEmployeeAccount, updateEmployeePermissions } from "@/app/actions/authActions";
import { useToast } from "@/components/ToastProvider";

const ALL_MODULES = [
  { key: "master", label: "Product Master" },
  { key: "matrix", label: "Size & Color Matrix" },
  { key: "bom", label: "Bill of Materials" },
  { key: "costing", label: "Costing & Estimation" },
  { key: "fabric", label: "Fabric Stock" },
  { key: "accessories", label: "Accessories Stock" },
  { key: "purchase", label: "Purchase Orders" },
  { key: "sales", label: "Sales Orders" },
  { key: "mrp", label: "Material Requirement (MRP)" },
  { key: "planning", label: "Production Planning" },
  { key: "cutting", label: "Cutting Floor" },
  { key: "bundle", label: "Bundle Generation" },
  { key: "stitching", label: "Stitching Line" },
  { key: "jobwork", label: "External Jobwork" },
  { key: "finishing", label: "Finishing & Washing" },
  { key: "quality", label: "Quality Control" },
  { key: "packing", label: "Packing Station" },
  { key: "dispatch", label: "Dispatch Logistics" },
  { key: "finished", label: "Finished Goods Stock" }
];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null if creating new
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedModules, setSelectedModules] = useState([]);

  const [actionLoading, setActionLoading] = useState(false);
  const { addToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    // Fetch current user
    const { data: { user } } = await supabase.auth.getUser();
    let profileData = null;
    if (user) {
      const { data } = await supabase.from('user_profiles').select('*').eq('email', user.email).single();
      profileData = data;
      setCurrentUserProfile(profileData);
    }

    // Fetch all users
    let query = supabase.from('user_profiles').select('*').order('created_at', { ascending: false });
    
    // Strict frontend isolation: Only fetch users belonging to the same company
    if (user && profileData && !profileData.role?.toUpperCase().includes('SUPER_ADMIN')) {
      query = query.eq('company_id', profileData.company_id);
    }

    const { data, error } = await query;
    if (!error && data) {
      setUsers(data.filter(u => u.email !== 'garmenterp@gmail.com')); // Double protection to hide super admin
    }
    setLoading(false);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setSelectedModules([]);
    setEditingUser(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setEmail(user.email);
    setPassword(""); // Not allowed to view/edit password here usually, but we leave it blank
    setSelectedModules(user.role.split(',').filter(r => r)); // Assuming role holds comma separated keys
    setIsModalOpen(true);
  };

  const handleToggleModule = (moduleKey) => {
    setSelectedModules(prev => {
      if (prev.includes(moduleKey)) return prev.filter(m => m !== moduleKey);
      return [...prev, moduleKey];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    if (editingUser) {
      // Update permissions
      const res = await updateEmployeePermissions(editingUser.id, selectedModules);
      if (res.success) {
        addToast("Permissions updated successfully", "success");
        setIsModalOpen(false);
        fetchUsers();
      } else {
        addToast(res.error, "error");
      }
    } else {
      // Create new user
      if (!email || !password) {
        addToast("Email and Password are required", "error");
        setActionLoading(false);
        return;
      }
      const companyName = currentUserProfile?.company_name || "Company A";
      const companyId = currentUserProfile?.company_id || null;
      const res = await createEmployeeAccount(email, password, companyName, companyId, selectedModules);

      if (res.success) {
        addToast("User created successfully", "success");
        setIsModalOpen(false);
        fetchUsers();
      } else {
        addToast(res.error, "error");
      }
    }
    setActionLoading(false);
  };

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to permanently delete this user?")) return;

    setActionLoading(true);
    const res = await deleteEmployeeAccount(userId);
    if (res.success) {
      addToast("User deleted successfully", "success");
      fetchUsers();
    } else {
      addToast(res.error, "error");
    }
    setActionLoading(false);
  };

  const handleSuspend = async (userId) => {
    if (!confirm("Are you sure you want to suspend this user?")) return;

    setActionLoading(true);
    const res = await suspendEmployeeAccount(userId);
    if (res.success) {
      addToast("User suspended", "success");
      fetchUsers();
    } else {
      addToast(res.error, "error");
    }
    setActionLoading(false);
  };

  const isAdmin = (roleString) => {
    return roleString && roleString.toLowerCase().includes('admin');
  };

  // If current user is not Admin, they shouldn't see this, but middleware will also protect it
  if (currentUserProfile && !isAdmin(currentUserProfile.role)) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--error)' }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to view User Management.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>
            User Management
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Manage employee access, permissions, and roles.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          style={{
            padding: '12px 24px',
            backgroundColor: 'var(--accent)',
            color: 'var(--bg-primary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(212,175,55,0.2)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person_add</span>
          Add Employee
        </button>
      </div>

      <div className="card" style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <th style={{ padding: '16px' }}>Employee Email</th>
              <th style={{ padding: '16px' }}>Status / Access Level</th>
              <th style={{ padding: '16px' }}>Assigned Modules</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No users found.</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: '500' }}>
                    {user.email}
                    {user.email === currentUserProfile?.email && <span style={{ marginLeft: '8px', fontSize: '10px', backgroundColor: 'rgba(212,175,55,0.1)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px' }}>You</span>}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {user.role === 'SUSPENDED' ? (
                      <span style={{ color: '#E63946', fontSize: '13px', fontWeight: 'bold' }}>Suspended</span>
                    ) : isAdmin(user.role) ? (
                      <span style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: 'bold' }}>Full Admin</span>
                    ) : (
                      <span style={{ color: '#4CAF50', fontSize: '13px', fontWeight: 'bold' }}>Restricted</span>
                    )}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {isAdmin(user.role) ? 'All Modules' : user.role === 'SUSPENDED' ? 'None' : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {user.role.split(',').filter(r => r).map(modKey => {
                          const mod = ALL_MODULES.find(m => m.key === modKey);
                          return mod ? (
                            <span key={modKey} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                              {mod.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenEditModal(user)}
                        disabled={user.email === 'admin@companya.com' || actionLoading}
                        style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px', borderRadius: '4px', cursor: user.email === 'admin@companya.com' ? 'not-allowed' : 'pointer', opacity: user.email === 'admin@companya.com' ? 0.3 : 1 }}
                        title="Edit Permissions"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                      </button>
                      <button
                        onClick={() => handleSuspend(user.id)}
                        disabled={user.email === 'admin@companya.com' || user.role === 'SUSPENDED' || actionLoading}
                        style={{ background: 'transparent', border: '1px solid var(--border-color)', color: '#FFB703', padding: '6px', borderRadius: '4px', cursor: (user.email === 'admin@companya.com' || user.role === 'SUSPENDED') ? 'not-allowed' : 'pointer', opacity: (user.email === 'admin@companya.com' || user.role === 'SUSPENDED') ? 0.3 : 1 }}
                        title="Suspend User"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>block</span>
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={user.email === 'admin@companya.com' || actionLoading}
                        style={{ background: 'transparent', border: '1px solid var(--border-color)', color: '#E63946', padding: '6px', borderRadius: '4px', cursor: user.email === 'admin@companya.com' ? 'not-allowed' : 'pointer', opacity: user.email === 'admin@companya.com' ? 0.3 : 1 }}
                        title="Delete User"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 48px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontFamily: "'Playfair Display', serif" }}>
                {editingUser ? "Edit Employee Permissions" : "Add New Employee"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <form id="user-form" onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Employee Email</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={editingUser ? email : email.replace('@companya.com', '')}
                        onChange={(e) => setEmail(editingUser ? e.target.value : `${e.target.value}@companya.com`)}
                        disabled={!!editingUser}
                        placeholder="worker1"
                        required
                        style={{
                          flex: 1, padding: '12px',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          borderRight: editingUser ? '1px solid var(--border-color)' : 'none',
                          borderRadius: editingUser ? '8px' : '8px 0 0 8px',
                          color: 'var(--text-primary)',
                          outline: 'none',
                          opacity: editingUser ? 0.6 : 1,
                        }}
                      />
                      {!editingUser && (
                        <div style={{
                          padding: '12px 16px',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          borderLeft: 'none',
                          borderRadius: '0 8px 8px 0',
                          color: 'var(--text-secondary)',
                          fontSize: '14px'
                        }}>
                          @companya.com
                        </div>
                      )}
                    </div>
                  </div>
                  {!editingUser && (
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                          width: '100%', padding: '12px',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          borderRadius: '8px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Module Access Permissions</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="button" onClick={() => setSelectedModules(ALL_MODULES.map(m => m.key))} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '12px' }}>Select All</button>
                    <button type="button" onClick={() => setSelectedModules([])} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px' }}>Clear All</button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {ALL_MODULES.map(mod => (
                    <label
                      key={mod.key}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px',
                        backgroundColor: selectedModules.includes(mod.key) ? 'rgba(212,175,55,0.1)' : 'var(--bg-secondary)',
                        border: `1px solid ${selectedModules.includes(mod.key) ? 'var(--accent)' : 'var(--border-color)'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedModules.includes(mod.key)}
                        onChange={() => handleToggleModule(mod.key)}
                        style={{ accentColor: 'var(--accent)', width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '13px', color: selectedModules.includes(mod.key) ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{mod.label}</span>
                    </label>
                  ))}
                </div>
              </form>
            </div>

            <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="user-form"
                disabled={actionLoading}
                style={{ padding: '12px 24px', backgroundColor: 'var(--accent)', color: 'var(--bg-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
              >
                {actionLoading ? 'Saving...' : editingUser ? 'Update Permissions' : 'Create Employee'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
