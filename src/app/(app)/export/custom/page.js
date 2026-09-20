"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ToastProvider";
import { fetchRecordsWithFilters } from "@/app/actions/dataActions";
import { generatePDFReport } from "@/utils/exportUtils";
import { createClient } from "@/utils/supabase/client";
import { useProfile } from "@/components/ProfileProvider";

const ALL_MODULES = [
  { key: 'erp_master', name: 'Product Master' }, { key: 'erp_matrix', name: 'Size & Color Matrix' }, { key: 'erp_bom', name: 'Bill of Materials' }, { key: 'erp_costing', name: 'Costing' },
  { key: 'erp_fabric', name: 'Fabric Stock' }, { key: 'erp_accessories', name: 'Accessories Stock' }, { key: 'erp_purchase', name: 'Purchase Orders' },
  { key: 'erp_sales', name: 'Sales Orders' }, { key: 'erp_mrp', name: 'MRP' }, { key: 'erp_planning', name: 'Production Planning' },
  { key: 'erp_cutting', name: 'Cutting Floor' }, { key: 'erp_bundle', name: 'Bundle Management' }, { key: 'erp_stitching', name: 'Stitching Line' },
  { key: 'erp_jobwork', name: 'External Jobwork' }, { key: 'erp_finishing', name: 'Finishing' }, { key: 'erp_quality', name: 'Quality Inspection' },
  { key: 'erp_packing', name: 'Packing' }, { key: 'erp_finished', name: 'Finished Goods' }, { key: 'erp_dispatch', name: 'Dispatch Logistics' }
];

