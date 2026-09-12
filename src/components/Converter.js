export function renderConverter() {
  return `
    <section id="converter" class="converter-section">
      <div class="converter-full-wrap">
        <div class="converter-shell">
          
          <!-- UNIFIED PRO APPLICATION TOPBAR (Edge-to-edge single clean strip) -->
          <div class="app-topbar">
            <!-- Left: Mode Switcher & Doc Title & Templates -->
            <div class="app-topbar-left">
              <a href="#/" id="studio-back-btn" class="studio-back-btn" title="Back to All Tools">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span>All Tools</span>
              </a>

              <div class="topbar-divider"></div>

              <div class="mode-switcher-tabs">
                <button class="mode-tab-btn active" data-tab="studio" title="Interactive Markdown Studio">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                  <span>Live Studio</span>
                </button>

                <button class="mode-tab-btn" data-tab="batch" title="Multi-file Batch Conversion">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                  <span>Batch Convert</span>
                  <span id="tab-batch-badge" class="tab-badge-num" style="display: none;">0</span>
                </button>
              </div>

              <div class="topbar-divider"></div>

              <!-- Interactive Document Title Input -->
              <div class="doc-file-chip" title="Click to rename document">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="doc-icon">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <input type="text" id="studio-doc-name" class="doc-title-input" value="architecture-spec.md" spellcheck="false" />
              </div>

              <div class="topbar-divider"></div>

              <!-- Quick Templates Group -->
              <div class="topbar-templates-group">
                <span class="topbar-label-subtle">Templates:</span>
                <button class="sample-chip sample-pill active" data-sample="techSpec">⚡ Tech Spec</button>
                <button class="sample-chip sample-pill" data-sample="designNote">🏗️ Design Note</button>
                <button class="sample-chip sample-pill" data-sample="atsResume">🎯 ATS Resume</button>
                <button class="sample-chip sample-pill" data-sample="legalContract">📜 Legal</button>
                <button class="sample-chip sample-pill" data-sample="academicPaper">🎓 Academic</button>
                <button class="sample-chip sample-pill" data-sample="batesLegalMerge">📑 Bates Legal</button>
                <button class="sample-chip sample-pill" data-sample="kdpEbook">📖 Book (KDP)</button>
              </div>
            </div>

            <!-- Center: Layout Switcher & Live Zoom -->
            <div class="app-topbar-center">
              <div class="view-switch-tabs">
                <button class="view-switch-btn view-mode-btn active" data-view="split" title="Split Screen (Editor & Preview)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
                  <span>Split</span>
                </button>
                <button class="view-switch-btn view-mode-btn" data-view="editor" title="Editor Focus">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                  <span>Editor</span>
                </button>
                <button class="view-switch-btn view-mode-btn" data-view="preview" title="Preview Focus">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                  <span>Preview</span>
                </button>
              </div>

              <div class="topbar-divider"></div>

              <div class="zoom-controls">
                <button id="btn-zoom-out" class="zoom-btn" title="Zoom Out">−</button>
                <span id="zoom-value" class="zoom-indicator">100%</span>
                <button id="btn-zoom-in" class="zoom-btn" title="Zoom In">+</button>
                <button id="btn-zoom-reset" class="zoom-btn fit-btn" title="Fit to Screen">Fit</button>
              </div>
            </div>

            <!-- Right: Document Settings & Primary Export Buttons -->
            <div class="app-topbar-right">
              <!-- Theme Selector -->
              <div class="topbar-select-wrap" title="Visual Style Theme">
                <span class="select-prefix">🎨</span>
                <select id="theme-select" class="topbar-select">
                  <option value="super-modern" selected>Super Modern</option>
                  <option value="github">GitHub Classic</option>
                  <option value="academic">Academic Paper</option>
                  <option value="executive">Executive Brief</option>
                  <option value="midnight">Midnight Dark</option>
                </select>
              </div>

              <!-- Compact Page Settings Pill (Format, Orientation, Margins) -->
              <div class="topbar-settings-pill">
                <select id="format-select" class="topbar-select-compact" title="Paper Size">
                  <option value="a4" selected>A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
                <div class="pill-divider"></div>
                <select id="orientation-select" class="topbar-select-compact" title="Orientation">
                  <option value="portrait" selected>Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
                <div class="pill-divider"></div>
                <select id="margin-select" class="topbar-select-compact" title="Margins">
                  <option value="15" selected>15mm</option>
                  <option value="8">8mm</option>
                  <option value="25">25mm</option>
                </select>
              </div>

              <!-- Watermark Controls Cluster -->
              <div class="watermark-cluster">
                <div class="watermark-input-wrap">
                  <input type="text" id="watermark-input" class="topbar-input watermark-input" placeholder="Watermark..." maxlength="25" title="Optional watermark text" />
                  <button type="button" id="btn-watermark-options" class="watermark-gear-btn" title="Watermark style options (Size, Angle: Straight/Cross, Repeat)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    <span id="watermark-active-dot" class="watermark-active-dot" style="display: none;"></span>
                  </button>
                </div>

                <!-- Watermark Settings Popover -->
                <div id="watermark-popover" class="watermark-popover" style="display: none;">
                  <div class="wm-popover-header">
                    <div class="wm-popover-title">
                      <span class="wm-popover-icon">💧</span>
                      <span>Watermark Options</span>
                    </div>
                    <button type="button" id="btn-close-watermark-popover" class="wm-popover-close">&times;</button>
                  </div>

                  <div class="wm-popover-body">
                    <!-- Text Quick Presets -->
                    <div class="wm-section">
                      <label class="wm-section-label">Quick Presets</label>
                      <div class="wm-chips-grid">
                        <button type="button" class="wm-chip-btn" data-preset="CONFIDENTIAL">Confidential</button>
                        <button type="button" class="wm-chip-btn" data-preset="DRAFT">Draft</button>
                        <button type="button" class="wm-chip-btn" data-preset="SAMPLE">Sample</button>
                        <button type="button" class="wm-chip-btn" data-preset="INTERNAL">Internal</button>
                        <button type="button" class="wm-chip-btn" data-preset="COPY">Copy</button>
                      </div>
                    </div>

                    <!-- Size Selection (Slider + Quick Pills) -->
                    <div class="wm-section">
                      <div class="wm-section-header">
                        <label class="wm-section-label">Watermark Size</label>
                        <span id="wm-size-badge" class="wm-val-badge">52px</span>
                      </div>
                      <input type="range" id="wm-size-slider" class="wm-range-slider" min="20" max="130" value="52" step="2" />
                      <div class="wm-btn-row" style="margin-top: 5px;">
                        <button type="button" class="wm-opt-btn wm-size-btn" data-size="32">Small (32)</button>
                        <button type="button" class="wm-opt-btn wm-size-btn active" data-size="52">Medium (52)</button>
                        <button type="button" class="wm-opt-btn wm-size-btn" data-size="76">Large (76)</button>
                        <button type="button" class="wm-opt-btn wm-size-btn" data-size="104">X-Large (104)</button>
                      </div>
                    </div>

                    <!-- Degree / Angle Selection (Straight vs Cross) -->
                    <div class="wm-section">
                      <div class="wm-section-header">
                        <label class="wm-section-label">Degree / Orientation</label>
                        <span id="wm-angle-badge" class="wm-val-badge">Cross (-45°)</span>
                      </div>
                      <div class="wm-btn-row">
                        <button type="button" class="wm-opt-btn wm-angle-btn active" data-angle="-45">
                          <span>↗ Cross (-45°)</span>
                        </button>
                        <button type="button" class="wm-opt-btn wm-angle-btn" data-angle="-30">
                          <span>↗ Subtle (-30°)</span>
                        </button>
                        <button type="button" class="wm-opt-btn wm-angle-btn" data-angle="0">
                          <span>→ Straight (0°)</span>
                        </button>
                      </div>
                    </div>

                    <!-- Repeat Pattern Selection -->
                    <div class="wm-section">
                      <div class="wm-section-header">
                        <label class="wm-section-label">Repeat Pattern</label>
                        <span id="wm-repeat-badge" class="wm-val-badge">Single Stamp</span>
                      </div>
                      <div class="wm-btn-row">
                        <button type="button" class="wm-opt-btn wm-repeat-btn active" data-repeat="false">
                          <span>Center (1 Stamp)</span>
                        </button>
                        <button type="button" class="wm-opt-btn wm-repeat-btn" data-repeat="true">
                          <span>⊞ Repeat Full Page</span>
                        </button>
                      </div>
                    </div>

                    <!-- Opacity -->
                    <div class="wm-section">
                      <div class="wm-section-header">
                        <label class="wm-section-label">Opacity Level</label>
                        <span id="wm-opacity-badge" class="wm-val-badge">8%</span>
                      </div>
                      <input type="range" id="wm-opacity-slider" class="wm-range-slider" min="4" max="25" value="8" step="1" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="topbar-divider"></div>

              <!-- Action Buttons -->
              <div class="topbar-actions">
                <button id="btn-vector-print" class="btn btn-secondary btn-sm" title="High-fidelity print to PDF">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 6 2 18 2 18 9"/>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                    <rect x="6" y="14" width="12" height="8"/>
                  </svg>
                  <span>Vector Print</span>
                </button>

                <button id="btn-export-pdf" class="btn btn-primary btn-sm btn-glow-hero" title="Instant Client-Side PDF Export">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                  <span id="btn-export-text">Export PDF</span>
                </button>
              </div>
            </div>
          </div>

          <!-- ============================================================
               VIEW 1: LIVE STUDIO WORKSPACE (Edge-to-Edge Full Height)
               ============================================================ -->
          <div id="view-studio" class="studio-workspace">
            <!-- Left Column: Markdown Editor -->
            <div class="studio-col-editor">
              <!-- Formatting Sub-Bar -->
              <div class="editor-subbar">
                <div class="editor-tools-group">
                  <div class="tool-btn-cluster">
                    <button class="tool-btn quickbar-btn" data-insert="# " title="Heading 1">H1</button>
                    <button class="tool-btn quickbar-btn" data-insert="## " title="Heading 2">H2</button>
                    <button class="tool-btn quickbar-btn" data-insert="### " title="Heading 3">H3</button>
                  </div>

                  <div class="tool-divider"></div>

                  <div class="tool-btn-cluster">
                    <button class="tool-btn quickbar-btn" data-insert="**" data-wrap="true" title="Bold (⌘B)"><strong>B</strong></button>
                    <button class="tool-btn quickbar-btn" data-insert="_" data-wrap="true" title="Italic (⌘I)"><em>I</em></button>
                    <button class="tool-btn quickbar-btn" data-insert="~~" data-wrap="true" title="Strikethrough"><s>S</s></button>
                    <button class="tool-btn quickbar-btn" data-insert="&#96;" data-wrap="true" title="Inline Code">&lt;/&gt;</button>
                  </div>

                  <div class="tool-divider"></div>

                  <div class="tool-btn-cluster">
                    <button class="tool-btn quickbar-btn" data-insert="&#96;&#96;&#96;typescript&#10;// code here&#10;&#96;&#96;&#96;&#10;" title="Code Block">Code</button>
                    <button class="tool-btn quickbar-btn" data-insert="| Column 1 | Column 2 |&#10;| :--- | :--- |&#10;| Value A | Value B |&#10;" title="Table">Table</button>
                    <button class="tool-btn quickbar-btn" data-insert="> " title="Blockquote">Quote</button>
                    <button class="tool-btn quickbar-btn" data-insert="- [ ] " title="Task Checklist">Task</button>
                    <button class="tool-btn quickbar-btn" data-insert="&#10;---&#10;" title="Divider Rule">HR</button>
                  </div>
                </div>

                <!-- Editor Metrics Pill on Right -->
                <div class="editor-metrics-pill">
                  <span id="counter-words" class="metric-highlight">0 words</span>
                  <span class="metric-sep">•</span>
                  <span id="counter-read-time">~1 min read</span>
                  <span class="metric-sep">•</span>
                  <span id="counter-chars">0 chars</span>
                </div>
              </div>

              <!-- Main Code Textarea -->
              <div class="studio-textarea-wrap">
                <textarea id="markdown-input" class="studio-textarea" spellcheck="false" placeholder="Type or paste Markdown here..."></textarea>
              </div>

              <!-- Editor Status Footer -->
              <div class="editor-status-bar">
                <div class="editor-status-left">
                  <span class="status-live-dot">●</span>
                  <span class="status-text">100% In-Browser Vector Engine • Zero Server Logs</span>
                </div>
                <div class="editor-quick-links">
                  <button id="btn-clear" class="quick-link-btn" title="Clear Text Content">Clear</button>
                  <button id="btn-copy-html" class="quick-link-btn" title="Copy Rendered HTML to Clipboard">Copy HTML</button>
                  <button id="btn-download-md" class="quick-link-btn" title="Download raw .md file">Download .md</button>
                </div>
              </div>
            </div>

            <!-- Right Column: Paginated Preview Canvas -->
            <div class="studio-col-preview">
              <div class="preview-subbar">
                <div class="preview-subbar-left">
                  <div class="preview-status-pill">
                    <span class="preview-status-dot">●</span>
                    <span class="preview-status-title">Live Vector PDF Canvas</span>
                  </div>
                  <span class="preview-tag-badge">High-Resolution</span>
                </div>

                <div class="preview-subbar-right">
                  <span id="counter-pages" class="page-count-badge">Est. 1 Page</span>
                  <span class="preview-meta-pill" id="preview-meta-badge">A4 • 15mm Margins</span>
                </div>
              </div>

              <div class="preview-canvas">
                <div id="paper-sheet-wrapper" class="paper-sheet-wrapper">
                  <div id="paper-mount" class="paper-sheet theme-super-modern">
                    <div id="paper-watermark" class="paper-watermark" style="display: none;"></div>
                    <div id="paper-content">
                      <!-- Parsed HTML will be injected here -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================================
               VIEW 2: BATCH CONVERT WORKSPACE (Edge-to-Edge)
               ============================================================ -->
          <div id="view-batch" class="batch-workspace" style="display: none;">
            <!-- Spacious Multi-file Dropzone -->
            <div id="batch-dropzone" class="batch-dropzone">
              <div class="dropzone-icon-wrap">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
              </div>
              <h3 class="dropzone-headline">Drag & Drop your Markdown files here</h3>
              <p class="dropzone-subhead">
                Accepts single or multiple files (<code style="color: var(--accent-lime);">.md</code>, <code style="color: var(--accent-lime);">.markdown</code>, <code style="color: var(--accent-lime);">.txt</code>). Zero data leaves your computer.
              </p>
              
              <div class="dropzone-actions">
                <button id="btn-batch-browse" class="btn btn-primary btn-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  <span>Select Files from Computer</span>
                </button>
                <button id="btn-load-sample-batch" class="btn btn-secondary btn-sm">
                  <span>⚡ Load Sample Batch (3 Documents)</span>
                </button>
              </div>
              <input type="file" id="batch-file-input" multiple accept=".md,.markdown,.txt" style="display: none;" />
            </div>

            <!-- Batch Document Queue List -->
            <div id="batch-queue-container" class="batch-queue-box" style="display: none;">
              <div class="queue-header">
                <div class="queue-title">
                  <span>Document Queue</span>
                  <span id="queue-count-badge" class="badge badge-brand">0 files</span>
                  <span id="queue-total-meta" class="queue-meta-text" style="color: var(--text-muted); font-size: 0.82rem;">0 KB</span>
                </div>
                <div class="queue-actions">
                  <button id="btn-add-more-files" class="btn btn-secondary btn-sm">+ Add More Files</button>
                  <button id="btn-clear-queue" class="btn btn-secondary btn-sm" style="color: #EF4444;">Clear All</button>
                </div>
              </div>

              <!-- List of Queue Cards -->
              <div id="batch-queue-list" class="queue-list">
                <!-- Dynamically populated -->
              </div>
            </div>

            <!-- Output Strategy Selector (Combine vs Separate) -->
            <div id="batch-strategy-container" style="display: none;">
              <div style="font-size: 0.84rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">
                Choose Output Strategy:
              </div>
              <div class="strategy-cards-grid">
                <!-- Strategy 1: Combine into Single PDF -->
                <div id="strat-combine" class="strategy-card selected" data-strat="combine">
                  <div class="strategy-card-title">
                    <span>📑 Combine into Single PDF</span>
                    <span class="strategy-badge">Recommended</span>
                  </div>
                  <p class="strategy-card-desc">
                    Merges all queued documents sequentially into one continuous, high-resolution master PDF.
                  </p>
                  <div class="strategy-suboptions">
                    <label class="toolbar-checkbox-label">
                      <input type="checkbox" id="opt-toc" checked />
                      <span>Auto Table of Contents on Page 1</span>
                    </label>
                    <label class="toolbar-checkbox-label">
                      <input type="checkbox" id="opt-pagebreak" checked />
                      <span>Page break between files</span>
                    </label>
                  </div>
                </div>

                <!-- Strategy 2: Separate PDFs (ZIP Archive) -->
                <div id="strat-separate" class="strategy-card" data-strat="separate">
                  <div class="strategy-card-title">
                    <span>📦 Separate PDFs (Download ZIP)</span>
                    <span class="strategy-badge">Batch Mode</span>
                  </div>
                  <p class="strategy-card-desc">
                    Compiles each markdown file independently and bundles them together into a high-speed ZIP archive.
                  </p>
                  <div class="strategy-suboptions">
                    <span style="font-size: 0.8rem; color: var(--accent-lime); font-weight: 600;">
                      ✓ Preserves original file names as individual PDFs
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Compilation Progress Indicator -->
            <div id="batch-progress-wrap" class="batch-progress-wrap">
              <div class="batch-progress-text">
                <span id="batch-progress-status">Compiling documents...</span>
                <span id="batch-progress-percent">0%</span>
              </div>
              <div class="batch-progress-track">
                <div id="batch-progress-fill" class="batch-progress-fill"></div>
              </div>
            </div>

            <!-- Batch Action Button -->
            <div id="batch-actions-bar" style="display: none; justify-content: flex-end;">
              <button id="btn-batch-execute" class="btn btn-primary btn-lg" style="box-shadow: var(--brand-glow);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span id="btn-batch-execute-text">Compile & Merge into Single PDF</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  `;
}
