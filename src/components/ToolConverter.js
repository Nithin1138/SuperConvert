/**
 * SuperConvert — Universal Tool Converter Component
 * Complete Full-Width Structured Application Workspace
 * Spans edge-to-edge with dedicated controls, settings, live output preview, and status footer.
 */

export function renderToolConverter() {
  return `
    <section id="tool-converter" class="tool-converter-section" style="display: none;">
      <div class="tool-converter-shell">
        
        <!-- Application Topbar (Edge-to-Edge Single Clean Strip) -->
        <div class="tool-header-bar">
          <div class="tool-header-left">
            <a href="#/" id="tool-back-btn" class="tool-back-btn" title="Back to all tools">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>All Tools</span>
            </a>

            <div class="tool-header-divider"></div>

            <div class="tool-breadcrumbs">
              <span class="crumb-root">Tools</span>
              <span class="crumb-sep">/</span>
              <span id="tool-active-category" class="crumb-cat">IMAGES</span>
              <span class="crumb-sep">/</span>
              <span id="tool-breadcrumb-title" class="crumb-title">Compress + Format Converter</span>
            </div>

            <div class="tool-header-divider hide-mobile"></div>

            <div class="tool-active-info">
              <span id="tool-active-icon" class="tool-active-icon">⚡</span>
              <div>
                <h1 id="tool-active-name" class="tool-active-name">Compress + Format Converter</h1>
                <p id="tool-active-desc" class="tool-active-desc">Simultaneously change image format and compress to target file size.</p>
              </div>
            </div>
          </div>

          <div class="tool-header-right">
            <span id="tool-active-badge" class="tool-header-badge badge-free">⚡ FREE</span>
            <button id="tool-format-pill" class="tool-format-pill tool-format-pill-btn" type="button" title="Click to browse & change format">
              <span id="tool-format-pill-label">.png → .webp / .jpg</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <span class="tool-privacy-tag">
              <span class="privacy-dot-pulse"></span>
              <span>100% Client-Side</span>
            </span>
          </div>
        </div>

        <!-- Main Tool Body: 2 Structured Panes (Controls & Settings | Live Output & Preview) -->
        <div class="tool-body">

          <!-- LEFT WORKSTATION: Input & Settings -->
          <div class="tool-input-panel">
            
            <!-- Section 1: Upload Source -->
            <div class="tool-panel-block">
              <div class="tool-panel-step">
                <span class="step-badge">1</span>
                <span class="step-title">Source File</span>
              </div>

              <!-- File Upload Zone -->
              <div id="tool-upload-zone" class="tool-upload-zone">
                <div class="upload-zone-content">
                  <div class="upload-zone-icon">
                    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <h3 class="upload-zone-title">Drag & drop your file here</h3>
                  <p id="upload-zone-formats" class="upload-zone-formats">Accepts .png, .jpg, .webp, .bmp, .svg</p>
                  <div class="upload-zone-actions">
                    <button id="tool-browse-btn" class="btn btn-primary btn-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      <span>Browse Files</span>
                    </button>
                  </div>
                </div>
                <input type="file" id="tool-file-input" style="display: none;" />
              </div>

              <!-- Text Input Zone (for code/data tools) -->
              <div id="tool-text-zone" class="tool-text-zone" style="display: none;">
                <div class="text-zone-header">
                  <span class="text-zone-label">Paste or type raw data:</span>
                  <button id="tool-text-clear" class="btn btn-sm btn-ghost">Clear</button>
                </div>
                <textarea id="tool-text-input" class="tool-text-textarea" spellcheck="false" placeholder="Paste your content here..."></textarea>
              </div>

              <!-- Uploaded Files List -->
              <div id="tool-files-list" class="tool-files-list" style="display: none;">
                <div class="files-list-header">
                  <span id="tool-files-count">0 files selected</span>
                  <button id="tool-files-clear" class="btn btn-sm btn-ghost" style="color: #EF4444;">Clear</button>
                </div>
                <div id="tool-files-items" class="files-list-items"></div>
              </div>
            </div>

            <!-- Section 2: Settings & Configuration -->
            <div id="tool-settings-block" class="tool-panel-block">
              <div id="tool-settings-step-heading" class="tool-panel-step">
                <span class="step-badge">2</span>
                <span class="step-title">Conversion Settings</span>
              </div>

              <!-- Tool Settings Panel -->
              <div id="tool-settings-panel" class="tool-settings-panel" style="display: none;">
                <div class="settings-panel-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  <span>Output Parameters & Compression</span>
                </div>
                <div id="tool-settings-body" class="settings-body"></div>
              </div>
            </div>

            <!-- Section 3: Action Execution -->
            <div class="tool-convert-action">
              <button id="tool-convert-btn" class="btn btn-primary btn-lg tool-convert-btn" disabled>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
                <span id="tool-convert-text">Convert & Download</span>
              </button>
              <div class="tool-action-guarantee">
                <span class="guarantee-dot"></span>
                <span>Zero server uploads • Processed securely inside browser RAM</span>
              </div>
            </div>

          </div>

          <!-- RIGHT WORKSTATION: Live Output & Result Preview -->
          <div class="tool-output-panel">
            <div class="tool-output-header-strip">
              <div class="tool-panel-step">
                <span class="step-badge">3</span>
                <span class="step-title">Live Output & Result Preview</span>
              </div>
              <span id="tool-output-status-pill" class="output-status-badge">Awaiting Source File</span>
            </div>

            <div class="tool-output-canvas">
              <!-- Empty State -->
              <div id="tool-output-empty" class="tool-output-empty">
                <div class="output-empty-frame">
                  <div class="output-empty-icon">
                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="12" y1="18" x2="12" y2="12"/>
                      <line x1="9" y1="15" x2="12" y2="12"/>
                      <line x1="15" y1="15" x2="12" y2="12"/>
                    </svg>
                  </div>
                  <h3 class="output-empty-title">Output Canvas Ready</h3>
                  <p class="output-empty-desc">Choose a file or enter input on the left and click <strong>Convert & Download</strong> to preview and inspect your converted output here.</p>
                  <div class="output-empty-pills">
                    <span class="empty-pill">⚡ Real-time Rendering</span>
                    <span class="empty-pill">🔒 Private Local Processing</span>
                    <span class="empty-pill">🎯 Exact Aspect & Quality</span>
                  </div>
                </div>
              </div>

              <!-- Processing State -->
              <div id="tool-output-processing" class="tool-output-processing" style="display: none;">
                <div class="processing-spinner"></div>
                <p class="processing-text">Processing in local RAM...</p>
                <div class="processing-bar-wrap">
                  <div id="tool-progress-bar" class="processing-bar-fill"></div>
                </div>
              </div>

              <!-- Result State -->
              <div id="tool-output-result" class="tool-output-result" style="display: none;">
                <div class="result-header">
                  <div class="result-status">
                    <span class="result-check">✓</span>
                    <span class="result-title">Conversion Successful</span>
                  </div>
                </div>

                <!-- Stats Row -->
                <div id="tool-result-stats" class="result-stats"></div>

                <!-- Preview Area -->
                <div id="tool-result-preview" class="result-preview">
                  <!-- Dynamic preview content (image, text, data table, etc.) -->
                </div>

                <!-- Download Actions Bar -->
                <div class="result-actions">
                  <button id="tool-download-btn" class="btn btn-primary btn-lg result-download-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span id="tool-download-text">Download File</span>
                  </button>
                  <button id="tool-copy-btn" class="btn btn-secondary btn-sm" style="display: none;">
                    <span>📋 Copy to Clipboard</span>
                  </button>
                  <button id="tool-convert-another" class="btn btn-secondary btn-sm">
                    <span>↻ Convert Another</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

        <!-- Full-Width Bottom Status Strip -->
        <div class="tool-footer-bar">
          <div class="tool-footer-left">
            <span class="footer-dot-pulse"></span>
            <span>Client-Side Sandboxed Engine • Zero Server Retention • All conversions happen strictly in browser memory</span>
          </div>
          <div class="tool-footer-right">
            <span class="footer-privacy-badge">🔒 Fully Private</span>
          </div>
        </div>

      </div>
    </section>
  `;
}
