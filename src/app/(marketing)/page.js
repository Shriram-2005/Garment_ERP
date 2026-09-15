"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)' }}>
      {/* 1. Hero Section */}
      <section style={{
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 10%',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '900px' }}>
          <p style={{ 
            textTransform: 'uppercase', 
            letterSpacing: '4px', 
            fontSize: '12px', 
            fontWeight: '600',
            color: '#D4AF37',
            marginBottom: '32px'
          }}>
            Bespoke Software for the Garment Industry
          </p>
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '5.5rem', 
            lineHeight: '1.1', 
            fontWeight: '400', 
            marginBottom: '48px',
            letterSpacing: '-1px'
          }}>
            Precision.<br/>
            <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>Woven in code.</span>
          </h1>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            <Link href="/login" style={{ 
              padding: '20px 48px', 
              fontSize: '13px', 
              textTransform: 'uppercase', 
              letterSpacing: '3px', 
              backgroundColor: '#0A0A0A', 
              color: '#F8F8F8', 
              border: '1px solid #0A0A0A',
              transition: 'all 0.4s ease',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.borderColor = '#D4AF37'; e.currentTarget.style.color = '#0A0A0A'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#0A0A0A'; e.currentTarget.style.borderColor = '#0A0A0A'; e.currentTarget.style.color = '#F8F8F8'; }}
            >
              Enter Prototype
            </Link>
            <a href="#philosophy" style={{ 
              fontSize: '13px', 
              textTransform: 'uppercase', 
              letterSpacing: '3px', 
              color: 'var(--text-primary)',
              textDecoration: 'none',
              borderBottom: '1px solid #D4AF37',
              paddingBottom: '8px',
              transition: 'opacity 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.6'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              Discover Architecture
            </a>
          </div>
        </div>
      </section>

      {/* 2. Philosophy Section */}
      <section id="philosophy" style={{ 
        padding: '140px 10%', 
        borderTop: '1px solid #D4AF37',
        display: 'flex',
        gap: '12%'
      }}>
        <div style={{ flex: '1' }}>
          <h2 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '3rem', 
            fontWeight: '400',
            lineHeight: '1.2'
          }}>
            The architecture of modern manufacturing.
          </h2>
        </div>
        <div style={{ flex: '1' }}>
          <p style={{ 
            fontSize: '1.2rem', 
            lineHeight: '1.8', 
            color: 'var(--text-secondary)',
            marginBottom: '60px'
          }}>
            Garment ERP was designed with the same meticulous attention to detail as high-end tailoring. 
            We replaced the clutter of traditional factory software with an elegant, streamlined interface 
            that provides absolute clarity from raw material sourcing to final dispatch.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {[
              { label: "01", text: "Integrated Product & Style Master" },
              { label: "02", text: "Real-time Fabric & Trim Inventory" },
              { label: "03", text: "Dynamic Bill of Materials (BOM)" },
              { label: "04", text: "Precision Cutting & Bundle Management" }
            ].map((item, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                gap: '32px', 
                borderBottom: '1px solid #D4AF37', 
                paddingBottom: '24px' 
              }}>
                <span style={{ fontSize: '12px', color: '#D4AF37', letterSpacing: '1px' }}>{item.label}</span>
                <span style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Workflow Section - Dark Mode */}
      <section style={{ 
        padding: '140px 10%', 
        backgroundColor: '#0A0A0A',
        color: '#F8F8F8',
        borderTop: '1px solid #D4AF37'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '100px' }}>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '12px', marginBottom: '24px' }}>
            End-To-End Visibility
          </p>
          <h2 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '3.5rem', 
            fontWeight: '400',
            marginBottom: '32px'
          }}>
            From Thread to Rack
          </h2>
          <p style={{ color: '#A0A0A0', maxWidth: '650px', margin: '0 auto', lineHeight: '1.8', fontSize: '1.1rem' }}>
            Trace every garment's lifecycle. A continuous, uncompromised workflow engineered for high-volume apparel production.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '40px' }}>
          {[
            { step: "Sourcing", desc: "Roll-wise fabric tracking and accessory inventory." },
            { step: "Cutting", desc: "Marker planning and bundle QR code generation." },
            { step: "Sewing", desc: "Line allocation and real-time WIP monitoring." },
            { step: "Finishing", desc: "Ironing, tagging, and stringent quality control." }
          ].map((item, i) => (
            <div key={i} style={{ flex: '1', minWidth: '220px', textAlign: 'center' }}>
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%', border: '1px solid #D4AF37', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px',
                color: '#D4AF37', fontFamily: "'Playfair Display', serif", fontSize: '28px'
              }}>
                {i + 1}
              </div>
              <h4 style={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: '13px', marginBottom: '20px' }}>{item.step}</h4>
              <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: '1.8' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Modules Grid Section */}
      <section style={{ padding: '140px 10% 0' }}>
        <div style={{ marginBottom: '100px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3.5rem', fontWeight: '400', lineHeight: '1.1' }}>
            The Suite
          </h2>
          <p style={{ maxWidth: '400px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Over 20 deeply integrated modules working in perfect unison to orchestrate your shop floor.
          </p>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          borderTop: '1px solid #D4AF37',
          borderLeft: '1px solid #D4AF37'
        }}>
          {[
            { title: "Material Requirement", desc: "Automated shortage identification and precise procurement.", icon: "precision_manufacturing" },
            { title: "Production Planning", desc: "Line, machine, and manpower allocation tailored to style capacity.", icon: "calendar_month" },
            { title: "Quality Assurance", desc: "Rigorous inline and final defect tracking to maintain brand standards.", icon: "fact_check" },
            { title: "Dispatch Logistics", desc: "Seamless carton packing, invoicing, and shipment tracking.", icon: "local_shipping" },
            { title: "Master Data Management", desc: "Centralized style, color, and size catalogs with complete revision history.", icon: "style" },
            { title: "Real-time Costing", desc: "Dynamic BOM calculation and exact margin tracking per order.", icon: "request_quote" }
          ].map((mod, i) => (
            <div key={i} style={{ 
              padding: '80px 60px', 
              borderRight: '1px solid #D4AF37', 
              borderBottom: '1px solid #D4AF37',
              transition: 'background-color 0.4s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span className="material-symbols-outlined" style={{ 
                fontSize: '28px', 
                color: '#D4AF37',
                marginBottom: '40px',
                display: 'block'
              }}>{mod.icon}</span>
              <h3 style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: '2rem', 
                fontWeight: '400',
                marginBottom: '20px'
              }}>{mod.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1rem' }}>
                {mod.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Analytics & Insights Section */}
      <section style={{ padding: '140px 10%', display: 'flex', gap: '12%', alignItems: 'center' }}>
        <div style={{ flex: '1' }}>
          <div style={{ 
            padding: '60px', border: '1px solid #D4AF37', position: 'relative' 
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '240px', borderBottom: '1px solid var(--border-color)' }}>
              {[40, 70, 55, 90, 65, 100].map((h, i) => (
                <div key={i} style={{ flex: '1', height: `${h}%`, backgroundColor: i === 5 ? '#D4AF37' : 'var(--bg-tertiary)', transition: 'height 1s ease' }}></div>
              ))}
            </div>
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)' }}>Overall Efficiency</span>
              <span style={{ fontSize: '14px', color: '#D4AF37', fontWeight: 'bold' }}>+24%</span>
            </div>
          </div>
        </div>
        <div style={{ flex: '1' }}>
          <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '12px', marginBottom: '24px' }}>
            Data-Driven Profitability
          </p>
          <h2 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: '3rem', 
            fontWeight: '400',
            lineHeight: '1.2',
            marginBottom: '40px'
          }}>
            Know your exact margins.<br/> Before the fabric is cut.
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem' }}>
            The Costing and Dashboard modules aggregate labor, processing, overhead, and wastage into a single pane of glass. Make informed decisions that protect your bottom line, all in real-time.
          </p>
        </div>
      </section>

      {/* 6. Final CTA - Dark Mode */}
      <section style={{ 
        padding: '160px 10%', 
        textAlign: 'center', 
        backgroundColor: '#0A0A0A', 
        color: '#F8F8F8',
        borderTop: '1px solid #D4AF37'
      }}>
        <h2 style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '4rem', 
          fontWeight: '400',
          marginBottom: '48px'
        }}>
          Experience the standard.
        </h2>
        <Link href="/login" style={{ 
          display: 'inline-block',
          padding: '20px 48px', 
          fontSize: '13px', 
          textTransform: 'uppercase', 
          letterSpacing: '3px', 
          backgroundColor: 'transparent', 
          color: '#D4AF37', 
          border: '1px solid #D4AF37',
          transition: 'all 0.4s ease',
          textDecoration: 'none'
        }}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.color = '#0A0A0A'; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#D4AF37'; }}
        >
          Access the System
        </Link>
      </section>
    </div>
  );
}
