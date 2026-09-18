"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import StaggeredMenu from "../../components/StaggeredMenu";
export default function MarketingLayout({ children }) {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      document.documentElement.setAttribute("data-theme", "dark");
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

  const menuItems = [
    { label: 'Platform', ariaLabel: 'Go to platform', link: '/#philosophy' },
    { label: 'Solutions', ariaLabel: 'Go to solutions', link: '/solutions' },
    { label: 'About Us', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' },
    { label: 'Sign In', ariaLabel: 'Sign in to your account', link: '/login' }
  ];

  const socialItems = [
    { label: 'LinkedIn', link: 'https://linkedin.com' },
    { label: 'Twitter', link: 'https://twitter.com' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {!isLoginPage && (
        <header style={{
          height: '80px',
          backgroundColor: scrolled ? 'var(--bg-primary)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
          position: 'fixed',
          width: '100%',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 10%',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease, border-bottom 0.3s ease',
          pointerEvents: 'none' /* ensure the transparent parts don't block clicks */
        }}>
          <div style={{ pointerEvents: 'auto' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'var(--text-primary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#D4AF37' }}>straighten</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', letterSpacing: '1px' }}>Garment ERP</span>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', pointerEvents: 'auto' }}>
            <button 
              onClick={toggleTheme}
              style={{
                background: 'transparent',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '8px',
                color: '#D4AF37',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 12px',
                position: 'relative',
                zIndex: 51,
                transition: 'all 0.3s ease'
              }}
              title="Toggle Theme"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                {theme === "light" ? "dark_mode" : "light_mode"}
              </span>
            </button>

            <div style={{ height: '30px', width: '1px', backgroundColor: '#D4AF37', opacity: 0.3 }}></div>

            <StaggeredMenu
              position="right"
              items={menuItems}
              socialItems={socialItems}
              displaySocials={true}
              displayItemNumbering={true}
              menuButtonColor="#D4AF37"
              openMenuButtonColor="#D4AF37"
              changeMenuColorOnOpen={true}
              colors={theme === 'light' ? ['#e0e0e0', '#f5f5f5'] : ['#111111', '#1A1A1A']}
              accentColor="#D4AF37"
            />
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
