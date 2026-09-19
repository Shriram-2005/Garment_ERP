"use client";

import DataTable from "@/components/DataTable";

export default function QualityModule() {
  const schema = [{ key: 'inspectionId', label: 'Inspection ID' }, { key: 'passQty', label: 'Passed Qty', type: 'number' }, { key: 'failQty', label: 'Failed Qty', type: 'number' }    , { key: "status", label: "Status", type: "text" }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>fact_check</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Quality Control</h1>
        </div>
      </div>

      <DataTable 
        moduleName="quality" 
        schema={schema} 
        title="Quality Control Records" 
        customActions={(record) => record.status === 'Pending' ? [{ label: 'Pass Inspection', status: 'Passed', icon: 'verified', successMsg: 'Passed QA' }, { label: 'Fail Inspection', status: 'Failed', icon: 'cancel', successMsg: 'Failed QA' }] : record.status === 'Failed' ? [{ label: 'Rework Done', status: 'Passed', icon: 'verified', successMsg: 'Passed QA after rework' }] : []}
      />
    </div>
  );
}
