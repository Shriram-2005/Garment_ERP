"use client";

import DataTable from "@/components/DataTable";

export default function StitchingModule() {
  const schema = [{ key: 'lineNo', label: 'Line Number' }, { key: 'outputQty', label: 'Output Qty', type: 'number' }    , { key: "status", label: "Status", type: "text" }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>format_line_spacing</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Sewing / Stitching</h1>
        </div>
      </div>

      <DataTable 
        moduleName="stitching" 
        schema={schema} 
        title="Sewing / Stitching Records" 
        customActions={(record) => record.status === 'In Progress' ? [{ label: 'Complete Output', status: 'Completed', icon: 'task_alt', successMsg: 'Stitching Completed' }] : []}
      />
    </div>
  );
}
