import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function InteractiveShowcase() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  const formatCategories = [
    {
      title: 'PDF & Document Workstation',
      desc: 'Clean multi-page vector generation with smart element-aware page breaks, Word (.docx) round-trips, and Markdown parsing.',
      icon: '📘',
      toolId: 'md-to-pdf',
      tags: ['PDF', 'DOCX', 'MD', 'TXT'],
      accent: '#6366f1',
    },
    {
      title: 'Quantum Image Quantizer',
      desc: 'Lossy and lossless compression with target size templates (100KB, 250KB, 500KB) and pure JS TIFF/BMP/ICO binary encoding.',
      icon: '🖼️',
      toolId: 'image-compress-convert',
      tags: ['JPG', 'PNG', 'WEBP', 'AVIF', 'TIFF', 'ICO'],
      accent: '#06b6d4',
    },
    {
      title: 'Wavefront 3D Poly Engine',
      desc: 'Client-side Wavefront OBJ and STL polygon parser with IEEE 754 binary STL compilation and glTF 2.0 WebXR exports.',
      icon: '🧊',
      toolId: '3d-convert',
      tags: ['OBJ', 'STL', 'FBX', 'GLTF'],
      accent: '#ec4899',
    },
    {
      title: 'Audio Buffer Studio',
      desc: 'Direct Web Audio API 16-bit PCM RIFF WAV synthesis, MP3 transcoding, and seamless video audio-track extraction.',
      icon: '🎵',
      toolId: 'audio-convert',
      tags: ['WAV', 'MP3', 'OGG', 'AAC', 'FLAC'],
      accent: '#10b981',
    },
    {
      title: 'Video Frame Slicer',
      desc: 'Hardware-accelerated MediaRecorder transcoding across WebM and MP4, plus high-framerate animated GIF creation.',
      icon: '🎬',
      toolId: 'video-convert',
      tags: ['MP4', 'WEBM', 'MOV', 'AVI', 'GIF'],
      accent: '#f59e0b',
    },
    {
      title: 'Data & Spreadsheet Matrix',
      desc: 'Tabular text, CSV, JSON, and GFM markdown tables converted directly into multi-column Microsoft Excel (.xlsx) workbooks.',
      icon: '📊',
      toolId: 'doc-to-xlsx',
      tags: ['XLSX', 'CSV', 'JSON', 'TABLES'],
      accent: '#8b5cf6',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.magnetic-card');
      if (!cards || cards.length === 0) return;

      // Staggered entrance animation
      gsap.from(cards, {
        opacity: 0,
        y: 60,
        rotateX: -15,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // 3D tilt tracking on mouse move
      cards.forEach((card) => {
        const handleCardMouseMove = (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -10;
          const rotateY = ((x - centerX) / centerX) * 10;

          gsap.to(card, {
            rotateX,
            rotateY,
            transformPerspective: 1000,
            duration: 0.25,
            ease: 'power2.out',
          });
        };

        const handleCardMouseLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.4)',
          });
        };

        card.addEventListener('mousemove', handleCardMouseMove);
        card.addEventListener('mouseleave', handleCardMouseLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="story-section story-cards-section gpu-accel">
      <div className="cards-section-header">
        <span
          style={{
            fontFamily: 'var(--story-font-mono)',
            fontSize: '0.85rem',
            color: 'var(--story-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '12px',
            display: 'block',
          }}
        >
          INTERACTIVE ECOSYSTEM
        </span>
        <h2 className="cards-section-title">Built for Every Format Spectrum.</h2>
        <p style={{ color: 'var(--story-text-muted)', fontSize: '1.15rem' }}>
          Select any workstation below to launch the dedicated in-browser conversion studio.
        </p>
      </div>

      <div ref={gridRef} className="cards-grid">
        {formatCategories.map((cat, idx) => (
          <div
            key={idx}
            className="magnetic-card gpu-accel"
            data-magnetic="true"
            onClick={() => {
              window.location.hash = `#/tool/${cat.toolId}`;
            }}
          >
            <div
              className="card-icon-halo"
              style={{
                backgroundColor: `${cat.accent}18`,
                borderColor: `${cat.accent}40`,
              }}
            >
              <span>{cat.icon}</span>
            </div>
            <h3 className="card-title">{cat.title}</h3>
            <p className="card-desc">{cat.desc}</p>
            <div className="card-tags">
              {cat.tags.map((t, tIdx) => (
                <span key={tIdx} className="card-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
