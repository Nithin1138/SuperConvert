import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CtaLaunchSection() {
  const sectionRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const box = boxRef.current;
      if (!box) return;

      gsap.fromTo(
        box,
        { opacity: 0.8, scale: 0.96, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: box,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="story-section story-cta-section gpu-accel">
      <div ref={boxRef} className="cta-box gpu-accel">
        <h2 className="cta-title">Ready for Frictionless Conversion?</h2>
        <p className="cta-desc">
          No credit card required. No email sign-up. 100% private, client-side document, image, and media transformations in your browser.
        </p>

        <div className="cta-button-group">
          <a
            href="#/tool/md-to-pdf"
            className="magnetic-btn btn-glow"
            data-magnetic="true"
          >
            <span>🚀 Launch Workstation Now</span>
          </a>
          <a
            href="#/studio"
            className="magnetic-btn btn-outline"
            data-magnetic="true"
          >
            <span>📝 Open Markdown Studio</span>
          </a>
        </div>
      </div>
    </section>
  );
}
