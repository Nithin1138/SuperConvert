import { renderNavbar } from './components/Navbar.js';
import { renderHero } from './components/Hero.js';
import { renderMarqueeTicker } from './components/MarqueeTicker.js';
import { renderConverter } from './components/Converter.js';
import { renderToolConverter } from './components/ToolConverter.js';
import { renderSuperCardShowcase } from './components/SuperCardShowcase.js';
import { renderFeatures } from './components/Features.js';
import { renderSuperPortal } from './components/SuperPortal.js';
import { renderFaq } from './components/Faq.js';
import { renderFooter } from './components/Footer.js';
import { renderApiDocsModal } from './components/ApiDocsModal.js';
import { renderPricingModal } from './components/PricingModal.js';
import { renderFloatingPill } from './components/FloatingPill.js';
import { renderCommandPalette } from './components/CommandPalette.js';
import { renderFormatModal, FORMAT_CATALOG } from './components/FormatModal.js';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StoryApp } from './scrollytelling/StoryApp.jsx';
import { initSmoothScroll, scrollToTop } from './core/smooth-scroll.js';

import { parseMarkdown } from './core/parser.js';
import { SAMPLES } from './core/samples.js';
import { downloadPdf, compileCombinedPdf, compileBatchZip, printVector, fireCelebration } from './core/pdf-engine.js';
import { playClickSound, playSuccessChime } from './core/haptics.js';
import { initSuperAnimations, animateButtonPress } from './core/animations.js';
import { getToolById, getToolsByCategory, CATEGORIES, TOOLS, TEMPLATE_PRESETS } from './core/converter-registry.js';
import { processImageTool } from './core/image-engine.js';
import { processDocTool } from './core/doc-engine.js';
import { processDataTool } from './core/data-engine.js';
import { processAudioVideoTool } from './core/audio-video-engine.js';
import { convert3DModel } from './core/three-d-engine.js';

// Application State
const state = {
  activeTab: 'studio', // 'studio' or 'batch'
  markdown: SAMPLES.techSpec,
  theme: 'super-modern',
  format: 'a4',
  orientation: 'portrait',
  margin: 15,
  watermark: '',
  watermarkSize: 52, // px: 32 (Small), 52 (Medium), 76 (Large), 104 (X-Large)
  watermarkAngle: -45, // deg: -45 (Cross), -30 (Subtle), 0 (Straight)
  watermarkRepeat: false, // false = Single Center, true = Repeat Full Page
  watermarkOpacity: 8, // 4% - 25%
  showPageNumbers: true,
  currentDocTitle: 'architecture-spec.md',
  proPrice: '$2.99',
  
  // Batch Queue
  batchFiles: [],
  batchStrategy: 'combine', // 'combine' or 'separate'
  addToc: true,
  pageBreaks: true,

  // Studio Views & Zoom
  studioViewMode: 'split', // 'split', 'editor', 'preview'
  previewZoom: 1.0,

  // Universal Tool State
  activeTool: null,        // Tool ID or null
  activeCategory: 'all',
  searchQuery: '',         // Live tool search query
  quickFilter: 'all',       // Quick filter chip
  toolFiles: [],           // Files uploaded for tool conversion
  toolSettings: {},        // Current tool settings
  toolResult: null,        // Result blob + metadata
  toolTextInput: ''        // Text input for code/data tools
};

/**
 * Initialize DOM
 */
function initApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Top Scrollytelling Progress Bar for Home -->
    <div id="home-scroll-progress"></div>
    <!-- Cinematic Horizon Page Transition Beam -->
    <div id="page-transition-beam"></div>

    ${renderNavbar()}
    <main>
      <!-- PAGE 1: Universal Hub Page (Home) -->
      <div id="page-hub" class="app-page">
        ${renderHero()}
        ${renderMarqueeTicker()}
        ${renderSuperCardShowcase()}
        ${renderFeatures()}
        ${renderSuperPortal()}
        ${renderFaq()}
        ${renderFooter()}
      </div>

      <!-- PAGE 2: Dedicated Tool Workspace Page -->
      <div id="page-tool" class="app-page" style="display: none;">
        ${renderToolConverter()}
        ${renderConverter()}
      </div>

      <!-- PAGE 3: Immersive Scrollytelling Landing Page -->
      <div id="page-story" class="app-page" style="display: none;"></div>
    </main>
    ${renderFloatingPill()}
    ${renderCommandPalette()}
    ${renderApiDocsModal()}
    ${renderPricingModal()}
    ${renderFormatModal()}
  `;

  initSmoothScroll();
  setupToolGrid();
  setupToolConverter();
  setupFormatModal();
  setupTabSwitcher();
  setupBatchConverter();
  setupStudioEditor();
  setupConversionHub();
  setupCommandPalette();
  updateLivePreview();
  initSuperAnimations();
  setupRouter();
}

// ═══════════════════════════════════════════════════════
// TOOL GRID — Category Filtering, Search & Tool Selection
// ═══════════════════════════════════════════════════════

const CATEGORY_NAMES = {
  all: 'All Conversion Tools',
  documents: 'Documents & PDFs',
  images: 'Image Engine & Studio',
  video: 'Video Processing & Extraction',
  audio: 'Audio Studio & Encoders',
  '3d': '3D Models & Mesh Processing',
  data: 'Data & Spreadsheets',
  code: 'Code & Dev Utilities'
};

const CATEGORY_DESCS = {
  all: `${TOOLS.length} organized client-side conversion engines running locally in your browser memory.`,
  documents: 'High-resolution PDF generation, Word DOCX, PowerPoint PPTX, Excel XLSX, and text parsing.',
  images: 'Canvas-powered image compression, resizing, format converting (JPG, PNG, WebP, GIF, TIFF, AVIF, ICO, BMP, SVG), and effects.',
  video: 'Extract audio (MP3, WAV), create animated GIFs, and transcode MP4, MOV, WebM, AVI, and MKV video containers.',
  audio: 'Client-side audio transcoding and decoding across MP3, WAV, OGG, AAC, M4A, and FLAC.',
  '3d': '3D mesh converter supporting OBJ, STL, GLTF 2.0, and FBX models with zero uploads.',
  data: 'Instant CSV, Excel, JSON, XML, and YAML converters with zero data leaks.',
  code: 'Base64, URL encoding, CSS/JS minification, and code formatting tools.'
};

function setupToolGrid() {
  const searchInput = document.getElementById('tool-search-input');
  const searchClear = document.getElementById('tool-search-clear');
  const catBtns = document.querySelectorAll('.sidebar-cat-btn, .tool-cat-tab');
  const tierBtns = document.querySelectorAll('.sidebar-tier-btn');
  const formatChips = document.querySelectorAll('.sidebar-tag-chip, .quick-chip');
  const emptyResetBtn = document.getElementById('empty-reset-btn');
  const toolCards = document.querySelectorAll('.tool-card');

  // 1. Live Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      if (searchClear) {
        searchClear.style.display = state.searchQuery ? 'flex' : 'none';
      }
      applyToolFilters();
    });

    // Global keyboard shortcut '/' to focus search
    window.addEventListener('keydown', (e) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
      if (e.key === '/' && !isInput) {
        e.preventDefault();
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        state.searchQuery = '';
        if (searchClear) searchClear.style.display = 'none';
        applyToolFilters();
        searchInput.blur();
      }
    });
  }

  // 2. Search Clear Button
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      playClickSound();
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      state.searchQuery = '';
      searchClear.style.display = 'none';
      applyToolFilters();
    });
  }

  // 3. Category Navigation (Sidebar & Tabs)
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const category = btn.dataset.category;
      state.activeCategory = category;
      catBtns.forEach(b => b.classList.toggle('active', b.dataset.category === category));
      applyToolFilters();
    });
  });

  // 4. Access Tier Filter
  tierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const tier = btn.dataset.quick;
      state.quickFilter = tier;
      tierBtns.forEach(b => b.classList.toggle('active', b.dataset.quick === tier));
      formatChips.forEach(c => c.classList.toggle('active', c.dataset.quick === tier));
      applyToolFilters();
    });
  });

  // 5. Popular Formats & Quick Chips
  formatChips.forEach(chip => {
    chip.addEventListener('click', () => {
      playClickSound();
      const filter = chip.dataset.quick;
      state.quickFilter = filter;
      formatChips.forEach(c => c.classList.toggle('active', c.dataset.quick === filter));
      tierBtns.forEach(b => b.classList.toggle('active', b.dataset.quick === filter));
      applyToolFilters();
    });
  });

  // 6. Empty State Reset Button
  if (emptyResetBtn) {
    emptyResetBtn.addEventListener('click', () => {
      playClickSound();
      if (searchInput) {
        searchInput.value = '';
      }
      state.searchQuery = '';
      state.activeCategory = 'all';
      state.quickFilter = 'all';

      if (searchClear) searchClear.style.display = 'none';
      catBtns.forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
      tierBtns.forEach(b => b.classList.toggle('active', b.dataset.quick === 'all'));
      formatChips.forEach(c => c.classList.toggle('active', c.dataset.quick === 'all'));

      applyToolFilters();
    });
  }

  // 7. Tool Card Clicks — Open Dedicated Tool Page
  toolCards.forEach(card => {
    card.addEventListener('click', () => {
      playClickSound();
      animateButtonPress(card);
      const toolId = card.dataset.toolId;
      if (toolId) {
        window.location.hash = `#/tool/${toolId}`;
      }
    });
  });
}

/**
 * Filter tool grid with multi-criteria: category, text search, and quick chips
 */
