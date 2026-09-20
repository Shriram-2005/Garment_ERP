"use client";

import { useEffect, useState } from "react";
import { fetchAllData } from "@/app/actions/dataActions";
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  AreaChart, Area,
  LineChart, Line
} from 'recharts';
import { useProfile } from "@/components/ProfileProvider";

export default function AnalyticsCharts() {
  const [data, setData] = useState(null);
  const { hasAccess } = useProfile();

  useEffect(() => {
    const loadDashboard = async () => {
      const allData = await fetchAllData();
      setData(allData);
    };
    loadDashboard();
  }, []);

  if (!data) return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
      Loading analytics...
    </div>
  );

  // --- CHART DATA PREPARATION ---

  // 1. Sales Distribution (Pie)
  const salesByStatus = hasAccess('sales') ? (data.sales || []).reduce((acc, curr) => {
    const status = curr.status || 'Pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {}) : {};
  const salesChartData = Object.keys(salesByStatus).map(key => ({
    name: key,
    value: salesByStatus[key]
  }));
  const PIE_COLORS = ['#D4AF37', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // 2. Quality Control (Bar)
  const qualityData = hasAccess('quality') ? (data.quality || []).map(q => ({
    name: q.inspectionId,
    Pass: Number(q.passQty || 0),
    Fail: Number(q.failQty || 0)
  })) : [];

  // 3. Fabric Inventory (Area)
  const fabricData = hasAccess('fabric') ? (data.fabric || []).map(f => ({
    name: f.name.substring(0, 10) + '...',
    Quantity: Number(f.quantity || 0)
  })) : [];

  // 4. Costing Analysis (Bar)
  const costingData = hasAccess('costing') ? (data.costing || []).map(c => ({
    name: c.styleCode,
    Cost: Number(c.totalCost || 0)
  })) : [];

  // 5. Stitching Output (Line)
  const stitchingData = hasAccess('stitching') ? (data.stitching || []).map(s => ({
    name: s.lineNo,
    Output: Number(s.outputQty || 0)
  })) : [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px' }}>Business Intelligence</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Analytics</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', marginBottom: '48px' }}>
        
        {/* Sales Pie Chart */}
        {hasAccess('sales') && (
          <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Sales Order Distribution</h3>
            <div style={{ flex: 1 }}>
              {salesChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={salesChartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {salesChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>No Sales Data</div>
              )}
            </div>
          </div>
        )}

        {/* Quality Bar Chart */}
        {hasAccess('quality') && (
          <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Quality Inspections (Pass vs Fail)</h3>
            <div style={{ flex: 1 }}>
              {qualityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={qualityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} />
                    <YAxis stroke="var(--text-secondary)" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                    <Legend />
                    <Bar dataKey="Pass" fill="#00C49F" />
                    <Bar dataKey="Fail" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>No Quality Data</div>
              )}
            </div>
          </div>
        )}

        {/* Costing Analysis Bar Chart */}
        {hasAccess('costing') && (
          <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Costing Analysis per Style</h3>
            <div style={{ flex: 1 }}>
              {costingData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} />
                    <YAxis stroke="var(--text-secondary)" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                    <Bar dataKey="Cost" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>No Costing Data</div>
              )}
            </div>
          </div>
        )}

        {/* Stitching Output Line Chart */}
        {hasAccess('stitching') && (
          <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Stitching Line Output</h3>
            <div style={{ flex: 1 }}>
              {stitchingData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stitchingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} />
                    <YAxis stroke="var(--text-secondary)" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                    <Line type="monotone" dataKey="Output" stroke="#D4AF37" strokeWidth={3} dot={{ r: 5, fill: '#D4AF37' }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>No Stitching Data</div>
              )}
            </div>
          </div>
        )}

        {/* Fabric Area Chart */}
        {hasAccess('fabric') && (
          <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Fabric Inventory Levels</h3>
            <div style={{ flex: 1 }}>
              {fabricData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fabricData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} />
                    <YAxis stroke="var(--text-secondary)" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                    <Area type="monotone" dataKey="Quantity" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>No Fabric Data</div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
