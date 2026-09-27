/**
 * SuperConvert — Universal Converter Registry
 * Consolidated, direct conversion units with explicit input/output specifications.
 * Every tool includes domain-specific Conversion Settings and quick presets.
 */

export const CATEGORIES = [
  { id: 'all', label: 'All Tools', icon: '⚡' },
  { id: 'images', label: 'Images', icon: '🖼️' },
  { id: 'documents', label: 'Documents', icon: '📄' },
  { id: 'video', label: 'Video', icon: '🎬' },
  { id: 'audio', label: 'Audio', icon: '🎵' },
  { id: '3d', label: '3D Models', icon: '🧊' },
  { id: 'data', label: 'Data & Sheets', icon: '📊' },
  { id: 'code', label: 'Code Utils', icon: '🧰' }
];

export const TOOLS = [
  // ═══════════════════════════════════════════════
  // POPULAR IMAGE CONVERSIONS (Top 6 Reference Cards)
  // ═══════════════════════════════════════════════
  {
    id: 'png-to-jpg',
    name: 'Convert PNG to JPG',
    category: 'images',
    icon: '🖼️',
    description: 'Convert PNG images with transparency into high-quality, lightweight JPG format.',
    inputFormats: ['.png'],
    inputAccept: 'image/png',
    outputFormat: '.jpg',
    isFree: true,
    engine: 'image',
    presets: [
      { label: '💎 High Quality (95%)', settings: { quality: 95, scale: '100% (Original)', colorFilter: 'None (Original)' } },
      { label: '⚡ Balanced Web (85%)', settings: { quality: 85, scale: '75%', colorFilter: 'None (Original)' } },
      { label: '🗜️ Compact (65%)', settings: { quality: 65, scale: '50%', colorFilter: 'None (Original)' } }
    ],
    settings: [
      { id: 'targetFormat', type: 'select', label: 'Output Format', options: ['.jpg', '.png', '.webp', '.gif', '.bmp', '.tiff', '.avif', '.ico', '.svg'], default: '.jpg' },
      { id: 'quality', type: 'range', label: 'Quality', min: 10, max: 100, default: 92, unit: '%' },
      { id: 'scale', type: 'select', label: 'Dimensions Scale', options: ['100% (Original)', '75%', '50% (Half Size)', '25% (Thumbnail)'], default: '100% (Original)' },
      { id: 'bgColor', type: 'color', label: 'Background Fill (Transparency)', default: '#ffffff' },
      { id: 'rotation', type: 'select', label: 'Rotate Image', options: ['0° (Normal)', '90° Clockwise', '180°', '270°'], default: '0° (Normal)' },
      { id: 'colorFilter', type: 'select', label: 'Color Filter', options: ['None (Original)', 'Grayscale', 'Sepia', 'High Contrast', 'Invert'], default: 'None (Original)' }
    ]
  },
  {
    id: 'jpg-to-png',
    name: 'Convert JPG to PNG',
    category: 'images',
    icon: '🖼️',
    description: 'Convert compressed JPG/JPEG photos into lossless, crystal-clear PNG images.',
    inputFormats: ['.jpg', '.jpeg'],
    inputAccept: 'image/jpeg',
    outputFormat: '.png',
    isFree: true,
    engine: 'image',
    presets: [
      { label: '💎 Crystal Clear (100%)', settings: { quality: 100, scale: '100% (Original)' } },
      { label: '⚡ Web Scaled (75%)', settings: { quality: 90, scale: '75%' } }
    ],
    settings: [
      { id: 'targetFormat', type: 'select', label: 'Output Format', options: ['.png', '.jpg', '.webp', '.gif', '.bmp', '.tiff', '.avif', '.ico', '.svg'], default: '.png' },
      { id: 'scale', type: 'select', label: 'Dimensions Scale', options: ['100% (Original)', '75%', '50%', '25%'], default: '100% (Original)' },
      { id: 'rotation', type: 'select', label: 'Rotate Image', options: ['0° (Normal)', '90° Clockwise', '180°', '270°'], default: '0° (Normal)' },
      { id: 'colorFilter', type: 'select', label: 'Color Filter', options: ['None (Original)', 'Grayscale', 'Sepia', 'High Contrast', 'Invert'], default: 'None (Original)' },
      { id: 'stripMetadata', type: 'checkbox', label: 'Strip EXIF Metadata', default: true }
    ]
  },
  {
    id: 'webp-to-png',
    name: 'Convert WEBP to PNG',
    category: 'images',
    icon: '🖼️',
    description: 'Convert modern WebP images into transparent, widely supported PNG format.',
    inputFormats: ['.webp'],
    inputAccept: 'image/webp',
    outputFormat: '.png',
    isFree: true,
    engine: 'image',
    presets: [
      { label: '💎 Lossless 100%', settings: { scale: '100% (Original)', colorFilter: 'None (Original)' } },
      { label: '⚡ Downscale 75%', settings: { scale: '75%', colorFilter: 'None (Original)' } }
    ],
    settings: [
      { id: 'targetFormat', type: 'select', label: 'Output Format', options: ['.png', '.jpg', '.webp', '.gif', '.bmp', '.tiff', '.avif', '.ico', '.svg'], default: '.png' },
      { id: 'scale', type: 'select', label: 'Dimensions Scale', options: ['100% (Original)', '75%', '50%', '25%'], default: '100% (Original)' },
      { id: 'rotation', type: 'select', label: 'Rotate Image', options: ['0° (Normal)', '90° Clockwise', '180°', '270°'], default: '0° (Normal)' },
      { id: 'colorFilter', type: 'select', label: 'Color Filter', options: ['None (Original)', 'Grayscale', 'Sepia', 'High Contrast', 'Invert'], default: 'None (Original)' }
    ]
  },
  {
    id: 'png-to-ico',
    name: 'Convert PNG to ICO',
    category: 'images',
    icon: '🔷',
    description: 'Convert PNG icons and logos into website favicon .ico files for your browser tabs.',
    inputFormats: ['.png', '.jpg', '.webp'],
    inputAccept: 'image/*',
    outputFormat: '.ico',
    isFree: true,
    engine: 'image',
    presets: [
      { label: '🌐 Standard Favicon (32x32)', settings: { icoSize: '32x32 (Browser Tab)', padToSquare: true } },
      { label: '📱 Retina Icon (128x128)', settings: { icoSize: '128x128 (Retina)', padToSquare: true } }
    ],
    settings: [
      { id: 'icoSize', type: 'select', label: 'Favicon Dimension', options: ['64x64 (Standard)', '32x32 (Browser Tab)', '16x16 (Classic Bookmark)', '128x128 (Retina)', '256x256 (High-Res)'], default: '64x64 (Standard)' },
      { id: 'padToSquare', type: 'checkbox', label: 'Maintain Square Aspect Ratio', default: true },
      { id: 'transparentBg', type: 'checkbox', label: 'Preserve Transparency', default: true },
      { id: 'bgColor', type: 'color', label: 'Fallback Background Fill', default: '#ffffff' }
    ]
  },
  {
    id: 'pdf-to-jpg',
    name: 'Convert PDF to JPG',
    category: 'documents',
    icon: '📄',
    description: 'Extract pages from PDF documents into high-resolution JPG images.',
    inputFormats: ['.pdf'],
    inputAccept: '.pdf,application/pdf',
    outputFormat: '.jpg',
    isFree: true,
    engine: 'doc',
    presets: [
      { label: '🖨️ High-Res Print (300 DPI)', settings: { dpi: '300 DPI (High-Res Print)', quality: 95, pageNumber: 1 } },
      { label: '⚡ Web Screen (150 DPI)', settings: { dpi: '150 DPI (Sharp Web)', quality: 85, pageNumber: 1 } }
    ],
    settings: [
      { id: 'pageNumber', type: 'number', label: 'Target Page Number', default: 1 },
      { id: 'dpi', type: 'select', label: 'Resolution / DPI', options: ['72 DPI (Standard Screen)', '150 DPI (Sharp Web)', '300 DPI (High-Res Print)'], default: '150 DPI (Sharp Web)' },
      { id: 'quality', type: 'range', label: 'JPEG Quality', min: 50, max: 100, default: 92, unit: '%' },
      { id: 'outputFormat', type: 'select', label: 'Image Format', options: ['.jpg', '.png', '.webp'], default: '.jpg' }
    ]
  },
  {
    id: 'png-to-pdf',
    name: 'Convert PNG to PDF',
    category: 'documents',
    icon: '📑',
    description: 'Combine PNG images into a clean, print-ready PDF document.',
    inputFormats: ['.png', '.jpg', '.webp'],
    inputAccept: 'image/*',
    outputFormat: '.pdf',
    isFree: true,
    engine: 'doc',
    presets: [
      { label: '📑 Standard A4 Document', settings: { format: 'a4', orientation: 'portrait', fit: 'Fit to Page' } },
      { label: '🖼️ Full Bleed Photo (No Margins)', settings: { format: 'a4', orientation: 'portrait', fit: 'Full Bleed' } }
    ],
    settings: [
      { id: 'fit', type: 'select', label: 'Image Fit Strategy', options: ['Fit to Page', 'Full Bleed', 'Original Scale Centered'], default: 'Fit to Page' },
      { id: 'format', type: 'select', label: 'Paper Size', options: ['a4', 'letter', 'legal'], default: 'a4' },
      { id: 'orientation', type: 'select', label: 'Orientation', options: ['portrait', 'landscape', 'Auto-Detect'], default: 'portrait' },
      { id: 'margin', type: 'select', label: 'Page Margins', options: ['0mm (Borderless)', '8mm (Tight)', '15mm (Standard)', '25mm (Wide)'], default: '15mm (Standard)' },
      { id: 'compressPdf', type: 'checkbox', label: 'Compress Embedded Images', default: true }
    ]
  },

  // ═══════════════════════════════════════════════
  // DOCUMENTS & MARKDOWN
  // ═══════════════════════════════════════════════
  {
    id: 'docx-to-pdf',
    name: 'Convert Word to PDF',
    category: 'documents',
    icon: '📄',
    description: 'Convert Microsoft Word (.docx, .doc) files directly into clean, vector PDF documents.',
    inputFormats: ['.docx', '.doc'],
    inputAccept: '.docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword',
    outputFormat: '.pdf',
    isFree: true,
    engine: 'doc',
    presets: [
      { label: '💼 Professional Executive', settings: { theme: 'executive', format: 'a4', orientation: 'portrait', margin: '15mm' } },
      { label: '🎓 Academic Paper', settings: { theme: 'academic', format: 'a4', orientation: 'portrait', margin: '20mm' } }
    ],
    settings: [
      { id: 'theme', type: 'select', label: 'Document Theme', options: ['github', 'super-modern', 'academic', 'executive', 'midnight'], default: 'github' },
      { id: 'format', type: 'select', label: 'Paper Size', options: ['a4', 'letter', 'legal'], default: 'a4' },
      { id: 'orientation', type: 'select', label: 'Orientation', options: ['portrait', 'landscape'], default: 'portrait' },
      { id: 'margin', type: 'select', label: 'Margins', options: ['8mm', '15mm', '20mm', '25mm'], default: '15mm' },
      { id: 'addPageNumbers', type: 'checkbox', label: 'Add Page Numbers in Footer', default: true }
    ]
  },
  {
    id: 'pdf-to-docx',
    name: 'Convert PDF to Word',
    category: 'documents',
    icon: '📑',
    description: 'Convert PDF documents into editable Microsoft Word (.docx) files preserving text and headings.',
    inputFormats: ['.pdf'],
    inputAccept: '.pdf,application/pdf',
    outputFormat: '.docx',
    isFree: true,
    engine: 'doc',
    presets: [
      { label: '📝 Clean Editable Word', settings: { font: 'Calibri', fontSize: '11pt', detectParagraphs: true } },
      { label: '🏛️ Formal Academic (Times)', settings: { font: 'Times New Roman', fontSize: '12pt', detectParagraphs: true } }
    ],
    settings: [
      { id: 'extractMode', type: 'select', label: 'Extraction Mode', options: ['Formatted Flowable Text', 'Raw Unformatted Lines', 'Table Structured'], default: 'Formatted Flowable Text' },
      { id: 'font', type: 'select', label: 'Default Word Font', options: ['Calibri', 'Times New Roman', 'Arial', 'Georgia'], default: 'Calibri' },
      { id: 'fontSize', type: 'select', label: 'Base Font Size', options: ['10pt', '11pt', '12pt'], default: '11pt' },
      { id: 'detectParagraphs', type: 'checkbox', label: 'Auto-Merge Broken Lines into Paragraphs', default: true },
      { id: 'includePageBreaks', type: 'checkbox', label: 'Preserve Page Breaks', default: true }
    ]
  },
  {
    id: 'md-to-pdf',
    name: 'Convert Markdown to PDF',
    category: 'documents',
    icon: '📝',
    description: 'Convert Markdown, Word (.docx), HTML pages, or Plain Text into vector PDFs with built-in templates.',
    inputFormats: ['.md', '.docx', '.html', '.txt'],
    inputAccept: '.md,.markdown,.docx,.doc,.html,.htm,.txt',
    outputFormat: '.pdf',
    isFree: true,
    isStudio: true,
    engine: 'studio',
    presets: [
      { label: '💻 Modern Tech Document', settings: { theme: 'super-modern', format: 'a4', fontSize: '11pt' } },
      { label: '🎓 Academic Report', settings: { theme: 'academic', format: 'a4', fontSize: '12pt' } }
    ],
    settings: [
      { id: 'theme', type: 'select', label: 'Styling Theme', options: ['github', 'super-modern', 'academic', 'executive', 'midnight'], default: 'github' },
      { id: 'format', type: 'select', label: 'Paper Size', options: ['a4', 'letter', 'legal'], default: 'a4' },
      { id: 'orientation', type: 'select', label: 'Orientation', options: ['portrait', 'landscape'], default: 'portrait' },
      { id: 'margin', type: 'select', label: 'Margins', options: ['8mm', '15mm', '25mm'], default: '15mm' },
      { id: 'fontSize', type: 'select', label: 'Base Font Size', options: ['10pt', '11pt', '12pt', '14pt'], default: '11pt' },
      { id: 'lineSpacing', type: 'select', label: 'Line Spacing', options: ['1.4 (Compact)', '1.6 (Normal)', '1.8 (Relaxed)'], default: '1.6 (Normal)' }
    ]
  },
  {
    id: 'doc-to-docx',
    name: 'Convert Document to Word',
    category: 'documents',
    icon: '📘',
    description: 'Convert Markdown and HTML documents into editable Microsoft Word (.docx) files.',
    inputFormats: ['.md', '.html', '.txt'],
    inputAccept: '.md,.markdown,.html,.htm,.txt,text/*',
    outputFormat: '.docx',
    isFree: true,
    engine: 'doc',
    settings: [
      { id: 'font', type: 'select', label: 'Word Font', options: ['Calibri', 'Times New Roman', 'Arial', 'Georgia'], default: 'Calibri' },
      { id: 'fontSize', type: 'select', label: 'Base Font Size', options: ['10pt', '11pt', '12pt'], default: '11pt' },
      { id: 'formatHeadings', type: 'checkbox', label: 'Apply Formal Heading Styles (H1-H4)', default: true },
      { id: 'convertTables', type: 'checkbox', label: 'Convert Tables to Word Grid Tables', default: true }
    ]
  },
  {
    id: 'pdf-to-text',
    name: 'Convert PDF to Text',
    category: 'documents',
    icon: '📄',
    description: 'Extract raw text, sentences, and structure from PDF documents without formatting.',
    inputFormats: ['.pdf'],
    inputAccept: '.pdf,application/pdf',
    outputFormat: '.txt',
    isFree: true,
    engine: 'doc',
    settings: [
      { id: 'extractFormat', type: 'select', label: 'Output Format', options: ['Clean Text (.txt)', 'Markdown (.md)', 'JSON Lines (by Page)'], default: 'Clean Text (.txt)' },
      { id: 'preserveLineBreaks', type: 'checkbox', label: 'Preserve Strict Line Breaks', default: false },
      { id: 'includePageDividers', type: 'checkbox', label: 'Include Page Divider Markers', default: true },
      { id: 'trimWhitespace', type: 'checkbox', label: 'Trim Extraneous Whitespace', default: true }
    ]
  },
  {
    id: 'doc-to-pptx',
    name: 'Convert Document to PowerPoint',
    category: 'documents',
    icon: '📊',
    description: 'Generate formatted PowerPoint slides (.pptx) automatically from document sections and headings.',
    inputFormats: ['.md', '.txt', '.pdf', '.docx'],
    inputAccept: '.md,.markdown,.txt,.pdf,.docx',
    outputFormat: '.pptx',
    isFree: true,
    engine: 'doc',
    settings: [
      { id: 'slideTheme', type: 'select', label: 'Presentation Theme', options: ['Modern Dark Minimal', 'Clean Executive White', 'Tech Indigo Gradient', 'Emerald Nature'], default: 'Modern Dark Minimal' },
      { id: 'aspectRatio', type: 'select', label: 'Slide Ratio', options: ['16:9 (Widescreen HD)', '4:3 (Standard)'], default: '16:9 (Widescreen HD)' },
      { id: 'bulletsPerSlide', type: 'select', label: 'Content Density', options: ['3-4 Key Takeaways', '5-6 Detailed Points', 'Full Text Paragraphs'], default: '3-4 Key Takeaways' },
      { id: 'addSlideNumbers', type: 'checkbox', label: 'Show Slide Numbers', default: true }
    ]
  },
  {
    id: 'doc-to-xlsx',
    name: 'Convert Document to Excel',
    category: 'documents',
    icon: '📈',
    description: 'Extract tables and structured lists from documents into Excel (.xlsx) workbooks.',
    inputFormats: ['.md', '.txt', '.pdf', '.docx', '.csv'],
    inputAccept: '.md,.markdown,.txt,.pdf,.docx,.csv',
    outputFormat: '.xlsx',
    isFree: true,
    engine: 'doc',
    settings: [
      { id: 'splitStrategy', type: 'select', label: 'Workbook Structure', options: ['Tables into Separate Worksheets', 'All Data on Single Sheet', 'Text Blocks as Rows'], default: 'Tables into Separate Worksheets' },
      { id: 'sheetName', type: 'text', label: 'Primary Sheet Name', default: 'Data' },
      { id: 'autoFitColumns', type: 'checkbox', label: 'Auto-Fit Column Widths', default: true },
      { id: 'freezeHeader', type: 'checkbox', label: 'Freeze Header Row', default: true }
    ]
  },
  {
    id: 'text-to-md',
    name: 'Convert Text to Markdown',
    category: 'documents',
    icon: '📝',
    description: 'Format unorganized plain text into structured Markdown with auto-detected headings, lists, and tables.',
    inputFormats: ['.txt', 'Pasted Text'],
    inputAccept: '.txt,text/plain,*',
    outputFormat: '.md',
    isFree: true,
    engine: 'doc',
    hasTextInput: true,
    settings: [
      { id: 'detectHeadings', type: 'checkbox', label: 'Auto-Detect Headings (#, ##)', default: true },
      { id: 'detectTables', type: 'checkbox', label: 'Auto-Convert Tabular Data to Tables', default: true },
      { id: 'linkify', type: 'checkbox', label: 'Auto-Link URLs', default: true },
      { id: 'bulletStyle', type: 'select', label: 'List Bullet Character', options: ['- Dash', '* Asterisk', '+ Plus'], default: '- Dash' },
      { id: 'codeBlockLanguage', type: 'select', label: 'Code Block Language', options: ['Auto-Detect', 'Plaintext', 'Bash/Shell', 'JSON', 'JavaScript'], default: 'Auto-Detect' }
    ]
  },
  {
    id: 'text-to-latex',
    name: 'Convert Text to LaTeX (Overleaf)',
    category: 'documents',
    icon: '📜',
    description: 'Transform plain text, notes, or Markdown into complete, compilable LaTeX code formatted for Overleaf with 1-click ZIP export.',
    inputFormats: ['.txt', '.md', 'Plain Text', 'Markdown'],
    inputAccept: '.txt,.md,.markdown,text/plain,*',
    outputFormat: '.tex',
    isFree: true,
    engine: 'latex',
    hasTextInput: true,
    presets: [
      { label: '🎓 Academic Paper', settings: { documentClass: 'article', fontSize: '11pt', paperSize: 'a4paper', margin: '1in' } },
      { label: '🔬 IEEE Journal', settings: { documentClass: 'IEEEtran', fontSize: '10pt', paperSize: 'letterpaper', margin: '0.75in', twoColumn: true } },
      { label: '📚 Thesis / Book', settings: { documentClass: 'report', fontSize: '12pt', paperSize: 'a4paper', margin: '1in' } }
    ],
    settings: [
      {
        id: 'documentClass',
        type: 'select',
        label: 'Document Template',
        options: [
          { value: 'article', label: '📄 Academic Research Paper (article)' },
          { value: 'IEEEtran', label: '🔬 IEEE Conference / Journal (IEEEtran)' },
          { value: 'report', label: '📚 University Thesis & Dissertation (report)' },
          { value: 'beamer', label: '📊 Modern Presentation Deck (beamer 16:9)' },
          { value: 'cv', label: '💼 Modern Academic & Executive CV' },
          { value: 'assignment', label: '📝 Math & Physics Assignment (homework)' },
          { value: 'executive', label: '🏢 Executive Briefing & Whitepaper' },
          { value: 'minimal', label: '⚡ Minimal Clean Article (minimal)' }
        ],
        default: 'article'
      },
      { id: 'fontSize', type: 'select', label: 'Font Size', options: ['10pt', '11pt', '12pt'], default: '11pt' },
      { id: 'paperSize', type: 'select', label: 'Paper Size', options: ['a4paper', 'letterpaper'], default: 'a4paper' },
      { id: 'margin', type: 'select', label: 'Margin', options: ['1in', '0.75in', '0.5in'], default: '1in' },
      { id: 'includeMath', type: 'checkbox', label: 'Include Math Packages (amsmath, amssymb)', default: true },
      { id: 'includeCodeListings', type: 'checkbox', label: 'Include Code Syntax Highlighting (listings)', default: true },
      { id: 'includeBooktabs', type: 'checkbox', label: 'Include Professional Tables (booktabs)', default: true },
      { id: 'twoColumn', type: 'checkbox', label: 'Two-Column Mode', default: false }
    ]
  },
  {
    id: 'file-to-latex',
    name: 'Convert File to LaTeX (Word, MD to .tex)',
    category: 'documents',
    icon: '📄',
    description: 'Convert Microsoft Word (.docx), Markdown (.md), or text files directly into clean LaTeX documents for Overleaf.',
    inputFormats: ['.docx', '.md', '.txt', '.doc'],
    inputAccept: '.docx,.doc,.md,.markdown,.txt,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    outputFormat: '.tex',
    isFree: true,
    engine: 'latex',
    presets: [
      { label: '🎓 Academic Paper', settings: { documentClass: 'article', fontSize: '11pt', paperSize: 'a4paper', margin: '1in' } },
      { label: '🔬 IEEE Journal', settings: { documentClass: 'IEEEtran', fontSize: '10pt', paperSize: 'letterpaper', margin: '0.75in', twoColumn: true } }
    ],
    settings: [
      {
        id: 'documentClass',
        type: 'select',
        label: 'Document Template',
        options: [
          { value: 'article', label: '📄 Academic Research Paper (article)' },
          { value: 'IEEEtran', label: '🔬 IEEE Conference / Journal (IEEEtran)' },
          { value: 'report', label: '📚 University Thesis & Dissertation (report)' },
          { value: 'beamer', label: '📊 Modern Presentation Deck (beamer 16:9)' },
          { value: 'cv', label: '💼 Modern Academic & Executive CV' },
          { value: 'assignment', label: '📝 Math & Physics Assignment (homework)' },
          { value: 'executive', label: '🏢 Executive Briefing & Whitepaper' },
          { value: 'minimal', label: '⚡ Minimal Clean Article (minimal)' }
        ],
        default: 'article'
      },
      { id: 'fontSize', type: 'select', label: 'Font Size', options: ['10pt', '11pt', '12pt'], default: '11pt' },
      { id: 'paperSize', type: 'select', label: 'Paper Size', options: ['a4paper', 'letterpaper'], default: 'a4paper' },
      { id: 'margin', type: 'select', label: 'Margin', options: ['1in', '0.75in', '0.5in'], default: '1in' },
      { id: 'includeMath', type: 'checkbox', label: 'Include Math Packages (amsmath, amssymb)', default: true },
      { id: 'includeCodeListings', type: 'checkbox', label: 'Include Code Syntax Highlighting (listings)', default: true },
      { id: 'includeBooktabs', type: 'checkbox', label: 'Include Professional Tables (booktabs)', default: true },
      { id: 'twoColumn', type: 'checkbox', label: 'Two-Column Mode', default: false }
    ]
  },
  {
    id: 'latex-to-pdf',
    name: 'Convert LaTeX to PDF (.tex to PDF)',
    category: 'documents',
    icon: '📕',
    description: 'Compile LaTeX source files (.tex) or pasted math documents directly into publication-quality PDF with full KaTeX math equations, theorems, and tables.',
    inputFormats: ['.tex', '.latex', 'LaTeX Code', '.txt'],
    inputAccept: '.tex,.latex,.txt,text/plain,*',
    outputFormat: '.pdf',
    isFree: true,
    engine: 'latex',
    hasTextInput: true,
    presets: [
      { label: '🎓 Academic Classic', settings: { theme: 'academic', paperSize: 'a4', fontSize: '11pt', margin: '15mm' } },
      { label: '💻 Modern Tech', settings: { theme: 'github', paperSize: 'a4', fontSize: '11pt', margin: '15mm' } }
    ],
    settings: [
      {
        id: 'theme',
        type: 'select',
        label: 'Document Styling',
        options: [
          { value: 'academic', label: '🎓 Academic Journal (Serif, Classic)' },
          { value: 'github', label: '💻 Modern Tech (GitHub Clean)' },
          { value: 'formal', label: '🏛️ Formal Executive (Times, Elegant)' },
          { value: 'minimal', label: '⚡ Minimalist (Clean Sans)' }
        ],
        default: 'academic'
      },
      { id: 'paperSize', type: 'select', label: 'Paper Size', options: ['a4', 'letter'], default: 'a4' },
      { id: 'fontSize', type: 'select', label: 'Font Size', options: ['10pt', '11pt', '12pt'], default: '11pt' },
      { id: 'margin', type: 'select', label: 'Margins', options: ['15mm', '20mm', '25mm'], default: '15mm' },
      { id: 'showLineNumbers', type: 'checkbox', label: 'Show Code Line Numbers', default: false }
    ]
  },
  {
    id: 'latex-to-docx',
    name: 'Convert LaTeX to Word (.tex to DOCX)',
    category: 'documents',
    icon: '📘',
    description: 'Convert LaTeX files (.tex) and mathematical papers into fully editable Microsoft Word (.docx) documents with headings, lists, tables, and formatted equations.',
    inputFormats: ['.tex', '.latex', 'LaTeX Code', '.txt'],
    inputAccept: '.tex,.latex,.txt,text/plain,*',
    outputFormat: '.docx',
    isFree: true,
    engine: 'latex',
    hasTextInput: true,
    settings: [
      { id: 'font', type: 'select', label: 'Word Font', options: ['Calibri', 'Times New Roman', 'Arial', 'Georgia'], default: 'Calibri' },
      { id: 'fontSize', type: 'select', label: 'Base Font Size', options: ['11pt', '12pt', '10pt'], default: '11pt' },
      { id: 'includeMath', type: 'checkbox', label: 'Preserve Math Equations', default: true },
      { id: 'tableBorders', type: 'checkbox', label: 'Format Grid Table Borders', default: true }
    ]
  },

  // ═══════════════════════════════════════════════
  // IMAGE TOOLS & OPTIMIZATION
  // ═══════════════════════════════════════════════
  {
    id: 'image-compress',
    name: 'Compress Image',
    category: 'images',
    icon: '🗜️',
    description: 'Compress JPG, PNG, and WebP to target size templates (100KB, 250KB, 500KB) preserving original format.',
    inputFormats: ['.jpg', '.png', '.webp'],
    inputAccept: 'image/jpeg,image/png,image/webp',
    outputFormat: 'Same Format (.jpg / .png / .webp)',
    isFree: true,
    engine: 'image',
    presets: [
      { label: '🗜️ Max Compression (<100KB)', settings: { sizePreset: '< 100 KB (Thumbnail/Web)', quality: 60 } },
      { label: '📧 Email Ready (<500KB)', settings: { sizePreset: '< 500 KB (Standard)', quality: 80 } },
      { label: '💎 High Quality (<1MB)', settings: { sizePreset: '< 1 MB (High Quality)', quality: 90 } }
    ],
    settings: [
      { id: 'sizePreset', type: 'select', label: 'Target Size Preset', options: ['Auto (Quality Slider)', '< 100 KB (Thumbnail/Web)', '< 250 KB (Upload/Email)', '< 500 KB (Standard)', '< 1 MB (High Quality)', '< 2 MB (Max Cap)', 'Custom Target (KB)'], default: 'Auto (Quality Slider)' },
      { id: 'customKb', type: 'number', label: 'Custom Target (KB)', default: 250 },
      { id: 'quality', type: 'range', label: 'Quality', min: 10, max: 100, default: 75, unit: '%' },
      { id: 'scale', type: 'select', label: 'Downscale Resolution', options: ['100% (Keep Resolution)', '75% (Scale 75%)', '50% (Half Dimensions)', '25% (Quarter Dimensions)'], default: '100% (Keep Resolution)' },
      { id: 'stripMetadata', type: 'checkbox', label: 'Strip Metadata (EXIF & GPS)', default: true }
    ]
  },
  {
    id: 'image-compress-convert',
    name: 'Compress & Convert Format',
    category: 'images',
    icon: '⚡',
    description: 'Simultaneously change image format (.webp, .jpg, .png, .gif, .tiff, .avif, .ico, .bmp, .svg) and compress to target file size.',
    inputFormats: ['.png', '.jpg', '.webp', '.bmp', '.svg', '.gif', '.tiff', '.avif'],
    inputAccept: 'image/*',
    outputFormat: '.webp / .jpg / .png / .gif / .tiff / .avif / .ico / .bmp / .svg',
    isFree: true,
    engine: 'image',
    presets: [
      { label: '⚡ Ultra WebP (<250KB)', settings: { targetFormat: '.webp', sizePreset: '< 250 KB (Upload/Email)', quality: 80 } },
      { label: '🖼️ High-Res PNG (Lossless)', settings: { targetFormat: '.png', sizePreset: 'Auto (Quality Slider)', quality: 95 } }
    ],
    settings: [
      { id: 'targetFormat', type: 'select', label: 'Output Format', options: ['.webp', '.jpg', '.png', '.gif', '.tiff', '.avif', '.ico', '.bmp', '.svg'], default: '.webp' },
      { id: 'sizePreset', type: 'select', label: 'Target Size Preset', options: ['Auto (Quality Slider)', '< 100 KB (Thumbnail/Web)', '< 250 KB (Upload/Email)', '< 500 KB (Standard)', '< 1 MB (High Quality)', '< 2 MB (Max Cap)', 'Custom Target (KB)'], default: 'Auto (Quality Slider)' },
      { id: 'customKb', type: 'number', label: 'Custom Target (KB)', default: 250 },
      { id: 'quality', type: 'range', label: 'Quality', min: 10, max: 100, default: 80, unit: '%' },
      { id: 'scale', type: 'select', label: 'Resolution Scale', options: ['100% (Preserve)', '75%', '50%', '25%'], default: '100% (Preserve)' },
      { id: 'bgColor', type: 'color', label: 'Background Fill (No Alpha)', default: '#ffffff' }
    ]
  },
  {
    id: 'image-resize',
    name: 'Resize Image',
    category: 'images',
    icon: '📐',
    description: 'Scale images to exact dimensions or crop to standard aspect ratios (16:9, 1:1, 4:3).',
    inputFormats: ['.jpg', '.png', '.webp'],
    inputAccept: 'image/jpeg,image/png,image/webp',
    outputFormat: 'Resized Image',
    isFree: true,
    engine: 'image',
    presets: [
      { label: '🖥️ 1080p FHD (1920x1080)', settings: { width: 1920, height: 1080, cropRatio: '16:9', maintainAspect: true } },
      { label: '📱 Instagram Square (1080x1080)', settings: { width: 1080, height: 1080, cropRatio: '1:1', maintainAspect: true } },
      { label: '🖼️ 720p HD (1280x720)', settings: { width: 1280, height: 720, cropRatio: '16:9', maintainAspect: true } }
    ],
    settings: [
      { id: 'width', type: 'number', label: 'Target Width (px)', default: 800 },
      { id: 'height', type: 'number', label: 'Target Height (px)', default: 600 },
      { id: 'maintainAspect', type: 'checkbox', label: 'Maintain Aspect Ratio', default: true },
      { id: 'cropRatio', type: 'select', label: 'Crop Preset', options: ['Free', '1:1', '4:3', '16:9', '3:2', '9:16'], default: 'Free' },
      { id: 'resampleFilter', type: 'select', label: 'Resampling Quality', options: ['High Quality (Bicubic)', 'Smooth (Bilinear)', 'Pixelated (Nearest Neighbor)'], default: 'High Quality (Bicubic)' }
    ]
  },
  {
    id: 'image-effects',
    name: 'Add Watermark to Image',
    category: 'images',
    icon: '🎨',
    description: 'Apply monochrome grayscale filters or stamp custom text copyright watermarks.',
    inputFormats: ['.jpg', '.png', '.webp'],
    inputAccept: 'image/jpeg,image/png,image/webp',
    outputFormat: 'Watermarked Image',
    isFree: true,
    engine: 'image',
    presets: [
      { label: '🔒 Confidential Cross Stamp', settings: { effect: 'Watermark', watermarkText: 'CONFIDENTIAL', watermarkDegree: 'Cross (-45°)', opacity: '25%' } },
      { label: '⊞ Full Page Tiled Watermark', settings: { effect: 'Watermark', watermarkText: 'COPYRIGHT PROTECTED', watermarkRepeat: 'Repeat Tiled Pattern', opacity: '15%' } },
      { label: '🖤 B&W Monochrome', settings: { effect: 'Grayscale' } }
    ],
    settings: [
      { id: 'effect', type: 'select', label: 'Effect Mode', options: ['Watermark', 'Grayscale', 'Sepia', 'High Contrast', 'Invert'], default: 'Watermark' },
      { id: 'watermarkText', type: 'text', label: 'Watermark Text', default: 'CONFIDENTIAL' },
      { id: 'watermarkSize', type: 'range', label: 'Watermark Size', min: 20, max: 120, default: 50, unit: 'px' },
      { id: 'watermarkDegree', type: 'select', label: 'Degree / Orientation', options: ['Cross (-45°)', 'Straight (0°)', 'Subtle (-30°)', 'Vertical (-90°)'], default: 'Cross (-45°)' },
      { id: 'watermarkRepeat', type: 'select', label: 'Layout / Repeat', options: ['Single Center', 'Repeat Tiled Pattern'], default: 'Single Center' },
      { id: 'opacity', type: 'select', label: 'Opacity', options: ['8%', '15%', '25%', '40%', '60%'], default: '25%' },
      { id: 'watermarkColor', type: 'color', label: 'Watermark Color', default: '#000000' }
    ]
  },

  // ═══════════════════════════════════════════════
  // VIDEO TOOLS
  // ═══════════════════════════════════════════════
  {
    id: 'video-to-mp3',
    name: 'Extract MP3 Audio from Video',
    category: 'video',
    icon: '🎵',
    description: 'Extract crystal-clear MP3 sound directly from MP4, MOV, WebM, AVI, and MKV video files.',
    inputFormats: ['.mp4', '.mov', '.webm', '.avi', '.mkv'],
    inputAccept: 'video/*',
    outputFormat: '.mp3',
    isFree: true,
    engine: 'media',
    presets: [
      { label: '🎵 Studio Quality (320 kbps)', settings: { bitrate: '320 kbps (Maximum Quality)', channels: 'Stereo (2 Channels)', sampleRate: '48000 Hz (Video Standard)' } },
      { label: '🎙️ Voice / Podcast (128 kbps)', settings: { bitrate: '128 kbps (Voice / Low Size)', channels: 'Mono (1 Channel)', sampleRate: '44100 Hz (CD Audio)' } }
    ],
    settings: [
      { id: 'bitrate', type: 'select', label: 'Audio Bitrate', options: ['320 kbps (Maximum Quality)', '256 kbps (High Quality)', '192 kbps (Standard)', '128 kbps (Voice / Low Size)'], default: '256 kbps (High Quality)' },
      { id: 'channels', type: 'select', label: 'Channel Mode', options: ['Stereo (2 Channels)', 'Mono (1 Channel)'], default: 'Stereo (2 Channels)' },
      { id: 'sampleRate', type: 'select', label: 'Sample Rate', options: ['48000 Hz (Video Standard)', '44100 Hz (CD Audio)', '96000 Hz (Hi-Res)'], default: '48000 Hz (Video Standard)' },
      { id: 'normalizeVolume', type: 'checkbox', label: 'Normalize Peak Volume', default: true }
    ]
  },
  {
    id: 'video-to-wav',
    name: 'Extract WAV Audio from Video',
    category: 'video',
    icon: '🎼',
    description: 'Extract lossless 16-bit PCM RIFF WAV audio track from video files.',
    inputFormats: ['.mp4', '.mov', '.webm', '.avi', '.mkv'],
    inputAccept: 'video/*',
    outputFormat: '.wav',
    isFree: true,
    engine: 'media',
    presets: [
      { label: '🎼 Studio 24-bit / 48 kHz', settings: { bitDepth: '24-bit PCM (Studio Audio)', sampleRate: '48000 Hz (Broadcast)', channels: 'Stereo (2 Channels)' } },
      { label: '💿 Standard 16-bit / 44.1 kHz', settings: { bitDepth: '16-bit PCM (CD Standard)', sampleRate: '44100 Hz (Standard)', channels: 'Stereo (2 Channels)' } }
    ],
    settings: [
      { id: 'bitDepth', type: 'select', label: 'Bit Depth', options: ['16-bit PCM (CD Standard)', '24-bit PCM (Studio Audio)', '32-bit Float'], default: '16-bit PCM (CD Standard)' },
      { id: 'sampleRate', type: 'select', label: 'Sample Rate', options: ['48000 Hz (Broadcast)', '44100 Hz (Standard)', '96000 Hz (Hi-Res)'], default: '48000 Hz (Broadcast)' },
      { id: 'channels', type: 'select', label: 'Channel Mode', options: ['Stereo (2 Channels)', 'Mono (1 Channel)'], default: 'Stereo (2 Channels)' }
    ]
  },
  {
    id: 'video-to-gif',
    name: 'Convert Video to Animated GIF',
    category: 'video',
    icon: '🎞️',
    description: 'Convert MP4 or WebM video clips into animated GIFs for Discord, Slack, and web embedding.',
    inputFormats: ['.mp4', '.webm', '.mov', '.avi', '.mkv'],
    inputAccept: 'video/*',
    outputFormat: '.gif',
    isFree: true,
    engine: 'media',
    presets: [
      { label: '⚡ Discord/Slack Optimized (360p, 10fps)', settings: { resolution: '360p Small (Discord / Slack)', fps: '10 fps', duration: 4 } },
      { label: '🎞️ Smooth HD (720p, 15fps)', settings: { resolution: '720p HD', fps: '15 fps', duration: 3 } }
    ],
    settings: [
      { id: 'duration', type: 'range', label: 'Max Duration (seconds)', min: 1, max: 15, default: 4, unit: 's' },
      { id: 'fps', type: 'select', label: 'Frame Rate (FPS)', options: ['5 fps', '10 fps', '15 fps', '24 fps'], default: '10 fps' },
      { id: 'resolution', type: 'select', label: 'GIF Resolution', options: ['Original (100%)', '720p HD', '480p Medium', '360p Small (Discord / Slack)'], default: '480p Medium' },
      { id: 'loop', type: 'checkbox', label: 'Loop Infinitely', default: true }
    ]
  },
  {
    id: 'mp4-to-webm',
    name: 'Convert MP4 to WEBM',
    category: 'video',
    icon: '🎬',
    description: 'Convert MP4 or MOV video files into lightweight, royalty-free WebM container.',
    inputFormats: ['.mp4', '.mov'],
    inputAccept: 'video/mp4,video/quicktime',
    outputFormat: '.webm',
    isFree: true,
    engine: 'media',
    settings: [
      { id: 'videoQuality', type: 'select', label: 'WebM Compression Quality', options: ['High Quality (Near Lossless)', 'Balanced (Recommended)', 'Web Fast (Ultra Compact)'], default: 'Balanced (Recommended)' },
      { id: 'resolution', type: 'select', label: 'Resolution Scale', options: ['Match Source (100%)', '1080p FHD', '720p HD', '480p SD'], default: 'Match Source (100%)' },
      { id: 'preserveAudio', type: 'checkbox', label: 'Preserve Audio Track', default: true }
    ]
  },
  {
    id: 'video-convert',
    name: 'Universal Video Converter',
    category: 'video',
    icon: '📹',
    description: 'Convert video container formats across MP4, WebM, MOV, AVI, and MKV with browser sandboxing.',
    inputFormats: ['.mp4', '.mov', '.webm', '.avi', '.mkv'],
    inputAccept: 'video/*',
    outputFormat: '.mp4 / .webm / .mov / .avi / .mkv',
    isFree: true,
    engine: 'media',
    settings: [
      { id: 'targetFormat', type: 'select', label: 'Target Video Container', options: ['.mp4', '.webm', '.mov', '.avi', '.mkv'], default: '.mp4' },
      { id: 'videoQuality', type: 'select', label: 'Video Profile', options: ['High Quality (Near Lossless)', 'Balanced (Recommended)', 'Compact File Size'], default: 'Balanced (Recommended)' },
      { id: 'resolution', type: 'select', label: 'Resolution', options: ['Preserve Original', '1080p Full HD', '720p HD', '480p SD'], default: 'Preserve Original' },
      { id: 'speedPreset', type: 'select', label: 'Processing Speed', options: ['Standard (Balanced)', 'Fast (Instant Packaging)', 'Deep Quality'], default: 'Standard (Balanced)' }
    ]
  },

  // ═══════════════════════════════════════════════
  // AUDIO TOOLS
  // ═══════════════════════════════════════════════
  {
    id: 'mp3-to-wav',
    name: 'Convert MP3 to WAV',
    category: 'audio',
    icon: '🔊',
    description: 'Decode compressed MP3 files into lossless, studio-grade 16-bit PCM RIFF WAV audio.',
    inputFormats: ['.mp3'],
    inputAccept: 'audio/mp3,audio/mpeg',
    outputFormat: '.wav',
    isFree: true,
    engine: 'media',
    presets: [
      { label: '💿 16-bit / 44.1 kHz (CD Standard)', settings: { bitDepth: '16-bit PCM (Standard)', sampleRate: '44100 Hz (CD Standard)' } },
      { label: '🎼 24-bit / 48 kHz (Studio Audio)', settings: { bitDepth: '24-bit PCM (Studio Audio)', sampleRate: '48000 Hz (Studio Audio)' } }
    ],
    settings: [
      { id: 'sampleRate', type: 'select', label: 'Sample Rate', options: ['44100 Hz (CD Standard)', '48000 Hz (Studio Audio)', '96000 Hz (Hi-Res)'], default: '44100 Hz (CD Standard)' },
      { id: 'bitDepth', type: 'select', label: 'Bit Depth', options: ['16-bit PCM (Standard)', '24-bit PCM (Studio Audio)', '32-bit Float'], default: '16-bit PCM (Standard)' },
      { id: 'channels', type: 'select', label: 'Channels', options: ['Stereo (2 Channels)', 'Mono (Downmix)'], default: 'Stereo (2 Channels)' },
      { id: 'normalize', type: 'checkbox', label: 'Normalize Peak Audio Levels', default: false }
    ]
  },
  {
    id: 'wav-to-mp3',
    name: 'Convert WAV to MP3',
    category: 'audio',
    icon: '🎧',
    description: 'Convert uncompressed WAV audio into compact, universal MP3 format.',
    inputFormats: ['.wav'],
    inputAccept: 'audio/wav',
    outputFormat: '.mp3',
    isFree: true,
    engine: 'media',
    presets: [
      { label: '💎 Studio Master (320 kbps)', settings: { bitrate: '320 kbps (Maximum Quality)', sampleRate: '44100 Hz (CD Quality)' } },
      { label: '⚡ Standard Web (192 kbps)', settings: { bitrate: '192 kbps (Standard Balanced)', sampleRate: '44100 Hz (CD Quality)' } }
    ],
    settings: [
      { id: 'bitrate', type: 'select', label: 'MP3 Bitrate', options: ['320 kbps (Maximum Quality)', '256 kbps (High Quality)', '192 kbps (Standard Balanced)', '128 kbps (Voice / Low Size)'], default: '320 kbps (Maximum Quality)' },
      { id: 'sampleRate', type: 'select', label: 'Sample Rate', options: ['44100 Hz (CD Quality)', '48000 Hz (Studio)', '32000 Hz (Voice)'], default: '44100 Hz (CD Quality)' },
      { id: 'channels', type: 'select', label: 'Channels', options: ['Stereo', 'Joint Stereo', 'Mono'], default: 'Stereo' }
    ]
  },
  {
    id: 'audio-to-ogg',
    name: 'Convert Audio to OGG',
    category: 'audio',
    icon: '🎶',
    description: 'Convert sound files into open OGG Vorbis audio for web streaming and gaming.',
    inputFormats: ['.mp3', '.wav', '.flac', '.m4a', '.aac'],
    inputAccept: 'audio/*',
    outputFormat: '.ogg',
    isFree: true,
    engine: 'media',
    settings: [
      { id: 'quality', type: 'range', label: 'Vorbis Quality (q0-q10)', min: 1, max: 10, default: 7, unit: '/10' },
      { id: 'sampleRate', type: 'select', label: 'Sample Rate', options: ['48000 Hz (Recommended)', '44100 Hz', '22050 Hz'], default: '48000 Hz (Recommended)' },
      { id: 'channels', type: 'select', label: 'Channels', options: ['Stereo', 'Mono'], default: 'Stereo' }
    ]
  },
  {
    id: 'audio-to-flac',
    name: 'Convert Audio to FLAC',
    category: 'audio',
    icon: '💿',
    description: 'Convert audio into lossless FLAC stream preserving acoustic fidelity.',
    inputFormats: ['.mp3', '.wav', '.ogg', '.m4a'],
    inputAccept: 'audio/*',
    outputFormat: '.flac',
    isFree: true,
    engine: 'media',
    settings: [
      { id: 'compressionLevel', type: 'select', label: 'FLAC Compression Level', options: ['Level 5 (Default Balanced)', 'Level 8 (Maximum Compression)', 'Level 0 (Fastest)'], default: 'Level 5 (Default Balanced)' },
      { id: 'bitDepth', type: 'select', label: 'Lossless Bit Depth', options: ['16-bit Lossless', '24-bit Studio Lossless'], default: '16-bit Lossless' },
      { id: 'sampleRate', type: 'select', label: 'Sample Rate', options: ['Original Source Rate', '44100 Hz', '48000 Hz', '96000 Hz'], default: 'Original Source Rate' }
    ]
  },
  {
    id: 'audio-convert',
    name: 'Universal Audio Converter',
    category: 'audio',
    icon: '📻',
    description: 'Transcode audio formats across MP3, WAV, OGG, AAC, M4A, and FLAC client-side.',
    inputFormats: ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac'],
    inputAccept: 'audio/*',
    outputFormat: '.mp3 / .wav / .ogg / .aac / .m4a / .flac',
    isFree: true,
    engine: 'media',
    settings: [
      { id: 'targetFormat', type: 'select', label: 'Target Audio Format', options: ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac'], default: '.mp3' },
      { id: 'qualityPreset', type: 'select', label: 'Quality Profile', options: ['High Quality (256-320 kbps)', 'Standard (192 kbps)', 'Compact (128 kbps)', 'Lossless (PCM/FLAC)'], default: 'High Quality (256-320 kbps)' },
      { id: 'sampleRate', type: 'select', label: 'Sample Rate', options: ['Auto (Match Source)', '44100 Hz', '48000 Hz'], default: 'Auto (Match Source)' },
      { id: 'channels', type: 'select', label: 'Channels', options: ['Preserve Channels', 'Force Stereo', 'Force Mono'], default: 'Preserve Channels' }
    ]
  },

  // ═══════════════════════════════════════════════
  // 3D MODELS
  // ═══════════════════════════════════════════════
  {
    id: 'obj-to-stl',
    name: 'Convert OBJ to STL',
    category: '3d',
    icon: '🧊',
    description: 'Convert Wavefront OBJ 3D meshes into standard binary STL files ready for 3D printing.',
    inputFormats: ['.obj'],
    inputAccept: '.obj,model/obj,text/plain',
    outputFormat: '.stl',
    isFree: true,
    engine: '3d',
    presets: [
      { label: '🖨️ 3D Print Standard (Binary, mm)', settings: { stlFormat: 'Binary STL (Compact & Fast)', unitScale: '1.0 (Direct Unit)', centerOrigin: true } },
      { label: '📐 Architectural (Meters to mm)', settings: { stlFormat: 'Binary STL (Compact & Fast)', unitScale: '1000.0 (Meters to Millimeters)', centerOrigin: true } }
    ],
    settings: [
      { id: 'stlFormat', type: 'select', label: 'STL Output Type', options: ['Binary STL (Compact & Fast)', 'ASCII STL (Human-Readable Text)'], default: 'Binary STL (Compact & Fast)' },
      { id: 'unitScale', type: 'select', label: 'Unit Scale', options: ['1.0 (Direct Unit)', '1000.0 (Meters to Millimeters)', '0.001 (Millimeters to Meters)', '25.4 (Inches to Millimeters)'], default: '1.0 (Direct Unit)' },
      { id: 'centerOrigin', type: 'checkbox', label: 'Center Geometry at Origin (0,0,0)', default: true },
      { id: 'invertNormals', type: 'checkbox', label: 'Flip / Invert Face Normals', default: false }
    ]
  },
  {
    id: 'stl-to-obj',
    name: 'Convert STL to OBJ',
    category: '3d',
    icon: '📐',
    description: 'Convert STL meshes (ASCII or Binary) into Wavefront OBJ format with vertex normals.',
    inputFormats: ['.stl'],
    inputAccept: '.stl,model/stl',
    outputFormat: '.obj',
    isFree: true,
    engine: '3d',
    settings: [
      { id: 'includeNormals', type: 'checkbox', label: 'Generate Vertex Normals (vn lines)', default: true },
      { id: 'unitScale', type: 'select', label: 'Scale Factor', options: ['1.0 (Direct Unit)', '0.001 (Millimeters to Meters)', '1000.0 (Meters to Millimeters)', '0.03937 (Millimeters to Inches)'], default: '1.0 (Direct Unit)' },
      { id: 'centerOrigin', type: 'checkbox', label: 'Center Mesh at Origin', default: false },
      { id: 'mergeCloseVertices', type: 'checkbox', label: 'Weld Coincident Vertices (Reduce Size)', default: true }
    ]
  },
  {
    id: 'obj-to-gltf',
    name: 'Convert OBJ to GLTF',
    category: '3d',
    icon: '🌐',
    description: 'Convert OBJ models into web-standard glTF 2.0 JSON format for Three.js, Babylon, and WebXR.',
    inputFormats: ['.obj'],
    inputAccept: '.obj,model/obj,text/plain',
    outputFormat: '.gltf',
    isFree: true,
    engine: '3d',
    settings: [
      { id: 'gltfFormat', type: 'select', label: 'glTF Flavor', options: ['glTF Embedded JSON (.gltf)', 'Binary Container (.glb)'], default: 'glTF Embedded JSON (.gltf)' },
      { id: 'upAxis', type: 'select', label: 'Up Axis Orientation', options: ['Y-Up (glTF Standard)', 'Z-Up (CAD / 3ds Max)', 'X-Up'], default: 'Y-Up (glTF Standard)' },
      { id: 'unitScale', type: 'select', label: 'Scale Factor', options: ['1.0 (Direct Scale)', '0.001 (mm to meters)', '0.01 (cm to meters)', '0.0254 (inches to meters)'], default: '1.0 (Direct Scale)' },
      { id: 'embedNormals', type: 'checkbox', label: 'Embed Vertex Normal Vectors', default: true }
    ]
  },
  {
    id: '3d-convert',
    name: 'Universal 3D Model Converter',
    category: '3d',
    icon: '📦',
    description: 'Convert 3D meshes and models between OBJ, STL, GLTF, and FBX formats.',
    inputFormats: ['.obj', '.stl', '.fbx', '.gltf'],
    inputAccept: '.obj,.stl,.fbx,.gltf,model/*',
    outputFormat: '.stl / .obj / .gltf / .fbx',
    isFree: true,
    engine: '3d',
    settings: [
      { id: 'targetFormat', type: 'select', label: 'Target 3D Format', options: ['.stl', '.obj', '.gltf', '.fbx'], default: '.stl' },
      { id: 'stlFormat', type: 'select', label: 'STL Output Type', options: ['Binary STL (Compact & Fast)', 'ASCII STL (Human-Readable Text)'], default: 'Binary STL (Compact & Fast)' },
      { id: 'unitScale', type: 'select', label: 'Unit Scale', options: ['1.0 (Direct Unit)', '1000.0 (Meters to Millimeters)', '0.001 (Millimeters to Meters)', '25.4 (Inches to Millimeters)'], default: '1.0 (Direct Unit)' },
      { id: 'centerOrigin', type: 'checkbox', label: 'Center Model at Origin', default: true },
      { id: 'invertNormals', type: 'checkbox', label: 'Flip / Invert Normals', default: false }
    ]
  },

  // ═══════════════════════════════════════════════
  // DATA & SPREADSHEETS
  // ═══════════════════════════════════════════════
  {
    id: 'csv-to-json',
    name: 'Convert CSV to JSON',
    category: 'data',
    icon: '📊',
    description: 'Convert CSV and tabular data into clean, structured JSON arrays.',
    inputFormats: ['.csv'],
    inputAccept: '.csv,text/csv',
    outputFormat: '.json',
    isFree: true,
    engine: 'data',
    presets: [
      { label: '📊 Array of Objects (Standard)', settings: { jsonStructure: 'Array of Objects (Standard)', indentation: '2 Spaces (Pretty)', delimiter: ', (Comma)' } },
      { label: '⚡ Ultra-Compact Minified', settings: { jsonStructure: 'Array of Objects (Standard)', indentation: 'Compact Minified (1 Line)', delimiter: ', (Comma)' } },
      { label: '📋 Columnar Data (Object of Arrays)', settings: { jsonStructure: 'Object of Arrays (Columnar)', indentation: '2 Spaces (Pretty)', delimiter: ', (Comma)' } }
    ],
    settings: [
      { id: 'jsonStructure', type: 'select', label: 'JSON Structure', options: ['Array of Objects (Standard)', 'Object of Arrays (Columnar)', '2D Array (Rows without keys)'], default: 'Array of Objects (Standard)' },
      { id: 'delimiter', type: 'select', label: 'CSV Delimiter', options: [', (Comma)', '; (Semicolon)', '\t (Tab / TSV)', '| (Pipe)'], default: ', (Comma)' },
      { id: 'headerRow', type: 'checkbox', label: 'First Row Contains Header Keys', default: true },
      { id: 'autoParseNumbers', type: 'checkbox', label: 'Parse Numeric Strings as Numbers', default: true },
      { id: 'autoParseBooleans', type: 'checkbox', label: 'Parse "true" / "false" as Booleans', default: true },
      { id: 'indentation', type: 'select', label: 'Indentation Style', options: ['2 Spaces (Pretty)', '4 Spaces', 'Compact Minified (1 Line)'], default: '2 Spaces (Pretty)' }
    ]
  },
  {
    id: 'json-to-csv',
    name: 'Convert JSON to CSV',
    category: 'data',
    icon: '📈',
    description: 'Export JSON arrays and data records into spreadsheet-compatible CSV files.',
    inputFormats: ['.json'],
    inputAccept: '.json,application/json',
    outputFormat: '.csv',
    isFree: true,
    engine: 'data',
    presets: [
      { label: '📈 Standard CSV (Excel Friendly)', settings: { delimiter: ', (Comma)', quoteStrings: 'Only when necessary (Standard)', lineEnding: 'CRLF (Windows Excel)' } },
      { label: '🌐 Unix / Web CSV', settings: { delimiter: ', (Comma)', quoteStrings: 'Only when necessary (Standard)', lineEnding: 'LF (Unix / Web)' } }
    ],
    settings: [
      { id: 'delimiter', type: 'select', label: 'CSV Delimiter', options: [', (Comma)', '; (Semicolon)', '\t (Tab)', '| (Pipe)'], default: ', (Comma)' },
      { id: 'quoteStrings', type: 'select', label: 'Field Quoting', options: ['Only when necessary (Standard)', 'Always quote all fields', 'Never quote'], default: 'Only when necessary (Standard)' },
      { id: 'includeHeader', type: 'checkbox', label: 'Include Column Header Row', default: true },
      { id: 'lineEnding', type: 'select', label: 'Line Breaks', options: ['LF (Unix / Web)', 'CRLF (Windows Excel)'], default: 'LF (Unix / Web)' }
    ]
  },
  {
    id: 'excel-to-json',
    name: 'Convert Excel to JSON',
    category: 'data',
    icon: '📊',
    description: 'Convert Excel (.xlsx, .xls) workbooks into structured JSON data.',
    inputFormats: ['.xlsx', '.xls'],
    inputAccept: '.xlsx,.xls',
    outputFormat: '.json',
    isFree: true,
    engine: 'data',
    settings: [
      { id: 'sheetSelection', type: 'select', label: 'Sheet Selection', options: ['First Sheet Only', 'All Sheets as Keyed Object', 'Merge All Sheets into One Array'], default: 'First Sheet Only' },
      { id: 'headerRow', type: 'select', label: 'Header Row', options: ['Row 1 (Standard Headers)', 'Row 2', 'No Header (Use Columns A, B, C...)'], default: 'Row 1 (Standard Headers)' },
      { id: 'rawValues', type: 'checkbox', label: 'Output Raw Values (Formulas & Unformatted)', default: false },
      { id: 'indentation', type: 'select', label: 'JSON Formatting', options: ['2 Spaces (Pretty)', '4 Spaces', 'Compact Minified'], default: '2 Spaces (Pretty)' }
    ]
  },
  {
    id: 'excel-to-csv',
    name: 'Convert Excel to CSV',
    category: 'data',
    icon: '📈',
    description: 'Convert Excel spreadsheets into lightweight CSV files.',
    inputFormats: ['.xlsx', '.xls'],
    inputAccept: '.xlsx,.xls',
    outputFormat: '.csv',
    isFree: true,
    engine: 'data',
    settings: [
      { id: 'sheetSelection', type: 'select', label: 'Sheet to Export', options: ['First Active Sheet', 'Sheet 2', 'Sheet 3'], default: 'First Active Sheet' },
      { id: 'delimiter', type: 'select', label: 'Field Delimiter', options: [', (Comma)', '; (Semicolon)', '\t (Tab / TSV)', '| (Pipe)'], default: ', (Comma)' },
      { id: 'dateHandling', type: 'select', label: 'Date Format', options: ['Formatted String (YYYY-MM-DD)', 'Excel Serial Number', 'ISO 8601'], default: 'Formatted String (YYYY-MM-DD)' },
      { id: 'lineEnding', type: 'select', label: 'Line Breaks', options: ['LF (Unix)', 'CRLF (Windows)'], default: 'LF (Unix)' }
    ]
  },
  {
    id: 'csv-to-excel',
    name: 'Convert CSV to Excel',
    category: 'data',
    icon: '📊',
    description: 'Convert CSV files into Microsoft Excel (.xlsx) workbooks.',
    inputFormats: ['.csv'],
    inputAccept: '.csv,text/csv',
    outputFormat: '.xlsx',
    isFree: true,
    engine: 'data',
    settings: [
      { id: 'outputType', type: 'select', label: 'Excel File Type', options: ['.xlsx (Excel 2007+)', '.xls (Legacy)'], default: '.xlsx' },
      { id: 'delimiter', type: 'select', label: 'Input CSV Delimiter', options: [', (Comma)', '; (Semicolon)', '\t (Tab)', '| (Pipe)'], default: ', (Comma)' },
      { id: 'sheetName', type: 'text', label: 'Worksheet Name', default: 'Sheet1' },
      { id: 'autoFitWidth', type: 'checkbox', label: 'Auto-Fit Column Widths', default: true },
      { id: 'freezeHeader', type: 'checkbox', label: 'Freeze Header Row on Scroll', default: true }
    ]
  },
  {
    id: 'json-to-excel',
    name: 'Convert JSON to Excel',
    category: 'data',
    icon: '📈',
    description: 'Convert JSON records and arrays directly into Excel (.xlsx) workbooks.',
    inputFormats: ['.json'],
    inputAccept: '.json,application/json',
    outputFormat: '.xlsx',
    isFree: true,
    engine: 'data',
    settings: [
      { id: 'outputType', type: 'select', label: 'Spreadsheet Format', options: ['.xlsx (Excel 2007+)', '.xls (Legacy)'], default: '.xlsx' },
      { id: 'sheetName', type: 'text', label: 'Worksheet Name', default: 'Data' },
      { id: 'autoFitWidth', type: 'checkbox', label: 'Auto-Fit Column Widths', default: true },
      { id: 'tableTheme', type: 'select', label: 'Table Grid Style', options: ['Accent Blue (Header Highlights)', 'Minimalist Gray', 'Plain Grid'], default: 'Accent Blue (Header Highlights)' },
      { id: 'freezeHeader', type: 'checkbox', label: 'Freeze Header Row', default: true }
    ]
  },
  {
    id: 'json-formatter',
    name: 'Format JSON',
    category: 'data',
    icon: '🔧',
    description: 'Prettify, validate syntax, sort keys, and format JSON with custom indentation.',
    inputFormats: ['.json', '.txt'],
    inputAccept: '.json,.txt',
    outputFormat: '.json',
    isFree: true,
    engine: 'data',
    hasTextInput: true,
    presets: [
      { label: '✨ 2-Space Pretty', settings: { indent: '2 spaces', sortKeys: false } },
      { label: '📦 Compact Minified', settings: { indent: 'Compact Minified', sortKeys: false } },
      { label: '🔤 Alphabetical Sorted Keys', settings: { indent: '2 spaces', sortKeys: true } }
    ],
    settings: [
      { id: 'indent', type: 'select', label: 'Indentation', options: ['2 spaces', '4 spaces', 'Tab', 'Compact Minified'], default: '2 spaces' },
      { id: 'sortKeys', type: 'checkbox', label: 'Sort Keys Alphabetically', default: false },
      { id: 'trailingComma', type: 'select', label: 'Trailing Commas', options: ['None (Valid RFC JSON)', 'Preserve'], default: 'None (Valid RFC JSON)' },
      { id: 'unescapeUnicode', type: 'checkbox', label: 'Unescape Unicode Characters (\\u0020 → real char)', default: true }
    ]
  },

  // ═══════════════════════════════════════════════
  // CODE & DEV UTILITIES
  // ═══════════════════════════════════════════════
  {
    id: 'file-to-base64',
    name: 'Convert File to Base64',
    category: 'code',
    icon: '🔐',
    description: 'Encode files or text into Base64 string representation.',
    inputFormats: ['.txt', '.png', '.pdf', 'Any'],
    inputAccept: '*',
    outputFormat: '.txt',
    isFree: true,
    engine: 'data',
    hasTextInput: true,
    settings: [
      { id: 'mode', type: 'select', label: 'Operation Mode', options: ['Encode', 'Decode'], default: 'Encode' },
      { id: 'dataUriPrefix', type: 'checkbox', label: 'Include Data URI Prefix (data:mime;base64,)', default: true },
      { id: 'lineBreaks', type: 'select', label: 'Line Breaks', options: ['Continuous (No Breaks)', 'Wrap at 76 chars (MIME RFC 2045)', 'Wrap at 64 chars'], default: 'Continuous (No Breaks)' },
      { id: 'urlSafe', type: 'checkbox', label: 'URL-Safe Alphabet (+ to -, / to _)', default: false }
    ]
  },
  {
    id: 'base64-to-file',
    name: 'Convert Base64 to File',
    category: 'code',
    icon: '🔓',
    description: 'Decode Base64 string data back into original files and text.',
    inputFormats: ['.txt', 'String'],
    inputAccept: '*',
    outputFormat: 'Original File',
    isFree: true,
    engine: 'data',
    hasTextInput: true,
    settings: [
      { id: 'mode', type: 'select', label: 'Operation Mode', options: ['Decode', 'Encode'], default: 'Decode' },
      { id: 'targetExtension', type: 'select', label: 'Target File Type', options: ['Auto-Detect from Header', '.png', '.jpg', '.pdf', '.txt', '.json', '.zip'], default: 'Auto-Detect from Header' },
      { id: 'stripWhitespace', type: 'checkbox', label: 'Strip Whitespace & Newlines Before Decode', default: true }
    ]
  },
  {
    id: 'url-codec',
    name: 'Encode / Decode URL',
    category: 'code',
    icon: '🔗',
    description: 'Safely encode special URL characters or decode percent-encoded URI strings.',
    inputFormats: ['URL String', '.txt'],
    inputAccept: '*',
    outputFormat: '.txt',
    isFree: true,
    engine: 'data',
    hasTextInput: true,
    settings: [
      { id: 'mode', type: 'select', label: 'Operation', options: ['Encode', 'Decode'], default: 'Encode' },
      { id: 'componentMode', type: 'select', label: 'Encoding Scope', options: ['encodeURIComponent (Complete Query & Values)', 'encodeURI (Preserve /?&=: Protocol)'], default: 'encodeURIComponent (Complete Query & Values)' },
      { id: 'spaceEncoding', type: 'select', label: 'Space Character', options: ['%20 (Standard RFC)', '+ (Form URL-encoded)'], default: '%20 (Standard RFC)' }
    ]
  },
  {
    id: 'code-minify',
    name: 'Minify Code (HTML/CSS/JS)',
    category: 'code',
    icon: '📦',
    description: 'Remove whitespace, comments, and boilerplate to optimize code bundle sizes.',
    inputFormats: ['.html', '.css', '.js'],
    inputAccept: '.html,.htm,.css,.js',
    outputFormat: 'Minified Code',
    isFree: true,
    engine: 'data',
    hasTextInput: true,
    settings: [
      { id: 'language', type: 'select', label: 'Target Language', options: ['Auto-Detect', 'HTML', 'CSS', 'JavaScript', 'JSON'], default: 'Auto-Detect' },
      { id: 'removeComments', type: 'checkbox', label: 'Remove Comments', default: true },
      { id: 'collapseWhitespace', type: 'checkbox', label: 'Collapse Multiple Whitespace to Single', default: true },
      { id: 'preserveCopyright', type: 'checkbox', label: 'Preserve /*! Copyright Headers', default: true }
    ]
  }
];

// Presets for templates that are part of Markdown to PDF
export const TEMPLATE_PRESETS = {
  'ats-resume': { sampleKey: 'atsResume', theme: 'executive', title: 'ats-resume.md' },
  'legal-contract': { sampleKey: 'legalContract', theme: 'executive', title: 'legal-contract.md' },
  'academic-paper': { sampleKey: 'academicPaper', theme: 'academic', title: 'academic-paper.md' },
  'bates-legal': { sampleKey: 'batesLegalMerge', theme: 'executive', title: 'bates-legal.md' },
  'kdp-book': { sampleKey: 'kdpEbook', theme: 'academic', title: 'kdp-book.md' }
};

// Backward-compatible and format-selector alias lookup
const ALIAS_MAP = {
  'image-convert': 'png-to-jpg',
  'image-to-pdf': 'png-to-pdf',
  'img-to-pdf': 'png-to-pdf',
  'jpg-to-pdf': 'png-to-pdf',
  'images-to-pdf': 'png-to-pdf',
  'pdf-to-img': 'pdf-to-jpg',
  'html-to-pdf': 'md-to-pdf',
  'txt-to-pdf': 'md-to-pdf',
  'doc-to-pdf': 'docx-to-pdf',
  'word-to-pdf': 'docx-to-pdf',
  'pdf-to-word': 'pdf-to-docx',
  'pdf-to-doc': 'pdf-to-docx',
  'pdf-to-txt': 'pdf-to-text',
  'ats-resume': 'md-to-pdf',
  'legal-contract': 'md-to-pdf',
  'academic-paper': 'md-to-pdf',
  'bates-legal': 'md-to-pdf',
  'kdp-book': 'md-to-pdf',
  'md-to-docx': 'doc-to-docx',
  'html-to-docx': 'doc-to-docx',
  'image-crop': 'image-resize',
  'image-grayscale': 'image-effects',
  'image-watermark': 'image-effects',
  'compress-convert': 'image-compress-convert',
  'convert-compress': 'image-compress-convert',
  'image-compress-and-convert': 'image-compress-convert',
  'data-to-json': 'csv-to-json',
  'xml-to-json': 'csv-to-json',
  'yaml-to-json': 'csv-to-json',
  'data-to-sheet': 'json-to-csv',
  'base64-studio': 'file-to-base64',
  'base64-encode': 'file-to-base64',
  'base64-decode': 'base64-to-file',
  'url-encode': 'url-codec',
  'minify': 'code-minify',

  // Audio / Video Aliases
  'mp4-to-mp3': 'video-to-mp3',
  'mov-to-mp3': 'video-to-mp3',
  'webm-to-mp3': 'video-to-mp3',
  'avi-to-mp3': 'video-to-mp3',
  'mkv-to-mp3': 'video-to-mp3',
  'mp4-to-wav': 'video-to-wav',
  'mov-to-wav': 'video-to-wav',
  'webm-to-wav': 'video-to-wav',
  'mp4-to-gif': 'video-to-gif',
  'webm-to-gif': 'video-to-gif',
  'mov-to-mp4': 'video-convert',
  'avi-to-mp4': 'video-convert',
  'mkv-to-mp4': 'video-convert',
  'audio-to-mp3': 'wav-to-mp3',
  'audio-to-wav': 'mp3-to-wav',
  'flac-to-mp3': 'wav-to-mp3',
  'm4a-to-mp3': 'wav-to-mp3',
  'aac-to-mp3': 'wav-to-mp3',
  
  // 3D Aliases
  'obj-to-mesh': 'obj-to-stl',
  'stl-to-mesh': 'stl-to-obj',
  'fbx-to-obj': '3d-convert',
  'fbx-to-stl': '3d-convert',
  'gltf-to-obj': '3d-convert',
  'gltf-to-stl': '3d-convert',

  // Document Aliases
  'md-to-pptx': 'doc-to-pptx',
  'txt-to-pptx': 'doc-to-pptx',
  'pdf-to-pptx': 'doc-to-pptx',
  'docx-to-pptx': 'doc-to-pptx',
  'csv-to-xlsx': 'csv-to-excel',
  'json-to-xlsx': 'json-to-excel',
  'data-to-xlsx': 'doc-to-xlsx',
  'txt-to-xlsx': 'doc-to-xlsx',
  'txt-to-md': 'text-to-md',
  'text-to-markdown': 'text-to-md',
  'txt-to-markdown': 'text-to-md',
  'text-md': 'text-to-md',

  // LaTeX & Overleaf Aliases
  'md-to-latex': 'file-to-latex',
  'md-to-tex': 'file-to-latex',
  'docx-to-latex': 'file-to-latex',
  'word-to-latex': 'file-to-latex',
  'text-to-tex': 'text-to-latex',
  'txt-to-latex': 'text-to-latex',
  'latex-converter': 'text-to-latex',
  'latex': 'text-to-latex',
  'overleaf': 'text-to-latex',
  'tex-to-pdf': 'latex-to-pdf',
  'latex-pdf': 'latex-to-pdf',
  'tex-pdf': 'latex-to-pdf',
  'latex2pdf': 'latex-to-pdf',
  'tex-to-docx': 'latex-to-docx',
  'latex-docx': 'latex-to-docx',
  'tex-docx': 'latex-to-docx',
  'latex-to-word': 'latex-to-docx',
  'tex-to-word': 'latex-to-docx',
  'latex2docx': 'latex-to-docx',
  'latex2word': 'latex-to-docx'
};

/**
 * Get a tool by ID (supports aliases)
 */
export function getToolById(id) {
  const direct = TOOLS.find(t => t.id === id);
  if (direct) return direct;
  const aliasedId = ALIAS_MAP[id];
  if (aliasedId) {
    const aliased = TOOLS.find(t => t.id === aliasedId);
    if (aliased) return aliased;
  }
  return undefined;
}

/**
 * Get tools filtered by category
 */
export function getToolsByCategory(categoryId) {
  if (categoryId === 'all') return TOOLS;
  return TOOLS.filter(t => t.category === categoryId);
}

/**
 * Get count of tools per category
 */
export function getCategoryCounts() {
  const counts = { all: TOOLS.length };
  TOOLS.forEach(t => {
    counts[t.category] = (counts[t.category] || 0) + 1;
  });
  return counts;
}
