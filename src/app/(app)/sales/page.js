"use client";

import DataTable from "@/components/DataTable";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchRecords } from "@/app/actions/dataActions";

export default function SalesModule() {
  const schema = [
    { key: 'orderId', label: 'Order ID' }, 
    { key: 'styleCode', label: 'Style Code' }, 
    { key: 'buyer', label: 'Buyer' }, 
    { key: 'qty', label: 'Quantity', type: 'number' }, 
    { key: "status", label: "Status", type: "text" }
  ];

  const [deepDiveOrder, setDeepDiveOrder] = useState(null);
  const [lifecycleData, setLifecycleData] = useState({ cutting: 0, stitching: 0, passQty: 0, failQty: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (deepDiveOrder) {
      const loadLifecycle = async () => {
        setLoading(true);
        try {
          const [cutting, stitching, quality] = await Promise.all([
            fetchRecords('cutting'),
            fetchRecords('stitching'),
            fetchRecords('quality')
          ]);
          
          const cut = cutting.filter(c => c.orderId === deepDiveOrder.orderId).reduce((sum, c) => sum + parseInt(c.cutQty || 0), 0);
          const stitch = stitching.filter(s => s.orderId === deepDiveOrder.orderId).reduce((sum, s) => sum + parseInt(s.outputQty || 0), 0);
          const pass = quality.filter(q => q.orderId === deepDiveOrder.orderId).reduce((sum, q) => sum + parseInt(q.passQty || 0), 0);
          const fail = quality.filter(q => q.orderId === deepDiveOrder.orderId).reduce((sum, q) => sum + parseInt(q.failQty || 0), 0);
          
          setLifecycleData({ cutting: cut, stitching: stitch, passQty: pass, failQty: fail });
        } catch (e) {
          console.error("Failed to load lifecycle", e);
        } finally {
          setLoading(false);
        }
      };
      loadLifecycle();
    }
  }, [deepDiveOrder]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #D4AF37', paddingBottom: '24px' }}>
        <div>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>storefront</span> Module</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '400', margin: 0 }}>Sales Orders</h1>
        </div>
      </div>

      <DataTable 
        moduleName="sales" 
        schema={schema} 
        title="Sales Orders Records" 
        customActions={(record) => [
          { label: 'View Lifecycle', icon: 'visibility', onClick: () => setDeepDiveOrder(record) },
          ...(record.status === 'Pending Material' ? [{ label: 'Confirm Order', status: 'Confirmed', icon: 'check_circle', successMsg: 'Order Confirmed' }] : record.status === 'Confirmed' ? [{ label: 'Start Production', status: 'In Production', icon: 'factory', successMsg: 'Production Started' }] : record.status === 'In Production' ? [{ label: 'Complete Order', status: 'Finished Goods', icon: 'task_alt', successMsg: 'Order Completed' }] : [])
        ]}
      />

      {/* Deep Dive Modal */}
      <AnimatePresence>
        {deepDiveOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px'
            }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                width: '100%',
                maxWidth: '1200px',
                height: '100%',
                maxHeight: '800px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ padding: '32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'linear-gradient(to right, rgba(212,175,55,0.1), transparent)' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Sales Order Lifecycle</div>
                  <h2 style={{ margin: 0, fontSize: '32px', fontWeight: '400', fontFamily: 'var(--font-playfair)' }}>{deepDiveOrder.orderId}</h2>
                  <div style={{ display: 'flex', gap: '24px', marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span><strong>Buyer:</strong> {deepDiveOrder.buyer}</span>
                    <span><strong>Style:</strong> {deepDiveOrder.styleCode}</span>
                    <span><strong>Total Qty:</strong> {deepDiveOrder.qty} units</span>
                    <span><strong>Delivery:</strong> {deepDiveOrder.deliveryDate}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setDeepDiveOrder(null)}
                  style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--accent)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px', animation: 'spin 1s linear infinite' }}>sync</span>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                      <div style={{ backgroundColor: 'var(--sidebar-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Total Ordered</div>
                        <div style={{ fontSize: '36px', color: 'var(--text-primary)', fontFamily: 'var(--font-playfair)' }}>{deepDiveOrder.qty}</div>
                      </div>
                      <div style={{ backgroundColor: 'var(--sidebar-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Units Cut</div>
                        <div style={{ fontSize: '36px', color: 'var(--text-primary)', fontFamily: 'var(--font-playfair)' }}>{lifecycleData.cutting}</div>
                        <div style={{ fontSize: '11px', color: 'var(--accent)', marginTop: '8px' }}>{Math.round((lifecycleData.cutting / deepDiveOrder.qty) * 100) || 0}% of order</div>
                      </div>
                      <div style={{ backgroundColor: 'var(--sidebar-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Units Stitched</div>
                        <div style={{ fontSize: '36px', color: 'var(--text-primary)', fontFamily: 'var(--font-playfair)' }}>{lifecycleData.stitching}</div>
                        <div style={{ fontSize: '11px', color: 'var(--accent)', marginTop: '8px' }}>{Math.round((lifecycleData.stitching / deepDiveOrder.qty) * 100) || 0}% of order</div>
                      </div>
                      <div style={{ backgroundColor: 'var(--sidebar-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>QC Passed</div>
                        <div style={{ fontSize: '36px', color: '#4CAF50', fontFamily: 'var(--font-playfair)' }}>{lifecycleData.passQty}</div>
                        <div style={{ fontSize: '11px', color: '#E63946', marginTop: '8px' }}>{lifecycleData.failQty} failed inspection</div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--sidebar-bg)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-color)', flex: 1 }}>
                      <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: '500' }}>Production Pipeline Status</h3>
                      <div style={{ position: 'relative', paddingTop: '40px' }}>
                        <div style={{ position: 'absolute', top: '48px', left: '0', right: '0', height: '2px', backgroundColor: 'var(--border-color)', zIndex: 0 }}></div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                          {[
                            { step: 'Order Confirmed', done: true },
                            { step: 'Cutting Floor', done: lifecycleData.cutting > 0 },
                            { step: 'Stitching Line', done: lifecycleData.stitching > 0 },
                            { step: 'Quality Control', done: (lifecycleData.passQty > 0 || lifecycleData.failQty > 0) },
                            { step: 'Ready to Dispatch', done: lifecycleData.passQty >= parseInt(deepDiveOrder.qty) }
                          ].map((stage, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '120px' }}>
                              <div style={{ 
                                width: '20px', height: '20px', borderRadius: '50%', 
                                backgroundColor: stage.done ? 'var(--accent)' : 'var(--bg-primary)', 
                                border: `2px solid ${stage.done ? 'var(--accent)' : 'var(--border-color)'}`,
                                transition: 'all 0.3s ease'
                              }}></div>
                              <span style={{ fontSize: '11px', textAlign: 'center', color: stage.done ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: stage.done ? '600' : '400' }}>{stage.step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
