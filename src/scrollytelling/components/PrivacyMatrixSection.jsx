import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function PrivacyMatrixSection() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const textColRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const card = cardRef.current;
      const textCol = textColRef.current;
      if (!section || !card || !textCol) return;

      // Parallax effect between columns
      gsap.fromTo(
        card,
        { y: 80, opacity: 0.2 },
        {
          y: -40,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1.2,
          },
        }
      );

      gsap.fromTo(
        textCol,
        { y: 40 },
        {
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 0.8,
          },
        }
      );

      // Observer-style staggered reveal of comparison rows
      const rows = card.querySelectorAll('.privacy-comparison-row');
      gsap.from(rows, {
        opacity: 0,
        x: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="story-section story-privacy-section gpu-accel">
      <div className="privacy-grid">
        {/* Left column: Narrative & Metrics */}
        <div ref={textColRef}>
          <div className="privacy-pill">
            <span>🛡️</span>
            <span>ZERO-KNOWLEDGE ARCHITECTURE</span>
          </div>
          <h2 className="privacy-title">
            Your Documents Never Leave Your Device.
          </h2>
          <p className="privacy-body">
            Traditional online converters upload your confidential PDFs, contracts, and images to remote cloud servers, storing them on third-party buckets and creating attack vectors. SuperConvert operates 100% inside your browser sandbox via WebAssembly and HTML5 Canvas.
          </p>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#10b981', fontFamily: 'var(--story-font-mono)' }}>
                0.00<span style={{ fontSize: '1.2rem' }}>ms</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--story-text-muted)' }}>Network Upload Latency</div>
            </div>
            <div style={{ width: '1px', background: 'var(--story-border)' }} />
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#6366f1', fontFamily: 'var(--story-font-mono)' }}>
                0
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--story-text-muted)' }}>Server Database Writes</div>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Security Comparison Matrix */}
        <div ref={cardRef} className="privacy-interactive-box gpu-accel" data-magnetic="true">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--story-border)' }}>
            <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Metric / Feature</span>
            <div style={{ display: 'flex', gap: '32px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--story-text-muted)' }}>Traditional Cloud</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--story-emerald)', fontWeight: '700' }}>SuperConvert</span>
            </div>
          </div>

          <div className="privacy-comparison-row">
            <div>
              <div style={{ fontWeight: '600' }}>Data Transmission</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--story-text-dim)' }}>Files uploaded over public WAN</div>
            </div>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <span className="badge-risk">Cloud Upload</span>
              <span className="badge-zero">100% Local RAM</span>
            </div>
          </div>

          <div className="privacy-comparison-row">
            <div>
              <div style={{ fontWeight: '600' }}>Third-Party Retention</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--story-text-dim)' }}>Stored in server S3 buckets</div>
            </div>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <span className="badge-risk">Retained 24h+</span>
              <span className="badge-zero">Zero Retention</span>
            </div>
          </div>

          <div className="privacy-comparison-row">
            <div>
              <div style={{ fontWeight: '600' }}>Offline Capability</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--story-text-dim)' }}>Works without WiFi or internet</div>
            </div>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <span className="badge-risk">Fails Offline</span>
              <span className="badge-zero">Works Offline</span>
            </div>
          </div>

          <div className="privacy-comparison-row">
            <div>
              <div style={{ fontWeight: '600' }}>File Size Caps</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--story-text-dim)' }}>Upload limits & paywalls</div>
            </div>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <span className="badge-risk">Strict 15MB Cap</span>
              <span className="badge-zero">Unlimited</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
