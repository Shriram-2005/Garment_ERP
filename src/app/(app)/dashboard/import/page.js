"use client";

import { useState } from "react";
import Papa from "papaparse";
import { createRecordsBatch } from "@/app/actions/dataActions";
import { useToast } from "@/components/ToastProvider";

const moduleSchemas = {
  master: ['styleCode', 'category', 'season'],
  fabric: ['name', 'type', 'quantity', 'unit', 'cost'],
  accessories: ['name', 'category', 'quantity', 'unit', 'cost'],
  bom: ['style', 'fabric', 'fabricConsumption', 'accessory', 'accConsumption'],
  costing: ['styleCode', 'totalCost'],
  sales: ['orderId', 'buyer', 'qty', 'deliveryDate', 'status'],
  mrp: ['planId', 'status'],
  cutting: ['jobId', 'cutQty'],
  bundle: ['bundleId', 'size', 'pcs'],
  stitching: ['lineNo', 'outputQty'],
  quality: ['inspectionId', 'passQty', 'failQty'],
  packing: ['cartonNo', 'contents'],
  dispatch: ['invoiceNo', 'destination'],
  finished: ['style', 'totalStock'],
  jobwork: ['challanNo', 'contractor'],
  planning: ['planId', 'startDate'],
  purchase: ['poNumber', 'vendor', 'amount'],
  finishing: ['batchId', 'status'],
  matrix: ['styleCode', 'color', 'size']
};

