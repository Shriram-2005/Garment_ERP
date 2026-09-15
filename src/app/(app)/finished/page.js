"use client";

import DataTable from "@/components/DataTable";

export default function FinishedModule() {
  const schema = [{ key: 'style', label: 'Style' }, { key: 'totalStock', label: 'Total Stock', type: 'number' }];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>warehouse</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Finished Goods</h1>
        </div>
      </div>

      <DataTable 
        moduleName="finished" 
        schema={schema} 
        title="Finished Goods Records" 
      />
    </div>
  );
}