function applyToolFilters() {
  const allCards = document.querySelectorAll('.tool-card');
  const emptyState = document.getElementById('tool-empty-state');
  const countText = document.getElementById('tool-count-text');
  const canvasTitle = document.getElementById('canvas-cat-title');
  const canvasDesc = document.getElementById('canvas-cat-desc');
  const canvasCount = document.getElementById('canvas-count-pill');
  
  const query = (state.searchQuery || '').trim().toLowerCase();
  const category = state.activeCategory || 'all';
  const quick = state.quickFilter || 'all';

  let visibleCount = 0;

  allCards.forEach(card => {
    const cardCategory = card.dataset.category;
    const cardSearch = card.dataset.search || '';
    const isFree = card.dataset.free === 'true';
    
    // Category match
    const matchesCategory = (category === 'all' || cardCategory === category);

    // Quick filter match
    let matchesQuick = true;
    if (quick === 'pdf') {
      matchesQuick = cardSearch.includes('pdf');
    } else if (quick === 'docx') {
      matchesQuick = cardSearch.includes('docx') || cardSearch.includes('word');
    } else if (quick === 'webp') {
      matchesQuick = cardSearch.includes('webp');
    } else if (quick === 'compress') {
      matchesQuick = cardSearch.includes('compress');
    } else if (quick === 'resize') {
      matchesQuick = cardSearch.includes('resize') || cardSearch.includes('crop');
    } else if (quick === 'csv') {
      matchesQuick = cardSearch.includes('csv') || cardSearch.includes('excel') || cardSearch.includes('xlsx');
    } else if (quick === 'json') {
      matchesQuick = cardSearch.includes('json');
    } else if (quick === 'base64') {
      matchesQuick = cardSearch.includes('base64');
    } else if (quick === 'free') {
      matchesQuick = isFree;
    } else if (quick === 'pro') {
      matchesQuick = !isFree;
    }

    // Text search query match
    const matchesSearch = !query || cardSearch.includes(query);

    if (matchesCategory && matchesQuick && matchesSearch) {
      card.classList.remove('hidden');
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });

  // Update canvas header titles
  if (canvasTitle) {
    if (query) {
      canvasTitle.textContent = `Search Results for "${query}"`;
    } else {
      canvasTitle.textContent = CATEGORY_NAMES[category] || 'Conversion Tools';
    }
  }

  if (canvasDesc) {
    if (query) {
      canvasDesc.textContent = `Showing ${visibleCount} tool${visibleCount === 1 ? '' : 's'} matching your query.`;
    } else {
      canvasDesc.textContent = CATEGORY_DESCS[category] || `${TOOLS.length} client-side engines running locally in your browser memory.`;
    }
  }

  if (canvasCount) {
    canvasCount.textContent = `Showing ${visibleCount} tool${visibleCount === 1 ? '' : 's'}`;
  }

  // Update header counter text
  if (countText) {
    if (query) {
      countText.textContent = `${visibleCount} Tools Found`;
    } else if (quick !== 'all') {
      countText.textContent = `${visibleCount} Tools Filtered`;
    } else if (category !== 'all') {
      const catObj = CATEGORIES.find(c => c.id === category);
      const label = catObj ? catObj.label : category;
      countText.textContent = `${visibleCount} ${label}`;
    } else {
      countText.textContent = `${TOOLS.length} Engines Available`;
    }
  }

  // Handle empty state
  if (emptyState) {
    const emptyDesc = document.getElementById('empty-desc');
    if (visibleCount === 0) {
      emptyState.style.display = 'flex';
      if (emptyDesc) {
        emptyDesc.textContent = query 
          ? `We couldn't find any tool matching "${query}". Try searching for PDF, Image, or JSON.`
          : `No tools match the selected filters.`;
      }
    } else {
      emptyState.style.display = 'none';
    }
  }

  // Reset scroll box to top so filtered tools are immediately visible
  const scrollBox = document.getElementById('hub-grid-scroll-box');
  if (scrollBox) {
    scrollBox.scrollTop = 0;
  }
}

function filterToolGrid(category) {
  state.activeCategory = category;
  applyToolFilters();
}

// ═══════════════════════════════════════════════════════
// PAGE ROUTER — Dedicated Tool Page Navigation
// ═══════════════════════════════════════════════════════

function setupRouter() {
  window.addEventListener('hashchange', handleRoute);

  // Studio Back to Tools button
  const studioBackBtn = document.getElementById('studio-back-btn');
  if (studioBackBtn) {
    studioBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      playClickSound();
      window.location.hash = '#/';
    });
  }

  // Run initial route check
  handleRoute();
}

let currentActivePageId = null;
let storyRoot = null;

/**
 * Executes a cinematic, hardware-accelerated page transition
 */
function transitionToPage(targetPageId, switchCallback) {
  const pages = {
    'page-hub': document.getElementById('page-hub'),
    'page-tool': document.getElementById('page-tool'),
    'page-story': document.getElementById('page-story')
  };

  const targetPage = pages[targetPageId];
  if (!targetPage) return;

  const beam = document.getElementById('page-transition-beam');

  // Initial load: Reveal target immediately without any opacity: 0 delay
  if (!currentActivePageId) {
    Object.keys(pages).forEach(id => {
      if (pages[id]) {
        pages[id].style.display = (id === targetPageId ? 'block' : 'none');
        pages[id].style.opacity = '1';
        pages[id].style.transform = 'none';
      }
    });
    currentActivePageId = targetPageId;
    if (switchCallback) switchCallback();
    scrollToTop(true);
    return;
  }

  // Already on this page
  if (currentActivePageId === targetPageId) {
    if (switchCallback) switchCallback();
    scrollToTop(true);
    return;
  }

  // Active page to new page transition
  const currentPage = pages[currentActivePageId];
  currentActivePageId = targetPageId;

  if (currentPage && currentPage !== targetPage) {
    gsap.killTweensOf([currentPage, targetPage, beam]);

    if (beam) {
      gsap.fromTo(beam, 
        { width: '0%', opacity: 1 }, 
        { width: '75%', duration: 0.18, ease: 'power2.out' }
      );
    }

    gsap.to(currentPage, {
      opacity: 0,
      y: -10,
      duration: 0.16,
      ease: 'power2.in',
      onComplete: () => {
        currentPage.style.display = 'none';
        gsap.set(currentPage, { opacity: 1, y: 0, scale: 1 });

        targetPage.style.display = 'block';
        if (switchCallback) switchCallback();
        scrollToTop(true);

        if (beam) {
          gsap.to(beam, {
            width: '100%',
            opacity: 0,
            duration: 0.22,
            ease: 'power2.inOut',
            onComplete: () => {
              beam.style.width = '0%';
              beam.style.opacity = '0';
            }
          });
        }

        gsap.fromTo(targetPage,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out', clearProps: 'all' }
        );
      }
    });
  } else {
    targetPage.style.display = 'block';
    targetPage.style.opacity = '1';
    if (switchCallback) switchCallback();
    scrollToTop(true);
  }
}

function handleRoute() {
  const hash = window.location.hash || '#/';
  const floatingPill = document.getElementById('super-floating-pill');
  const navbar = document.querySelector('.navbar-header');

  // Case 1: Story Mode (#/story)
  if (hash.startsWith('#/story')) {
    if (navbar) {
      gsap.to(navbar, { opacity: 0, y: -10, duration: 0.2, onComplete: () => { navbar.style.display = 'none'; } });
    }
    if (floatingPill) floatingPill.style.display = 'none';

    transitionToPage('page-story', () => {
      const storyPage = document.getElementById('page-story');
      if (!storyRoot && storyPage) {
        storyRoot = createRoot(storyPage);
      }
      if (storyRoot) {
        storyRoot.render(createElement(StoryApp));
      }
    });
    return;
  }

  // Restore Navbar when returning from Story
  if (navbar && navbar.style.display === 'none') {
    navbar.style.display = 'block';
    gsap.fromTo(navbar, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3, clearProps: 'all' });
  }

  // Case 2: Dedicated Tool Workspace (#/tool/:id)
  if (hash.startsWith('#/tool/')) {
    const toolId = hash.replace('#/tool/', '').trim();
    const tool = getToolById(toolId);

    if (tool) {
      transitionToPage('page-tool', () => {
        const toolSection = document.getElementById('tool-converter');
        const studioSection = document.getElementById('converter');

        // Floating quick export pill strictly only on Live Studio
        if (floatingPill) {
          floatingPill.style.display = tool.isStudio ? 'inline-flex' : 'none';
        }

        if (tool.isStudio) {
          if (toolSection) toolSection.style.display = 'none';
          if (studioSection) studioSection.style.display = 'block';

          // Check if raw toolId corresponds to a template preset (e.g., ats-resume, legal-contract)
          const preset = TEMPLATE_PRESETS[toolId];
          if (preset) {
            tool.sampleKey = preset.sampleKey;
            tool.theme = preset.theme;
          }

          activateStudioTool(tool);
        } else {
          if (studioSection) studioSection.style.display = 'none';
          if (toolSection) toolSection.style.display = 'block';
          activateUniversalTool(tool);
        }
      });
      return;
    }
  }

  // Case 3: Universal Hub Home Page (#/ or #/app or default)
  if (floatingPill) floatingPill.style.display = 'none';

  transitionToPage('page-hub', () => {
    const toolSection = document.getElementById('tool-converter');
    const studioSection = document.getElementById('converter');
    if (toolSection) toolSection.style.display = 'none';
    if (studioSection) studioSection.style.display = 'none';
  });
}

/**
 * Activate a studio-based tool (Markdown → PDF, Pro templates)
 */
function activateStudioTool(tool) {
  state.activeTool = tool.id;

  // Load sample content if available
  const sampleKey = tool.sampleKey || tool.id.replace(/-/g, '');
  if (SAMPLES[sampleKey]) {
    state.markdown = SAMPLES[sampleKey];
    state.currentDocTitle = `${sampleKey}.md`;
    state.theme = tool.theme || 'super-modern';
    state.proPrice = tool.price || '$2.99';

    const textarea = document.getElementById('markdown-input');
    const docNameInput = document.getElementById('studio-doc-name');
    const themeSelect = document.getElementById('theme-select');

    if (textarea) textarea.value = state.markdown;
    if (docNameInput) docNameInput.value = state.currentDocTitle;
    if (themeSelect) themeSelect.value = state.theme;
  }

  // Switch to studio tab
  const studioTab = document.querySelector('.mode-tab-btn[data-tab="studio"], .converter-tab[data-tab="studio"]');
  if (studioTab) studioTab.click();

  updateLivePreview();
}

/**
 * Activate a universal (non-studio) tool
 */
