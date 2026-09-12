export function renderSuperCardShowcase() {
  return `
    <section class="supercard-section">
      <!-- Floating 3D Decorative Assets like super.money -->
      <div class="super-decor super-decor-coin" style="top: 15%; left: 8%;">SC</div>
      <div class="super-decor super-decor-stairs" style="bottom: 12%; left: 10%;"></div>
      <div class="super-decor super-decor-cube" style="top: 20%; right: 9%;"></div>

      <div class="container">
        <div class="badge badge-brand" style="margin-bottom: 16px;">
          <span>superCard Edition</span>
        </div>
        <h2 style="font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 16px;">
          superDocument Pass
        </h2>
        <p style="color: var(--text-secondary); max-width: 620px; margin: 0 auto 20px; font-size: 1.15rem;">
          Enjoy the speed of local compilation with the precision of print publishing. Move your cursor across the card to experience reactive 3D specular shine.
        </p>

        <div class="supercard-perspective-box">
          <div id="interactive-supercard" class="supercard-card">
            <div class="supercard-shine"></div>
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; z-index: 2;">
              <div class="supercard-chip"></div>
              <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-lime); font-weight: 700; letter-spacing: 0.08em;">
                300 DPI VECTOR
              </div>
            </div>

            <div style="z-index: 2; margin: 20px 0;">
              <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
                Verified Document License
              </div>
              <div class="supercard-title">SuperConvert Ultra</div>
              <div style="font-family: var(--font-mono); font-size: 1.1rem; color: #E2E8F0; margin-top: 8px; letter-spacing: 0.15em;">
                •••• •••• •••• 2026
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-end; z-index: 2;">
              <div class="supercard-badges">
                <span class="supercard-badge">Zero-Knowledge</span>
                <span class="supercard-badge">Sub-50ms</span>
                <span class="supercard-badge">GFM Engine</span>
              </div>
              <button id="btn-card-export" class="btn btn-accent-lime btn-sm" style="box-shadow: 0 4px 16px rgba(181, 239, 133, 0.4);">
                Export Live PDF →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
