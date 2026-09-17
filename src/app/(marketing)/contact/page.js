export const metadata = {
  title: "Contact | Garment ERP",
  description: "Get in touch for enterprise inquiries.",
};

export default function ContactPage() {
  return (
    <div style={{ padding: '120px 10% 80px', minHeight: 'calc(100vh - 80px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', color: 'var(--text-primary)', marginBottom: '24px' }}>
          Let's discuss your <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>operations.</span>
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '40px' }}>
          Whether you run a boutique atelier or a massive export house, we can tailor a deployment plan that fits your exact scale.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--accent)' }}>mail</span>
            <span style={{ color: 'var(--text-primary)' }}>enterprise@garmenterp.com</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--accent)' }}>location_on</span>
            <span style={{ color: 'var(--text-primary)' }}>New York &middot; Milan &middot; Mumbai</span>
          </div>
        </div>
      </div>

      <div style={{ 
        padding: '40px', 
        backgroundColor: 'var(--card-bg)', 
        border: '1px solid var(--border-color)',
        borderRadius: '16px'
      }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Company Name</label>
            <input type="text" style={{ 
              padding: '16px', 
              backgroundColor: 'transparent', 
              border: '1px solid var(--border-color)', 
              color: 'var(--text-primary)',
              borderRadius: '8px',
              outline: 'none'
            }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Work Email</label>
            <input type="email" style={{ 
              padding: '16px', 
              backgroundColor: 'transparent', 
              border: '1px solid var(--border-color)', 
              color: 'var(--text-primary)',
              borderRadius: '8px',
              outline: 'none'
            }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Message</label>
            <textarea rows={4} style={{ 
              padding: '16px', 
              backgroundColor: 'transparent', 
              border: '1px solid var(--border-color)', 
              color: 'var(--text-primary)',
              borderRadius: '8px',
              outline: 'none',
              resize: 'vertical'
            }}></textarea>
          </div>
          <button type="button" style={{
            padding: '16px',
            backgroundColor: 'var(--accent)',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            cursor: 'pointer',
            marginTop: '16px'
          }}>
            Request Demo
          </button>
        </form>
      </div>
    </div>
  );
}