function activateUniversalTool(tool) {
  state.activeTool = tool.id;
  state.toolFiles = [];
  state.toolSettings = {};
  state.toolResult = null;
  state.toolTextInput = '';

  // Initialize default settings
  if (tool.settings) {
    tool.settings.forEach(s => {
      state.toolSettings[s.id] = s.default;
    });
  }

  // Update header & breadcrumbs
  const iconEl = document.getElementById('tool-active-icon');
  const nameEl = document.getElementById('tool-active-name');
  const descEl = document.getElementById('tool-active-desc');
  const catEl = document.getElementById('tool-active-category');
  const crumbTitle = document.getElementById('tool-breadcrumb-title');
  const statusPill = document.getElementById('tool-output-status-pill');

  if (iconEl) iconEl.textContent = tool.icon;
  if (nameEl) nameEl.textContent = tool.name;
  if (descEl) descEl.textContent = tool.description;
  if (catEl) catEl.textContent = (tool.category || 'tools').toUpperCase();
  if (crumbTitle) crumbTitle.textContent = tool.name;
  if (statusPill) statusPill.textContent = tool.hasTextInput ? 'Ready for Input' : 'Awaiting Source File';
  
  const badge = document.getElementById('tool-active-badge');
  if (badge) {
    badge.className = `tool-header-badge ${tool.isFree ? 'badge-free' : 'badge-pro'}`;
    badge.textContent = tool.isFree ? '⚡ FREE' : `💎 ${tool.price}`;
  }

  const formatPill = document.getElementById('tool-format-pill');
  if (formatPill) {
    const pillLabel = document.getElementById('tool-format-pill-label');
    if (pillLabel) {
      pillLabel.textContent = `${tool.inputFormats[0]} → ${tool.outputFormat}`;
    } else {
      formatPill.innerHTML = `
        <span id="tool-format-pill-label">${tool.inputFormats[0]} → ${tool.outputFormat}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      `;
    }
  }

  // Configure upload zone
  const fileInput = document.getElementById('tool-file-input');
  if (fileInput) {
    fileInput.accept = tool.inputAccept || '*';
    fileInput.multiple = true;
  }

  const uploadFormats = document.getElementById('upload-zone-formats');
  if (uploadFormats) {
    uploadFormats.textContent = `Accepts ${tool.inputFormats.join(', ')} files`;
  }

  // Show/hide text input zone
  const uploadZone = document.getElementById('tool-upload-zone');
  const textZone = document.getElementById('tool-text-zone');
  if (tool.hasTextInput) {
    if (uploadZone) uploadZone.style.display = 'block';
    if (textZone) textZone.style.display = 'flex';
  } else {
    if (uploadZone) uploadZone.style.display = 'block';
    if (textZone) textZone.style.display = 'none';
  }

  // Render settings
  renderToolSettings(tool);

  // Reset states
  document.getElementById('tool-files-list').style.display = 'none';
  document.getElementById('tool-output-empty').style.display = 'flex';
  document.getElementById('tool-output-processing').style.display = 'none';
  document.getElementById('tool-output-result').style.display = 'none';
  document.getElementById('tool-convert-btn').disabled = !tool.hasTextInput;

  // Clear text input
  const textInput = document.getElementById('tool-text-input');
  if (textInput) textInput.value = '';

  // Scroll to tool converter
  if (toolSection) toolSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Render settings panel for a tool
 */
function renderToolSettings(tool) {
  const panel = document.getElementById('tool-settings-panel');
  const block = document.getElementById('tool-settings-block');
  const stepHeading = document.getElementById('tool-settings-step-heading');
  const body = document.getElementById('tool-settings-body');

  if (!tool.settings || tool.settings.length === 0) {
    if (panel) panel.style.display = 'none';
    if (block) block.style.display = 'none';
    if (stepHeading) stepHeading.style.display = 'none';
    return;
  }

  if (panel) panel.style.display = 'block';
  if (block) block.style.display = 'block';
  if (stepHeading) stepHeading.style.display = 'flex';

  const settingsHtml = tool.settings.map(setting => {
    let controlHtml = '';

    switch (setting.type) {
      case 'range':
        controlHtml = `
          <div class="setting-control">
            <input type="range" class="setting-range" data-setting-id="${setting.id}" 
                   min="${setting.min}" max="${setting.max}" value="${setting.default}" />
            <span class="setting-value" id="setting-val-${setting.id}">${setting.default}${setting.unit || ''}</span>
          </div>
        `;
        break;
      case 'select':
        controlHtml = `
          <select class="setting-select" id="setting-${setting.id}" data-setting-id="${setting.id}">
            ${setting.options.map(opt => `<option value="${opt}" ${opt === setting.default ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        `;
        break;
      case 'text':
        controlHtml = `<input type="text" class="setting-text" id="setting-${setting.id}" data-setting-id="${setting.id}" value="${setting.default || ''}" />`;
        break;
      case 'number':
        controlHtml = `<input type="number" class="setting-number" id="setting-${setting.id}" data-setting-id="${setting.id}" value="${setting.default || ''}" />`;
        break;
      case 'checkbox':
        controlHtml = `
          <div class="setting-checkbox-wrap">
            <input type="checkbox" id="setting-${setting.id}" data-setting-id="${setting.id}" ${setting.default ? 'checked' : ''} />
          </div>
        `;
        break;
      case 'color':
        controlHtml = `<input type="color" class="setting-color" id="setting-${setting.id}" data-setting-id="${setting.id}" value="${setting.default || '#ffffff'}" />`;
        break;
    }

    return `
      <div class="setting-row">
        <span class="setting-label">${setting.label}</span>
        ${controlHtml}
      </div>
    `;
  }).join('');

  if (body) body.innerHTML = settingsHtml;

  // Attach event listeners for settings changes
  body?.querySelectorAll('[data-setting-id]').forEach(el => {
    const settingId = el.dataset.settingId;
    const eventType = el.type === 'range' ? 'input' : 'change';

    el.addEventListener(eventType, (e) => {
      const val = el.type === 'checkbox' ? el.checked : el.value;
      state.toolSettings[settingId] = el.type === 'number' ? Number(val) : val;

      // Update value display for ranges
      if (el.type === 'range') {
        const setting = tool.settings.find(s => s.id === settingId);
        const valSpan = document.getElementById(`setting-val-${settingId}`);
        if (valSpan) valSpan.textContent = `${val}${setting?.unit || ''}`;
      }
    });
  });
}

// ═══════════════════════════════════════════════════════
// TOOL CONVERTER — Upload, Process, Download
// ═══════════════════════════════════════════════════════

function setupToolConverter() {
  const uploadZone = document.getElementById('tool-upload-zone');
  const fileInput = document.getElementById('tool-file-input');
  const browseBtn = document.getElementById('tool-browse-btn');
  const backBtn = document.getElementById('tool-back-btn');
  const convertBtn = document.getElementById('tool-convert-btn');
  const downloadBtn = document.getElementById('tool-download-btn');
  const copyBtn = document.getElementById('tool-copy-btn');
  const convertAnotherBtn = document.getElementById('tool-convert-another');
  const filesClear = document.getElementById('tool-files-clear');
  const textInput = document.getElementById('tool-text-input');
  const textClear = document.getElementById('tool-text-clear');

  // Browse files
  if (browseBtn) {
    browseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playClickSound();
      fileInput.click();
    });
  }

  // Upload zone click
  if (uploadZone) {
    uploadZone.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover'].forEach(name => {
      uploadZone.addEventListener(name, (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      uploadZone.addEventListener(name, (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
      });
    });

    uploadZone.addEventListener('drop', (e) => {
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) handleToolFilesAdd(files);
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) handleToolFilesAdd(files);
      fileInput.value = '';
    });
  }

  // Text input
  if (textInput) {
    textInput.addEventListener('input', () => {
      state.toolTextInput = textInput.value;
      updateToolConvertButton();
    });
  }

  if (textClear) {
    textClear.addEventListener('click', () => {
      playClickSound();
      if (textInput) textInput.value = '';
      state.toolTextInput = '';
      updateToolConvertButton();
    });
  }

  // Clear files
  if (filesClear) {
    filesClear.addEventListener('click', () => {
      playClickSound();
      state.toolFiles = [];
      renderToolFilesList();
      updateToolConvertButton();
    });
  }

  // Back button
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      playClickSound();
      state.activeTool = null;
      window.location.hash = '#/';
    });
  }

  // Convert button
  if (convertBtn) {
    convertBtn.addEventListener('click', () => {
      playClickSound();
      animateButtonPress(convertBtn);
      executeToolConversion();
    });
  }

  // Download button
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      playClickSound();
      if (state.toolResult?.blob) {
        downloadBlob(state.toolResult.blob, state.toolResult.filename);
        playSuccessChime();
        fireCelebration();
      }
    });
  }

  // Copy button
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      playClickSound();
      if (state.toolResult?.preview) {
        await navigator.clipboard.writeText(state.toolResult.preview);
        copyBtn.innerHTML = '<span>✓ Copied!</span>';
        setTimeout(() => { copyBtn.innerHTML = '<span>📋 Copy to Clipboard</span>'; }, 2000);
      }
    });
  }

  // Convert another
  if (convertAnotherBtn) {
    convertAnotherBtn.addEventListener('click', () => {
      playClickSound();
      const tool = getToolById(state.activeTool);
      if (tool) activateUniversalTool(tool);
    });
  }

  // Format modal trigger from top format pill
  const formatPillBtn = document.getElementById('tool-format-pill');
  if (formatPillBtn) {
    formatPillBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      playClickSound();
      openFormatModal();
    });
  }
}

function handleToolFilesAdd(fileList) {
  state.toolFiles = [...state.toolFiles, ...fileList];
  renderToolFilesList();
  updateToolConvertButton();
  playSuccessChime();
}

function renderToolFilesList() {
  const container = document.getElementById('tool-files-list');
  const itemsEl = document.getElementById('tool-files-items');
  const countEl = document.getElementById('tool-files-count');

  if (state.toolFiles.length === 0) {
    if (container) container.style.display = 'none';
    return;
  }

  if (container) container.style.display = 'block';
  if (countEl) countEl.textContent = `${state.toolFiles.length} file${state.toolFiles.length > 1 ? 's' : ''} selected`;

  if (itemsEl) {
    itemsEl.innerHTML = state.toolFiles.map((file, idx) => `
      <div class="file-item">
        <div class="file-item-left">
          <span class="file-item-icon">📄</span>
          <span class="file-item-name">${file.name}</span>
        </div>
        <span class="file-item-size">${formatFileSize(file.size)}</span>
        <button class="file-item-remove" data-idx="${idx}" title="Remove">✕</button>
      </div>
    `).join('');

    itemsEl.querySelectorAll('.file-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        playClickSound();
        const idx = Number(btn.dataset.idx);
        state.toolFiles.splice(idx, 1);
        renderToolFilesList();
        updateToolConvertButton();
      });
    });
  }
}

function updateToolConvertButton() {
  const btn = document.getElementById('tool-convert-btn');
  if (!btn) return;

  const tool = getToolById(state.activeTool);
  const hasFiles = state.toolFiles.length > 0;
  const hasText = state.toolTextInput.trim().length > 0;
  
  btn.disabled = !hasFiles && !hasText;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Execute the active tool's conversion
 */
async function executeToolConversion() {
  const tool = getToolById(state.activeTool);
  if (!tool) return;

  // Show processing state
  document.getElementById('tool-output-empty').style.display = 'none';
  document.getElementById('tool-output-result').style.display = 'none';
  document.getElementById('tool-output-processing').style.display = 'flex';
  
  const progressBar = document.getElementById('tool-progress-bar');
  if (progressBar) progressBar.style.width = '30%';

  const convertBtn = document.getElementById('tool-convert-btn');
  const convertText = document.getElementById('tool-convert-text');
  if (convertBtn) convertBtn.disabled = true;
  if (convertText) convertText.textContent = 'Converting...';

  try {
    let result;

    // Determine input: file or text
    const input = state.toolFiles.length > 0 ? state.toolFiles[0] : state.toolTextInput;

    if (progressBar) progressBar.style.width = '60%';

    switch (tool.engine) {
      case 'image':
        result = await processImageTool(tool.id, input, state.toolSettings);
        break;
      case 'doc':
        result = await processDocTool(tool.id, input, state.toolSettings);
        break;
      case 'media':
        result = await processAudioVideoTool(tool.id, input, state.toolSettings);
        break;
      case '3d':
        result = await convert3DModel(input, state.toolSettings?.targetFormat || tool.outputFormat);
        break;
      case 'data':
        result = await processDataTool(tool.id, input, state.toolSettings);
        break;
      default:
        throw new Error(`Unknown engine: ${tool.engine}`);
    }

    if (progressBar) progressBar.style.width = '100%';

    // Store result
    state.toolResult = result;

    // Show result
    setTimeout(() => showToolResult(tool, result), 300);

    playSuccessChime();
  } catch (err) {
    console.error('Conversion error:', err);
    document.getElementById('tool-output-processing').style.display = 'none';
    document.getElementById('tool-output-empty').style.display = 'flex';
    
    const emptyTitle = document.querySelector('.output-empty-title');
    const emptyDesc = document.querySelector('.output-empty-desc');
    if (emptyTitle) emptyTitle.textContent = '⚠️ Conversion Error';
    if (emptyDesc) emptyDesc.textContent = err.message || 'Something went wrong. Please check your file and try again.';
  } finally {
    if (convertBtn) convertBtn.disabled = false;
    if (convertText) convertText.textContent = 'Convert & Download';
  }
}

/**
 * Display conversion result
 */
function showToolResult(tool, result) {
  document.getElementById('tool-output-processing').style.display = 'none';
  document.getElementById('tool-output-result').style.display = 'flex';

  // Stats
  const statsEl = document.getElementById('tool-result-stats');
  let statsHtml = '';

  if (result.originalSize && result.compressedSize) {
    statsHtml += `
      <span class="stat-pill"><span class="stat-value">${formatFileSize(result.originalSize)}</span> Original</span>
      <span class="stat-pill"><span class="stat-value">${formatFileSize(result.compressedSize)}</span> Output</span>
      <span class="stat-pill savings-pill">🎯 <span class="stat-value">${result.savings}%</span> saved</span>
    `;
  } else if (result.blob) {
    statsHtml += `<span class="stat-pill"><span class="stat-value">${formatFileSize(result.blob.size)}</span> Output</span>`;
  }

  if (result.originalDimensions) {
    statsHtml += `<span class="stat-pill">${result.originalDimensions.width}×${result.originalDimensions.height} → ${result.newDimensions.width}×${result.newDimensions.height}</span>`;
  }

  if (result.rowCount !== undefined) {
    statsHtml += `<span class="stat-pill"><span class="stat-value">${result.rowCount}</span> rows</span>`;
  }

  if (result.pageCount !== undefined) {
    statsHtml += `<span class="stat-pill"><span class="stat-value">${result.pageCount}</span> pages</span>`;
  }

  if (result.stats?.vertices !== undefined) {
    statsHtml += `
      <span class="stat-pill"><span class="stat-value">${result.stats.vertices}</span> vertices</span>
      <span class="stat-pill"><span class="stat-value">${result.stats.faces}</span> faces</span>
    `;
  }

  if (statsEl) statsEl.innerHTML = statsHtml;

  // Preview
  const previewEl = document.getElementById('tool-result-preview');
  const copyBtn = document.getElementById('tool-copy-btn');

  if (previewEl) {
    if (result.blob && (result.blob.type.startsWith('image/') || result.filename?.match(/\.(png|jpg|jpeg|webp|gif|bmp|svg|ico|avif)$/i))) {
      // Image preview
      const imgUrl = URL.createObjectURL(result.blob);
      previewEl.innerHTML = `<img src="${imgUrl}" alt="Converted image" style="max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px;" />`;
      if (copyBtn) copyBtn.style.display = 'none';
    } else if (result.blob && (result.blob.type.startsWith('audio/') || result.filename?.match(/\.(mp3|wav|ogg|flac|aac|m4a)$/i))) {
      // Audio preview
      const audioUrl = URL.createObjectURL(result.blob);
      previewEl.innerHTML = `
        <div class="audio-result-preview" style="padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%;">
          <span style="font-size: 3.5rem;">🎵</span>
          <div style="font-weight: 700; color: var(--text-primary); font-size: 1.05rem;">${result.filename}</div>
          <audio controls src="${audioUrl}" style="width: 100%; max-width: 440px; margin-top: 8px;"></audio>
        </div>
      `;
      if (copyBtn) copyBtn.style.display = 'none';
    } else if (result.blob && (result.blob.type.startsWith('video/') || result.filename?.match(/\.(mp4|webm|mov|avi|mkv)$/i))) {
      // Video preview
      const videoUrl = URL.createObjectURL(result.blob);
      previewEl.innerHTML = `
        <div class="video-result-preview" style="padding: 12px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%;">
          <video controls src="${videoUrl}" style="max-width: 100%; max-height: 420px; border-radius: 8px; background: #000; box-shadow: 0 4px 20px rgba(0,0,0,0.4);"></video>
        </div>
      `;
      if (copyBtn) copyBtn.style.display = 'none';
    } else if (result.blob && (result.blob.type === 'application/pdf' || result.filename?.endsWith('.pdf'))) {
      // Live PDF preview via iframe
      const pdfUrl = URL.createObjectURL(result.blob);
      previewEl.innerHTML = `
        <div style="width: 100%; height: 480px; display: flex; flex-direction: column;">
          <iframe src="${pdfUrl}#toolbar=0&navpanes=0" style="width: 100%; height: 100%; border: none; border-radius: 8px; background: #ffffff;" title="PDF Preview"></iframe>
        </div>
      `;
    } else if (result.preview) {
      // Text / Markdown preview
      const escaped = result.preview
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const isMd = result.filename?.match(/\.(md|markdown)$/i) || tool.id === 'text-to-md';
      previewEl.innerHTML = `
        <div style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
          ${isMd ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 2px 4px;">
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Markdown Output</span>
              <button id="tool-open-studio-btn" type="button" class="btn btn-secondary" style="font-size: 0.78rem; padding: 4px 10px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                <span>✨ Edit in Live Studio</span>
              </button>
            </div>
          ` : ''}
          <pre style="margin: 0;">${escaped.substring(0, 3000)}${escaped.length > 3000 ? '\n\n... (truncated)' : ''}</pre>
        </div>
      `;
      if (copyBtn) copyBtn.style.display = 'inline-flex';
      const openStudioBtn = document.getElementById('tool-open-studio-btn');
      if (openStudioBtn) {
        openStudioBtn.addEventListener('click', () => {
          if (typeof window.switchToStudioWithContent === 'function') {
            const docTitle = (result.filename || 'Document').replace(/\.md$/i, '');
            window.switchToStudioWithContent(docTitle, result.text || result.preview);
          }
        });
      }
    } else {
      // 3D / Office Document Placeholder preview
      let docIcon = '📄';
      if (result.filename?.match(/\.(obj|stl|fbx|gltf)$/i)) docIcon = '🧊';
      else if (result.filename?.match(/\.(pptx|ppt)$/i)) docIcon = '📊';
      else if (result.filename?.match(/\.(xlsx|xls|csv)$/i)) docIcon = '📈';
      else if (result.filename?.match(/\.(docx|doc)$/i)) docIcon = '📘';

      previewEl.innerHTML = `
        <div class="preview-placeholder" style="padding: 32px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px;">
          <span style="font-size: 3.5rem;">${docIcon}</span>
          <div style="font-weight: 700; color: var(--text-primary); font-size: 1.1rem;">${result.filename}</div>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0;">File generated successfully in memory. Click Download below to save to your device.</p>
        </div>
      `;
      if (copyBtn) copyBtn.style.display = 'none';
    }
  }

  // Download button text
  const downloadText = document.getElementById('tool-download-text');
  if (downloadText) {
    downloadText.textContent = `Download ${result.filename}`;
  }
}


// ═══════════════════════════════════════════════════════
// EXISTING SYSTEMS (Studio, Batch, Modals)
// ═══════════════════════════════════════════════════════

/**
 * Mode Switcher between Batch Converter and Live Studio
 */
function setupTabSwitcher() {
  const tabs = document.querySelectorAll('.mode-tab-btn, .converter-tab');
  const viewBatch = document.getElementById('view-batch');
  const viewStudio = document.getElementById('view-studio');
  const studioFooter = document.getElementById('studio-actions-footer');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playClickSound();
      animateButtonPress(tab);
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      state.activeTab = target;

      if (target === 'batch') {
        viewBatch.style.display = 'flex';
        viewStudio.style.display = 'none';
        if (studioFooter) studioFooter.style.display = 'none';
      } else {
        viewBatch.style.display = 'none';
        viewStudio.style.display = 'grid';
        if (studioFooter) studioFooter.style.display = 'flex';
        updateLivePreview();
      }
    });
  });

  // Switch to Studio helper
  window.switchToStudioWithContent = (title, content) => {
    state.currentDocTitle = title;
    state.markdown = content;
    const docInput = document.getElementById('studio-doc-name');
    const textarea = document.getElementById('markdown-input');
    if (docInput) docInput.value = title;
    if (textarea) textarea.value = content;
    updateLivePreview();

    const studioTab = document.querySelector('.mode-tab-btn[data-tab="studio"], .converter-tab[data-tab="studio"]');
    if (studioTab) studioTab.click();

    const converter = document.getElementById('converter');
    if (converter) converter.scrollIntoView({ behavior: 'smooth' });
  };
}

