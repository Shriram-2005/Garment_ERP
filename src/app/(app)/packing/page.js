"use client";

import DataTable from "@/components/DataTable";

export default function PackingModule() {
  const schema = [{ key: 'cartonNo', label: 'Carton No' }, { key: 'contents', label: 'Contents' }    , { key: "status", label: "Status", type: "text" }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>inventory</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Packing</h1>
        </div>
      </div>

      <DataTable 
        moduleName="packing" 
        schema={schema} 
        title="Packing Records" 
        customActions={(record) => record.status === 'Pending' ? [{ label: 'Seal Carton', status: 'Sealed', icon: 'inventory_2', successMsg: 'Carton Sealed' }] : record.status === 'Sealed' ? [{ label: 'Mark Ready', status: 'Ready for Dispatch', icon: 'local_shipping', successMsg: 'Ready for Dispatch' }] : []}
      />
    </div>
  );
}
