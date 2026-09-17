export const metadata = {
  title: "About Us | Garment ERP",
  description: "The craftsmanship behind our bespoke software.",
};

export default function AboutPage() {
  return (
    <div style={{ padding: '120px 10% 80px', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: '800px' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: '12px', color: 'var(--accent)', marginBottom: '16px' }}>
          Our Philosophy
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '56px', color: 'var(--text-primary)', marginBottom: '40px', lineHeight: '1.1' }}>
          Software crafted with the same precision as a <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>bespoke suit.</span>
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--text-secondary)', fontSize: '18px', lineHeight: '1.8' }}>
          <p>
            The garment industry is built on exact measurements, careful stitching, and an unwavering attention to detail. We believe the software running these operations should be built the exact same way.
          </p>
          <p>
            Generic ERPs force garment manufacturers to adapt their intricate workflows to rigid software logic. We took the opposite approach. We spent years on factory floors, understanding how fabrics stretch, how cutting plans are optimized, and how quality is measured.
          </p>
          <p>
            The result is a digital ecosystem that feels like a natural extension of your production line—fast, elegant, and perfectly tailored to your needs.
          </p>
        </div>
      </div>
    </div>
  );
}
