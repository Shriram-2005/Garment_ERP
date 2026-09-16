"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax calculations
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 40, damping: 20 }
    }
  };

  const revealRight = {
    hidden: { opacity: 0, x: -40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)', overflowX: 'hidden' }}>
      


      {/* 1. Cinematic Hero Section */}
      <section style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 10%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Mesh */}
        <div style={{
          position: 'absolute',
          top: '-50%', left: '-50%', right: '-50%', bottom: '-50%',
          background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 60%)',
          animation: 'pulse 15s ease-in-out infinite alternate',
          zIndex: 0,
          pointerEvents: 'none'
        }} />
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse {
            0% { transform: scale(1) translate(0, 0); }
            50% { transform: scale(1.1) translate(2%, 2%); }
            100% { transform: scale(1) translate(-2%, -2%); }
          }
        `}} />

        <motion.div 
          style={{ maxWidth: '1000px', zIndex: 10, y: heroY, opacity: heroOpacity }}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.p variants={fadeInUp} style={{ 
            textTransform: 'uppercase', 
            letterSpacing: '6px', 
            fontSize: '11px', 
            fontWeight: '600',
            color: '#D4AF37',
            marginBottom: '40px'
          }}>
            Bespoke Software for the Garment Industry
          </motion.p>
          <motion.h1 variants={fadeInUp} style={{ 
            fontFamily: "var(--font-playfair)", 
            fontSize: 'clamp(4rem, 8vw, 7rem)', 
            lineHeight: '1.05', 
            fontWeight: '400', 
            marginBottom: '56px',
            letterSpacing: '-2px'
          }}>
            Precision.<br/>
            <span style={{ fontStyle: 'italic', color: '#888888' }}>Woven in code.</span>
          </motion.h1>
          
          <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
            <Link href="/login" style={{ 
              position: 'relative',
              padding: '24px 56px', 
              fontSize: '12px', 
              textTransform: 'uppercase', 
              letterSpacing: '4px', 
              backgroundColor: 'var(--accent)', 
              color: 'var(--bg-primary)', 
              fontWeight: '600',
              textDecoration: 'none',
              overflow: 'hidden',
              display: 'inline-block'
            }}
            className="hero-btn"
            >
              <span style={{ position: 'relative', zIndex: 2 }}>Enter Prototype</span>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
                transform: 'translateX(-100%)',
                transition: 'transform 0.6s ease',
                zIndex: 1
              }} className="btn-glow" />
            </Link>
            
            <style dangerouslySetInnerHTML={{__html: `
              .hero-btn:hover .btn-glow {
                transform: translateX(100%);
              }
            `}} />

            <a href="#philosophy" style={{ 
              fontSize: '12px', 
              textTransform: 'uppercase', 
              letterSpacing: '3px', 
              color: '#A0A0A0',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
              paddingBottom: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderBottomColor = 'var(--accent)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderBottomColor = 'rgba(212, 175, 55, 0.3)'; }}
            >
              Discover Architecture
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Philosophy Section */}
      <section id="philosophy" style={{ 
        padding: '160px 10%', 
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        gap: '10%',
        flexWrap: 'wrap'
      }}>
        <motion.div 
          style={{ flex: '1', minWidth: '400px' }}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
          variants={revealRight}
        >
          <h2 style={{ 
            fontFamily: "var(--font-playfair)", 
            fontSize: 'clamp(2.5rem, 4vw, 4rem)', 
            fontWeight: '400',
            lineHeight: '1.2'
          }}>
            The architecture of modern manufacturing.
          </h2>
        </motion.div>
        
        <motion.div 
          style={{ flex: '1', minWidth: '400px', paddingTop: '16px' }}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.p variants={fadeInUp} style={{ 
            fontSize: '1.25rem', 
            lineHeight: '1.8', 
            color: '#888888',
            marginBottom: '80px',
            fontWeight: '300'
          }}>
            Garment ERP was designed with the meticulous attention to detail of high-end tailoring. 
            We replaced the clutter of traditional factory software with an elegant, streamlined interface 
            providing absolute clarity from raw material sourcing to final dispatch.
          </motion.p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {[
              { label: "01", text: "Integrated Product & Style Master" },
              { label: "02", text: "Real-time Fabric & Trim Inventory" },
              { label: "03", text: "Dynamic Bill of Materials (BOM)" },
              { label: "04", text: "Precision Cutting & Bundle Management" }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} style={{ 
                display: 'flex', 
                gap: '40px', 
                borderBottom: '1px solid rgba(255,255,255,0.05)', 
                paddingBottom: '24px' 
              }}>
                <span style={{ fontSize: '13px', color: 'var(--accent)', letterSpacing: '2px' }}>{item.label}</span>
                <span style={{ fontSize: '15px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 3. The Workflow Section */}
      <section style={{ 
        padding: '160px 10%', 
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)'
      }}>
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '120px' }}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.p variants={fadeInUp} style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '5px', fontSize: '11px', marginBottom: '24px' }}>
            End-To-End Visibility
          </motion.p>
          <motion.h2 variants={fadeInUp} style={{ 
            fontFamily: "var(--font-playfair)", 
            fontSize: 'clamp(3rem, 5vw, 4.5rem)', 
            fontWeight: '400',
            marginBottom: '32px'
          }}>
            From Thread to Rack
          </motion.h2>
          <motion.p variants={fadeInUp} style={{ color: '#888888', maxWidth: '700px', margin: '0 auto', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' }}>
            Trace every garment&apos;s lifecycle. A continuous, uncompromised workflow engineered for high-volume apparel production.
          </motion.p>
        </motion.div>

        <motion.div 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px' }}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {[
            { step: "Sourcing", desc: "Roll-wise fabric tracking and accessory inventory." },
            { step: "Cutting", desc: "Marker planning and bundle QR code generation." },
            { step: "Sewing", desc: "Line allocation and real-time WIP monitoring." },
            { step: "Finishing", desc: "Ironing, tagging, and stringent quality control." }
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} style={{ textAlign: 'center', padding: '0 20px' }}>
              <div style={{ 
                width: '100px', height: '100px', borderRadius: '50%', border: '1px solid rgba(212, 175, 55, 0.3)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px',
                color: '#D4AF37', fontFamily: "var(--font-playfair)", fontSize: '32px',
                background: 'rgba(212, 175, 55, 0.02)'
              }}>
                {i + 1}
              </div>
              <h4 style={{ textTransform: 'uppercase', letterSpacing: '4px', fontSize: '12px', marginBottom: '24px', color: 'var(--text-primary)' }}>{item.step}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.9', fontWeight: '300' }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. Modules Grid Section */}
      <section style={{ padding: '160px 10% 0' }}>
        <motion.div 
          style={{ marginBottom: '120px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '40px' }}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} style={{ fontFamily: "var(--font-playfair)", fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: '400', lineHeight: '1.1', margin: 0 }}>
            The Suite
          </motion.h2>
          <motion.p variants={fadeInUp} style={{ maxWidth: '450px', color: '#888888', lineHeight: '1.8', margin: 0, fontWeight: '300', fontSize: '1.1rem' }}>
            Over 20 deeply integrated modules working in perfect unison to orchestrate your shop floor.
          </motion.p>
        </motion.div>
        
        <motion.div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            borderTop: '1px solid var(--border-color)',
            borderLeft: '1px solid var(--border-color)'
          }}
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {[
            { title: "Material Requirement", desc: "Automated shortage identification and precise procurement.", icon: "precision_manufacturing" },
            { title: "Production Planning", desc: "Line, machine, and manpower allocation tailored to capacity.", icon: "calendar_month" },
            { title: "Quality Assurance", desc: "Rigorous inline and final defect tracking to maintain brand standards.", icon: "fact_check" },
            { title: "Dispatch Logistics", desc: "Seamless carton packing, invoicing, and shipment tracking.", icon: "local_shipping" },
            { title: "Master Data Mgmt", desc: "Centralized catalogs with complete revision history.", icon: "style" },
            { title: "Real-time Costing", desc: "Dynamic BOM calculation and exact margin tracking.", icon: "request_quote" }
          ].map((mod, i) => (
            <motion.div key={i} variants={fadeInUp} style={{ 
              padding: '80px 60px', 
              borderRight: '1px solid var(--border-color)', 
              borderBottom: '1px solid var(--border-color)',
              transition: 'background-color 0.4s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span className="material-symbols-outlined" style={{ 
                fontSize: '32px', 
                color: '#D4AF37',
                marginBottom: '48px',
                display: 'block'
              }}>{mod.icon}</span>
              <h3 style={{ 
                fontFamily: "var(--font-playfair)", 
                fontSize: '2rem', 
                fontWeight: '400',
                marginBottom: '24px'
              }}>{mod.title}</h3>
              <p style={{ color: '#888888', lineHeight: '1.8', fontSize: '1rem', fontWeight: '300' }}>
                {mod.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. Final CTA */}
      <section style={{ 
        padding: '200px 10%', 
        textAlign: 'center', 
        backgroundColor: 'var(--bg-primary)', 
        borderTop: '1px solid var(--border-color)'
      }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} style={{ 
            fontFamily: "var(--font-playfair)", 
            fontSize: 'clamp(3rem, 6vw, 5rem)', 
            fontWeight: '400',
            marginBottom: '64px'
          }}>
            Experience the standard.
          </motion.h2>
          <motion.div variants={fadeInUp}>
            <Link href="/login" style={{ 
              display: 'inline-block',
              padding: '24px 64px', 
              fontSize: '12px', 
              textTransform: 'uppercase', 
              letterSpacing: '4px', 
              backgroundColor: 'transparent', 
              color: '#D4AF37', 
              border: '1px solid rgba(212, 175, 55, 0.5)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => { 
              e.currentTarget.style.backgroundColor = 'var(--accent)'; 
              e.currentTarget.style.color = 'var(--bg-primary)'; 
              e.currentTarget.style.boxShadow = '0 0 40px rgba(212, 175, 55, 0.2)';
            }}
            onMouseOut={(e) => { 
              e.currentTarget.style.backgroundColor = 'transparent'; 
              e.currentTarget.style.color = '#D4AF37'; 
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              Access the System
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
