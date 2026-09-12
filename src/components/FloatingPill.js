export function renderFloatingPill() {
  return `
    <div id="super-floating-pill" class="super-floating-pill" title="Click to Export PDF (or press ⌘E)">
      <div class="floating-pill-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="12" y2="12"/>
          <line x1="15" y1="15" x2="12" y2="12"/>
        </svg>
      </div>
      <div>
        <div class="floating-pill-text">Quick Export PDF</div>
        <div id="floating-pill-sub" class="floating-pill-sub">⚡ Ready • 1-Click</div>
      </div>
    </div>
  `;
}
