"use client";

import DataTable from "@/components/DataTable";

export default function AccessoriesModule() {
  const schema = [
    { key: "name", label: "Accessory Name", type: "text" },
    { key: "category", label: "Category", type: "select", options: [
      { value: "Trims", label: "Trims" },
      { value: "Fasteners", label: "Fasteners" },
      { value: "Packaging", label: "Packaging" },
      { value: "Labels", label: "Labels" }
    ]},
    { key: "quantity", label: "Quantity", type: "number" },
    { key: "unit", label: "Unit", type: "select", options: [
      { value: "Pcs", label: "Pcs" },
      { value: "Gross", label: "Gross" },
      { value: "Meters", label: "Meters" },
    ]},
    { key: "cost", label: "Cost Per Unit ($)", type: "number" },
    { key: "threshold", label: "Alert Threshold", type: "number" },
    { key: "status", label: "Status", type: "text" }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>category</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Accessories Inventory</h1>
        </div>
      </div>

      <DataTable 
        moduleName="accessories" 
        schema={schema} 
        title="Trims & Accessories Stock" 
        customActions={(record) => record.status === 'In Stock' ? [{ label: 'Mark Low Stock', status: 'Low Stock', icon: 'warning', successMsg: 'Marked Low Stock' }, { label: 'Mark Out of Stock', status: 'Out of Stock', icon: 'block', successMsg: 'Marked Out of Stock' }] : record.status === 'Low Stock' ? [{ label: 'Restock', status: 'In Stock', icon: 'inventory', successMsg: 'Restocked' }, { label: 'Mark Out of Stock', status: 'Out of Stock', icon: 'block', successMsg: 'Marked Out of Stock' }] : [{ label: 'Restock', status: 'In Stock', icon: 'inventory', successMsg: 'Restocked' }]}
      />
    </div>
  );
}
