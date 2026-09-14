"use client";

export default function Dashboard() {
  const kpis = [
    { title: "Production Target vs Actual", value: "85%", icon: "monitoring", color: "var(--success)" },
    { title: "Line Efficiency", value: "78%", icon: "speed", color: "var(--warning)" },
    { title: "Order Fulfilment", value: "92%", icon: "task_alt", color: "var(--success)" },
    { title: "Pending Dispatch", value: "1,240 Units", icon: "pending_actions", color: "var(--accent)" },
  ];

  const recentOrders = [
    { id: "ORD-001", style: "Crew Neck T-Shirt", qty: 5000, status: "In Production" },
    { id: "ORD-002", style: "Fleece Track Pant", qty: 2500, status: "Cutting" },
    { id: "ORD-003", style: "Cotton Innerwear", qty: 10000, status: "Pending Material" },
    { id: "ORD-004", style: "V-Neck T-Shirt", qty: 3000, status: "Finished Goods" },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600' }}>Management MIS Dashboard</h1>
        <button className="btn">
          <span className="material-symbols-outlined">download</span>
          Export Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {kpis.map((kpi, index) => (
          <div key={index} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              backgroundColor: `${kpi.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: kpi.color
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>{kpi.icon}</span>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{kpi.title}</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Recent Sales Orders</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Style Description</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: '500' }}>{order.id}</td>
                  <td>{order.style}</td>
                  <td>{order.qty.toLocaleString()}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      backgroundColor: order.status === 'Finished Goods' ? 'var(--success)' : 'var(--bg-tertiary)',
                      color: order.status === 'Finished Goods' ? 'white' : 'inherit'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-outline" style={{ padding: '4px', border: 'none' }}>
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
