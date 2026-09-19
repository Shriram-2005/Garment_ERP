"use client";

import DataTable from "@/components/DataTable";

export default function DispatchModule() {
  const schema = [{ key: 'invoiceNo', label: 'Invoice No' }, { key: 'destination', label: 'Destination' }    , { key: "status", label: "Status", type: "text" }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>local_shipping</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Dispatch</h1>
        </div>
      </div>

      <DataTable 
        moduleName="dispatch" 
        schema={schema} 
        title="Dispatch Records" 
        customActions={(record) => record.status === 'Pending' ? [{ label: 'Ship Invoice', status: 'Shipped', icon: 'flight_takeoff', successMsg: 'Shipped' }] : record.status === 'Shipped' ? [{ label: 'Mark Delivered', status: 'Delivered', icon: 'where_to_vote', successMsg: 'Delivered' }] : []}
      />
    </div>
  );
}
