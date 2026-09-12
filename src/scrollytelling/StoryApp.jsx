import React from 'react';
import { useLenisGsap } from './hooks/useLenisGsap.js';
import { CustomCursor } from './components/CustomCursor.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { PinnedMorphSection } from './components/PinnedMorphSection.jsx';
import { PrivacyMatrixSection } from './components/PrivacyMatrixSection.jsx';
import { FullBleedMorphSection } from './components/FullBleedMorphSection.jsx';
import { InteractiveShowcase } from './components/InteractiveShowcase.jsx';
import { CtaLaunchSection } from './components/CtaLaunchSection.jsx';
import './styles/scrollytelling.css';

export function StoryApp() {
  const lenisRef = useLenisGsap();

  const scrollTo = (target) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { duration: 1.4 });
    }
  };

  return (
    <div className="story-root">
      {/* Top Scroll Progress Indicator */}
      <div id="story-progress-indicator" className="story-scroll-progress" />

      {/* Ambient Radial Background Mesh */}
      <div className="story-ambient-mesh" />
      <div className="story-noise-overlay" />

      {/* Fluid Magnetic Custom Cursor */}
      <CustomCursor />

      {/* Floating Header Bar */}
      <header className="story-header">
        <a href="#/story" className="story-brand" data-magnetic="true">
          <span>⚡ SuperConvert</span>
          <span className="story-brand-badge">Storytelling</span>
        </a>

        <div className="story-nav-actions">
          <button
            type="button"
            className="story-nav-btn secondary"
            data-magnetic="true"
            onClick={() => scrollTo('.story-pinned-section')}
          >
            Morph Core
          </button>
          <button
            type="button"
            className="story-nav-btn secondary"
            data-magnetic="true"
            onClick={() => scrollTo('.story-privacy-section')}
          >
            Security
          </button>
          <button
            type="button"
            className="story-nav-btn secondary"
            data-magnetic="true"
            onClick={() => scrollTo('.story-cards-section')}
          >
            Ecosystem
          </button>
          <a
            href="#/app"
            className="story-nav-btn primary"
            data-magnetic="true"
          >
            <span>Launch App →</span>
          </a>
        </div>
      </header>

      {/* Main Scrollytelling Chapters */}
      <main>
        <HeroSection />
        <PinnedMorphSection />
        <PrivacyMatrixSection />
        <FullBleedMorphSection />
        <InteractiveShowcase />
        <CtaLaunchSection />
      </main>

      {/* Story Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--story-border)',
          padding: '40px 24px',
          textAlign: 'center',
          color: 'var(--story-text-dim)',
          fontSize: '0.85rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <p style={{ margin: 0 }}>
          SuperConvert • In-Browser Universal Transformation Platform • Zero Cloud Tracking • 60 FPS Lenis + GSAP Scrollytelling
        </p>
      </footer>
    </div>
  );
}
