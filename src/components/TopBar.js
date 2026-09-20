"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { fetchRecords } from "@/app/actions/dataActions";
import { useToast } from "@/components/ToastProvider";
import { useProfile } from "@/components/ProfileProvider";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function TopBar({ toggleTheme, theme, logout, toggleSidebar, user }) {
  const router = useRouter();
  const { notifications, markAllAsRead, addToast, deleteNotification } = useToast();
  const { hasAccess } = useProfile();
  
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
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user?.email) {
      const fetchProfile = async () => {
        const { data } = await supabase.from('user_profiles').select('*').eq('email', user.email).single();
        if (data) setProfile(data);
      };
      fetchProfile();
    }
  }, [user]);
  useEffect(() => {
    if (!profile) return;
    if (profile.role?.toUpperCase().includes('SUPER_ADMIN')) return; // No stock checking for Super Admin

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
  }, [profile]);

  const isAdmin = profile?.role?.toLowerCase().includes('admin');
  const isSuperAdmin = profile?.role?.includes('SUPER_ADMIN');

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
    { name: "Data Importing", path: "/dashboard/import" },
    { name: "Complete Export", path: "/export/complete" },
    { name: "Custom Export", path: "/export/custom" },
    ...(isSuperAdmin ? [{ name: "Manage Companies", path: "/settings/companies" }] : []),
    ...(isAdmin ? [{ name: "User Management", path: "/settings/users" }, { name: "System Settings", path: "/settings" }] : [])
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredModules = erpModules.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (logout) logout();
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
      gap: '16px',
      position: 'relative',
      zIndex: 999
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
                  {filteredModules.map((module, idx) => {
                    const moduleKey = module.path.replace('/', '').split('/')[0] || 'dashboard';
                    // Special logic: Custom Export / Complete Export / Import check 'export' or 'import' keys, or we just rely on if it's not a generic dashboard path. 
                    // To simplify, if path is /dashboard/import, moduleKey is dashboard. 
                    // Let's use exact path based matching for the special ones.
                    let canAccess = true;
                    if (module.path.startsWith('/export')) {
                      // Exports allowed for all, but internal logic restricts. So we let them click.
                      canAccess = true;
                    } else if (module.path !== '/dashboard/import' && module.path !== '/dashboard') {
                      canAccess = hasAccess(moduleKey);
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!canAccess) return;
                          router.push(module.path);
                          setIsSearchFocused(false);
                          setSearchQuery("");
                        }}
                        disabled={!canAccess}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'transparent',
                          border: 'none',
                          color: canAccess ? 'var(--text-primary)' : 'var(--text-secondary)',
                          cursor: canAccess ? 'pointer' : 'not-allowed',
                          fontSize: '13px',
                          textAlign: 'left',
                          transition: 'background 0.2s ease',
                          opacity: canAccess ? 1 : 0.5
                        }}
                        onMouseOver={(e) => { 
                          if (canAccess) {
                            e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'; 
                            e.currentTarget.style.color = 'var(--accent)'; 
                          }
                        }}
                        onMouseOut={(e) => { 
                          if (canAccess) {
                            e.currentTarget.style.backgroundColor = 'transparent'; 
                            e.currentTarget.style.color = 'var(--text-primary)'; 
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
                            {canAccess ? 'arrow_right_alt' : 'lock'}
                          </span>
                          {module.name}
                        </div>
                      </button>
                    );
                  })}
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
            <div style={{ fontSize: '11px', fontWeight: '500', textTransform: 'lowercase', letterSpacing: '1px', color: 'var(--text-primary)' }}>{user?.email || "No Email"}</div>
            <div style={{ fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
              {profile ? `${profile.role} · ${profile.company_name}` : "System User"}
            </div>
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
            {user?.email ? user.email.substring(0, 2).toUpperCase() : "GE"}
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
          onClick={() => logout()}
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
