export function renderFeatures() {
  return `
    <section id="features" class="features-section">
      <div class="container">
        <div class="features-header">
          <div class="badge badge-brand" style="margin-bottom: 16px;">
            <span>High-Scale Architecture</span>
          </div>
          <h2 class="features-title">Engineered for Micro-SaaS Precision.</h2>
          <p class="features-subtitle">
            Say goodbye to slow, privacy-leaking cloud converters. SuperConvert executes in isolated worker threads right in your runtime.
          </p>
        </div>

        <div class="features-grid">
          <!-- Card 1: Electric Indigo (Privacy) -->
          <div class="feature-card feature-card-primary">
            <div>
              <div class="feature-icon-badge">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 class="feature-card-title">Zero-Knowledge Privacy</h3>
              <p class="feature-card-desc">
                Your proprietary business plans, financial reports, and confidential technical specs never touch any backend server. Everything executes locally in memory.
              </p>
            </div>
            <div style="margin-top: 24px; font-weight: 700; font-size: 0.85rem; opacity: 0.85;">
              SOC-2 & HIPAA Friendly →
            </div>
          </div>

          <!-- Card 2: Lime Neon (Blistering Speed) -->
          <div class="feature-card feature-card-lime">
            <div>
              <div class="feature-icon-badge">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <h3 class="feature-card-title">Sub-100ms Latency</h3>
              <p class="feature-card-desc">
                Zero network roundtrips and zero server cold-starts. Documents compile instantaneously with multi-threaded AST parsers.
              </p>
            </div>
            <div style="margin-top: 24px; font-weight: 700; font-size: 0.85rem; color: #08090E;">
              Benchmarked 40x Faster →
            </div>
          </div>

          <!-- Card 3: Magenta Neon (Typography) -->
          <div class="feature-card feature-card-magenta">
            <div>
              <div class="feature-icon-badge">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="4 7 4 4 20 4 20 7"/>
                  <line x1="9" y1="20" x2="15" y2="20"/>
                  <line x1="12" y1="4" x2="12" y2="20"/>
                </svg>
              </div>
              <h3 class="feature-card-title">Studio Typography</h3>
              <p class="feature-card-desc">
                Beautiful GFM tables, syntax highlighting for 50+ programming languages, mathematical formulas, and custom paper margins ready for press.
              </p>
            </div>
            <div style="margin-top: 24px; font-weight: 700; font-size: 0.85rem; opacity: 0.85;">
              5 Handcrafted Themes →
            </div>
          </div>

          <!-- Card 4: Obsidian Glass (API & High Scale) -->
          <div class="feature-card feature-card-glass">
            <div>
              <div class="feature-icon-badge">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <h3 class="feature-card-title">Headless API & High-Scale Automation</h3>
              <p class="feature-card-desc" style="color: var(--text-secondary);">
                Need to automate 50,000 document conversions per hour? Plug our lightweight Node.js or Python SDK into your CI/CD pipelines, document portals, or internal tooling.
              </p>
            </div>
            <div class="feature-code-preview">
<span style="color: #64748B;">// High-Scale Headless Conversion</span>
<span style="color: #F472B6;">const</span> response = <span style="color: #F472B6;">await</span> superConvert.<span style="color: #38BDF8;">compile</span>({
  <span style="color: #CBD5E1;">markdown</span>: rawMarkdownContent,
  <span style="color: #CBD5E1;">theme</span>: <span style="color: #A7F3D0;">'super-modern'</span>,
  <span style="color: #CBD5E1;">format</span>: <span style="color: #A7F3D0;">'A4'</span>,
  <span style="color: #CBD5E1;">watermark</span>: <span style="color: #A7F3D0;">'APPROVED'</span>
});
<span style="color: #64748B;">// &gt; Returns 300 DPI Vector PDF buffer in 45ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
