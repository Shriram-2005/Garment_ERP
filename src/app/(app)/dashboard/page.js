"use client";

export default function Dashboard() {
  const kpis = [
    { title: "Production vs Target", value: "85%", icon: "monitoring", change: "+5%" },
    { title: "Line Efficiency", value: "78%", icon: "speed", change: "-2%" },
    { title: "Order Fulfilment", value: "92%", icon: "task_alt", change: "+1%" },
    { title: "Pending Dispatch", value: "1,240", icon: "pending_actions", change: "+45" },
  ];

  const recentOrders = [
    { id: "ORD-001", style: "Crew Neck T-Shirt", qty: 5000, status: "In Production" },
    { id: "ORD-002", style: "Fleece Track Pant", qty: 2500, status: "Cutting" },
    { id: "ORD-003", style: "Cotton Innerwear", qty: 10000, status: "Pending Material" },
    { id: "ORD-004", style: "V-Neck T-Shirt", qty: 3000, status: "Finished Goods" },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px' }}>Facility Overview</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Dashboard</h1>
        </div>
        <button style={{ 
          padding: '12px 24px', 
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
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
          Export Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        {kpis.map((kpi, index) => (
          <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#D4AF37' }}>{kpi.icon}</span>
              <span style={{ fontSize: '11px', color: kpi.change.startsWith('+') ? 'var(--text-primary)' : 'var(--accent)', fontWeight: 'bold' }}>{kpi.change}</span>
            </div>
            <div>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{kpi.title}</p>
              <p style={{ fontSize: '2.5rem', margin: 0 }}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '400', margin: 0 }}>Recent Orders</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Style Description</th>
                <th>Quantity</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: '500', fontFamily: 'monospace' }}>{order.id}</td>
                  <td>{order.style}</td>
                  <td>{order.qty.toLocaleString()}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      border: '1px solid',
                      borderColor: order.status === 'Finished Goods' ? '#D4AF37' : 'var(--border-color)',
                      color: order.status === 'Finished Goods' ? '#D4AF37' : 'var(--text-secondary)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#D4AF37' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