/**
 * Setup Multi-File Batch Converter
 */
function setupBatchConverter() {
  const dropzone = document.getElementById('batch-dropzone');
  const fileInput = document.getElementById('batch-file-input');
  const btnBrowse = document.getElementById('btn-batch-browse');
  const btnAddMore = document.getElementById('btn-add-more-files');
  const btnClearQueue = document.getElementById('btn-clear-queue');
  const btnLoadSampleBatch = document.getElementById('btn-load-sample-batch');
  const btnBatchExecute = document.getElementById('btn-batch-execute');

  const stratCombine = document.getElementById('strat-combine');
  const stratSeparate = document.getElementById('strat-separate');
  const optToc = document.getElementById('opt-toc');
  const optPagebreak = document.getElementById('opt-pagebreak');

  if (btnBrowse && fileInput) {
    btnBrowse.addEventListener('click', (e) => {
      e.stopPropagation();
      playClickSound();
      fileInput.click();
    });
  }

  if (btnAddMore && fileInput) {
    btnAddMore.addEventListener('click', () => {
      playClickSound();
      fileInput.click();
    });
  }

  if (btnClearQueue) {
    btnClearQueue.addEventListener('click', () => {
      playClickSound();
      state.batchFiles = [];
      renderBatchQueue();
    });
  }

  if (btnLoadSampleBatch) {
    btnLoadSampleBatch.addEventListener('click', () => {
      playClickSound();
      animateButtonPress(btnLoadSampleBatch);

      state.batchFiles = [
        {
          id: 'doc-1',
          name: '1_Architecture_Spec.md',
          content: SAMPLES.techSpec,
          size: new Blob([SAMPLES.techSpec]).size
        },
        {
          id: 'doc-2',
          name: '2_Academic_Research.md',
          content: SAMPLES.academicPaper,
          size: new Blob([SAMPLES.academicPaper]).size
        },
        {
          id: 'doc-3',
          name: '3_Executive_Q3_Review.md',
          content: SAMPLES.executiveSummary,
          size: new Blob([SAMPLES.executiveSummary]).size
        }
      ];

      playSuccessChime();
      fireCelebration();
      renderBatchQueue();
    });
  }

  if (dropzone) {
    dropzone.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) handleFilesAdd(files);
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) handleFilesAdd(files);
      fileInput.value = '';
    });
  }

  if (stratCombine && stratSeparate) {
    stratCombine.addEventListener('click', () => {
      playClickSound();
      stratCombine.classList.add('selected');
      stratSeparate.classList.remove('selected');
      state.batchStrategy = 'combine';
      updateBatchExecuteButton();
    });

    stratSeparate.addEventListener('click', () => {
      playClickSound();
      stratSeparate.classList.add('selected');
      stratCombine.classList.remove('selected');
      state.batchStrategy = 'separate';
      updateBatchExecuteButton();
    });
  }

  if (optToc) {
    optToc.addEventListener('change', (e) => state.addToc = e.target.checked);
  }
  if (optPagebreak) {
    optPagebreak.addEventListener('change', (e) => state.pageBreaks = e.target.checked);
  }

  if (btnBatchExecute) {
    btnBatchExecute.addEventListener('click', async () => {
      if (state.batchFiles.length === 0) return;

      playClickSound();
      animateButtonPress(btnBatchExecute);

      const progressWrap = document.getElementById('batch-progress-wrap');
      const progressStatus = document.getElementById('batch-progress-status');
      const progressPercent = document.getElementById('batch-progress-percent');
      const progressFill = document.getElementById('batch-progress-fill');

      if (progressWrap) progressWrap.style.display = 'block';
      btnBatchExecute.disabled = true;
      btnBatchExecute.style.opacity = '0.6';

      try {
        if (state.batchStrategy === 'combine') {
          if (progressStatus) progressStatus.textContent = `Merging ${state.batchFiles.length} documents into single PDF...`;
          if (progressPercent) progressPercent.textContent = '60%';
          if (progressFill) progressFill.style.width = '60%';

          await compileCombinedPdf(state.batchFiles, {
            filename: 'combined-documents.pdf',
            theme: state.theme,
            format: state.format,
            orientation: state.orientation,
            margin: state.margin,
            watermark: state.watermark,
            addToc: state.addToc,
            pageBreaks: state.pageBreaks
          });

          if (progressFill) progressFill.style.width = '100%';
          if (progressPercent) progressPercent.textContent = '100%';
          if (progressStatus) progressStatus.textContent = 'Done! PDF generated.';
          playSuccessChime();
        } else {
          await compileBatchZip(state.batchFiles, {
            zipName: 'converted-documents.zip',
            theme: state.theme,
            format: state.format,
            orientation: state.orientation,
            margin: state.margin,
            watermark: state.watermark
          }, (current, total, docName) => {
            const pct = Math.round((current / total) * 100);
            if (progressPercent) progressPercent.textContent = `${pct}%`;
            if (progressFill) progressFill.style.width = `${pct}%`;
            if (progressStatus) progressStatus.textContent = `Compiling ${current} of ${total} (${docName})...`;
          });
          playSuccessChime();
        }
      } catch (err) {
        alert('Batch compilation error: ' + err.message);
      } finally {
        btnBatchExecute.disabled = false;
        btnBatchExecute.style.opacity = '1';
        setTimeout(() => {
          if (progressWrap) progressWrap.style.display = 'none';
        }, 3000);
      }
    });
  }

  function handleFilesAdd(fileList) {
    const validFiles = fileList.filter(f => /\.(md|markdown|txt)$/i.test(f.name));
    if (validFiles.length === 0) {
      alert('Please upload .md, .markdown, or .txt files.');
      return;
    }

    let loaded = 0;
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        state.batchFiles.push({
          id: 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          name: file.name,
          content: e.target.result,
          size: file.size
        });
        loaded++;
        if (loaded === validFiles.length) {
          playSuccessChime();
          renderBatchQueue();
        }
      };
      reader.readAsText(file);
    });
  }
}

