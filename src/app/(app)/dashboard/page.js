"use client";

import { useEffect, useState } from "react";
import { getAllData } from "@/utils/dataStore";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(getAllData());
  }, []);

  if (!data) return null;

  const totalStyles = (data.master || []).length;
  const totalSalesQty = (data.sales || []).reduce((acc, curr) => acc + Number(curr.qty || 0), 0);
  const totalFabrics = (data.fabric || []).length;
  const recentOrders = data.sales || [];

  const kpis = [
    { title: "Active Styles", value: totalStyles.toString(), icon: "checkroom", change: "Live" },
    { title: "Total Ordered Qty", value: totalSalesQty.toLocaleString(), icon: "shopping_cart", change: "Units" },
    { title: "Fabric Types in Stock", value: totalFabrics.toString(), icon: "inventory_2", change: "Live" },
    { title: "Order Fulfilment", value: "92%", icon: "task_alt", change: "+1%" },
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
          {recentOrders.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No recent orders.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Buyer</th>
                  <th>Quantity</th>
                  <th>Delivery Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: '500', fontFamily: 'monospace' }}>{order.orderId}</td>
                    <td>{order.buyer}</td>
                    <td>{Number(order.qty).toLocaleString()}</td>
                    <td>{order.deliveryDate}</td>
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
                        {order.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
