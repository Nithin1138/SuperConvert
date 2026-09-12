import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let animationsInitialized = false;

/**
 * Initializes cinematic scrollytelling, continuous floating motions, and 3D card physics on Home
 */
export function initSuperAnimations() {
  // 1. Continuous Floating 3D Geometric shapes (Hero/SuperCard section)
  gsap.to('.super-decor-coin', {
    y: -18,
    rotation: 6,
    duration: 3.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.super-decor-stairs', {
    y: 15,
    rotation: -8,
    duration: 3.8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.super-decor-cube', {
    y: -14,
    rotation: 30,
    duration: 4.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  // ScrollTrigger Parallax for Decorative Shapes
  const supercardSection = document.querySelector('.supercard-section');
  if (supercardSection) {
    gsap.to('.super-decor-coin', {
      y: 60,
      rotation: 45,
      ease: 'none',
      scrollTrigger: {
        trigger: '.supercard-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    });

    gsap.to('.super-decor-stairs', {
      y: -50,
      rotation: -35,
      ease: 'none',
      scrollTrigger: {
        trigger: '.supercard-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    gsap.to('.super-decor-cube', {
      y: 80,
      rotation: 90,
      ease: 'none',
      scrollTrigger: {
        trigger: '.supercard-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.8
      }
    });
  }

  // 2. Interactive 3D Card Tilt with Specular Reflection (SuperCard)
  const card = document.getElementById('interactive-supercard');
  if (card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12; // tilt max 12 deg
      const rotateY = ((x - centerX) / centerX) * 12;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        scale: 1.02,
        duration: 0.25,
        ease: 'power2.out',
        transformPerspective: 1000
      });

      // Update specular sheen position
      const pctX = (x / rect.width) * 100;
      const pctY = (y / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${pctX}%`);
      card.style.setProperty('--mouse-y', `${pctY}%`);
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
      card.style.setProperty('--mouse-x', `50%`);
      card.style.setProperty('--mouse-y', `50%`);
    });

    // Scroll-driven 3D Entrance & Specular Sweep for SuperCard
    gsap.fromTo(card, 
      { rotateX: 18, rotateY: -10, scale: 0.93, opacity: 0.8 },
      {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.supercard-section',
          start: 'top 80%',
          end: 'center center',
          scrub: 1
        }
      }
    );
  }

  // 3. Features Section Scrollytelling Reveal
  const featuresSection = document.getElementById('features');
  if (featuresSection) {
    gsap.from('.features-header', {
      y: 35,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#features',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length > 0) {
      gsap.from(featureCards, {
        y: 45,
        opacity: 0,
        scale: 0.96,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }
  }

  // 4. SuperPortal Concentric Rings Scrollytelling Scrub
  const superportalSection = document.querySelector('.superportal-section');
  if (superportalSection) {
    gsap.to('.portal-ring-outer', {
      rotation: 260,
      ease: 'none',
      scrollTrigger: {
        trigger: '.superportal-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    gsap.to('.portal-ring-mid', {
      rotation: -220,
      ease: 'none',
      scrollTrigger: {
        trigger: '.superportal-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    });

    gsap.to('.portal-ring-inner', {
      scale: 1.15,
      rotation: 120,
      ease: 'none',
      scrollTrigger: {
        trigger: '.superportal-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    gsap.to('.portal-core', {
      boxShadow: '0 0 90px rgba(129, 140, 248, 0.9)',
      scale: 1.08,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '.superportal-section',
        start: 'top 70%',
        end: 'center center',
        scrub: 0.8
      }
    });
  }

  // 5. FAQ Items Scrollytelling Reveal
  const faqSection = document.getElementById('faq');
  if (faqSection) {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
      gsap.from(faqItems, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.faq-list',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }
  }

  // 6. Interactive 3D micro-tilt on Feature cards
  setupFeatureCardsTilt();

  // 7. Workspace entrance reveal (Hero section elements)
  if (!animationsInitialized) {
    animationsInitialized = true;
    animateHomeEntrance();
  }
}

/**
 * Cinematic entrance sequence when Home loads
 */
export function animateHomeEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hub-main-title', {
    y: 24,
    opacity: 0,
    duration: 0.7
  }, 0.05);

  tl.from('.hub-status-badge', {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(2)'
  }, 0.2);

  tl.from('.hub-main-subtitle', {
    y: 16,
    opacity: 0,
    duration: 0.6
  }, 0.25);

  tl.from('.hub-search-box', {
    y: 20,
    opacity: 0,
    duration: 0.6
  }, 0.3);

  tl.from('.sidebar-block', {
    x: -20,
    opacity: 0,
    stagger: 0.08,
    duration: 0.5
  }, 0.35);

  const initialCards = document.querySelectorAll('.tool-card');
  if (initialCards.length > 0) {
    tl.from(Array.from(initialCards).slice(0, 18), {
      y: 20,
      opacity: 0,
      scale: 0.95,
      stagger: 0.015,
      duration: 0.45
    }, 0.4);
  }
}

/**
 * 3D Micro-tilt physics on Feature Cards
 */
function setupFeatureCardsTilt() {
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      gsap.to(card, {
        rotateX,
        rotateY,
        scale: 1.02,
        duration: 0.25,
        ease: 'power2.out',
        transformPerspective: 800
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.45,
        ease: 'power2.out'
      });
    });
  });
}

/**
 * Bouncy tactile button animation
 */
export function animateButtonPress(elem) {
  if (!elem) return;
  gsap.fromTo(elem, 
    { scale: 0.94 }, 
    { scale: 1, duration: 0.25, ease: 'back.out(2)' }
  );
}
