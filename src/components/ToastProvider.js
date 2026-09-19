"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('erp_notifications');
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load notifications", e);
    }
    setIsLoaded(true);
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('erp_notifications', JSON.stringify(notifications));
    }
  }, [notifications, isLoaded]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now().toString();
    const timestamp = new Date().toISOString();
    
    // Add to temporary toast view
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Save to permanent notification history
    setNotifications((prev) => [{ id, message, type, timestamp, read: false }, ...prev]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, notifications, markAllAsRead, deleteNotification }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{
            minWidth: '300px',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            padding: '16px 24px',
            borderLeft: `4px solid ${toast.type === 'error' ? '#E63946' : 'var(--accent)'}`,
            borderTop: '1px solid var(--border-color)',
            borderRight: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            fontFamily: 'var(--font-sans)',
            animation: 'toast-slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }}>
            <span className="material-symbols-outlined" style={{ 
              color: toast.type === 'error' ? '#E63946' : 'var(--accent)',
              fontSize: '20px',
              marginTop: '2px'
            }}>
              {toast.type === 'error' ? 'error' : 'check_circle'}
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
                {toast.type === 'error' ? 'System Notice' : 'System Confirmation'}
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {toast.message}
              </p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
            </button>
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes toast-slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}} />
    </ToastContext.Provider>
  );
}
