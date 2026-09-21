import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { createClient } from '@/utils/supabase/client';

export default function AIInsightsWidget({ dashboardData }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = createClient();

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ dashboardData })
      });
      
      const result = await response.json();
      if (response.ok) {
        setInsights(result.insights);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dashboardData) {
      fetchInsights();
    }
  }, [dashboardData]);

  if (!dashboardData) return null;

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: 'var(--card-shadow)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: 'var(--accent)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--accent)' }}>auto_awesome</span>
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: "'Playfair Display', serif" }}>Executive AI Insights</h3>
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <span className="material-symbols-outlined" style={{ animation: 'spin 2s linear infinite', fontSize: '18px' }}>sync</span>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          Analyzing dashboard data...
        </div>
      ) : error ? (
        <div style={{ color: 'var(--error)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            {error.includes('503') || error.includes('high demand') || error.includes('429') || error.includes('Too Many Requests')
              ? 'The AI model is in high traffic. Please try after some time.' 
              : `Failed to load insights: ${error}`}
          </div>
          <button 
            onClick={fetchInsights}
            style={{
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: '1px solid var(--error)',
              color: 'var(--error)',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              width: 'fit-content',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>refresh</span>
            Retry
          </button>
        </div>
      ) : (
        <div style={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: '1.6' }}>
          <ReactMarkdown
            components={{
              p: ({node, ...props}) => <p style={{margin: '0 0 8px 0'}} {...props} />,
              strong: ({node, ...props}) => <strong style={{color: 'var(--accent)'}} {...props} />,
            }}
          >
            {insights}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
