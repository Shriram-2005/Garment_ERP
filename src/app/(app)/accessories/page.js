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
    { key: "cost", label: "Cost Per Unit ($)", type: "number" }
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
      />
    </div>
  );
}
