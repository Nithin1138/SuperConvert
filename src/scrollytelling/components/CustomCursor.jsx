import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const dotRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const follower = followerRef.current;
    if (!dot || !follower) return;

    // Use gsap.quickTo for instant 60fps tracking without state re-renders
    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' });
    const setFollowerX = gsap.quickTo(follower, 'x', { duration: 0.24, ease: 'power2.out' });
    const setFollowerY = gsap.quickTo(follower, 'y', { duration: 0.24, ease: 'power2.out' });

    let activeMagneticEl = null;

    const handlePointerMove = (e) => {
      setDotX(e.clientX);
      setDotY(e.clientY);
      setFollowerX(e.clientX);
      setFollowerY(e.clientY);

      // Check if hovering over a magnetic element via closest
      const target = e.target?.closest?.('.magnetic-btn, .magnetic-card, .story-nav-btn, [data-magnetic="true"]');
      if (target) {
        if (activeMagneticEl !== target) {
          activeMagneticEl = target;
          follower.classList.add('is-hovered');
          if (target.classList.contains('magnetic-btn') || target.dataset.magnetic === 'true') {
            follower.classList.add('is-magnetic');
          }
        }

        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.22;
        const deltaY = (e.clientY - centerY) * 0.22;

        gsap.to(target, {
          x: deltaX,
          y: deltaY,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else if (activeMagneticEl) {
        gsap.to(activeMagneticEl, {
          x: 0,
          y: 0,
          duration: 0.4,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto',
        });
        activeMagneticEl = null;
        follower.classList.remove('is-hovered');
        follower.classList.remove('is-magnetic');
      }
    };

    const handleScroll = () => {
      if (activeMagneticEl) {
        gsap.to(activeMagneticEl, {
          x: 0,
          y: 0,
          duration: 0.3,
          overwrite: 'auto',
        });
        activeMagneticEl = null;
        follower.classList.remove('is-hovered');
        follower.classList.remove('is-magnetic');
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      if (activeMagneticEl) {
        gsap.set(activeMagneticEl, { x: 0, y: 0 });
      }
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={followerRef} className="custom-cursor-follower" />
    </>
  );
}