/**
 * Render the Batch Queue Items in UI
 */
function renderBatchQueue() {
  const queueContainer = document.getElementById('batch-queue-container');
  const queueList = document.getElementById('batch-queue-list');
  const queueCountBadge = document.getElementById('queue-count-badge');
  const queueTotalMeta = document.getElementById('queue-total-meta');
  const strategyContainer = document.getElementById('batch-strategy-container');
  const actionsBar = document.getElementById('batch-actions-bar');
  const tabBadge = document.getElementById('tab-batch-badge');

  const count = state.batchFiles.length;

  if (tabBadge) {
    if (count > 0) {
      tabBadge.textContent = count;
      tabBadge.style.display = 'inline-block';
    } else {
      tabBadge.style.display = 'none';
    }
  }

  if (count === 0) {
    if (queueContainer) queueContainer.style.display = 'none';
    if (strategyContainer) strategyContainer.style.display = 'none';
    if (actionsBar) actionsBar.style.display = 'none';
    return;
  }

  if (queueContainer) queueContainer.style.display = 'block';
  if (strategyContainer) strategyContainer.style.display = 'block';
  if (actionsBar) actionsBar.style.display = 'flex';

  const totalBytes = state.batchFiles.reduce((acc, f) => acc + f.size, 0);
  const totalKb = (totalBytes / 1024).toFixed(1);

  if (queueCountBadge) queueCountBadge.textContent = `${count} ${count === 1 ? 'file' : 'files'}`;
  if (queueTotalMeta) queueTotalMeta.textContent = `Total: ${totalKb} KB`;

  if (queueList) {
    queueList.innerHTML = state.batchFiles.map((file, idx) => {
      const words = file.content.trim().split(/\s+/).length;
      const pages = Math.max(1, Math.ceil(words / 450));
      return `
        <div class="queue-card" data-id="${file.id}">
          <div class="queue-card-left">
            <span class="queue-index-badge">#${idx + 1}</span>
            <div class="queue-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div class="queue-card-details">
              <div class="queue-card-name" title="${file.name}">${file.name}</div>
              <div class="queue-card-meta">${(file.size / 1024).toFixed(1)} KB • ${words.toLocaleString()} words • Est. ${pages}p</div>
            </div>
          </div>

          <div class="queue-card-right">
            ${idx > 0 ? `<button class="queue-btn-icon move-up" title="Move up" data-action="move-up" data-idx="${idx}">↑</button>` : ''}
            ${idx < count - 1 ? `<button class="queue-btn-icon move-down" title="Move down" data-action="move-down" data-idx="${idx}">↓</button>` : ''}
            <button class="queue-btn-icon" title="Open in Live Studio" data-action="open-studio" data-idx="${idx}">👁️</button>
            <button class="queue-btn-icon delete" title="Remove from queue" data-action="delete" data-idx="${idx}">✕</button>
          </div>
        </div>
      `;
    }).join('');

    queueList.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const idx = Number(btn.dataset.idx);

        if (action === 'delete') {
          playClickSound();
          state.batchFiles.splice(idx, 1);
          renderBatchQueue();
        } else if (action === 'move-up' && idx > 0) {
          playClickSound();
          const temp = state.batchFiles[idx];
          state.batchFiles[idx] = state.batchFiles[idx - 1];
          state.batchFiles[idx - 1] = temp;
          renderBatchQueue();
        } else if (action === 'move-down' && idx < state.batchFiles.length - 1) {
          playClickSound();
          const temp = state.batchFiles[idx];
          state.batchFiles[idx] = state.batchFiles[idx + 1];
          state.batchFiles[idx + 1] = temp;
          renderBatchQueue();
        } else if (action === 'open-studio') {
          playClickSound();
          const target = state.batchFiles[idx];
          window.switchToStudioWithContent(target.name, target.content);
        }
      });
    });
  }

  updateBatchExecuteButton();
}

