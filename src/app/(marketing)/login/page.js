"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { getCompanyNameByEmail } from "@/app/actions/authActions";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();
  
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router, supabase.auth]);

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const res = await getCompanyNameByEmail(email);

      if (!res.success) {
        setError("Email not found or unauthorized. Please contact support.");
      } else {
        setCompanyName(res.companyName || "Super Admin");
        setStep(2);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (error) {
      setError("Invalid password. Please try again.");
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
          padding: '80px',
          height: '100%'
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
          
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div style={{ marginBottom: '40px' }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: '400', marginBottom: '8px' }}>Sign In</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
                    Enter your email to verify your organization's workspace.
                  </p>
                </div>
                
                {error && (
                  <div style={{ padding: '16px', backgroundColor: 'rgba(230, 57, 70, 0.1)', border: '1px solid var(--error)', color: 'var(--error)', marginBottom: '24px', fontSize: '13px' }}>
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleCheckEmail} autoComplete="off">
                  <div style={{ marginBottom: '40px' }}>
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
                      placeholder="admin@yourcompany.com"
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
                    {loading ? 'Verifying...' : 'Continue'}
                    {!loading && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '50%', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--accent)' }}>business</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Workspace</p>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: '400', margin: 0, color: 'var(--text-primary)' }}>
                    {companyName}
                  </h2>
                  <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {email} · <button onClick={() => { setStep(1); setPassword(""); setError(""); }} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Change</button>
                  </p>
                </div>

                {error && (
                  <div style={{ padding: '16px', backgroundColor: 'rgba(230, 57, 70, 0.1)', border: '1px solid var(--error)', color: 'var(--error)', marginBottom: '24px', fontSize: '13px' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} autoComplete="off">
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
                      placeholder="Enter your password"
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
                    {loading ? 'Authenticating...' : 'Sign In'}
                    {!loading && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lock_open</span>}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', transition: 'color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
              Return to Entry
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}
