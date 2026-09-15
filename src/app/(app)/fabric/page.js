"use client";

import DataTable from "@/components/DataTable";

export default function FabricModule() {
  const schema = [
    { key: "name", label: "Fabric Name", type: "text" },
    { key: "type", label: "Type", type: "select", options: [
      { value: "Knit", label: "Knit" },
      { value: "Woven", label: "Woven" },
      { value: "Denim", label: "Denim" },
    ]},
    { key: "quantity", label: "Quantity", type: "number" },
    { key: "unit", label: "Unit", type: "select", options: [
      { value: "Kgs", label: "Kgs" },
      { value: "Meters", label: "Meters" },
      { value: "Yards", label: "Yards" },
    ]},
    { key: "cost", label: "Cost Per Unit ($)", type: "number" }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>inventory_2</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Fabric Inventory</h1>
        </div>
      </div>

      <DataTable 
        moduleName="fabric" 
        schema={schema} 
        title="Fabric Stock Ledger" 
      />
    </div>
  );
}
