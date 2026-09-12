/**
 * Smooth Navigation & Top Scroll Progress Controller
 * Handles top progress indicator, smooth anchor gliding, and scroll resets.
 */

let isInitialized = false;

export function initSmoothScroll() {
  if (isInitialized) return;
  isInitialized = true;

  // Real-time top scroll progress bar for Home page
  window.addEventListener('scroll', handleScrollProgress, { passive: true });

  // In-page smooth anchor gliding (#features, #faq, etc.)
  document.addEventListener('click', handleAnchorClick);
}

function handleScrollProgress() {
  const homeProgress = document.getElementById('home-scroll-progress');
  const hubPage = document.getElementById('page-hub');
  if (!homeProgress || !hubPage || hubPage.style.display === 'none') return;

  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  if (maxScroll > 0) {
    const pct = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
    homeProgress.style.width = `${pct}%`;
  }
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
    if (targetEl) {
      e.preventDefault();
      const navOffset = 76;
      const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  }
}

/**
 * Instantly or smoothly resets scroll to the top of the viewport
 */
export function scrollToTop(immediate = true) {
  window.scrollTo({
    top: 0,
    behavior: immediate ? 'instant' : 'smooth'
  });
}
