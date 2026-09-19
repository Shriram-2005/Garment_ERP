"use client";

import DataTable from "@/components/DataTable";

export default function MasterModule() {
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
      </div>

      <DataTable 
        moduleName="master" 
        schema={schema} 
        title="Style Database" 
        customActions={(record) => record.status === 'Draft' ? [{ label: 'Approve', status: 'Active', icon: 'check_circle', successMsg: 'Style Approved' }] : record.status === 'Active' ? [{ label: 'Archive', status: 'Archived', icon: 'archive', successMsg: 'Style Archived' }] : []}
      />
    </div>
  );
}