function updateBatchExecuteButton() {
  const btnBatchExecuteText = document.getElementById('btn-batch-execute-text');
  if (!btnBatchExecuteText) return;

  const count = state.batchFiles.length;
  if (state.batchStrategy === 'combine') {
    btnBatchExecuteText.textContent = `Merge & Compile into Single PDF (${count} Files)`;
  } else {
    btnBatchExecuteText.textContent = `Compile All to ZIP Archive (${count} PDFs)`;
  }
}

/**
 * Setup Live Studio and Editor
 */
function setupStudioEditor() {
  const textarea = document.getElementById('markdown-input');
  const docNameInput = document.getElementById('studio-doc-name');
  const themeSelect = document.getElementById('theme-select');
  const formatSelect = document.getElementById('format-select');
  const orientationSelect = document.getElementById('orientation-select');
  const marginSelect = document.getElementById('margin-select');
  const watermarkInput = document.getElementById('watermark-input');
  const pageNumToggle = document.getElementById('page-num-toggle');

  if (textarea) {
    textarea.value = state.markdown;
    textarea.addEventListener('input', (e) => {
      state.markdown = e.target.value;
      updateLivePreview();
    });
  }

  if (docNameInput) {
    docNameInput.value = state.currentDocTitle;
    docNameInput.addEventListener('input', (e) => {
      state.currentDocTitle = e.target.value || 'document.md';
    });
  }

  const viewModeBtns = document.querySelectorAll('.view-mode-btn');
  const studioView = document.getElementById('view-studio');

  viewModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      viewModeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.dataset.view;
      state.studioViewMode = mode;

      if (studioView) {
        studioView.classList.remove('editor-only', 'preview-only');
        if (mode === 'editor') studioView.classList.add('editor-only');
        if (mode === 'preview') studioView.classList.add('preview-only');
      }
    });
  });

  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');
  const btnZoomReset = document.getElementById('btn-zoom-reset');
  const zoomValue = document.getElementById('zoom-value');
  const sheetWrapper = document.getElementById('paper-sheet-wrapper');

  function updateZoom(newZoom) {
    state.previewZoom = Math.min(1.5, Math.max(0.6, Number(newZoom.toFixed(1))));
    if (zoomValue) zoomValue.textContent = `${Math.round(state.previewZoom * 100)}%`;
    if (sheetWrapper) sheetWrapper.style.transform = `scale(${state.previewZoom})`;
  }

  if (btnZoomIn) btnZoomIn.addEventListener('click', () => { playClickSound(); updateZoom(state.previewZoom + 0.1); });
  if (btnZoomOut) btnZoomOut.addEventListener('click', () => { playClickSound(); updateZoom(state.previewZoom - 0.1); });
  if (btnZoomReset) btnZoomReset.addEventListener('click', () => { playClickSound(); updateZoom(1.0); });

  document.querySelectorAll('.quickbar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      animateButtonPress(btn);
      const textToInsert = btn.dataset.insert;
      const isWrap = btn.dataset.wrap === 'true';
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      if (isWrap) {
        const selected = val.substring(start, end) || 'text';
        textarea.value = val.substring(0, start) + textToInsert + selected + textToInsert + val.substring(end);
        textarea.selectionStart = start + textToInsert.length;
        textarea.selectionEnd = start + textToInsert.length + selected.length;
      } else {
        textarea.value = val.substring(0, start) + textToInsert + val.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length;
      }

      state.markdown = textarea.value;
      updateLivePreview();
      textarea.focus();
    });
  });

  document.querySelectorAll('.sample-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      animateButtonPress(btn);
      document.querySelectorAll('.sample-pill').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      const sampleKey = btn.dataset.sample;
      if (SAMPLES[sampleKey]) {
        state.markdown = SAMPLES[sampleKey];
        state.currentDocTitle = `${sampleKey}.md`;
        if (textarea) textarea.value = state.markdown;
        if (docNameInput) docNameInput.value = state.currentDocTitle;
        
        if (sampleKey === 'academicPaper' || sampleKey === 'kdpEbook') {
          state.theme = 'academic';
          if (themeSelect) themeSelect.value = 'academic';
        } else if (sampleKey === 'executiveSummary' || sampleKey === 'atsResume' || sampleKey === 'legalContract' || sampleKey === 'batesLegalMerge') {
          state.theme = 'executive';
          if (themeSelect) themeSelect.value = 'executive';
        } else {
          state.theme = 'super-modern';
          if (themeSelect) themeSelect.value = 'super-modern';
        }

        updateLivePreview();
        const studioTab = document.querySelector('.converter-tab[data-tab="studio"], .mode-tab-btn[data-tab="studio"]');
        if (studioTab) studioTab.click();

        const converter = document.getElementById('converter');
        if (converter) converter.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  if (themeSelect) themeSelect.addEventListener('change', (e) => { playClickSound(); state.theme = e.target.value; updateLivePreview(); });
  if (formatSelect) formatSelect.addEventListener('change', (e) => { playClickSound(); state.format = e.target.value; updateLivePreview(); });
  if (orientationSelect) orientationSelect.addEventListener('change', (e) => { playClickSound(); state.orientation = e.target.value; updateLivePreview(); });
  if (marginSelect) marginSelect.addEventListener('change', (e) => { playClickSound(); state.margin = Number(e.target.value); updateLivePreview(); });
  if (watermarkInput) watermarkInput.addEventListener('input', (e) => { state.watermark = e.target.value; updateLivePreview(); });
  if (pageNumToggle) pageNumToggle.addEventListener('change', (e) => { playClickSound(); state.showPageNumbers = e.target.checked; });

  // Watermark Customization Popover (Size, Angle: Straight/Cross, Repeat: Single/Tiled)
  const btnWatermarkOptions = document.getElementById('btn-watermark-options');
  const watermarkPopover = document.getElementById('watermark-popover');
  const btnCloseWatermarkPopover = document.getElementById('btn-close-watermark-popover');
  const watermarkActiveDot = document.getElementById('watermark-active-dot');

  function updateWatermarkActiveIndicator() {
    if (!watermarkActiveDot) return;
    const isCustom = state.watermarkSize !== 52 || state.watermarkAngle !== -45 || state.watermarkRepeat !== false || state.watermarkOpacity !== 8;
    watermarkActiveDot.style.display = isCustom ? 'block' : 'none';
  }

  if (btnWatermarkOptions && watermarkPopover) {
    btnWatermarkOptions.addEventListener('click', (e) => {
      e.stopPropagation();
      playClickSound();
      const isVisible = watermarkPopover.style.display !== 'none';
      watermarkPopover.style.display = isVisible ? 'none' : 'block';
      btnWatermarkOptions.classList.toggle('active', !isVisible);
    });

    if (btnCloseWatermarkPopover) {
      btnCloseWatermarkPopover.addEventListener('click', (e) => {
        e.stopPropagation();
        watermarkPopover.style.display = 'none';
        btnWatermarkOptions.classList.remove('active');
      });
    }

    document.addEventListener('click', (e) => {
      if (watermarkPopover.style.display !== 'none' && !watermarkPopover.contains(e.target) && e.target !== btnWatermarkOptions) {
        watermarkPopover.style.display = 'none';
        btnWatermarkOptions.classList.remove('active');
      }
    });

    // Preset Chips
    document.querySelectorAll('.wm-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playClickSound();
        const preset = btn.dataset.preset;
        state.watermark = preset;
        if (watermarkInput) watermarkInput.value = preset;
        updateLivePreview();
      });
    });

    // Size Selection (Continuous Slider + Quick Pills)
    const sizeSlider = document.getElementById('wm-size-slider');
    const sizeBadge = document.getElementById('wm-size-badge');

    function applyWatermarkSize(newSize) {
      state.watermarkSize = Number(newSize);
      if (sizeBadge) sizeBadge.textContent = `${state.watermarkSize}px`;
      if (sizeSlider && Number(sizeSlider.value) !== state.watermarkSize) {
        sizeSlider.value = state.watermarkSize;
      }
      document.querySelectorAll('.wm-size-btn').forEach(b => {
        b.classList.toggle('active', Number(b.dataset.size) === state.watermarkSize);
      });
      updateWatermarkActiveIndicator();
      updateLivePreview();
    }

    if (sizeSlider) {
      sizeSlider.addEventListener('input', (e) => {
        applyWatermarkSize(e.target.value);
      });
    }

    document.querySelectorAll('.wm-size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playClickSound();
        applyWatermarkSize(btn.dataset.size);
      });
    });

    // Angle / Degree Selection (Straight vs Cross)
    const angleBadge = document.getElementById('wm-angle-badge');
    document.querySelectorAll('.wm-angle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playClickSound();
        document.querySelectorAll('.wm-angle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.watermarkAngle = Number(btn.dataset.angle);
        const labels = { '-45': 'Cross (-45°)', '-30': 'Subtle (-30°)', '0': 'Straight (0°)' };
        if (angleBadge) angleBadge.textContent = labels[state.watermarkAngle] || `${state.watermarkAngle}°`;
        updateWatermarkActiveIndicator();
        updateLivePreview();
      });
    });

    // Repeat Selection
    const repeatBadge = document.getElementById('wm-repeat-badge');
    document.querySelectorAll('.wm-repeat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playClickSound();
        document.querySelectorAll('.wm-repeat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.watermarkRepeat = btn.dataset.repeat === 'true';
        if (repeatBadge) repeatBadge.textContent = state.watermarkRepeat ? '⊞ Full Page Repeat' : 'Single Center';
        updateWatermarkActiveIndicator();
        updateLivePreview();
      });
    });

    // Opacity Slider
    const opacitySlider = document.getElementById('wm-opacity-slider');
    const opacityBadge = document.getElementById('wm-opacity-badge');
    if (opacitySlider) {
      opacitySlider.addEventListener('input', (e) => {
        state.watermarkOpacity = Number(e.target.value);
        if (opacityBadge) opacityBadge.textContent = `${state.watermarkOpacity}%`;
        updateWatermarkActiveIndicator();
        updateLivePreview();
      });
    }
  }

  const btnExportPdf = document.getElementById('btn-export-pdf');
  const btnExportText = document.getElementById('btn-export-text');
  const btnVectorPrint = document.getElementById('btn-vector-print');
  const btnCopyHtml = document.getElementById('btn-copy-html');
  const btnDownloadMd = document.getElementById('btn-download-md');
  const btnClear = document.getElementById('btn-clear');
  const btnCardExport = document.getElementById('btn-card-export');
  const floatingPill = document.getElementById('super-floating-pill');

  async function triggerStudioPdfDownload() {
    const paperSheet = document.getElementById('paper-mount');
    if (!paperSheet) return;

    playClickSound();
    if (btnExportPdf) animateButtonPress(btnExportPdf);
    if (btnExportText) btnExportText.textContent = 'Compiling PDF...';
    if (btnExportPdf) btnExportPdf.style.opacity = '0.7';

    try {
      const outName = state.currentDocTitle.replace(/\.(md|markdown|txt)$/i, '') || 'document';
      await downloadPdf(paperSheet, {
        filename: `${outName}.pdf`,
        format: state.format,
        orientation: state.orientation,
        margin: state.margin
      });
      playSuccessChime();
    } catch (err) {
      alert('Could not compile PDF directly in this browser. Please try "Vector Print" to save as PDF.');
    } finally {
      if (btnExportText) btnExportText.textContent = 'Download PDF';
      if (btnExportPdf) btnExportPdf.style.opacity = '1';
    }
  }

  if (btnExportPdf) btnExportPdf.addEventListener('click', triggerStudioPdfDownload);
  if (btnCardExport) btnCardExport.addEventListener('click', triggerStudioPdfDownload);
  if (floatingPill) floatingPill.addEventListener('click', triggerStudioPdfDownload);

  if (btnVectorPrint) {
    btnVectorPrint.addEventListener('click', () => {
      playClickSound();
      animateButtonPress(btnVectorPrint);
      printVector();
    });
  }

  if (btnCopyHtml) {
    btnCopyHtml.addEventListener('click', () => {
      playClickSound();
      const paperContent = document.getElementById('paper-content');
      if (paperContent) {
        navigator.clipboard.writeText(paperContent.innerHTML);
        btnCopyHtml.textContent = '✓ Copied!';
        setTimeout(() => btnCopyHtml.textContent = 'Copy HTML', 2000);
      }
    });
  }

  if (btnDownloadMd) {
    btnDownloadMd.addEventListener('click', () => {
      playClickSound();
      const blob = new Blob([state.markdown], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = state.currentDocTitle || 'document.md';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      playClickSound();
      if (confirm('Clear editor contents?')) {
        state.markdown = '';
        if (textarea) textarea.value = '';
        updateLivePreview();
      }
    });
  }

  // Modals
  const modalApi = document.getElementById('modal-api');
  const modalPricing = document.getElementById('modal-pricing');
  const btnOpenApi = document.getElementById('btn-open-api');
  const btnOpenPricing = document.getElementById('btn-open-pricing');

  if (btnOpenApi && modalApi) btnOpenApi.addEventListener('click', () => { playClickSound(); modalApi.classList.add('open'); });
  if (btnOpenPricing && modalPricing) btnOpenPricing.addEventListener('click', () => { playClickSound(); modalPricing.classList.add('open'); });

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const modal = document.getElementById(btn.dataset.close);
      if (modal) modal.classList.remove('open');
    });
  });

  [modalApi, modalPricing].forEach(m => {
    if (m) m.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('open'); });
  });

  // API Tabs
  const apiTabs = document.querySelectorAll('.api-tab-btn');
  apiTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playClickSound();
      apiTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const lang = tab.dataset.lang;
      ['curl', 'node', 'python'].forEach(l => {
        const box = document.getElementById(`snippet-${l}`);
        if (box) box.style.display = (l === lang) ? 'block' : 'none';
      });
    });
  });

  document.querySelectorAll('.code-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const targetElem = document.getElementById(btn.dataset.target);
      if (targetElem) {
        navigator.clipboard.writeText(targetElem.innerText);
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 2000);
      }
    });
  });

  document.querySelectorAll('.faq-item').forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        playClickSound();
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });
}

