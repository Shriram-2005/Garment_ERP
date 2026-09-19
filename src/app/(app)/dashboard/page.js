"use client";

import { useEffect, useState } from "react";
import { fetchAllData } from "@/app/actions/dataActions";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [comparisonType, setComparisonType] = useState("cut_vs_stitch");

  useEffect(() => {
    const loadDashboard = async () => {
      const allData = await fetchAllData();
      setData(allData);
    };
    loadDashboard();
  }, []);

  if (!data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--accent)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', animation: 'spin 1s linear infinite' }}>sync</span>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // --- Data Processing for KPIs ---
  const totalStyles = (data.master || []).length;
  const totalSalesQty = (data.sales || []).reduce((acc, curr) => acc + Number(curr.qty || 0), 0);
  const totalFabrics = (data.fabric || []).length;
  const recentOrders = data.sales || [];
  const fulfilmentRate = recentOrders.length ? Math.round((recentOrders.filter(o => o.status === 'Finished Goods').length / recentOrders.length) * 100) : 0;

  const kpis = [
    { title: "Active Styles", value: totalStyles.toString(), icon: "checkroom", change: "Live" },
    { title: "Total Ordered Qty", value: totalSalesQty.toLocaleString(), icon: "shopping_cart", change: "Units" },
    { title: "Fabric Types in Stock", value: totalFabrics.toString(), icon: "inventory_2", change: "Live" },
    { title: "Order Fulfilment", value: `${fulfilmentRate}%`, icon: "task_alt", change: "Calculated" },
  ];

  // --- Data Processing for Charts ---
  // 1. Sales Trend (Group by deliveryDate month)
  const salesByMonth = {};
  (data.sales || []).forEach(order => {
    if (order.deliveryDate) {
      const month = new Date(order.deliveryDate).toLocaleString('default', { month: 'short' });
      salesByMonth[month] = (salesByMonth[month] || 0) + Number(order.qty || 0);
    }
  });
  const salesData = Object.keys(salesByMonth).map(month => ({ month, qty: salesByMonth[month] }));

  // 2. Inventory Donut Chart
  const totalFabricQty = (data.fabric || []).reduce((acc, curr) => acc + Number(curr.quantity || 0), 0);
  const totalAccQty = (data.accessories || []).reduce((acc, curr) => acc + Number(curr.quantity || 0), 0);
  const inventoryData = [
    { name: 'Fabric', value: totalFabricQty, color: '#D4AF37' },
    { name: 'Accessories', value: totalAccQty, color: '#2A9D8F' }
  ];

  // 3. Dynamic Production Bar Chart
  const totalCut = (data.cutting || []).reduce((acc, curr) => acc + Number(curr.cutQty || 0), 0);
  const totalStitch = (data.stitching || []).reduce((acc, curr) => acc + Number(curr.outputQty || 0), 0);
  const totalQC = (data.quality || []).reduce((acc, curr) => acc + Number(curr.passQty || 0), 0);
  const totalPacked = (data.packing || []).length * 50; // Approximating based on carton contents for demo

  let barData = [];
  if (comparisonType === 'cut_vs_stitch') {
    barData = [{ name: 'Production', 'Cutting': totalCut, 'Stitching': totalStitch }];
  } else if (comparisonType === 'stitch_vs_qc') {
    barData = [{ name: 'Production', 'Stitching': totalStitch, 'QC Passed': totalQC }];
  } else {
    barData = [{ name: 'Production', 'QC Passed': totalQC, 'Packed Units': totalPacked }];
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid var(--accent)', padding: '12px', borderRadius: '8px', color: 'white', boxShadow: '0 4px 12px rgba(212,175,55,0.2)' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ color: entry.color, fontWeight: 'bold', fontSize: '14px', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span>{entry.name}:</span>
              <span>{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px' }}>Executive Analytics</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Dashboard</h1>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {kpis.map((kpi, index) => (
          <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#D4AF37', textShadow: '0 0 10px rgba(212,175,55,0.5)' }}>{kpi.icon}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{kpi.change}</span>
            </div>
            <div>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{kpi.title}</p>
              <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: '300' }}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Sales Trend Line Chart */}
        <motion.div variants={itemVariants} className="card" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '400', marginBottom: '24px', color: 'var(--text-primary)' }}>Sales Trend (Units)</h2>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="qty" name="Units Ordered" stroke="#D4AF37" strokeWidth={3} dot={{ r: 4, fill: '#D4AF37', strokeWidth: 2, stroke: '#121212' }} activeDot={{ r: 6, stroke: '#D4AF37', strokeWidth: 2, fill: '#121212' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Inventory Donut Chart */}
        <motion.div variants={itemVariants} className="card" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '400', marginBottom: '8px', color: 'var(--text-primary)' }}>Inventory Breakdown</h2>
          <div style={{ width: '100%', flex: 1, minHeight: '250px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={inventoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>

      {/* Production Comparison Bar Chart */}
      <motion.div variants={itemVariants} className="card" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '400', margin: 0, color: 'var(--text-primary)' }}>Production Bottleneck Analysis</h2>
          <select 
            className="input-lux" 
            value={comparisonType}
            onChange={(e) => setComparisonType(e.target.value)}
            style={{ width: '250px', backgroundColor: 'var(--bg-secondary)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--accent)' }}
          >
            <option value="cut_vs_stitch">Cutting vs Stitching</option>
            <option value="stitch_vs_qc">Stitching vs Quality Control</option>
            <option value="qc_vs_pack">Quality Control vs Packing</option>
          </select>
        </div>
        
        <div style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={20} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              {comparisonType === 'cut_vs_stitch' && (
                <>
                  <Bar dataKey="Cutting" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Stitching" fill="#E63946" radius={[4, 4, 0, 0]} />
                </>
              )}
              {comparisonType === 'stitch_vs_qc' && (
                <>
                  <Bar dataKey="Stitching" fill="#E63946" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="QC Passed" fill="#2A9D8F" radius={[4, 4, 0, 0]} />
                </>
              )}
              {comparisonType === 'qc_vs_pack' && (
                <>
                  <Bar dataKey="QC Passed" fill="#2A9D8F" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Packed Units" fill="#457B9D" radius={[4, 4, 0, 0]} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </motion.div>
  );
}
