"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { fetchRecords } from "@/app/actions/dataActions";
import { generatePDFReport } from "@/utils/exportUtils";
import { useProfile } from "@/components/ProfileProvider";

export default function CompleteExport() {
  const { addToast } = useToast();
  const { hasAccess, profile } = useProfile();
  const [isExporting, setIsExporting] = useState(false);

  const isAdmin = profile?.role?.toLowerCase().includes('admin');
  const allTables = [
    { key: 'erp_master', name: 'Product Master' }, { key: 'erp_matrix', name: 'Size & Color Matrix' }, { key: 'erp_bom', name: 'Bill of Materials' }, { key: 'erp_costing', name: 'Costing' },
    { key: 'erp_fabric', name: 'Fabric Stock' }, { key: 'erp_accessories', name: 'Accessories Stock' }, { key: 'erp_purchase', name: 'Purchase Orders' },
    { key: 'erp_sales', name: 'Sales Orders' }, { key: 'erp_mrp', name: 'MRP' }, { key: 'erp_planning', name: 'Production Planning' },
    { key: 'erp_cutting', name: 'Cutting Floor' }, { key: 'erp_bundle', name: 'Bundle Management' }, { key: 'erp_stitching', name: 'Stitching Line' },
    { key: 'erp_jobwork', name: 'External Jobwork' }, { key: 'erp_finishing', name: 'Finishing' }, { key: 'erp_quality', name: 'Quality Inspection' },
    { key: 'erp_packing', name: 'Packing' }, { key: 'erp_finished', name: 'Finished Goods' }, { key: 'erp_dispatch', name: 'Dispatch Logistics' }
  ];
  
  const allowedTables = allTables.filter(t => hasAccess(t.key.replace('erp_', '')));
  const hasFullAccess = isAdmin || allowedTables.length === allTables.length;

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Filter tables based on user access
      const tables = allowedTables;

      if (tables.length === 0) {
        addToast('You do not have access to any modules to export.', 'error');
        setIsExporting(false);
        return;
      }

      // Fetch all data
      const results = await Promise.all(tables.map(t => fetchRecords(t.key.replace('erp_', ''))));
      const dataMap = {};
      tables.forEach((t, index) => {
        dataMap[t.key] = results[index] || [];
      });

      // Pass hasFullAccess as the last param (includeOverview)
      generatePDFReport(dataMap, tables, true, hasFullAccess);
      addToast('PDF Report generated successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate PDF report.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    if (allowedTables.length === 0) {
      addToast('You do not have access to any modules to export.', 'error');
      return;
    }
    const params = new URLSearchParams();
    if (!hasFullAccess) {
      params.append("modules", allowedTables.map(t => t.key).join(","));
    }
    params.append("overview", hasFullAccess);
    
    try {
      addToast('Preparing Excel...', 'info');
      setIsExporting(true);
      const res = await fetch(`/api/export?${params.toString()}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'erp_report.xlsx';
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
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '32px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Complete Export
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px' }}>
          Download a comprehensive backup of all 19 ERP modules. This operation will package all your data into beautifully formatted Excel or PDF files.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        
        {/* EXCEL CARD */}
        <div 
          onClick={handleExportExcel}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderColor = '#2E7D32';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(46, 125, 50, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
          }}
        >
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(46, 125, 50, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#2E7D32' }}>table_view</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '500', color: 'var(--text-primary)' }}>Excel Format</h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Download all data in a multi-sheet .xlsx file with formatted headers.</p>
          </div>
          <button 
            type="button"
            disabled={isExporting}
            style={{ padding: '12px 24px', backgroundColor: '#347e38', color: 'white', border: 'none', borderRadius: '8px', cursor: isExporting ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '14px', width: '100%', opacity: isExporting ? 0.7 : 1 }}
          >
            {isExporting ? 'Downloading...' : 'Download Excel'}
          </button>
        </div>

        {/* PDF CARD */}
        <div 
          onClick={isExporting ? undefined : handleExportPDF}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            cursor: isExporting ? 'wait' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            opacity: isExporting ? 0.7 : 1
          }}
          onMouseOver={(e) => {
            if(!isExporting) {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = '#E63946';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(230, 57, 70, 0.15)';
            }
          }}
          onMouseOut={(e) => {
            if(!isExporting) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            }
          }}
        >
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(230, 57, 70, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#E63946' }}>picture_as_pdf</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '500', color: 'var(--text-primary)' }}>PDF Format</h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Download a beautifully formatted document with a generated index.</p>
          </div>
          <button 
            disabled={isExporting}
            style={{
              padding: '12px 24px', backgroundColor: '#E63946', color: 'white', border: 'none', borderRadius: '8px', cursor: isExporting ? 'wait' : 'pointer', fontWeight: '600', fontSize: '13px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            {isExporting ? (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', animation: 'spin 1s linear infinite' }}>sync</span>
                Generating...
              </>
            ) : "Download PDF"}
          </button>
        </div>

      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