/**
 * Live Rendered Preview Updating
 */
function updateLivePreview() {
  const paperContent = document.getElementById('paper-content');
  const paperSheet = document.getElementById('paper-mount');
  const paperWatermark = document.getElementById('paper-watermark');
  const wordsCounter = document.getElementById('counter-words');
  const charsCounter = document.getElementById('counter-chars');
  const readTimeCounter = document.getElementById('counter-read-time');
  const pagesCounter = document.getElementById('counter-pages');
  const floatingPillSub = document.getElementById('floating-pill-sub');

  if (!paperContent || !paperSheet) return;

  const { html, metadata, stats } = parseMarkdown(state.markdown);

  let metaHtml = '';
  if (Object.keys(metadata).length > 0) {
    const badges = Object.entries(metadata)
      .map(([k, v]) => `<span style="display:inline-block; font-size:0.75rem; background:rgba(0,0,0,0.06); padding:2px 8px; border-radius:4px; margin-right:6px; margin-bottom:6px; text-transform:uppercase; font-weight:700;">${k}: ${v}</span>`)
      .join('');
    metaHtml = `<div style="margin-bottom:1.5em; padding-bottom:1em; border-bottom:1px dashed #CBD5E1;">${badges}</div>`;
  }

  paperSheet.className = `paper-sheet theme-${state.theme}`;
  paperSheet.style.padding = `${state.margin * 2}px`;
  paperContent.innerHTML = metaHtml + html;

  if (state.watermark.trim()) {
    const text = state.watermark.trim();
    const size = state.watermarkSize || 52;
    const angle = state.watermarkAngle !== undefined ? state.watermarkAngle : -45;
    const repeat = !!state.watermarkRepeat;
    const opacity = (state.watermarkOpacity !== undefined ? state.watermarkOpacity : 8) / 100;

    paperWatermark.style.display = 'block';

    if (repeat) {
      paperWatermark.className = 'paper-watermark paper-watermark-repeat';
      const docHeight = Math.max(940, paperSheet.scrollHeight || paperSheet.offsetHeight || 940);
      const rows = Math.max(3, Math.ceil(docHeight / 240));
      const stampsCount = rows * 2;

      let stampsHtml = '';
      for (let i = 0; i < stampsCount; i++) {
        stampsHtml += `<div class="watermark-stamp" style="transform: rotate(${angle}deg); font-size: ${size}px; font-weight: 800; color: rgba(0, 0, 0, ${opacity});">${text}</div>`;
      }
      paperWatermark.innerHTML = stampsHtml;
    } else {
      paperWatermark.className = 'paper-watermark paper-watermark-single';
      paperWatermark.innerHTML = `<div class="watermark-stamp" style="transform: translate(-50%, -50%) rotate(${angle}deg); font-size: ${size}px; font-weight: 900; color: rgba(0, 0, 0, ${opacity}); position: absolute; top: 50%; left: 50%;">${text}</div>`;
    }
  } else {
    paperWatermark.style.display = 'none';
    paperWatermark.innerHTML = '';
  }

  if (wordsCounter) wordsCounter.textContent = `${stats.words.toLocaleString()} words`;
  if (charsCounter) charsCounter.textContent = `${stats.chars.toLocaleString()} chars`;
  if (readTimeCounter) {
    const mins = Math.max(1, Math.ceil(stats.words / 200));
    readTimeCounter.textContent = `~${mins} min read`;
  }
  if (pagesCounter) pagesCounter.textContent = `Est. ${stats.estimatedPages} ${stats.estimatedPages === 1 ? 'page' : 'pages'}`;

  if (floatingPillSub) {
    floatingPillSub.textContent = `⚡ ${stats.words} words • 1-Click`;
  }

  const metaBadge = document.getElementById('preview-meta-badge');
  if (metaBadge) {
    const orientStr = state.orientation === 'portrait' ? 'Portrait' : 'Landscape';
    metaBadge.textContent = `${state.format.toUpperCase()} • ${state.margin}mm • ${orientStr}`;
  }
}

/**
 * Setup Command Palette (Cmd+K)
 */
