export function renderCommandPalette() {
  return `
    <div id="cmd-palette" class="cmd-palette-backdrop">
      <div class="cmd-palette-box">
        <div class="cmd-input-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--text-muted);">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" id="cmd-search-input" class="cmd-input" placeholder="Type a command or search actions..." autocomplete="off" />
          <span class="cmd-kbd">ESC</span>
        </div>

        <ul id="cmd-list" class="cmd-list">
          <!-- Populated dynamically via JS -->
        </ul>
      </div>
    </div>
  `;
}
