/**
 * Global Smooth Scrolling Engine (Lenis + GSAP ScrollTrigger Synchronization)
 * Delivers unified 60-120fps inertial scrolling across all pages (Home, Tool, Story)
 */

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger, Observer);

let lenisInstance = null;
let isInitialized = false;

/**
 * Initializes the unified global Lenis smooth scrolling instance
 */
export function initSmoothScroll() {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    lerp: 0.085,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
    autoResize: true,
  });

  // Synchronize Lenis scroll events with GSAP ScrollTrigger & progress bars
  lenisInstance.on('scroll', (e) => {
    ScrollTrigger.update();

    // 1. Home Page Scroll Progress Bar (#home-scroll-progress)
    const homeProgress = document.getElementById('home-scroll-progress');
    const hubPage = document.getElementById('page-hub');
    if (homeProgress && hubPage && hubPage.style.display !== 'none' && e.limit > 0) {
      const pct = Math.min(100, Math.max(0, (e.scroll / e.limit) * 100));
      homeProgress.style.width = `${pct}%`;
    }

    // 2. Scrollytelling Story Page Scroll Progress Bar (#story-progress-indicator)
    const storyProgress = document.getElementById('story-progress-indicator');
    const storyPage = document.getElementById('page-story');
    if (storyProgress && storyPage && storyPage.style.display !== 'none' && e.limit > 0) {
      const pct = Math.min(100, Math.max(0, (e.scroll / e.limit) * 100));
      storyProgress.style.width = `${pct}%`;
    }
  });

  // Direct lock into GSAP ticker for 60-120fps stutter-free physics
  const tickerCallback = (time) => {
    lenisInstance.raf(time * 1000);
  };
  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  // Smooth-scroll interception for anchor links (#features, #faq, etc.)
  if (!isInitialized) {
    isInitialized = true;
    document.addEventListener('click', handleAnchorClick);
    window.addEventListener('resize', handleResize);
  }

  return lenisInstance;
}

function handleAnchorClick(e) {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;

  const href = anchor.getAttribute('href');
  if (!href) return;

  // Ignore SPA routes like #/, #/tool/..., #/story, #/app
  if (href.startsWith('#/')) return;

  // In-page section anchors like #features, #faq, #hero
  if (href.length > 1 && !href.includes('/')) {
    const targetEl = document.querySelector(href);
    if (targetEl && lenisInstance) {
      e.preventDefault();
      lenisInstance.scrollTo(targetEl, {
        offset: -76,
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  }
}

function handleResize() {
  ScrollTrigger.refresh();
}

/**
 * Returns the active global Lenis instance
 */
export function getLenis() {
  if (!lenisInstance) {
    return initSmoothScroll();
  }
  return lenisInstance;
}

/**
 * Smoothly or immediately scrolls to top of page
 */
export function scrollToTop(immediate = false) {
  const lenis = getLenis();
  if (lenis) {
    if (immediate) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      lenis.scrollTo(0, {
        duration: 0.9,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? 'instant' : 'smooth' });
  }
}
