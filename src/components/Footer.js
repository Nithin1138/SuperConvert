export function renderFooter() {
  return `
    <footer class="site-footer" style="border-top: 1px solid var(--border-subtle); padding: 60px 0 40px; background: var(--bg-surface);">
      <div class="container">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; margin-bottom: 40px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="navbar-logo-icon" style="width: 32px; height: 32px; font-size: 0.95rem;">SC</div>
            <span style="font-weight: 800; font-size: 1.15rem; color: #FFF;">SuperConvert</span>
            <span class="badge" style="font-size: 0.72rem; padding: 3px 10px; margin-left: 8px;">
              <span class="badge-dot"></span>
              <span>All Systems Operational (99.99%)</span>
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 24px; font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">
            <a href="#converter" class="navbar-link">Studio</a>
            <a href="#features" class="navbar-link">Features</a>
            <a href="#faq" class="navbar-link">FAQs</a>
            <a href="https://github.com" target="_blank" class="navbar-link">GitHub</a>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; border-top: 1px solid var(--border-subtle); padding-top: 24px; font-size: 0.85rem; color: var(--text-muted);">
          <div>
            © 2026 SuperConvert Micro-SaaS. All rights reserved. Zero-Knowledge Document Architecture.
          </div>
          <div style="display: flex; gap: 16px;">
            <a href="#" class="navbar-link" style="font-size: 0.82rem;">Privacy Policy</a>
            <a href="#" class="navbar-link" style="font-size: 0.82rem;">Terms of Service</a>
            <a href="#" class="navbar-link" style="font-size: 0.82rem;">Security</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
