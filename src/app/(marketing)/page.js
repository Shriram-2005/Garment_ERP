"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ScrollExpand from "@/components/ScrollExpand";
import PixelSwap from "@/components/PixelSwap";
import AccordionGallery from "@/components/AccordionGallery";
import SplashScreen from "@/components/SplashScreen";

const galleryItems = [
  { image: '/images/gallery/1.png', label: 'Tailored Elegance', link: '#' },
  { image: '/images/gallery/2.png', label: 'Precision Stitching', link: '#' },
  { image: '/images/gallery/3.png', label: 'Design & Draft', link: '#' },
  { image: '/images/gallery/4.png', label: 'Luxury Boutique', link: '#' },
  { image: '/images/gallery/5.png', label: 'Master Tailor', link: '#' }
];

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

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
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)' }}
      >

        {/* 1. Cinematic Hero Section */}
        <ScrollExpand
          src="/hero-2.png"
          title="The Digital Fabric of Manufacturing"
          scrollHint="Scroll to explore"
          useWindowScroll={true}
          startWidth={35}
          startHeight={50}
          startRadius={24}
          endRadius={0}
          mediaZoom={1.2}
          scrollDistance={1.2}
          holdDistance={0.35}
          smoothing={0.1}
          overlayScrim={0.85}
          enabled={true}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px'
          }}>
            <h2 style={{
              fontFamily: "var(--font-playfair)",
              fontSize: 'clamp(4rem, 8vw, 7rem)',
              fontWeight: '400',
              lineHeight: '1.1',
              margin: 0,
              color: '#fff',
              textShadow: '0 4px 40px rgba(0,0,0,1)'
            }}>
              Precision.<br />
              <span style={{ fontStyle: 'italic', color: '#D4AF37' }}>Woven in code.</span>
            </h2>
            <p style={{
              color: '#ffffff',
              maxWidth: '650px',
              fontSize: '1.4rem',
              lineHeight: '1.8',
              fontWeight: '400',
              textShadow: '0 4px 24px rgba(0,0,0,1)'
            }}>
              A continuous, uncompromised workflow engineered for high-volume apparel production.
            </p>
            <Link href="/login" style={{
              marginTop: '16px',
              padding: '20px 48px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              backgroundColor: 'var(--accent)',
              color: '#000',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
              borderRadius: '4px'
            }}>
              Enter Prototype
            </Link>
          </div>
        </ScrollExpand>


        {/* 2. Philosophy Section */}
        <section id="philosophy" style={{
          padding: '160px 10% 80px',
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

        {/* 2.5 Gallery Showcase Section */}
        <section style={{
          padding: '80px 10% 160px',
          backgroundColor: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div style={{ marginBottom: '80px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: '400', margin: 0 }}>
              The Collection
            </h2>
            <p style={{ color: '#888888', marginTop: '24px', fontSize: '1.1rem', fontWeight: '300' }}>
              Where code meets craftsmanship.
            </p>
          </div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <AccordionGallery
              items={galleryItems}
              defaultIndex={2}
              expandRatio={0.52}
              trigger="hover"
              accentColor="#D4AF37"
              overlayColor="#0a0713"
              textColor="#ffffff"
              grayscale={false}
              showLabels
              duration={0.6}
              ease="power3.out"
              parallax={0.5}
              tilt={8}
              stagger={0.06}
              height={500}
              gap={10}
              radius={16}
              orientation="horizontal"
            />
          </motion.div>
        </section>

        {/* 3. The Workflow Section */}
        <section style={{
          padding: '160px 10%',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '120px' }}>
            <p style={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '5px', fontSize: '11px', marginBottom: '24px' }}>
              End-To-End Visibility
            </p>
            <h2 style={{
              fontFamily: "var(--font-playfair)",
              fontSize: 'clamp(3rem, 5vw, 4.5rem)',
              fontWeight: '400',
              marginBottom: '32px'
            }}>
              From Thread to Rack
            </h2>
            <p style={{ color: '#888888', maxWidth: '700px', margin: '0 auto', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' }}>
              Trace every garment&apos;s lifecycle. A continuous, uncompromised workflow engineered for high-volume apparel production.
            </p>
          </div>

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
                  width: '120px', height: '120px', borderRadius: '50%', border: '1px solid rgba(212, 175, 55, 0.3)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px',
                  color: '#D4AF37', fontFamily: "var(--font-playfair)", fontSize: '40px',
                  background: 'rgba(212, 175, 55, 0.02)'
                }}>
                  {i + 1}
                </div>
                <h4 style={{ textTransform: 'uppercase', letterSpacing: '4px', fontSize: '16px', marginBottom: '24px', color: 'var(--text-primary)' }}>{item.step}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.9', fontWeight: '300' }}>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* 4. Modules Grid Section */}
        <section style={{ padding: '160px 10% 0' }}>
          <div style={{ marginBottom: '120px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '40px' }}>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: '400', lineHeight: '1.1', margin: 0 }}>
              The Suite
            </h2>
            <p style={{ maxWidth: '450px', color: '#888888', lineHeight: '1.8', margin: 0, fontWeight: '300', fontSize: '1.1rem' }}>
              Over 20 deeply integrated modules working in perfect unison to orchestrate your shop floor.
            </p>
          </div>

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
                borderRight: '1px solid var(--border-color)',
                borderBottom: '1px solid var(--border-color)',
                height: '100%'
              }}>
                <PixelSwap
                  firstContent={
                    <div style={{
                      padding: '48px 48px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      backgroundColor: 'var(--bg-primary)',
                      boxSizing: 'border-box'
                    }}>
                      <span className="material-symbols-outlined" style={{
                        fontSize: '32px',
                        color: '#D4AF37',
                        marginBottom: '32px',
                        display: 'block'
                      }}>{mod.icon}</span>
                      <h3 style={{
                        fontFamily: "var(--font-playfair)",
                        fontSize: '2rem',
                        fontWeight: '400',
                        margin: 0
                      }}>{mod.title}</h3>
                    </div>
                  }
                  secondContent={
                    <div style={{
                      padding: '48px 48px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      backgroundColor: '#D4AF37', // Golden background on hover
                      color: '#000000', // Black text for contrast
                      boxSizing: 'border-box'
                    }}>
                      <span className="material-symbols-outlined" style={{
                        fontSize: '32px',
                        color: '#000000',
                        marginBottom: '32px',
                        display: 'block'
                      }}>{mod.icon}</span>
                      <h3 style={{
                        fontFamily: "var(--font-playfair)",
                        fontSize: '2rem',
                        fontWeight: '600',
                        margin: 0
                      }}>{mod.title}</h3>
                      <p style={{ color: 'rgba(0,0,0,0.8)', lineHeight: '1.8', fontSize: '1.05rem', fontWeight: '400', margin: '24px 0 0 0' }}>
                        {mod.desc}
                      </p>
                    </div>
                  }
                  pixelSize={64}
                  gap={0}
                  pixelRadius={0}
                  pixelSpin={0}
                  pixelScale={0.35}
                  duration={500}
                  pixelDuration={300}
                  pattern="random"
                  randomness={0}
                  fade
                  trigger="hover"
                  aspectRatio="auto"
                  style={{ height: '320px' }}
                />
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
      </motion.div>
    </>
  );
}
