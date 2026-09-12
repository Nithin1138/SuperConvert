/**
 * SuperConvert — Universal Converter Registry
 * Consolidated, direct conversion units with explicit input/output specifications.
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
    settings: [
      { id: 'targetFormat', type: 'select', label: 'Output Format', options: ['.jpg', '.png', '.webp', '.gif', '.bmp', '.tiff', '.avif', '.ico', '.svg'], default: '.jpg' },
      { id: 'quality', type: 'range', label: 'Quality', min: 10, max: 100, default: 92, unit: '%' }
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
    settings: [
      { id: 'targetFormat', type: 'select', label: 'Output Format', options: ['.png', '.jpg', '.webp', '.gif', '.bmp', '.tiff', '.avif', '.ico', '.svg'], default: '.png' }
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
    settings: [
      { id: 'targetFormat', type: 'select', label: 'Output Format', options: ['.png', '.jpg', '.webp', '.gif', '.bmp', '.tiff', '.avif', '.ico', '.svg'], default: '.png' }
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
    engine: 'image'
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
    engine: 'doc'
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
    settings: [
      { id: 'fit', type: 'select', label: 'Image Fit', options: ['Fit to Page', 'Full Bleed'], default: 'Fit to Page' },
      { id: 'format', type: 'select', label: 'Paper Size', options: ['a4', 'letter'], default: 'a4' },
      { id: 'orientation', type: 'select', label: 'Orientation', options: ['portrait', 'landscape'], default: 'portrait' }
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
    engine: 'doc'
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
    engine: 'doc'
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
    engine: 'studio'
  },
  {
    id: 'doc-to-docx',
    name: 'Convert Document to Word',
    category: 'documents',
    icon: '📘',
    description: 'Convert Markdown and HTML documents into editable Microsoft Word (.docx) files.',
    inputFormats: ['.md', '.html', '.txt'],
    inputAccept: '.md,.markdown,.html,.htm,.txt',
    outputFormat: '.docx',
    isFree: true,
    engine: 'doc'
  },
  {
    id: 'pdf-to-text',
    name: 'Convert PDF to Text',
    category: 'documents',
    icon: '🔍',
    description: 'Extract all readable text, tables, and structured content from PDF documents.',
    inputFormats: ['.pdf'],
    inputAccept: '.pdf',
    outputFormat: '.txt',
    isFree: true,
    engine: 'doc'
  },
  {
    id: 'doc-to-pptx',
    name: 'Convert Document to PowerPoint',
    category: 'documents',
    icon: '📊',
    description: 'Convert Markdown, Text, or Word documents into Microsoft PowerPoint (.pptx) slide decks.',
    inputFormats: ['.md', '.txt', '.docx', '.pdf'],
    inputAccept: '.md,.txt,.docx,.pdf',
    outputFormat: '.pptx',
    isFree: true,
    engine: 'doc'
  },
  {
    id: 'doc-to-xlsx',
    name: 'Convert Document to Excel',
    category: 'documents',
    icon: '📈',
    description: 'Convert tabular text, CSV, or structured documents into Microsoft Excel (.xlsx) workbooks.',
    inputFormats: ['.csv', '.json', '.txt', '.md'],
    inputAccept: '.csv,.json,.txt,.md',
    outputFormat: '.xlsx',
    isFree: true,
    engine: 'doc'
  },
  {
    id: 'text-to-md',
    name: 'Convert Text to Markdown',
    category: 'documents',
    icon: '📝',
    description: 'Transform unformatted plain text into clean, structured Markdown with automatic headings, lists, tables, and links.',
    inputFormats: ['.txt', '.text', 'Plain Text'],
    inputAccept: '.txt,text/plain,*',
    outputFormat: '.md',
    isFree: true,
    engine: 'doc',
    hasTextInput: true,
    settings: [
      { id: 'detectHeadings', type: 'checkbox', label: 'Auto-Detect Headings', default: true },
      { id: 'detectTables', type: 'checkbox', label: 'Auto-Convert Tables', default: true },
      { id: 'linkify', type: 'checkbox', label: 'Auto-Link URLs', default: true }
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
    settings: [
      { id: 'sizePreset', type: 'select', label: 'Target Size Preset', options: ['Auto (Quality Slider)', '< 100 KB (Thumbnail/Web)', '< 250 KB (Upload/Email)', '< 500 KB (Standard)', '< 1 MB (High Quality)', '< 2 MB (Max Cap)', 'Custom Target (KB)'], default: 'Auto (Quality Slider)' },
      { id: 'customKb', type: 'number', label: 'Custom Target (KB)', default: 250 },
      { id: 'quality', type: 'range', label: 'Quality', min: 10, max: 100, default: 75, unit: '%' }
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
    settings: [
      { id: 'targetFormat', type: 'select', label: 'Output Format', options: ['.webp', '.jpg', '.png', '.gif', '.tiff', '.avif', '.ico', '.bmp', '.svg'], default: '.webp' },
      { id: 'sizePreset', type: 'select', label: 'Target Size Preset', options: ['Auto (Quality Slider)', '< 100 KB (Thumbnail/Web)', '< 250 KB (Upload/Email)', '< 500 KB (Standard)', '< 1 MB (High Quality)', '< 2 MB (Max Cap)', 'Custom Target (KB)'], default: 'Auto (Quality Slider)' },
      { id: 'customKb', type: 'number', label: 'Custom Target (KB)', default: 250 },
      { id: 'quality', type: 'range', label: 'Quality', min: 10, max: 100, default: 80, unit: '%' }
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
    settings: [
      { id: 'width', type: 'number', label: 'Width (px)', default: 800 },
      { id: 'height', type: 'number', label: 'Height (px)', default: 600 },
      { id: 'maintainAspect', type: 'checkbox', label: 'Maintain Aspect Ratio', default: true },
      { id: 'cropRatio', type: 'select', label: 'Crop Preset', options: ['Free', '1:1', '4:3', '16:9', '3:2'], default: 'Free' }
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
    settings: [
      { id: 'effect', type: 'select', label: 'Effect Mode', options: ['Watermark', 'Grayscale'], default: 'Watermark' },
      { id: 'watermarkText', type: 'text', label: 'Watermark Text', default: 'CONFIDENTIAL' },
      { id: 'watermarkSize', type: 'range', label: 'Watermark Size', min: 20, max: 120, default: 50, unit: 'px' },
      { id: 'watermarkDegree', type: 'select', label: 'Degree / Orientation', options: ['Cross (-45°)', 'Straight (0°)', 'Subtle (-30°)', 'Vertical (-90°)'], default: 'Cross (-45°)' },
      { id: 'watermarkRepeat', type: 'select', label: 'Layout / Repeat', options: ['Single Center', 'Repeat Tiled Pattern'], default: 'Single Center' },
      { id: 'opacity', type: 'select', label: 'Opacity', options: ['10%', '20%', '30%', '50%'], default: '20%' }
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
    engine: 'media'
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
    engine: 'media'
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
    settings: [
      { id: 'duration', type: 'range', label: 'Max Duration (seconds)', min: 1, max: 15, default: 4, unit: 's' },
      { id: 'fps', type: 'select', label: 'Frame Rate (FPS)', options: ['5 fps', '10 fps', '15 fps'], default: '10 fps' }
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
    engine: 'media'
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
      { id: 'targetFormat', type: 'select', label: 'Target Video Format', options: ['.mp4', '.webm', '.mov', '.avi', '.mkv'], default: '.mp4' }
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
    engine: 'media'
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
    engine: 'media'
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
    engine: 'media'
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
    engine: 'media'
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
      { id: 'targetFormat', type: 'select', label: 'Target Audio Format', options: ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac'], default: '.mp3' }
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
    engine: '3d'
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
    engine: '3d'
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
    engine: '3d'
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
      { id: 'targetFormat', type: 'select', label: 'Target 3D Format', options: ['.stl', '.obj', '.gltf', '.fbx'], default: '.stl' }
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
    engine: 'data'
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
    engine: 'data'
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
    engine: 'data'
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
    engine: 'data'
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
      { id: 'outputType', type: 'select', label: 'Spreadsheet Format', options: ['.xlsx'], default: '.xlsx' }
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
      { id: 'outputType', type: 'select', label: 'Spreadsheet Format', options: ['.xlsx'], default: '.xlsx' }
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
    settings: [
      { id: 'indent', type: 'select', label: 'Indent', options: ['2 spaces', '4 spaces', 'Tab'], default: '2 spaces' }
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
      { id: 'mode', type: 'select', label: 'Operation', options: ['Encode', 'Decode'], default: 'Encode' }
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
      { id: 'mode', type: 'select', label: 'Operation', options: ['Decode', 'Encode'], default: 'Decode' }
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
      { id: 'mode', type: 'select', label: 'Operation', options: ['Encode', 'Decode'], default: 'Encode' }
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
      { id: 'language', type: 'select', label: 'Language', options: ['Auto-Detect', 'HTML', 'CSS', 'JavaScript'], default: 'Auto-Detect' }
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
  'text-md': 'text-to-md'
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
