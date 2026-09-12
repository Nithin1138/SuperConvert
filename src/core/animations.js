import gsap from 'gsap';

/**
 * Initializes continuous floating motions, 3D card tilt physics, and micro-interactions.
 * Guarantees 100% immediate visibility of all content (tools, cards, features, FAQs) without blank voids.
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
  }

  // 3. Interactive 3D micro-tilt on Feature cards
  setupFeatureCardsTilt();
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
