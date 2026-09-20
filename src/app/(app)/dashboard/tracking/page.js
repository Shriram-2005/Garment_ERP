"use client";

import { useEffect, useState } from "react";
import { fetchRecords } from "@/app/actions/dataActions";
import { useRouter } from "next/navigation";
import { useProfile } from "@/components/ProfileProvider";

export default function PipelineTracking() {
  const router = useRouter();
  const { hasAccess } = useProfile();
  
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const modulesWithStatus = [
    { key: 'sales', label: 'Sales Orders Pipeline' },
    { key: 'mrp', label: 'MRP Approval Flow' },
    { key: 'planning', label: 'Production Planning' },
    { key: 'cutting', label: 'Cutting Floor' },
    { key: 'stitching', label: 'Stitching Lines' },
    { key: 'finishing', label: 'Finishing Process' },
    { key: 'packing', label: 'Packing Sequence' },
    { key: 'dispatch', label: 'Dispatch Pipeline' }
  ].filter(m => hasAccess(m.key));

  const [selectedModule, setSelectedModule] = useState(modulesWithStatus.length > 0 ? modulesWithStatus[0].key : "");

  useEffect(() => {
    const loadTracking = async () => {
      if (!selectedModule) {
        setTrackingData([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const moduleRecords = await fetchRecords(selectedModule);
      setTrackingData(moduleRecords || []);
      setLoading(false);
    };
    loadTracking();
  }, [selectedModule]);

  // Group by status
  const flowBoard = trackingData.reduce((acc, curr) => {
    const status = curr.status || 'Pending';
    if (!acc[status]) acc[status] = [];
    acc[status].push(curr);
    return acc;
  }, {});

  // Extract columns and ensure a logical progression
  const columns = Object.keys(flowBoard);
  if (columns.length === 0) {
    columns.push('Pending');
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px' }}>Process Flow</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Pipeline Tracking</h1>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Select Pipeline</label>
          <div style={{ position: 'relative', width: '250px' }}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ 
                width: '100%', padding: '12px 16px', background: 'var(--sidebar-bg)', 
                border: '1px solid var(--border-color)', borderRadius: '8px', 
                color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: '13px', fontWeight: '500', transition: 'border-color 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--border-highlight)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              {selectedModule ? modulesWithStatus.find(m => m.key === selectedModule)?.label : 'No access to pipelines'}
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--accent)', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>expand_more</span>
            </button>
            
            {isDropdownOpen && modulesWithStatus.length > 0 && (
              <>
                <div 
                  onClick={() => setIsDropdownOpen(false)} 
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
                />
                <div style={{ 
                  position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '100%',
                  background: 'var(--sidebar-bg)', backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border-highlight)', borderRadius: '12px',
                  overflow: 'hidden', zIndex: 50, display: 'flex', flexDirection: 'column', 
                  boxShadow: 'var(--card-shadow)'
                }}>
                  {modulesWithStatus.map(m => (
                    <button 
                      key={m.key}
                      onClick={() => { setSelectedModule(m.key); setIsDropdownOpen(false); }}
                      style={{ 
                        padding: '12px 20px', background: 'transparent', border: 'none', 
                        borderBottom: '1px solid var(--border-color)', textAlign: 'left', 
                        cursor: 'pointer', color: selectedModule === m.key ? 'var(--accent)' : 'var(--text-primary)', 
                        fontSize: '12px', fontWeight: '500', transition: 'all 0.2s ease',
                        display: 'flex', alignItems: 'center', gap: '12px'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '24px'; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = selectedModule === m.key ? 'var(--accent)' : 'var(--text-primary)'; e.currentTarget.style.paddingLeft = '20px'; }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading pipeline data...
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '24px', minWidth: '800px', paddingBottom: '16px' }}>
            {columns.map(col => (
              <div key={col} style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #D4AF37', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', color: '#D4AF37' }}>{col}</span>
                  <span style={{ background: 'var(--sidebar-hover)', padding: '2px 8px', borderRadius: '12px', fontSize: '10px' }}>
                    {flowBoard[col]?.length || 0}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(flowBoard[col] || []).map((record, rIdx) => {
                    const keys = Object.keys(record).filter(k => !['id', 'created_at', 'status'].includes(k));
                    const mainKey = keys[0];
                    const subKeys = keys.slice(1, 4); // Get up to 3 subkeys
                    
                    return (
                      <div 
                        key={rIdx} 
                        onClick={() => router.push(`/${selectedModule}`)}
                        style={{ 
                          background: 'var(--sidebar-bg)', 
                          padding: '16px', 
                          borderRadius: '8px', 
                          border: '1px solid var(--border-color)', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          cursor: 'pointer',
                          transition: 'border-color 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = '#D4AF37';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-color)';
                        }}
                      >
                        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '14px', color: 'var(--text-primary)' }}>
                          {record[mainKey]}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {subKeys.map(sk => (
                            record[sk] ? (
                              <p key={sk} style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>
                                <span style={{ textTransform: 'uppercase', marginRight: '4px' }}>{sk}:</span>
                                {record[sk]}
                              </p>
                            ) : null
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {(!flowBoard[col] || flowBoard[col].length === 0) && (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '11px', fontStyle: 'italic' }}>
                      Empty
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}
