"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/utils/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("garmenterp@gmail.com");
  const [password, setPassword] = useState("GarmentERP@1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
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
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
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
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'var(--text-primary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--accent)' }}>straighten</span>
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
              Uncompromising <br/> <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Precision.</span>
            </h1>
            <p style={{ 
              fontSize: '12px', 
              textTransform: 'uppercase', 
              letterSpacing: '4px', 
              color: 'var(--text-secondary)' 
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
        .input-lux:focus { border-bottom: 1px solid var(--accent); }
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
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
              Enter your credentials to access the shop floor dashboard.<br/>
              <span style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '8px', display: 'inline-block', letterSpacing: '1px' }}>
                Demo Credentials: garmenterp@gmail.com / GarmentERP@1
              </span>
            </p>
          </div>
          
          {error && (
            <div style={{ padding: '16px', backgroundColor: 'rgba(230, 57, 70, 0.1)', border: '1px solid var(--error)', color: 'var(--error)', marginBottom: '24px', fontSize: '13px' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} autoComplete="off">
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Email Address
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-lux"
                autoComplete="off"
                style={{ borderBottom: '1px solid var(--accent)' }}
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
                required
                className="input-lux"
                autoComplete="new-password"
                style={{ paddingRight: '40px', borderBottom: '1px solid var(--accent)' }}
              />
            </div>
            
            <button type="submit" disabled={loading} style={{ 
              width: '100%', 
              padding: '20px', 
              fontSize: '13px', 
              textTransform: 'uppercase', 
              letterSpacing: '3px',
              backgroundColor: loading ? 'var(--border-color)' : 'var(--text-primary)', 
              color: 'var(--bg-primary)', 
              border: '1px solid var(--text-primary)', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              transition: 'all 0.4s ease',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px'
            }}
            onMouseOver={(e) => { if(!loading){ e.currentTarget.style.backgroundColor = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--bg-primary)'; } }}
            onMouseOut={(e) => { if(!loading){ e.currentTarget.style.backgroundColor = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--bg-primary)'; } }}
            >
              {loading ? 'Authenticating...' : 'Authenticate'}
              {!loading && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>}
            </button>
          </form>

          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--accent)' }}>
            <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid var(--accent)', paddingBottom: '4px', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '2px' }}>
              Return to Entry
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}
