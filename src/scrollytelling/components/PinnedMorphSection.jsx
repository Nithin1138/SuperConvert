import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function PinnedMorphSection() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const progressBarRef = useRef(null);
  const cardRef = useRef(null);

  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      step: '01 / 04',
      title: 'Vector Document Synthesizer',
      tag: 'DOCUMENTS & PDF',
      desc: 'Deterministic multi-page vector layout with smart element-aware break detection. Headings, tables, and code snippets stay perfectly intact.',
      icon: '📄',
      format: 'PDF • DOCX • MD',
      metric: '0.04s execution • Lossless typography',
      color: '#6366f1',
    },
    {
      step: '02 / 04',
      title: 'Quantum Image Engine',
      tag: 'VISUAL ASSETS',
      desc: 'Lossy & lossless client-side quantization. Target size templates (100KB, 250KB, 500KB) with instant live preview and zero fidelity loss.',
      icon: '⚡',
      format: 'WEBP • AVIF • PNG • TIFF',
      metric: 'Up to 88% size reduction • 60fps canvas',
      color: '#06b6d4',
    },
    {
      step: '03 / 04',
      title: 'Wavefront 3D Tessellator',
      tag: 'SPATIAL GEOMETRY',
      desc: 'Direct binary float IEEE 754 STL compilation and glTF 2.0 conversion from raw Wavefront OBJ polygons, right inside browser memory.',
      icon: '🧊',
      format: 'OBJ ↔ STL ↔ GLTF',
      metric: 'Binary mesh parsing • WebXR ready',
      color: '#ec4899',
    },
    {
      step: '04 / 04',
      title: 'Lossless Audio & Video Stream',
      tag: 'MULTIMEDIA TRANSDUCER',
      desc: 'Direct Web Audio API 16-bit PCM RIFF WAV synthesis and MediaRecorder hardware decoding for instant offline extraction and conversions.',
      icon: '🎵',
      format: 'WAV • MP3 • MP4 • WEBM',
      metric: '44.1kHz audio buffer • Zero bandwidth',
      color: '#10b981',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const stage = stageRef.current;
      const progressBar = progressBarRef.current;
      const card = cardRef.current;
      if (!container || !stage || !progressBar || !card) return;

      const morphItems = stage.querySelectorAll('.morph-stage-item');

      // Master Scroll-Pinned Scrollytelling Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=2400',
          pin: stage,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            // Update progress bar
            progressBar.style.width = `${p * 100}%`;

            // Compute active stage (0, 1, 2, 3)
            const idx = Math.min(Math.floor(p * 4), 3);
            setActiveStage(idx);
          },
        },
      });

      // Initial state: first item visible, others hidden
      morphItems.forEach((item, idx) => {
        if (idx === 0) {
          gsap.set(item, { opacity: 1, scale: 1, rotateY: 0 });
        } else {
          gsap.set(item, { opacity: 0, scale: 0.7, rotateY: 45, y: 50 });
        }
      });

      // Transition 1 -> 2
      tl.to(morphItems[0], { opacity: 0, scale: 1.3, filter: 'blur(12px)', duration: 1 })
        .to(morphItems[1], { opacity: 1, scale: 1, rotateY: 0, y: 0, filter: 'blur(0px)', duration: 1 }, '-=0.5')
        .to(card, { borderColor: stages[1].color, duration: 0.8 }, '-=0.8');

      // Transition 2 -> 3
      tl.to(morphItems[1], { opacity: 0, scale: 0.6, rotateZ: -15, filter: 'blur(12px)', duration: 1 })
        .to(morphItems[2], { opacity: 1, scale: 1, rotateY: 0, y: 0, rotateZ: 0, filter: 'blur(0px)', duration: 1 }, '-=0.5')
        .to(card, { borderColor: stages[2].color, duration: 0.8 }, '-=0.8');

      // Transition 3 -> 4
      tl.to(morphItems[2], { opacity: 0, scale: 1.2, rotateX: 30, filter: 'blur(12px)', duration: 1 })
        .to(morphItems[3], { opacity: 1, scale: 1, rotateY: 0, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 1 }, '-=0.5')
        .to(card, { borderColor: stages[3].color, duration: 0.8 }, '-=0.8');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const current = stages[activeStage] || stages[0];

  return (
    <section ref={containerRef} className="story-section story-pinned-section">
      <div ref={stageRef} className="pinned-viewport-stage gpu-accel">
        {/* Header */}
        <div className="pinned-stage-header">
          <span className="pinned-stage-tag">{current.tag}</span>
          <h2 className="pinned-stage-title">The Universal Transformation Core</h2>
        </div>

        {/* Morph Theater Glass Card */}
        <div ref={cardRef} className="morph-theater-card gpu-accel" data-magnetic="true">
          {/* Left info panel */}
          <div className="morph-panel-left">
            <div>
              <div className="morph-step-counter">
                <span className="morph-step-dot" style={{ backgroundColor: current.color }} />
                <span>STAGE {current.step}</span>
              </div>
              <h3 className="morph-dynamic-title">{current.title}</h3>
              <p className="morph-dynamic-desc">{current.desc}</p>
            </div>

            <div>
              <div className="morph-progress-bar-wrap">
                <div ref={progressBarRef} className="morph-progress-bar-fill" />
              </div>
            </div>
          </div>

          {/* Right morph visual stage */}
          <div className="morph-panel-right">
            {stages.map((stage, idx) => (
              <div key={idx} className="morph-stage-item">
                <div
                  className="morph-item-icon-box"
                  style={{
                    borderColor: `${stage.color}80`,
                    boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 35px ${stage.color}40`,
                  }}
                >
                  <span>{stage.icon}</span>
                </div>
                <div className="morph-item-format-tag">{stage.format}</div>
                <div className="morph-item-metrics">{stage.metric}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
