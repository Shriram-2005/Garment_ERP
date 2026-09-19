"use client";

import DataTable from "@/components/DataTable";

export default function PurchaseModule() {
  const schema = [{ key: 'poNumber', label: 'PO Number' }, { key: 'vendor', label: 'Vendor' }, { key: 'amount', label: 'Amount ($)', type: 'number' }    , { key: "status", label: "Status", type: "text" }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>shopping_cart</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Purchase Orders</h1>
        </div>
      </div>

      <DataTable 
        moduleName="purchase" 
        schema={schema} 
        title="Purchase Orders Records" 
        customActions={(record) => record.status === 'Draft' ? [{ label: 'Send to Vendor', status: 'Sent', icon: 'send', successMsg: 'PO Sent' }] : record.status === 'Sent' ? [{ label: 'Mark Received', status: 'Received', icon: 'inventory', successMsg: 'Goods Received' }] : []}
      />
    </div>
  );
}
