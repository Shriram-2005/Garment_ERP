"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { fetchRecords } from "@/app/actions/dataActions";
import { useToast } from "@/components/ToastProvider";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function TopBar({ toggleTheme, theme, logout, toggleSidebar, user }) {
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const router = useRouter();
  const { notifications, markAllAsRead, addToast, deleteNotification } = useToast();
  
  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Background Stock Checker
  useEffect(() => {
    const checkStockLevels = async () => {
      try {
        const [fabricData, accData] = await Promise.all([
          fetchRecords('fabric'),
          fetchRecords('accessories')
        ]);
        
        const allItems = [
          ...(fabricData || []).map(item => ({ ...item, module: 'Fabric' })),
          ...(accData || []).map(item => ({ ...item, module: 'Accessories' }))
        ];

        allItems.forEach(item => {
          const qty = parseFloat(item.quantity || 0);
          const threshold = parseFloat(item.threshold || 500); // fallback to 500
          
          if (qty < threshold) {
            addToast(`Low Stock Alert: ${item.name} in ${item.module}. Only ${qty} ${item.unit} remaining!`, 'error', 0); // 0 means it won't auto-dismiss, or we can use 5000 so it goes to history
          }
        });
      } catch (err) {
        console.error("Failed to check stock levels", err);
      }
    };
    
    // Slight delay to ensure ToastProvider is fully mounted
    const timer = setTimeout(() => {
      checkStockLevels();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Modules list
  const erpModules = [
    { name: "Product Master", path: "/master" },
    { name: "Fabric Stock", path: "/fabric" },
    { name: "Accessories Stock", path: "/accessories" },
    { name: "Bill of Materials", path: "/bom" },
    { name: "Costing & Estimation", path: "/costing" },
    { name: "Sales Orders", path: "/sales" },
    { name: "Material Requirement (MRP)", path: "/mrp" },
    { name: "Cutting Floor", path: "/cutting" },
    { name: "Bundle Generation", path: "/bundle" },
    { name: "Stitching Line", path: "/stitching" },
    { name: "Quality Control", path: "/quality" },
    { name: "Packing Station", path: "/packing" },
    { name: "Dispatch Logistics", path: "/dispatch" },
    { name: "Finished Goods Stock", path: "/finished" },
    { name: "External Jobwork", path: "/jobwork" },
    { name: "Production Planning", path: "/planning" },
    { name: "Purchase Orders", path: "/purchase" },
    { name: "Finishing & Washing", path: "/finishing" },
    { name: "Size & Color Matrix", path: "/matrix" },
    { name: "Data Importing", path: "/dashboard/import" }
  ];

  // Typewriter effect
  useEffect(() => {
    const currentModule = erpModules[placeholderIndex].name;
    const fullText = `Search ${currentModule}...`;
    
    let timer;
    if (isDeleting) {
      timer = setTimeout(() => {
        setPlaceholderText(fullText.substring(0, placeholderText.length - 1));
        if (placeholderText.length <= 7) { // keep "Search "
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % erpModules.length);
        }
      }, 50); // fast delete
    } else {
      timer = setTimeout(() => {
        setPlaceholderText(fullText.substring(0, placeholderText.length + 1));
        if (placeholderText.length === fullText.length) {
          setTimeout(() => setIsDeleting(true), 2000); // pause at the end
        }
      }, 100); // typing speed
    }
    
    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, placeholderIndex, erpModules]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.global-search-container')) {
        setIsSearchFocused(false);
      }
      if (!e.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
      if (!e.target.closest('.export-container')) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredModules = erpModules.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (logout) logout();
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/export');
      if (!res.ok) throw new Error('Export failed');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "erp_full_report.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setShowExportMenu(false);
    } catch (err) {
      console.error(err);
      addToast('Failed to export Excel report.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      const doc = new jsPDF();
      
      const tables = [
        { key: 'master', name: 'Product Master' }, { key: 'matrix', name: 'Size & Color Matrix' }, { key: 'bom', name: 'Bill of Materials' }, { key: 'costing', name: 'Costing' },
        { key: 'fabric', name: 'Fabric Stock' }, { key: 'accessories', name: 'Accessories Stock' }, { key: 'purchase', name: 'Purchase Orders' },
        { key: 'sales', name: 'Sales Orders' }, { key: 'mrp', name: 'MRP' }, { key: 'planning', name: 'Production Planning' },
        { key: 'cutting', name: 'Cutting Floor' }, { key: 'bundle', name: 'Bundle Management' }, { key: 'stitching', name: 'Stitching Line' },
        { key: 'jobwork', name: 'External Jobwork' }, { key: 'finishing', name: 'Finishing' }, { key: 'quality', name: 'Quality Inspection' },
        { key: 'packing', name: 'Packing' }, { key: 'finished', name: 'Finished Goods' }, { key: 'dispatch', name: 'Dispatch Logistics' }
      ];

      // Fetch all data
      const results = await Promise.all(tables.map(t => fetchRecords(t.key)));
      const dataMap = {};
      tables.forEach((t, index) => {
        dataMap[t.key] = results[index] || [];
      });

      // Page 1 is reserved for Index. We will add a blank page for Index and start drawing on page 2.
      // After all tables are drawn, we'll go back to page 1 and draw the index.
      const indexMap = []; // { name: 'Fabric Stock', pageNumber: 2 }

      // Skip page 1 (which will be the Index)
      doc.addPage();
      
      let firstTable = true;
      tables.forEach((t) => {
        if (!firstTable) {
          doc.addPage();
        }
        firstTable = false;

        const data = dataMap[t.key];
        const pageNumber = doc.internal.getNumberOfPages();
        indexMap.push({ name: t.name, pageNumber });

        // Add Header
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(t.name.toUpperCase(), 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Total Records: ${data.length}`, 14, 26);

        if (data.length > 0) {
          const headers = Object.keys(data[0]).filter(k => k !== 'id' && k !== 'created_at');
          const body = data.map(row => headers.map(h => row[h] ? String(row[h]) : ""));

          autoTable(doc, {
            startY: 32,
            head: [headers.map(h => h.toUpperCase())],
            body: body,
            theme: 'grid',
            headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0], fontStyle: 'bold' }, // D4AF37 Gold
            styles: { fontSize: 8, cellPadding: 3, textColor: [50, 50, 50] },
            alternateRowStyles: { fillColor: [250, 250, 250] },
          });
        } else {
          doc.setFontSize(12);
          doc.setTextColor(150, 150, 150);
          doc.text("No records found.", 14, 40);
        }
      });

      // Draw Index on Page 1
      doc.setPage(1);
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      doc.text("GARMENT ERP - MASTER REPORT", 14, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
      
      doc.setLineWidth(0.5);
      doc.setDrawColor(212, 175, 55); // Gold line
      doc.line(14, 32, 196, 32);

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("INDEX", 14, 45);

      const indexBody = indexMap.map((item, i) => [`${i + 1}. ${item.name}`, `Page ${item.pageNumber}`]);
      
      autoTable(doc, {
        startY: 50,
        body: indexBody,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2.5, textColor: [0, 0, 0] },
        columnStyles: { 
          0: { cellWidth: 'auto' }, 
          1: { cellWidth: 30, halign: 'right', fontStyle: 'bold' } 
        }
      });

      doc.save("erp_full_report.pdf");
      addToast('PDF Report generated successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate PDF report.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const email = user?.email || "Admin User";
  const initial = user?.email ? user.email.charAt(0).toUpperCase() : "A";

  return (
    <header style={{
      height: '70px',
      backgroundColor: 'var(--glass-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button 
          onClick={toggleSidebar}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            marginRight: '16px'
          }}
          title="Toggle Sidebar"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>menu</span>
        </button>
        <div className="global-search-container" style={{ position: 'relative', width: '380px' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '9px', fontSize: '20px', color: isSearchFocused ? 'var(--accent)' : 'var(--text-secondary)', transition: 'color 0.3s ease' }}>search</span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder={placeholderText || "Search..."}
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              borderRadius: '20px',
              border: isSearchFocused ? '1px solid var(--accent)' : '1px solid var(--border-color)',
              backgroundColor: 'rgba(255,255,255,0.03)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
              boxShadow: isSearchFocused ? '0 0 10px rgba(212,175,55,0.1)' : 'none',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-inter)'
            }}
          />
          
          {isSearchFocused && (
            <div style={{
              position: 'absolute',
              top: '45px',
              left: 0,
              right: 0,
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              maxHeight: '300px',
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              zIndex: 100,
              padding: '8px 0'
            }}>
              {filteredModules.length > 0 ? (
                <>
                  <div style={{ padding: '8px 16px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Quick Navigation</div>
                  {filteredModules.map((module, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        router.push(module.path);
                        setIsSearchFocused(false);
                        setSearchQuery("");
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontSize: '13px',
                        textAlign: 'left',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'; e.currentTarget.style.color = 'var(--accent)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>arrow_right_alt</span>
                        {module.name}
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>
                  No modules found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        
        {/* Export Dropdown */}
        <div className="export-container" style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
            style={{
              padding: '10px 20px', 
              backgroundColor: (isExporting || showExportMenu) ? 'transparent' : 'var(--text-primary)', 
              color: (isExporting || showExportMenu) ? 'var(--text-secondary)' : 'var(--bg-primary)', 
              border: '1px solid var(--text-primary)', 
              textTransform: 'uppercase', 
              letterSpacing: '2px', 
              fontSize: '11px',
              cursor: isExporting ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              borderRadius: '0'
            }}
            onMouseOver={(e) => { 
              if(!isExporting && !showExportMenu) {
                e.currentTarget.style.backgroundColor = 'transparent'; 
                e.currentTarget.style.color = 'var(--text-primary)'; 
              }
            }}
            onMouseOut={(e) => { 
              if(!isExporting && !showExportMenu) {
                e.currentTarget.style.backgroundColor = 'var(--text-primary)'; 
                e.currentTarget.style.color = 'var(--bg-primary)'; 
              }
            }}
            title="Export ERP Reports"
          >
            {isExporting ? (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }}>sync</span>
                Generating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                Export Report
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_drop_down</span>
              </>
            )}
          </button>

          {showExportMenu && (
            <div style={{
              position: 'absolute',
              top: '45px',
              right: 0,
              width: '200px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <button
                onClick={handleExport}
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textAlign: 'left',
                  transition: 'background 0.2s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.1)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>table_view</span>
                Download Excel
              </button>
              
              <button
                onClick={handleExportPDF}
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textAlign: 'left',
                  transition: 'background 0.2s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.1)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>picture_as_pdf</span>
                Download PDF
              </button>
            </div>
          )}
        </div>

        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>

        <button 
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px'
          }}
          title="Toggle Theme"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
            {theme === "light" ? "dark_mode" : "light_mode"}
          </span>
        </button>

        <div style={{ height: '32px', width: '1px', backgroundColor: '#D4AF37' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', fontWeight: '500', textTransform: 'lowercase', letterSpacing: '1px', color: 'var(--text-primary)' }}>{email}</div>
            <div style={{ fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{user?.user_metadata?.role || "System User"}</div>
          </div>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {initial}
          </div>
        </div>

        {/* Notifications */}
        <div className="notification-container" style={{ position: 'relative' }}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications && unreadCount > 0) markAllAsRead();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              position: 'relative'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>notifications</span>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: '#E63946',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              width: '350px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              zIndex: 100,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '400px'
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>Notifications</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{notifications?.length || 0} Total</span>
              </div>
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {(!notifications || notifications.length === 0) ? (
                  <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} style={{ 
                      padding: '16px', 
                      borderBottom: '1px solid var(--border-color)', 
                      display: 'flex', 
                      gap: '12px',
                      backgroundColor: notif.read ? 'transparent' : 'rgba(212,175,55,0.05)'
                    }}>
                      <span className="material-symbols-outlined" style={{ 
                        color: notif.type === 'error' ? '#E63946' : 'var(--accent)',
                        fontSize: '20px'
                      }}>
                        {notif.type === 'error' ? 'error' : 'info'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--text-primary)' }}>{notif.message}</p>
                        <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-secondary)' }}>
                          {new Date(notif.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#E63946'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        title="Delete notification"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={handleLogout}
          style={{ 
            padding: '10px 16px', 
            fontSize: '11px', 
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginLeft: '12px',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            border: '1px solid var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--bg-primary)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span>
          Logout
        </button>
      </div>
    </header>
  );
}
