import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function HeroSection() {
  const sectionRef = useRef(null);
  const titleLine1Ref = useRef(null);
  const titleLine2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const badgesRef = useRef(null);
  const pillRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const line1Words = titleLine1Ref.current?.querySelectorAll('.split-word');
      const line2Words = titleLine2Ref.current?.querySelectorAll('.split-word');
      const subtitleWords = subtitleRef.current?.querySelectorAll('.split-word');

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Entrance pill
      tl.fromTo(
        pillRef.current,
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.1 }
      );

      // Line 1 word-by-word reveal
      if (line1Words && line1Words.length > 0) {
        tl.fromTo(
          line1Words,
          { opacity: 0, y: 40, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.85,
            stagger: 0.08,
          },
          '-=0.4'
        );
      }

      // Line 2 gradient word-by-word reveal
      if (line2Words && line2Words.length > 0) {
        tl.fromTo(
          line2Words,
          { opacity: 0, y: 40, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.85,
            stagger: 0.08,
          },
          '-=0.6'
        );
      }

      // Subtitle reveal
      if (subtitleWords && subtitleWords.length > 0) {
        tl.fromTo(
          subtitleWords,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.02,
          },
          '-=0.5'
        );
      }

      // Floating format badges subtle orbital parallax
      const tokens = badgesRef.current?.querySelectorAll('.parallax-format-token');
      if (tokens && sectionRef.current) {
        tokens.forEach((token, index) => {
          const depth = (index + 1) * 28;
          gsap.to(token, {
            y: -depth * 1.8,
            rotate: (index % 2 === 0 ? 1 : -1) * 8,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
            },
          });
        });
      }

      // Parallax fade out of hero as user scrolls down
      gsap.to([titleLine1Ref.current, titleLine2Ref.current, subtitleRef.current, pillRef.current], {
        y: -90,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderWords = (text) => {
    return text.split(' ').map((word, idx) => (
      <span key={idx} className="split-word">
        {word}
      </span>
    ));
  };

  return (
    <section ref={sectionRef} className="story-section story-hero-section gpu-accel">
      {/* Floating Parallax Format Badges on the Periphery */}
      <div ref={badgesRef} className="hero-floating-badges-container">
        <div className="parallax-format-token token-1" data-magnetic="true">
          <span>📄</span>
          <span>.PDF</span>
        </div>
        <div className="parallax-format-token token-2" data-magnetic="true">
          <span>🖼️</span>
          <span>.WEBP</span>
        </div>
        <div className="parallax-format-token token-3" data-magnetic="true">
          <span>🧊</span>
          <span>.OBJ 3D</span>
        </div>
        <div className="parallax-format-token token-4" data-magnetic="true">
          <span>🎵</span>
          <span>.WAV</span>
        </div>
        <div className="parallax-format-token token-5" data-magnetic="true">
          <span>📊</span>
          <span>.PPTX</span>
        </div>
        <div className="parallax-format-token token-6" data-magnetic="true">
          <span>⚡</span>
          <span>.DOCX</span>
        </div>
      </div>

      {/* Pill Badge */}
      <div ref={pillRef} className="hero-pill-badge">
        <span className="hero-pill-indicator" />
        <span>Universal In-Browser Engine • Zero Server Uploads</span>
      </div>

      {/* Split Animated Headline with Tight Vertical Rhythm */}
      <h1 className="story-split-title">
        <span ref={titleLine1Ref} className="hero-title-line-1">
          {renderWords('Transform Any Format.')}
        </span>
        <span ref={titleLine2Ref} className="hero-title-line-2">
          {renderWords('Pure In-Memory Speed.')}
        </span>
      </h1>

      {/* Subtitle */}
      <p ref={subtitleRef} className="story-hero-subtitle">
        {renderWords(
          'Documents, 3D meshes, ultra-compressed images, audio, and video processed entirely on your device with hardware-accelerated WebAssembly and zero cloud latency.'
        )}
      </p>

      {/* Scroll indicator */}
      <div className="story-scroll-indicator">
        <div className="scroll-mouse-icon">
          <div className="scroll-wheel-dot" />
        </div>
        <span>Scroll to Explore</span>
      </div>
    </section>
  );
}
