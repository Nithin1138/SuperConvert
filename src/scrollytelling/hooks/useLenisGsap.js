import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Observer);

/**
 * Custom hook to initialize Lenis smooth scrolling and synchronize with GSAP ScrollTrigger
 */
export function useLenisGsap() {
  const lenisRef = useRef(null);

  useEffect(() => {
    // 1. Initialize Lenis with optimal lerp response
    const lenis = new Lenis({
      lerp: 0.09,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      autoResize: true,
    });

    lenisRef.current = lenis;

    // 2. Synchronize Lenis scroll events with GSAP ScrollTrigger
    lenis.on('scroll', (e) => {
      ScrollTrigger.update();

      // Update top scroll progress bar
      const progressEl = document.getElementById('story-progress-indicator');
      if (progressEl && e.limit > 0) {
        const progressPercent = Math.min(100, Math.max(0, (e.scroll / e.limit) * 100));
        progressEl.style.width = `${progressPercent}%`;
      }
    });

    // 3. Drive Lenis updates directly from GSAP ticker for 60-120fps lock
    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after DOM layout calculations settle
    const t1 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const t2 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    // 4. Cleanup on unmount
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return lenisRef;
}
