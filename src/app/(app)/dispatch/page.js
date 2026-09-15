"use client";

export default function DispatchModule() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>local_shipping</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Dispatch & Shipment</h1>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '400', margin: 0 }}>Module Data</h2>
          <button style={{ 
            padding: '10px 20px', 
            backgroundColor: '#0A0A0A', 
            color: '#F8F8F8', 
            border: '1px solid #0A0A0A', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.borderColor = '#D4AF37'; e.currentTarget.style.color = '#0A0A0A'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#0A0A0A'; e.currentTarget.style.borderColor = '#0A0A0A'; e.currentTarget.style.color = '#F8F8F8'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
            Add New Record
          </button>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Invoice</th><th>Transporter</th><th>Tracking</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              
              <tr key="0">
                <td>INV-101</td><td>Logistics A</td><td>In Transit</td>
                <td>
                  <button style={{ background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', cursor: 'pointer', padding: '4px 8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }} style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                </td>
              </tr>
              
              <tr key="1">
                <td>INV-102</td><td>Express B</td><td>Delivered</td>
                <td>
                  <button style={{ background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', cursor: 'pointer', padding: '4px 8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }} style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                </td>
              </tr>
              
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
