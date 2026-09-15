"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/DataTable";
import { getRecords } from "@/utils/dataStore";

export default function BOMModule() {
  const [schema, setSchema] = useState([]);

  useEffect(() => {
    const masterRecords = getRecords("master");
    const fabricRecords = getRecords("fabric");
    const accRecords = getRecords("accessories");

    const dynamicSchema = [
      { 
        key: "style", 
        label: "Product Style", 
        type: "select", 
        options: masterRecords.length > 0 
          ? masterRecords.map(r => ({ value: r.styleCode, label: `${r.styleCode} - ${r.category}` }))
          : [{ value: "", label: "No Styles Found. Please add in Product Master." }]
      },
      { 
        key: "fabric", 
        label: "Primary Fabric", 
        type: "select", 
        options: fabricRecords.length > 0
          ? fabricRecords.map(r => ({ value: r.name, label: r.name }))
          : [{ value: "", label: "No Fabrics Found. Please add in Fabric Stock." }]
      },
      { key: "fabricConsumption", label: "Fabric Cons. (per pc)", type: "number" },
      { 
        key: "accessory", 
        label: "Primary Trim", 
        type: "select", 
        options: accRecords.length > 0
          ? accRecords.map(r => ({ value: r.name, label: r.name }))
          : [{ value: "", label: "No Trims Found. Please add in Accessories." }]
      },
      { key: "accConsumption", label: "Trim Cons. (per pc)", type: "number" },
    ];
    setSchema(dynamicSchema);
  }, []);

  if (schema.length === 0) return null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>receipt_long</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Bill of Materials</h1>
        </div>
      </div>

      <DataTable 
        moduleName="bom" 
        schema={schema} 
        title="BOM Definitions" 
      />
    </div>
  );
}
