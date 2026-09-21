"use client";

import DataTable from "@/components/DataTable";
import { useState } from "react";
import { useToast } from "@/components/ToastProvider";

export default function MasterModule() {
  const [showAiModal, setShowAiModal] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedBom, setGeneratedBom] = useState(null);
  const { addToast } = useToast();

  const handleGenerateBom = async () => {
    if (!description.trim()) return addToast("Please describe the garment first", "error");
    
    setLoading(true);
    setGeneratedBom(null);
    try {
      const response = await fetch('/api/ai/generate-bom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      setGeneratedBom(data.bom);
      addToast("BOM generated successfully!", "success");
    } catch (err) {
      addToast(err.message || "Failed to generate BOM", "error");
    } finally {
      setLoading(false);
    }
  };

  const schema = [
    { key: "styleCode", label: "Style Code", type: "text" },
    { key: "category", label: "Category", type: "select", options: [
      { value: "T-Shirt", label: "T-Shirt" },
      { value: "Track Pant", label: "Track Pant" },
      { value: "Hoodie", label: "Hoodie" },
      { value: "Jacket", label: "Jacket" },
    ]},
    { key: "season", label: "Season", type: "select", options: [
      { value: "Summer 2026", label: "Summer 2026" },
      { value: "Winter 2026", label: "Winter 2026" },
      { value: "Spring 2026", label: "Spring 2026" },
    ]}
      , { key: "status", label: "Status", type: "text" }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>checkroom</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Product Master</h1>
        </div>
        
        <button 
          onClick={() => setShowAiModal(true)}
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
          AI Generate BOM
        </button>
      </div>

      <DataTable 
        moduleName="master" 
        schema={schema} 
        title="Style Database" 
        customActions={(record) => record.status === 'Draft' ? [{ label: 'Approve', status: 'Active', icon: 'check_circle', successMsg: 'Style Approved' }] : record.status === 'Active' ? [{ label: 'Archive', status: 'Archived', icon: 'archive', successMsg: 'Style Archived' }] : []}
      />

      {/* AI BOM Modal */}
      {showAiModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '32px', borderRadius: '12px', width: '600px', maxWidth: '90%', border: '1px solid var(--accent)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Playfair Display', serif" }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--accent)' }}>auto_awesome</span>
                Generative BOM Creator
              </h2>
              <button onClick={() => { setShowAiModal(false); setGeneratedBom(null); setDescription(""); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>Describe the new style/garment. The AI will estimate the Bill of Materials and manufacturing cost based on available inventory.</p>
            
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-lux"
              placeholder="e.g., Premium summer cotton t-shirt, men's large, with embroidered front logo..."
              style={{ width: '100%', height: '100px', marginBottom: '16px', resize: 'vertical' }}
            />
            
            <button 
              onClick={handleGenerateBom}
              disabled={loading}
              className="btn"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? <span className="material-symbols-outlined" style={{ animation: 'spin 2s linear infinite' }}>sync</span> : <span className="material-symbols-outlined">bolt</span>}
              {loading ? 'Analyzing & Calculating...' : 'Generate BOM'}
            </button>

            {generatedBom && (
              <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--accent)' }}>{generatedBom.styleName} ({generatedBom.category})</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                      <th style={{ padding: '8px 0' }}>Material</th>
                      <th style={{ padding: '8px 0' }}>Qty</th>
                      <th style={{ padding: '8px 0', textAlign: 'right' }}>Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedBom.materials.map((m, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '8px 0' }}>{m.itemName}</td>
                        <td style={{ padding: '8px 0' }}>{m.quantity} {m.unit}</td>
                        <td style={{ padding: '8px 0', textAlign: 'right' }}>${m.estimatedCost.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                      <td colSpan="2" style={{ padding: '16px 0 8px 0' }}>Total Estimated Cost (Per Unit):</td>
                      <td style={{ padding: '16px 0 8px 0', textAlign: 'right' }}>${generatedBom.totalEstimatedCost.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