export default function DataImporting() {
  const [selectedModule, setSelectedModule] = useState("sales");
  const [importMethod, setImportMethod] = useState("csv");
  const [parsedData, setParsedData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [validationErrors, setValidationErrors] = useState([]);
  const rowsPerPage = 10;
  const { addToast } = useToast();

  const modules = [
    { key: 'master', label: 'Product Master' },
    { key: 'sales', label: 'Sales Orders' },
    { key: 'fabric', label: 'Fabric Stock' },
    { key: 'accessories', label: 'Trims Stock' },
    { key: 'planning', label: 'Production Planning' },
    { key: 'cutting', label: 'Cutting Floor' },
    { key: 'stitching', label: 'Stitching' },
    { key: 'finishing', label: 'Finishing' },
    { key: 'packing', label: 'Packing' },
    { key: 'dispatch', label: 'Dispatch' },
    { key: 'quality', label: 'Quality Control' },
    { key: 'costing', label: 'Costing' }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const csvHeaders = Object.keys(results.data[0]);
          const expectedHeaders = moduleSchemas[selectedModule] || [];
          
          let errors = [];
          
          // Check for missing columns
          const missing = expectedHeaders.filter(h => !csvHeaders.includes(h));
          if (missing.length > 0) {
            errors.push(`Missing required columns: ${missing.join(', ')}`);
          }
          
          // Check for extra unknown columns
          const extra = csvHeaders.filter(h => !expectedHeaders.includes(h));
          if (extra.length > 0) {
            errors.push(`Unknown columns found: ${extra.join(', ')}`);
          }
          
          setHeaders(csvHeaders);
          setParsedData(results.data);
          setCurrentPage(1);
          setValidationErrors(errors);
          
          if (errors.length === 0) {
            addToast(`Parsed ${results.data.length} rows successfully.`, "success");
          } else {
            addToast(`File validation failed. See errors below.`, "error");
          }
        } else {
          addToast("The uploaded CSV appears to be empty.", "warning");
        }
        setIsProcessing(false);
      },
      error: (error) => {
        addToast(`Failed to parse CSV: ${error.message}`, "error");
        setIsProcessing(false);
      }
    });
  };

  const handleProceed = async () => {
    if (!parsedData || parsedData.length === 0) return;
    
    setIsProcessing(true);
    const result = await createRecordsBatch(selectedModule, parsedData);
    
    if (result.success) {
      addToast(`Successfully imported ${result.count} records to ${modules.find(m => m.key === selectedModule)?.label}!`, "success");
      setParsedData(null); // Reset after success
      setHeaders([]);
      setValidationErrors([]);
    } else {
      addToast(`Import failed: ${result.error}`, "error");
    }
    setIsProcessing(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px' }}>Data Operations</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Data Importing</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Step 1: Select Target Module */}
        <div className="card">
          <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent)', marginBottom: '16px' }}>Step 1: Target Pipeline</h2>
          <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px' }}>
            Select the destination database table for your data.
          </label>
          <div style={{ position: 'relative', width: '100%' }}>
            <button 
              onClick={() => setIsModuleDropdownOpen(!isModuleDropdownOpen)}
              style={{ 
                width: '100%', padding: '16px 0', background: 'transparent', 
                border: 'none', borderBottom: '1px solid var(--border-color)', 
                color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: '15px', transition: 'border-color 0.4s ease', outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderBottom = '1px solid var(--accent)'}
              onBlur={(e) => e.currentTarget.style.borderBottom = '1px solid var(--border-color)'}
            >
              {modules.find(m => m.key === selectedModule)?.label}
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--accent)', transform: isModuleDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>expand_more</span>
            </button>
            
            {isModuleDropdownOpen && (
              <>
                <div 
                  onClick={() => setIsModuleDropdownOpen(false)} 
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
                />
                <div style={{ 
                  position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '100%',
                  background: 'var(--sidebar-bg)', backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border-highlight)', borderRadius: '12px',
                  overflow: 'hidden', zIndex: 50, display: 'flex', flexDirection: 'column', 
                  boxShadow: 'var(--card-shadow)', maxHeight: '300px', overflowY: 'auto'
                }}>
                  {modules.map(m => (
                    <button 
                      key={m.key}
                      onClick={() => { setSelectedModule(m.key); setIsModuleDropdownOpen(false); }}
                      style={{ 
                        padding: '12px 20px', background: 'transparent', border: 'none', 
                        borderBottom: '1px solid var(--border-color)', textAlign: 'left', 
                        cursor: 'pointer', color: selectedModule === m.key ? 'var(--accent)' : 'var(--text-primary)', 
                        fontSize: '13px', fontWeight: '500', transition: 'all 0.2s ease',
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

        {/* Step 2: Select Import Method */}
        <div className="card">
          <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent)', marginBottom: '16px' }}>Step 2: Import Source</h2>
          <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px' }}>
            Choose how you want to ingest the data.
          </label>
          <div style={{ position: 'relative', width: '100%' }}>
            <button 
              onClick={() => setIsMethodDropdownOpen(!isMethodDropdownOpen)}
              style={{ 
                width: '100%', padding: '16px 0', background: 'transparent', 
                border: 'none', borderBottom: '1px solid var(--border-color)', 
                color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: '15px', transition: 'border-color 0.4s ease', outline: 'none'
              }}
            >
              CSV Upload (.csv)
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--accent)', transform: isMethodDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>expand_more</span>
            </button>
            
            {isMethodDropdownOpen && (
              <>
                <div 
                  onClick={() => setIsMethodDropdownOpen(false)} 
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
                />
                <div style={{ 
                  position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '100%',
                  background: 'var(--sidebar-bg)', backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border-highlight)', borderRadius: '12px',
                  overflow: 'hidden', zIndex: 50, display: 'flex', flexDirection: 'column', 
                  boxShadow: 'var(--card-shadow)'
                }}>
                  <button 
                    onClick={() => { setImportMethod('csv'); setIsMethodDropdownOpen(false); }}
                    style={{ 
                      padding: '12px 20px', background: 'transparent', border: 'none', 
                      borderBottom: '1px solid var(--border-color)', textAlign: 'left', 
                      cursor: 'pointer', color: 'var(--accent)', 
                      fontSize: '13px', fontWeight: '500', transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'; e.currentTarget.style.paddingLeft = '24px'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.paddingLeft = '20px'; }}
                  >
                    CSV Upload (.csv)
                  </button>
                  <button 
                    disabled
                    style={{ 
                      padding: '12px 20px', background: 'transparent', border: 'none', 
                      borderBottom: '1px solid var(--border-color)', textAlign: 'left', 
                      color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500', opacity: 0.5
                    }}
                  >
                    Excel Upload (.xlsx) - Coming Soon
                  </button>
                  <button 
                    disabled
                    style={{ 
                      padding: '12px 20px', background: 'transparent', border: 'none', 
                      borderBottom: '1px solid var(--border-color)', textAlign: 'left', 
                      color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500', opacity: 0.5
                    }}
                  >
                    Shopify API Sync - Coming Soon
                  </button>
                  <button 
                    disabled
                    style={{ 
                      padding: '12px 20px', background: 'transparent', border: 'none', 
                      textAlign: 'left', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500', opacity: 0.5
                    }}
                  >
                    Raw JSON Upload - Coming Soon
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Step 3: Upload Zone */}
      {(!parsedData || parsedData.length === 0) && (
        <div className="card" style={{ marginBottom: '32px', textAlign: 'center', padding: '60px 24px', borderStyle: 'dashed' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--text-secondary)', marginBottom: '16px' }}>cloud_upload</span>
          <h3 style={{ fontSize: '18px', fontWeight: '400', margin: '0 0 8px 0' }}>Upload your Data File</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
            Please ensure your CSV column headers match the target module's schema.
          </p>
          <input 
            id="csv-upload"
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            style={{ display: 'none' }}
          />
          <label 
            htmlFor="csv-upload" 
            className="btn btn-primary" 
            style={{ display: 'inline-flex', width: 'auto' }}
          >
            {isProcessing ? 'Parsing File...' : 'Select CSV File'}
          </label>
        </div>
      )}

      {/* Step 4: Preview Data */}
      {parsedData && parsedData.length > 0 && (
        <div className="card" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent)', margin: 0 }}>Step 4: Cross-Check Preview</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--sidebar-hover)', padding: '4px 12px', borderRadius: '12px' }}>
              Showing rows {(currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, parsedData.length)} of {parsedData.length}
            </span>
          </div>

          <div className="table-container" style={{ marginBottom: '32px' }}>
            <table>
              <thead>
                <tr>
                  {headers.map((h, i) => <th key={i}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {parsedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((row, rIdx) => (
                  <tr key={rIdx}>
                    {headers.map((h, cIdx) => (
                      <td key={cIdx}>{row[h] || <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>null</span>}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {parsedData.length > rowsPerPage && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ 
                  background: 'transparent', border: '1px solid var(--border-color)', 
                  color: currentPage === 1 ? 'var(--text-secondary)' : 'var(--text-primary)',
                  padding: '6px 12px', borderRadius: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Page {currentPage} of {Math.ceil(parsedData.length / rowsPerPage)}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(parsedData.length / rowsPerPage), p + 1))}
                disabled={currentPage === Math.ceil(parsedData.length / rowsPerPage)}
                style={{ 
                  background: 'transparent', border: '1px solid var(--border-color)', 
                  color: currentPage === Math.ceil(parsedData.length / rowsPerPage) ? 'var(--text-secondary)' : 'var(--text-primary)',
                  padding: '6px 12px', borderRadius: '8px', cursor: currentPage === Math.ceil(parsedData.length / rowsPerPage) ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
            <button 
              onClick={() => { 
                setParsedData(null); 
                setHeaders([]); 
                setValidationErrors([]);
              }}
              style={{ 
                padding: '12px 24px', borderRadius: '12px', background: 'transparent', 
                border: '1.5px solid var(--error)', color: 'var(--error)', fontSize: '13px', 
                fontWeight: '600', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s ease',
                display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase'
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--error)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(230,57,70,0.2)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--error)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>cancel</span>
              Reject Import
            </button>
            <button 
              onClick={handleProceed}
              disabled={isProcessing || validationErrors.length > 0}
              style={{ 
                padding: '12px 24px', borderRadius: '12px', 
                background: 'transparent', 
                border: (isProcessing || validationErrors.length > 0) ? '1.5px solid var(--border-color)' : '1.5px solid var(--accent)', 
                color: (isProcessing || validationErrors.length > 0) ? 'var(--text-secondary)' : 'var(--accent)', 
                fontSize: '13px', fontWeight: '600', letterSpacing: '1px', 
                cursor: (isProcessing || validationErrors.length > 0) ? 'not-allowed' : 'pointer', 
                transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase'
              }}
              onMouseOver={(e) => { if(!isProcessing && validationErrors.length === 0) { e.currentTarget.style.backgroundColor = 'var(--accent)'; e.currentTarget.style.color = '#000000'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(212, 175, 55, 0.3)'; } }}
              onMouseOut={(e) => { if(!isProcessing && validationErrors.length === 0) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; } }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
              {isProcessing ? 'Importing...' : `Proceed Import (${parsedData.length} Records)`}
            </button>
          </div>

          {validationErrors.length > 0 && (
            <div style={{ marginTop: '24px', padding: '24px', backgroundColor: 'rgba(230, 57, 70, 0.05)', borderRadius: '12px', border: '1px dashed var(--error)', textAlign: 'center' }}>
              <h4 style={{ color: 'var(--error)', margin: '0 0 12px 0', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>error</span>
                Schema Validation Failed
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
                The uploaded CSV does not match the strict schema requirements for the <strong>{modules.find(m => m.key === selectedModule)?.label}</strong> module. Please fix the following errors and re-upload.
              </p>
              <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                {validationErrors.map((err, i) => (
                  <div key={i} style={{ background: 'var(--sidebar-bg)', padding: '12px 16px', borderRadius: '8px', borderLeft: '3px solid var(--error)', color: 'var(--text-primary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--card-shadow)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--error)' }}>warning</span>
                    {err}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
