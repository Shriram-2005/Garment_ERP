"use client";

import DataTable from "@/components/DataTable";

export default function MrpModule() {
  const schema = [{ key: 'planId', label: 'Plan ID' }, { key: 'status', label: 'Status' }];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>precision_manufacturing</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Material Requirement</h1>
        </div>
      </div>

      <DataTable 
        moduleName="mrp" 
        schema={schema} 
        title="Material Requirement Records" 
      />
    </div>
  );
}
