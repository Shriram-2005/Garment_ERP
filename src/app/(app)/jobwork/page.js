"use client";

import DataTable from "@/components/DataTable";

export default function JobworkModule() {
  const schema = [{ key: 'challanNo', label: 'Challan No' }, { key: 'contractor', label: 'Contractor Name' }];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>engineering</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Job Work</h1>
        </div>
      </div>

      <DataTable 
        moduleName="jobwork" 
        schema={schema} 
        title="Job Work Records" 
      />
    </div>
  );
}
