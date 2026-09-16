"use client";

import { supabase } from "@/utils/supabaseClient";

export default function TopBar({ toggleTheme, theme, logout, toggleSidebar }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (logout) logout();
  };
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
        <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--text-secondary)' }}>
          Secure Dashboard
        </span>
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
            <div style={{ fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-primary)' }}>Admin User</div>
            <div style={{ fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>Factory Manager</div>
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
            A
          </div>
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
