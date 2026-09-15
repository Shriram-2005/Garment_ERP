"use client";

import DataTable from "@/components/DataTable";

export default function CuttingModule() {
  const schema = [{ key: 'jobId', label: 'Job ID' }, { key: 'cutQty', label: 'Cut Quantity', type: 'number' }];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>content_cut</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Cutting</h1>
        </div>
      </div>

      <DataTable 
        moduleName="cutting" 
        schema={schema} 
        title="Cutting Records" 
      />
    </div>
  );
}
