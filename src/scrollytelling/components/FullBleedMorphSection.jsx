import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function FullBleedMorphSection() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const stage = stageRef.current;
      const card = cardRef.current;
      const content = contentRef.current;
      if (!container || !stage || !card || !content) return;

      // Pin the stage inside container with exact pinSpacing
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=1600',
          pin: stage,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // 0% - 60%: Expand card to full viewport
      tl.fromTo(
        card,
        {
          width: '740px',
          maxWidth: '92vw',
          height: '440px',
          borderRadius: '32px',
          borderWidth: '1.5px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7)',
        },
        {
          width: '100vw',
          maxWidth: '100vw',
          height: '100vh',
          borderRadius: '0px',
          borderWidth: '0px',
          boxShadow: 'none',
          duration: 1,
          ease: 'power2.inOut',
        }
      ).fromTo(
        content,
        { scale: 0.9, opacity: 0.8 },
        { scale: 1.05, opacity: 1, duration: 1, ease: 'power2.out' },
        '<'
      );

      // 60% - 100%: Hold stage at full-bleed so user can interact and read comfortably
      tl.to({}, { duration: 0.6 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="story-section story-morph-section-wrap">
      <div ref={stageRef} className="morph-bleed-stage gpu-accel">
        <div ref={cardRef} className="morph-bleed-card gpu-accel">
          {/* Ambient background visual inside morphing card */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
              pointerEvents: 'none',
            }}
          />

          <div ref={contentRef} className="morph-bleed-content gpu-accel">
            <span
              style={{
                fontFamily: 'var(--story-font-mono)',
                fontSize: '0.85rem',
                color: 'var(--story-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                marginBottom: '16px',
                display: 'block',
              }}
            >
              INFINITE CANVAS • BROWSER COMPUTING
            </span>
            <h2 className="morph-bleed-headline">
              From Inline Utility to Full-Bleed Studio.
            </h2>
            <p className="morph-bleed-desc">
              Experience responsive workstation transformation. Convert documents in quick batch mode, or expand directly into the live Markdown Studio with real-time vector pagination, custom CSS typography, and watermarking.
            </p>

            <div style={{ display: 'inline-flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a
                href="#/studio"
                className="story-nav-btn primary"
                data-magnetic="true"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                <span>✨ Launch Live Studio</span>
              </a>
              <a
                href="#/tools"
                className="story-nav-btn secondary"
                data-magnetic="true"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                <span>Browse All 43 Tools →</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
