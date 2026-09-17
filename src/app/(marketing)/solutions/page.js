export const metadata = {
  title: "Solutions | Garment ERP",
  description: "Enterprise modules tailored for the garment industry.",
};

export default function SolutionsPage() {
  const modules = [
    { title: "Inventory Management", description: "Real-time tracking of fabrics, accessories, and finished goods with automated reorder alerts.", icon: "inventory_2" },
    { title: "Production Tracking", description: "Monitor cutting, stitching, and finishing processes on the factory floor with precise analytics.", icon: "factory" },
    { title: "Quality Assurance", description: "Digitized inspection workflows to ensure every garment meets strict international standards.", icon: "verified" },
    { title: "Order Fulfillment", description: "Seamless integration with shipping providers and real-time dispatch tracking for B2B orders.", icon: "local_shipping" }
  ];

  return (
    <div style={{ padding: '120px 10% 80px', minHeight: 'calc(100vh - 80px)' }}>
      <div style={{ maxWidth: '800px', marginBottom: '80px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', color: 'var(--text-primary)', marginBottom: '24px' }}>
          Tailored Solutions for the <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Garment Industry</span>
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          Our platform is built from the ground up for apparel manufacturers. We understand the unique challenges of the textile supply chain—from fabric sourcing to final dispatch—and have engineered bespoke modules to streamline every step.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        {modules.map((mod, index) => (
          <div key={index} style={{
            padding: '40px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            transition: 'transform 0.3s ease'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'var(--accent)', marginBottom: '20px' }}>
              {mod.icon}
            </span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--text-primary)', marginBottom: '16px' }}>
              {mod.title}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {mod.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
