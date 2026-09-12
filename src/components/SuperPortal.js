export function renderSuperPortal() {
  return `
    <section class="superportal-section">
      <div class="container">
        <div class="badge badge-brand" style="margin-bottom: 16px;">
          <span>Beyond Cloud Rendering</span>
        </div>
        <h2 style="font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 16px;">
          Document Engine Reimagined
        </h2>
        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto; font-size: 1.15rem;">
          Concentric client-side Web Worker architecture executing AST compilation with zero cold starts.
        </p>

        <div class="superportal-container">
          <div class="portal-ring portal-ring-outer"></div>
          <div class="portal-ring portal-ring-mid"></div>
          <div class="portal-ring portal-ring-inner"></div>
          <div class="portal-core">
            AST CORE
          </div>
        </div>
      </div>
    </section>
  `;
}
