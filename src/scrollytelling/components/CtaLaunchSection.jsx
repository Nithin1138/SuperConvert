import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CtaLaunchSection() {
  const sectionRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const box = boxRef.current;
      if (!box) return;

      gsap.from(box, {
        opacity: 0,
        scale: 0.92,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: box,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
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
