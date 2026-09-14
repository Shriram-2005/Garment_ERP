"use client";

export default function TopBar({ toggleTheme, theme, logout }) {
  return (
    <header style={{
      height: '64px',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 24px',
      boxShadow: 'var(--card-shadow)',
      gap: '16px'
    }}>
      <button 
        onClick={toggleTheme}
        className="btn-outline"
        style={{
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          backgroundColor: 'var(--bg-tertiary)',
          color: 'var(--text-primary)'
        }}
        title="Toggle Theme"
      >
        <span className="material-symbols-outlined">
          {theme === "light" ? "dark_mode" : "light_mode"}
        </span>
      </button>

      <div style={{ height: '32px', width: '1px', backgroundColor: 'var(--border-color)' }}></div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>Admin User</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Manager</div>
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600'
        }}>
          A
        </div>
      </div>

      <button 
        onClick={logout}
        className="btn-outline"
        style={{ padding: '8px 12px', fontSize: '14px', marginLeft: '12px' }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
        Logout
      </button>
    </header>
  );
}
