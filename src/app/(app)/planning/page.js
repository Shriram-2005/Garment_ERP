"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/DataTable";
import { fetchRecords, updateRecordStatus } from "@/app/actions/dataActions";
import { useToast } from "@/components/ToastProvider";
import { motion } from "framer-motion";

export default function PlanningModule() {
  const [viewMode, setViewMode] = useState('table');
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const schema = [
    { key: 'planId', label: 'Plan ID' }, 
    { key: 'startDate', label: 'Start Date', type: 'date' }, 
    { key: "status", label: "Status", type: "text" }
  ];

  useEffect(() => {
    if (viewMode === 'kanban') {
      loadSalesOrders();
    }
  }, [viewMode]);

  const loadSalesOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchRecords('sales');
      setSalesOrders(data || []);
    } catch (e) {
      addToast("Failed to load orders for Kanban", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, order) => {
    e.dataTransfer.setData("orderId", order.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData("orderId");
    
    // Optimistic UI update
    setSalesOrders(prev => prev.map(o => o.id === parseInt(orderId) ? { ...o, status: newStatus } : o));
    
    // Database update
    const result = await updateRecordStatus('sales', parseInt(orderId), newStatus);
    if (result.success) {
      addToast(`Moved Job Order to ${newStatus}`, "success");
    } else {
      addToast(result.error || "Failed to move job order", "error");
      loadSalesOrders(); // Revert on failure
    }
  };

  // Ensure these match exact status values for drag and drop
  const columns = [
    { title: "Pending", status: "Pending" },
    { title: "Cutting", status: "Cutting" },
    { title: "Stitching", status: "Stitching" },
    { title: "Quality Control", status: "Quality Control" },
    { title: "Finished Goods", status: "Finished Goods" }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calendar_month</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Production Planning</h1>
        </div>
        
        {/* View Toggle */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setViewMode('table')}
            style={{ padding: '8px 16px', background: viewMode === 'table' ? 'var(--text-primary)' : 'transparent', color: viewMode === 'table' ? 'var(--bg-primary)' : 'var(--text-secondary)', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '500', transition: 'all 0.2s' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>table_rows</span> Table View
          </button>
          <button 
            onClick={() => setViewMode('kanban')}
            style={{ padding: '8px 16px', background: viewMode === 'kanban' ? 'var(--text-primary)' : 'transparent', color: viewMode === 'kanban' ? 'var(--bg-primary)' : 'var(--text-secondary)', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '500', transition: 'all 0.2s' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>view_kanban</span> Kanban Board
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <DataTable 
          moduleName="planning" 
          schema={schema} 
          title="Production Planning Records" 
          customActions={(record) => record.status === 'Draft' ? [{ label: 'Start Production', status: 'In Progress', icon: 'play_arrow', successMsg: 'Production Started' }] : record.status === 'In Progress' ? [{ label: 'Complete Plan', status: 'Completed', icon: 'task_alt', successMsg: 'Plan Completed' }] : []}
        />
      ) : (
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '24px', minHeight: '600px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'var(--accent)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', animation: 'spin 1s linear infinite' }}>sync</span>
            </div>
          ) : (
            columns.map(col => (
              <div 
                key={col.status} 
                style={{ flex: '0 0 300px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', height: '100%' }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.status)}
              >
                <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{col.title}</h3>
                  <span style={{ fontSize: '11px', backgroundColor: 'rgba(212,175,55,0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '12px' }}>
                    {salesOrders.filter(o => (o.status || 'Pending') === col.status).length}
                  </span>
                </div>
                
                <div style={{ padding: '16px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {salesOrders.filter(o => (o.status || 'Pending') === col.status).map(order => (
                    <motion.div 
                      layoutId={`order-${order.id}`}
                      key={order.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, order)}
                      style={{ backgroundColor: 'var(--sidebar-bg)', border: '1px solid var(--border-highlight)', borderRadius: '8px', padding: '16px', cursor: 'grab', boxShadow: 'var(--card-shadow)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--accent)', fontWeight: 'bold' }}>{order.orderId}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Qty: {order.qty}</span>
                      </div>
                      <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>{order.buyer}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
                          <span style={{ fontSize: '10px' }}>{new Date(order.deliveryDate).toLocaleDateString()}</span>
                        </div>
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Draggable</span>
                      </div>
                    </motion.div>
                  ))}
                  
                  {salesOrders.filter(o => (o.status || 'Pending') === col.status).length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-secondary)', fontSize: '12px', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                      Drop items here
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
