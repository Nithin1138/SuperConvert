import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '../../core/smooth-scroll.js';

/**
 * Custom hook to connect StoryApp with global Lenis smooth scrolling and GSAP ScrollTrigger
 */
export function useLenisGsap() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = getLenis();
    lenisRef.current = lenis;

    // Refresh ScrollTrigger after story components mount into DOM
    const t1 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);

    const t2 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      // Cleanly refresh triggers for incoming views
      ScrollTrigger.refresh();
    };
  }, []);

  return lenisRef;
}
