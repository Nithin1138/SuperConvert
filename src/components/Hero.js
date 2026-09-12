/**
 * SuperConvert — Professional Studio Workspace with Sidebar Filters & Tools Canvas
 * Consolidated, non-duplicate conversion units with explicit input/output tags.
 */

import { CATEGORIES, TOOLS, getCategoryCounts } from '../core/converter-registry.js';

const CATEGORY_LABELS = {
  all: 'All Conversion Tools',
  documents: 'Documents & PDFs',
  images: 'Image Engine & Studio',
  data: 'Data & Spreadsheets',
  code: 'Code & Dev Utilities'
};

const CATEGORY_SUBTITLES = {
  all: `${TOOLS.length} organized client-side engines running locally in your browser memory.`,
  documents: 'High-resolution PDF generation, Word DOCX conversions, and text extraction.',
  images: 'Format conversion, smart compression, dimension scaling, and visual effects.',
  data: 'Instant CSV, Excel, JSON, XML, and YAML converters with zero data leaks.',
  code: 'Base64 encode/decode, URL safe encoding, and multi-language minification.'
};

export function renderHero() {
  const counts = getCategoryCounts();
  const freeCount = TOOLS.filter(t => t.isFree).length;
  const proCount = TOOLS.filter(t => !t.isFree).length;

  const categoryItems = CATEGORIES.map(cat => `
    <button class="sidebar-cat-btn ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}">
      <span class="cat-btn-icon">${cat.icon}</span>
      <span class="cat-btn-label">${cat.label}</span>
      <span class="cat-btn-count">${counts[cat.id] || 0}</span>
    </button>
  `).join('');

  const toolCards = TOOLS.map(tool => {
    const searchData = `${tool.name} ${tool.description} ${tool.inputFormats.join(' ')} ${tool.outputFormat} ${tool.category} ${tool.isFree ? 'free' : 'pro'} ${tool.engine}`.toLowerCase();
    
    return `
    <div class="tool-card cat-${tool.category} ${tool.isFree ? '' : 'tool-card-pro'}" 
         data-tool-id="${tool.id}" 
         data-category="${tool.category}"
         data-engine="${tool.engine}"
         data-free="${tool.isFree}"
         data-search="${searchData}"
         title="${tool.description}">
      <span class="tool-card-title">${tool.name}</span>
    </div>
  `;
  }).join('');

  return `
    <section class="hub-hero-section">
      <!-- Ambient Lighting -->
      <div class="hub-ambient-glows">
        <div class="hub-glow glow-top"></div>
        <div class="hub-glow glow-side"></div>
      </div>

      <div class="hub-container">
        <!-- Top App Header: Clean, Simple, Effective -->
        <header class="hub-top-header">
          <div class="hub-header-left">
            <div class="hub-title-row">
              <h1 class="hub-main-title">
                Universal File <span class="gradient-text-electric">Hub</span>
              </h1>
              <span class="hub-status-badge">
                <span class="pulse-indicator"></span>
                <span>100% Client-Side</span>
              </span>
            </div>
            <p class="hub-main-subtitle">
              ${TOOLS.length} instant browser conversion engines • Private, local & zero server uploads
            </p>
          </div>

          <div class="hub-header-right">
            <!-- Command-Style Search Box -->
            <div class="hub-search-box">
              <span class="hub-search-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input 
                type="text" 
                id="tool-search-input" 
                class="hub-search-input" 
                placeholder="Search ${TOOLS.length} tools (PDF, Word, Images, CSV)..." 
                autocomplete="off" 
                spellcheck="false"
              />
              <button id="tool-search-clear" class="hub-search-clear" title="Clear search" style="display: none;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <kbd class="hub-kbd-hint">/</kbd>
            </div>

            <!-- Sleek Minimal Meta Strip -->
            <div class="hub-header-meta">
              <span class="meta-dot"></span>
              <span id="tool-count-text" class="meta-count">${TOOLS.length} Engines Available</span>
              <span class="meta-divider">•</span>
              <span class="meta-note">Local Memory Only</span>
            </div>
          </div>
        </header>

        <!-- Main Studio Workspace (Left Sidebar + Right Tools Canvas) -->
        <div class="hub-workspace">
          
          <!-- LEFT SIDEBAR: Categories & Quick Filters -->
          <aside class="hub-sidebar">
            <!-- Categories Group -->
            <div class="sidebar-block">
              <div class="sidebar-block-title">
                <span>CATEGORIES</span>
              </div>
              <nav class="sidebar-cat-list" role="tablist">
                ${categoryItems}
              </nav>
            </div>

            <!-- Tier Filter Group -->
            <div class="sidebar-block">
              <div class="sidebar-block-title">
                <span>ACCESS TIER</span>
              </div>
              <div class="sidebar-tier-list">
                <button class="sidebar-tier-btn active" data-quick="all">
                  <span class="tier-label">⚡ 100% Free & Local</span>
                  <span class="tier-badge">${TOOLS.length}</span>
                </button>
              </div>
            </div>

            <!-- Popular Formats Filter -->
            <div class="sidebar-block">
              <div class="sidebar-block-title">
                <span>POPULAR FORMATS</span>
              </div>
              <div class="sidebar-format-cloud">
                <button class="sidebar-tag-chip active" data-quick="all">All</button>
                <button class="sidebar-tag-chip" data-quick="pdf">📄 PDF</button>
                <button class="sidebar-tag-chip" data-quick="docx">📘 Word</button>
                <button class="sidebar-tag-chip" data-quick="webp">🖼️ WEBP</button>
                <button class="sidebar-tag-chip" data-quick="compress">🗜️ Compress</button>
                <button class="sidebar-tag-chip" data-quick="resize">📐 Resize</button>
                <button class="sidebar-tag-chip" data-quick="csv">📊 CSV/XLS</button>
                <button class="sidebar-tag-chip" data-quick="json">📋 JSON</button>
                <button class="sidebar-tag-chip" data-quick="base64">⚡ Base64</button>
              </div>
            </div>

            <!-- Client-Side Guarantee Card -->
            <div class="sidebar-guarantee-box">
              <div class="guarantee-header">
                <span class="guarantee-icon">🔒</span>
                <span class="guarantee-title">Zero-Server Policy</span>
              </div>
              <p class="guarantee-text">
                Files remain inside your device's memory. No data is ever transmitted, logged, or stored remotely.
              </p>
            </div>
          </aside>

          <!-- RIGHT CANVAS: Active Category Header + Tool Grid -->
          <main class="hub-canvas">
            <!-- Canvas Header Bar -->
            <div class="canvas-header-bar">
              <div class="canvas-title-wrap">
                <h2 id="canvas-cat-title" class="canvas-title">All Conversion Tools</h2>
                <p id="canvas-cat-desc" class="canvas-desc">${TOOLS.length} client-side engines running locally in your browser memory.</p>
              </div>
              <div class="canvas-meta-wrap">
                <span class="canvas-scroll-hint">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M12 5v14M19 12l-7 7-7-7"/>
                  </svg>
                  Scroll Box
                </span>
                <span id="canvas-count-pill" class="canvas-count-pill">Showing ${TOOLS.length} tools</span>
              </div>
            </div>

            <!-- Tool Grid Scroll Box -->
            <div class="hub-grid-scroll-box" id="hub-grid-scroll-box">
              <!-- Tool Grid -->
              <div class="hub-tool-grid" id="tool-grid">
                ${toolCards}
              </div>

              <!-- Empty State -->
              <div id="tool-empty-state" class="tool-empty-state" style="display: none;">
                <div class="empty-icon-wrap">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
                <h3 class="empty-title">No matching tools found</h3>
                <p id="empty-desc" class="empty-desc">We couldn't find any tool matching your search.</p>
                <button id="empty-reset-btn" class="btn btn-secondary btn-sm">
                  <span>Reset Filters & Show All</span>
                </button>
              </div>
            </div>
          </main>

        </div>
      </div>
    </section>
  `;
}