export default function CustomExport() {
  const { addToast } = useToast();
  const { hasAccess, profile } = useProfile();
  const [isExporting, setIsExporting] = useState(false);

  const isAdmin = profile?.role?.toLowerCase().includes('admin');
  const allowedModules = ALL_MODULES.filter(m => hasAccess(m.key.replace('erp_', '')));
  const hasFullAccess = isAdmin || allowedModules.length === ALL_MODULES.length;

  // Form State
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [includeOverview, setIncludeOverview] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);

  useEffect(() => {
    if (profile) {
      if (hasFullAccess) setIncludeOverview(true);
      setSelectedModules(allowedModules.map(m => m.key));
    }
  }, [profile]);

  const handleModuleToggle = (key) => {
    if (!hasAccess(key.replace('erp_', ''))) return;
    setSelectedModules(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleSelectAll = () => setSelectedModules(ALL_MODULES.filter(m => hasAccess(m.key.replace('erp_', ''))).map(m => m.key));
  const handleDeselectAll = () => setSelectedModules([]);

  const validateFilters = () => {
    if (selectedModules.length === 0) {
      addToast("Please select at least one module.", "warning");
      return false;
    }
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      addToast("From Date cannot be after To Date.", "warning");
      return false;
    }
    return true;
  };

  const handleExportPDF = async () => {
    if (!validateFilters()) return;
    setIsExporting(true);
    try {
      const activeModulesConfig = ALL_MODULES.filter(m => selectedModules.includes(m.key));
      
      const supabase = createClient();

      const results = await Promise.all(activeModulesConfig.map(async (t) => {
        let query = supabase.from(t.key).select('*');
        if (fromDate) query = query.gte('created_at', `${fromDate}T00:00:00.000Z`);
        if (toDate) query = query.lte('created_at', `${toDate}T23:59:59.999Z`);
        const { data } = await query;
        return data || [];
      }));

      const dataMap = {};
      activeModulesConfig.forEach((t, index) => {
        dataMap[t.key] = results[index] || [];
      });

      // We use the new argument includeOverview
      generatePDFReport(dataMap, activeModulesConfig, false, includeOverview);
      addToast('Custom PDF Report generated successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate custom PDF report.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    if (!validateFilters()) return;
    const params = new URLSearchParams();
    if (selectedModules.length !== ALL_MODULES.length) {
      params.append("modules", selectedModules.join(","));
    }
    if (fromDate) params.append("from", `${fromDate}T00:00:00.000Z`);
    if (toDate) params.append("to", `${toDate}T23:59:59.999Z`);
    if (includeOverview) params.append("overview", "true");
    
    try {
      addToast('Preparing Excel...', 'info');
      setIsExporting(true);
      const res = await fetch(`/api/export?${params.toString()}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'erp_custom_report.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addToast('Excel Report generated successfully!', 'success');
    } catch (e) {
      addToast('Failed to generate Excel report.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-inter)' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '32px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Custom Export
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px' }}>
          Select specific date ranges and exactly which modules you want to include in your customized report.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px', alignItems: 'start' }}>
        
        {/* Filters Section */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '500', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Configuration</h2>
          
          <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>From Date</label>
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)',
                  borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>To Date</label>
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)',
                  borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                }}
              />
            </div>
          </div>

          {hasFullAccess && (
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '16px' }}>Report Options</label>
              <label 
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
                  backgroundColor: includeOverview ? 'rgba(212,175,55,0.1)' : 'var(--bg-primary)',
                  border: includeOverview ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
                  color: includeOverview ? 'var(--accent)' : 'var(--text-primary)',
                  fontSize: '14px', fontWeight: '500'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={includeOverview}
                  onChange={(e) => setIncludeOverview(e.target.checked)}
                  style={{ accentColor: 'var(--accent)', cursor: 'pointer', width: '16px', height: '16px' }}
                />
                Include Dashboard Overview Page
              </label>
            </div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Select Modules</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleSelectAll} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>Select All</button>
                <button onClick={handleDeselectAll} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>Deselect All</button>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {ALL_MODULES.map(module => {
                const canAccess = hasAccess(module.key.replace('erp_', ''));
                return (
                  <label 
                    key={module.key}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
                      backgroundColor: selectedModules.includes(module.key) ? 'rgba(212,175,55,0.1)' : 'var(--bg-primary)',
                      border: selectedModules.includes(module.key) ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                      borderRadius: '8px', cursor: canAccess ? 'pointer' : 'not-allowed', transition: 'all 0.2s ease',
                      color: canAccess ? (selectedModules.includes(module.key) ? 'var(--accent)' : 'var(--text-primary)') : 'var(--text-secondary)',
                      fontSize: '13px',
                      opacity: canAccess ? 1 : 0.4
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedModules.includes(module.key)}
                      onChange={() => handleModuleToggle(module.key)}
                      disabled={!canAccess}
                      style={{ accentColor: 'var(--accent)', cursor: canAccess ? 'pointer' : 'not-allowed' }}
                    />
                    {module.name}
                    {!canAccess && <span className="material-symbols-outlined" style={{ fontSize: '14px', marginLeft: 'auto' }}>lock</span>}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Download Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div 
            onClick={handleExportExcel}
            style={{
              backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#2E7D32'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#2E7D32' }}>table_view</span>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '500' }}>Custom Excel</h3>
            </div>
            <button 
              type="button"
              disabled={isExporting}
              style={{ padding: '10px', backgroundColor: '#2E7D32', color: 'white', border: 'none', borderRadius: '8px', cursor: isExporting ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '12px', width: '100%', opacity: isExporting ? 0.7 : 1 }}
            >
              {isExporting ? 'Downloading...' : 'Download'}
            </button>
          </div>

          <div 
            onClick={isExporting ? undefined : handleExportPDF}
            style={{
              backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', cursor: isExporting ? 'wait' : 'pointer', transition: 'all 0.3s ease',
              opacity: isExporting ? 0.7 : 1
            }}
            onMouseOver={(e) => { if(!isExporting) e.currentTarget.style.borderColor = '#E63946'; }}
            onMouseOut={(e) => { if(!isExporting) e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#E63946' }}>picture_as_pdf</span>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '500' }}>Custom PDF</h3>
            </div>
            <button disabled={isExporting} style={{ padding: '10px', backgroundColor: '#E63946', color: 'white', border: 'none', borderRadius: '8px', cursor: isExporting ? 'wait' : 'pointer', fontWeight: '600', fontSize: '12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {isExporting ? (
                <><span className="material-symbols-outlined" style={{ fontSize: '14px', animation: 'spin 1s linear infinite' }}>sync</span></>
              ) : "Download"}
            </button>
          </div>
        </div>

      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