function setupCommandPalette() {
  const palette = document.getElementById('cmd-palette');
  const input = document.getElementById('cmd-search-input');
  const list = document.getElementById('cmd-list');

  const commands = [
    { title: 'Download PDF', desc: 'Instant compile & download', action: () => document.getElementById('btn-export-pdf')?.click() },
    { title: 'Vector Print (PDF)', desc: 'Open vector print driver', action: () => printVector() },
    { title: 'Mode: Drop & Batch Convert', desc: 'Switch to multi-file batch upload', action: () => document.querySelector('.converter-tab[data-tab="batch"]')?.click() },
    { title: 'Mode: Live Studio', desc: 'Switch to live Markdown IDE', action: () => document.querySelector('.converter-tab[data-tab="studio"]')?.click() },
    { title: 'Theme: Super Modern', desc: 'Electric indigo highlights', action: () => setTheme('super-modern') },
    { title: 'Theme: Academic Paper', desc: 'Serif formal document styling', action: () => setTheme('academic') },
    { title: 'Theme: GitHub Classic', desc: 'Standard GitHub markdown', action: () => setTheme('github') },
    { title: 'Theme: Executive Brief', desc: 'Slate executive memo styling', action: () => setTheme('executive') },
    { title: 'Theme: Midnight Dark', desc: 'High-contrast dark-mode PDF', action: () => setTheme('midnight') },
    { title: 'Load Sample Batch (3 Docs)', desc: 'Load 3 files into batch queue', action: () => document.getElementById('btn-load-sample-batch')?.click() },
    { title: 'Developer API Docs', desc: 'View headless cURL / SDK snippets', action: () => document.getElementById('btn-open-api')?.click() },
    { title: 'Pricing & Pro Plans', desc: 'View Micro-SaaS pricing tiers', action: () => document.getElementById('btn-open-pricing')?.click() }
  ];

  function setTheme(theme) {
    state.theme = theme;
    const select = document.getElementById('theme-select');
    if (select) select.value = theme;
    updateLivePreview();
  }

  function renderList(query = '') {
    if (!list) return;
    const filtered = commands.filter(c => 
      c.title.toLowerCase().includes(query.toLowerCase()) || 
      c.desc.toLowerCase().includes(query.toLowerCase())
    );

    list.innerHTML = filtered.map((cmd, idx) => `
      <li class="cmd-item ${idx === 0 ? 'selected' : ''}" data-idx="${idx}">
        <div>
          <div>${cmd.title}</div>
          <div class="cmd-item-desc">${cmd.desc}</div>
        </div>
        <span class="cmd-kbd">↵</span>
      </li>
    `).join('');

    list.querySelectorAll('.cmd-item').forEach((item, idx) => {
      item.addEventListener('click', () => {
        playClickSound();
        filtered[idx].action();
        closePalette();
      });
    });
  }

  function openPalette() {
    if (!palette) return;
    playClickSound();
    palette.classList.add('open');
    if (input) {
      input.value = '';
      input.focus();
    }
    renderList('');
  }

  function closePalette() {
    if (!palette) return;
    palette.classList.remove('open');
  }

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (palette?.classList.contains('open')) closePalette();
      else openPalette();
    }
    if (e.key === 'Escape' && palette?.classList.contains('open')) closePalette();
  });

  if (palette) {
    palette.addEventListener('click', (e) => { if (e.target === palette) closePalette(); });
  }

  if (input) {
    input.addEventListener('input', (e) => renderList(e.target.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstItem = list?.querySelector('.cmd-item');
        if (firstItem) firstItem.click();
      }
    });
  }
}

// ═══════════════════════════════════════════════════════
// FORMAT SELECTION MODAL (Reference Match)
// ═══════════════════════════════════════════════════════

let activeFormatCategory = 'image';

export function openFormatModal() {
  const modal = document.getElementById('format-picker-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const searchInput = document.getElementById('format-search-input');
  if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
  }
  const clearBtn = document.getElementById('format-search-clear');
  if (clearBtn) clearBtn.style.display = 'none';

  // If active tool belongs to a known category, pre-select that category
  const activeTool = getToolById(state.activeTool);
  if (activeTool) {
    if (activeTool.category === 'images') activeFormatCategory = 'image';
    else if (activeTool.category === 'video') activeFormatCategory = 'video';
    else if (activeTool.category === 'audio') activeFormatCategory = 'audio';
    else if (activeTool.category === '3d') activeFormatCategory = '3d';
    else if (activeTool.category === 'documents') activeFormatCategory = 'document';
  }

  renderFormatModalContent();
}

export function closeFormatModal() {
  const modal = document.getElementById('format-picker-modal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function renderFormatModalContent(filterQuery = '') {
  const catNav = document.getElementById('format-cat-nav');
  const pillsGrid = document.getElementById('format-pills-grid');
  const emptyState = document.getElementById('format-empty-state');
  const emptyQuery = document.getElementById('format-empty-query');

  const query = filterQuery.trim().toLowerCase();

  // If query is active, search across all formats
  if (query) {
    catNav?.querySelectorAll('.format-cat-btn').forEach(btn => btn.classList.remove('active'));

    const allMatches = [];
    FORMAT_CATALOG.forEach(cat => {
      cat.formats.forEach(fmt => {
        if (fmt.name.toLowerCase().includes(query) || fmt.ext.toLowerCase().includes(query) || cat.name.toLowerCase().includes(query)) {
          allMatches.push({ ...fmt, catName: cat.name });
        }
      });
    });

    if (allMatches.length === 0) {
      if (pillsGrid) pillsGrid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      if (emptyQuery) emptyQuery.textContent = filterQuery;
    } else {
      if (emptyState) emptyState.style.display = 'none';
      if (pillsGrid) {
        pillsGrid.innerHTML = allMatches.map(fmt => `
          <button class="format-pill-btn" data-format-id="${fmt.id}" data-ext="${fmt.ext}" title="${fmt.catName}: ${fmt.name} (${fmt.ext})">
            ${fmt.name}
          </button>
        `).join('');
        wireFormatPills(pillsGrid);
      }
    }
    return;
  }

  // Normal category view
  if (emptyState) emptyState.style.display = 'none';

  catNav?.querySelectorAll('.format-cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.catId === activeFormatCategory);
  });

  const currentCat = FORMAT_CATALOG.find(c => c.id === activeFormatCategory) || FORMAT_CATALOG[0];
  if (pillsGrid && currentCat) {
    pillsGrid.innerHTML = currentCat.formats.map(fmt => `
      <button class="format-pill-btn" data-format-id="${fmt.id}" data-ext="${fmt.ext}">
        ${fmt.name}
      </button>
    `).join('');
    wireFormatPills(pillsGrid);
  }
}

function wireFormatPills(container) {
  container.querySelectorAll('.format-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const ext = btn.dataset.ext;
      const formatId = btn.dataset.formatId;
      selectFormatTarget(ext, formatId, btn.textContent.trim());
    });
  });
}

function selectFormatTarget(ext, formatId, formatName) {
  closeFormatModal();

  const currentTool = getToolById(state.activeTool);
  const targetExt = ext.startsWith('.') ? ext : `.${ext}`;

  // Check if current active tool has a targetFormat setting
  if (currentTool && currentTool.settings) {
    const targetSetting = currentTool.settings.find(s => s.id === 'targetFormat' || s.id === 'outputType');
    if (targetSetting) {
      state.toolSettings[targetSetting.id] = targetExt;
      const selectEl = document.getElementById(`setting-${targetSetting.id}`);
      if (selectEl) {
        let optExists = Array.from(selectEl.options).some(o => o.value === targetExt);
        if (!optExists) {
          const newOpt = document.createElement('option');
          newOpt.value = targetExt;
          newOpt.textContent = targetExt;
          selectEl.appendChild(newOpt);
        }
        selectEl.value = targetExt;
      }
      const pillLabel = document.getElementById('tool-format-pill-label');
      if (pillLabel) {
        pillLabel.textContent = `${currentTool.inputFormats[0]} → ${targetExt}`;
      }
      playSuccessChime();
      return;
    }
  }

  // Otherwise, find the best matching tool for this target format or category
  const targetLower = targetExt.replace('.', '').toLowerCase();
  
  let matchedTool = TOOLS.find(t => t.outputFormat.toLowerCase().includes(targetLower));

  if (!matchedTool) {
    if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(targetLower)) {
      matchedTool = getToolById('audio-convert');
    } else if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(targetLower)) {
      matchedTool = getToolById('video-convert');
    } else if (['obj', 'stl', 'fbx', 'gltf'].includes(targetLower)) {
      matchedTool = getToolById('3d-convert');
    } else if (['jpg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'avif', 'ico', 'svg'].includes(targetLower)) {
      matchedTool = getToolById('image-compress-convert');
    } else if (['pdf', 'docx', 'pptx', 'xlsx', 'txt', 'md', 'markdown'].includes(targetLower)) {
      if (targetLower === 'pptx') matchedTool = getToolById('doc-to-pptx');
      else if (targetLower === 'xlsx') matchedTool = getToolById('doc-to-xlsx');
      else if (targetLower === 'docx') matchedTool = getToolById('doc-to-docx');
      else if (targetLower === 'pdf') matchedTool = getToolById('docx-to-pdf');
      else if (targetLower === 'md' || targetLower === 'markdown') matchedTool = getToolById('text-to-md');
      else matchedTool = getToolById('pdf-to-text');
    }
  }

  if (matchedTool) {
    window.location.hash = `#/tool/${matchedTool.id}`;
    setTimeout(() => {
      if (state.toolSettings && matchedTool.settings?.some(s => s.id === 'targetFormat')) {
        state.toolSettings.targetFormat = targetExt;
        const selectEl = document.getElementById('setting-targetFormat');
        if (selectEl) selectEl.value = targetExt;
        const pillLabel = document.getElementById('tool-format-pill-label');
        if (pillLabel) pillLabel.textContent = `${matchedTool.inputFormats[0]} → ${targetExt}`;
      }
    }, 100);
  }
}

function setupFormatModal() {
  const modal = document.getElementById('format-picker-modal');
  const closeBtn = document.getElementById('format-modal-close');
  const searchInput = document.getElementById('format-search-input');
  const searchClear = document.getElementById('format-search-clear');
  const catNav = document.getElementById('format-cat-nav');

  // Close handlers
  if (closeBtn) closeBtn.addEventListener('click', closeFormatModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeFormatModal();
    });
  }

  // Global ESC handler
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display !== 'none') {
      closeFormatModal();
    }
  });

  // Category buttons
  if (catNav) {
    catNav.querySelectorAll('.format-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playClickSound();
        activeFormatCategory = btn.dataset.catId;
        if (searchInput) searchInput.value = '';
        if (searchClear) searchClear.style.display = 'none';
        renderFormatModalContent();
      });
    });
  }

  // Live search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value;
      if (searchClear) searchClear.style.display = q ? 'flex' : 'none';
      renderFormatModalContent(q);
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      playClickSound();
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchClear.style.display = 'none';
      renderFormatModalContent();
    });
  }
}

/**
 * Setup Hero Conversion Hub Grid (legacy — kept for backward compatibility)
 */
function setupConversionHub() {
  // This is now handled by setupToolGrid()
  // Keeping function reference to avoid errors
}



// Boot
document.addEventListener('DOMContentLoaded', initApp);
