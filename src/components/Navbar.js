export function renderNavbar() {
  return `
    <header class="navbar-header">
      <div class="navbar-container">
        <a href="#/" class="navbar-logo">
          <div class="navbar-logo-icon">SC</div>
          <span>SuperConvert</span>
          <span class="navbar-logo-tag">Universal</span>
        </a>

        <ul class="navbar-nav">
          <li><a href="#/" class="navbar-link">All Tools Hub</a></li>
          <li><a href="#/story" class="navbar-link" style="color: #818cf8; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;"><span>✨ Story Mode</span></a></li>
          <li><a href="#features" class="navbar-link">Features</a></li>
          <li><a href="#faq" class="navbar-link">FAQs</a></li>
          <li><button id="btn-open-api" class="navbar-link">API Docs</button></li>
        </ul>

        <div class="navbar-actions">
          <button id="btn-open-pricing" class="btn btn-secondary btn-sm">Pricing</button>
          <a href="#/tool/md-to-pdf" class="btn btn-primary btn-sm">Open Live Studio</a>
        </div>
      </div>
    </header>
  `;
}
