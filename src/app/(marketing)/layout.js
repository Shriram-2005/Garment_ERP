"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MarketingLayout({ children }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    
    // Inject Serif Font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }

    return () => { document.head.removeChild(link); }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  if (!mounted) return null;

  const isLoginPage = pathname === "/login";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {!isLoginPage && (
        <header style={{
          height: '80px',
          backgroundColor: '#0A0A0A',
          borderBottom: '1px solid #D4AF37',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 10%',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: '#F8F8F8' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#D4AF37' }}>straighten</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', letterSpacing: '1px' }}>Garment ERP</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <nav style={{ display: 'flex', gap: '40px' }}>
              <Link href="#architecture" style={{ color: '#D4AF37', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '2px', textDecoration: 'none' }}>Architecture</Link>
            </nav>
            
            <div style={{ height: '40px', width: '1px', backgroundColor: '#D4AF37' }}></div>
            
            <button 
              onClick={toggleTheme}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#F8F8F8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px'
              }}
              title="Toggle Theme"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                {theme === "light" ? "dark_mode" : "light_mode"}
              </span>
            </button>
            
            <Link href="/login" style={{ 
              color: '#F8F8F8', 
              textTransform: 'uppercase', 
              fontSize: '11px', 
              letterSpacing: '2px', 
              textDecoration: 'none',
              borderBottom: '1px solid #D4AF37',
              paddingBottom: '4px'
            }}>
              Sign In
            </Link>
          </div>
        </header>
      )}
      
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {!isLoginPage && (
        <footer style={{
          backgroundColor: 'transparent',
          borderTop: '1px solid #D4AF37',
          padding: '80px 10%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          color: 'var(--text-secondary)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span className="material-symbols-outlined">straighten</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--text-primary)' }}>Garment ERP</span>
            </div>
            <p style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Bespoke software solutions.</p>
          </div>
          <p style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>&copy; {new Date().getFullYear()} Garment ERP. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}
