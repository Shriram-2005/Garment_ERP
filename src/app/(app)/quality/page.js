"use client";

import DataTable from "@/components/DataTable";
import { useState } from "react";
import { useToast } from "@/components/ToastProvider";

export default function QualityModule() {
  const [showAiModal, setShowAiModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const { addToast } = useToast();

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(null);
    try {
      const response = await fetch('/api/ai/qc-analysis', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      if (data.message) {
        addToast(data.message, "info");
        return;
      }
      
      setAnalysis(data.analysis);
      addToast("Analysis complete!", "success");
    } catch (err) {
      addToast(err.message || "Failed to analyze QC logs", "error");
    } finally {
      setLoading(false);
    }
  };

  const schema = [{ key: 'inspectionId', label: 'Inspection ID' }, { key: 'passQty', label: 'Passed Qty', type: 'number' }, { key: 'failQty', label: 'Failed Qty', type: 'number' }    , { key: "status", label: "Status", type: "text" }];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>fact_check</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Quality Control</h1>
        </div>
        
        <button 
          onClick={() => { setShowAiModal(true); handleAnalyze(); }}
          style={{ 
            padding: '8px 16px', 
            background: 'linear-gradient(45deg, var(--accent), #e9c46a)', 
            color: '#000', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '14px', 
            fontWeight: '600', 
            boxShadow: '0 4px 10px rgba(212, 175, 55, 0.3)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>auto_awesome</span> 
          AI Defect Analysis
        </button>
      </div>

      <DataTable 
        moduleName="quality" 
        schema={schema} 
        title="Quality Control Records" 
        customActions={(record) => record.status === 'Pending' ? [{ label: 'Pass Inspection', status: 'Passed', icon: 'verified', successMsg: 'Passed QA' }, { label: 'Fail Inspection', status: 'Failed', icon: 'cancel', successMsg: 'Failed QA' }] : record.status === 'Failed' ? [{ label: 'Rework Done', status: 'Passed', icon: 'verified', successMsg: 'Passed QA after rework' }] : []}
      />

      {/* AI QC Modal */}
      {showAiModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '32px', borderRadius: '12px', width: '600px', maxWidth: '90%', border: '1px solid var(--accent)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Playfair Display', serif" }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--accent)' }}>auto_awesome</span>
                AI Defect Analysis
              </h2>
              <button onClick={() => { setShowAiModal(false); setAnalysis(null); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '40px 0', color: 'var(--accent)' }}>
                <span className="material-symbols-outlined" style={{ animation: 'spin 2s linear infinite', fontSize: '48px' }}>sync</span>
                <p>Analyzing recent QC logs...</p>
              </div>
            ) : analysis ? (
              <div>
                <div style={{ padding: '16px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--accent)', marginBottom: '24px' }}>
                  <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: '1.6' }}>{analysis.summary}</p>
                </div>
                
                <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Defect Trends (Last {analysis.totalAnalyzed} Logs)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', marginBottom: '24px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                      <th style={{ padding: '8px 0' }}>Defect</th>
                      <th style={{ padding: '8px 0', textAlign: 'center' }}>Frequency</th>
                      <th style={{ padding: '8px 0', textAlign: 'right' }}>Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.defectTrends?.map((d, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '8px 0' }}>{d.defectName}</td>
                        <td style={{ padding: '8px 0', textAlign: 'center' }}>
                          <span style={{ padding: '2px 8px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>{d.frequency}</span>
                        </td>
                        <td style={{ padding: '8px 0', textAlign: 'right', color: d.severity === 'High' ? 'var(--error)' : d.severity === 'Medium' ? '#e9c46a' : 'var(--text-secondary)' }}>
                          {d.severity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Actionable Recommendations</h3>
                <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  {analysis.actionableRecommendations?.map((rec, i) => (
                    <li key={i} style={{ marginBottom: '8px' }}>{rec}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p style={{ color: 'var(--error)' }}>No analysis could be generated.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
