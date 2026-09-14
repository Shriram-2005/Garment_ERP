"use client";
import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-primary)'
    }}>
      <div className="card" style={{ width: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--accent)' }}>
            factory
          </span>
          <h1 style={{ marginTop: '16px', fontSize: '24px' }}>Garment ERP</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>
            Sign in to your account
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@demo.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="demo123"
              required
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: '24px' }}>
            <span className="material-symbols-outlined">login</span>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
          <p>Demo Credentials:</p>
          <p><strong>Email:</strong> demo@demo.com | <strong>Pass:</strong> demo123</p>
        </div>
      </div>
    </div>
  );
}
