"use client"

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Application Error:', error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      fontFamily: 'var(--font-sans)',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '500px',
        padding: '48px',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        backgroundColor: 'var(--bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>
        <span className="material-symbols-outlined" style={{ 
          fontSize: '48px', 
          color: '#E63946',
          padding: '24px',
          backgroundColor: 'rgba(230, 57, 70, 0.05)',
          borderRadius: '50%'
        }}>
          warning
        </span>
        
        <div>
          <h2 style={{ 
            fontFamily: 'var(--font-playfair)', 
            fontSize: '2rem', 
            fontWeight: '400',
            margin: '0 0 16px 0',
            color: 'var(--text-primary)'
          }}>
            System Interruption
          </h2>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '15px', 
            lineHeight: '1.6',
            margin: 0
          }}>
            An unexpected error occurred while processing your request. Our technical team has been notified.
          </p>
        </div>

        <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '16px 0' }}></div>

        <button
          onClick={() => reset()}
          style={{
            padding: '16px 32px',
            backgroundColor: 'transparent',
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent)';
            e.currentTarget.style.color = 'var(--bg-primary)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--accent)';
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>refresh</span>
          Re-initialize Module
        </button>
      </div>
    </div>
  )
}
