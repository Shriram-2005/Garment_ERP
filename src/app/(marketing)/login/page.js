"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    if (localStorage.getItem("auth") === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "demo@demo.com" && password === "demo123") {
      localStorage.setItem("auth", "true");
      router.push("/dashboard");
    } else {
      alert("Invalid credentials. Please use demo@demo.com / demo123");
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Left side - Dark Distinct Aesthetic (Matching Header) */}
      <div style={{ 
        flex: 1, 
        backgroundColor: '#0A0A0A',
        color: '#F8F8F8',
        borderRight: '1px solid #D4AF37'
      }} className="desktop-only">
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px'
        }}>
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: '#F8F8F8' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#D4AF37' }}>straighten</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', letterSpacing: '1px' }}>Garment ERP</span>
            </Link>
          </div>
          <div>
            <h1 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: '4.5rem', 
              fontWeight: '400',
              lineHeight: '1.1',
              marginBottom: '32px'
            }}>
              Uncompromising <br/> <span style={{ color: '#D4AF37', fontStyle: 'italic' }}>Precision.</span>
            </h1>
            <p style={{ 
              fontSize: '12px', 
              textTransform: 'uppercase', 
              letterSpacing: '4px', 
              color: '#A0A0A0' 
            }}>
              Authorized Factory Personnel Only
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .desktop-only { display: none !important; }
        @media (min-width: 900px) { .desktop-only { display: flex !important; } }
        .input-lux { 
          width: 100%; padding: 16px 0; border: none; border-bottom: 1px solid var(--border-color); 
          background: transparent; color: var(--text-primary); font-size: 16px; outline: none; transition: border-color 0.4s ease;
        }
        .input-lux:focus { border-bottom: 1px solid #D4AF37; }
      `}} />

      {/* Right side - Form */}
      <div style={{ 
        flex: 1.2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '24px' 
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: '400', marginBottom: '8px' }}>Sign In</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Enter your credentials to access the shop floor dashboard.</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Email Address
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@demo.com"
                required
                className="input-lux"
              />
            </div>
            
            <div style={{ marginBottom: '40px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-lux"
              />
            </div>
            
            <button type="submit" style={{ 
              width: '100%', 
              padding: '20px', 
              fontSize: '13px', 
              textTransform: 'uppercase', 
              letterSpacing: '3px',
              backgroundColor: '#0A0A0A', 
              color: '#F8F8F8', 
              border: '1px solid #0A0A0A', 
              cursor: 'pointer', 
              transition: 'all 0.4s ease',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.borderColor = '#D4AF37'; e.currentTarget.style.color = '#0A0A0A'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#0A0A0A'; e.currentTarget.style.borderColor = '#0A0A0A'; e.currentTarget.style.color = '#F8F8F8'; }}
            >
              Authenticate
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </button>
          </form>

          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #D4AF37', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px' }}>Demo Access</p>
            <p style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--text-primary)' }}>demo@demo.com / demo123</p>
            <div style={{ marginTop: '24px' }}>
              <Link href="/" style={{ color: '#D4AF37', textDecoration: 'none', borderBottom: '1px solid #D4AF37', paddingBottom: '4px', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '2px' }}>
                Return to Entry
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
