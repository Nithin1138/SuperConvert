/**
 * SuperConvert — Interactive Format Selection Modal
 * Matches reference screenshots: Search format..., Category nav, and format pills grid.
 */

export const FORMAT_CATALOG = [
  {
    id: 'image',
    name: 'Image',
    preview: 'JPG • PNG • WEBP • GIF',
    formats: [
      { id: 'jpg', name: 'JPG', ext: '.jpg', mime: 'image/jpeg' },
      { id: 'png', name: 'PNG', ext: '.png', mime: 'image/png' },
      { id: 'webp', name: 'WEBP', ext: '.webp', mime: 'image/webp' },
      { id: 'gif', name: 'GIF', ext: '.gif', mime: 'image/gif' },
      { id: 'svg', name: 'SVG', ext: '.svg', mime: 'image/svg+xml' },
      { id: 'tiff', name: 'TIFF / TIF', ext: '.tiff', mime: 'image/tiff' },
      { id: 'bmp', name: 'BMP', ext: '.bmp', mime: 'image/bmp' },
      { id: 'avif', name: 'AVIF', ext: '.avif', mime: 'image/avif' },
      { id: 'heic', name: 'HEIC / HEIF', ext: '.heic', mime: 'image/heic' },
      { id: 'ico', name: 'ICO', ext: '.ico', mime: 'image/x-icon' }
    ]
  },
  {
    id: 'video',
    name: 'Video',
    preview: 'MP4 • MOV • AVI • MKV',
    formats: [
      { id: 'mp4', name: 'MP4', ext: '.mp4', mime: 'video/mp4' },
      { id: 'mov', name: 'MOV', ext: '.mov', mime: 'video/quicktime' },
      { id: 'avi', name: 'AVI', ext: '.avi', mime: 'video/x-msvideo' },
      { id: 'mkv', name: 'MKV', ext: '.mkv', mime: 'video/x-matroska' },
      { id: 'webm', name: 'WEBM', ext: '.webm', mime: 'video/webm' }
    ]
  },
  {
    id: 'audio',
    name: 'Audio',
    preview: 'MP3 • WAV',
    formats: [
      { id: 'mp3', name: 'MP3', ext: '.mp3', mime: 'audio/mp3' },
      { id: 'wav', name: 'WAV', ext: '.wav', mime: 'audio/wav' },
      { id: 'ogg', name: 'OGG', ext: '.ogg', mime: 'audio/ogg' },
      { id: 'aac', name: 'AAC', ext: '.aac', mime: 'audio/aac' },
      { id: 'm4a', name: 'M4A', ext: '.m4a', mime: 'audio/mp4' },
      { id: 'flac', name: 'FLAC', ext: '.flac', mime: 'audio/flac' }
    ]
  },
  {
    id: 'document',
    name: 'Document',
    preview: 'PDF • Word • MD • PPTX • XLSX',
    formats: [
      { id: 'pdf', name: 'PDF', ext: '.pdf', mime: 'application/pdf' },
      { id: 'word', name: 'Word', ext: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { id: 'docx', name: 'DOCX', ext: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { id: 'msword', name: 'Microsoft Word', ext: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { id: 'md', name: 'Markdown (MD)', ext: '.md', mime: 'text/markdown' },
      { id: 'pptx', name: 'PPTX', ext: '.pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
      { id: 'xlsx', name: 'XLSX', ext: '.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      { id: 'txt', name: 'TXT', ext: '.txt', mime: 'text/plain' },
      { id: 'csv', name: 'CSV', ext: '.csv', mime: 'text/csv' }
    ]
  },
  {
    id: '3d',
    name: '3D',
    preview: 'OBJ • FBX',
    formats: [
      { id: 'obj', name: 'OBJ', ext: '.obj', mime: 'model/obj' },
      { id: 'fbx', name: 'FBX', ext: '.fbx', mime: 'model/fbx' },
      { id: 'stl', name: 'STL', ext: '.stl', mime: 'model/stl' },
      { id: 'gltf', name: 'GLTF', ext: '.gltf', mime: 'model/gltf+json' }
    ]
  }
];

export function renderFormatModal() {
  return `
    <div id="format-picker-modal" class="format-modal-backdrop" style="display: none;">
      <div class="format-modal-card" role="dialog" aria-modal="true" aria-labelledby="format-modal-heading">
        
        <!-- Header with Search Input -->
        <div class="format-modal-header">
          <div class="format-search-wrap">
            <svg class="format-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              id="format-search-input" 
              class="format-search-input" 
              placeholder="Search format..." 
              autocomplete="off" 
              spellcheck="false"
            />
            <button id="format-search-clear" class="format-search-clear" title="Clear search" style="display: none;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <button id="format-modal-close" class="format-modal-close-btn" title="Close modal" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Main Body: 2 Columns (Categories List | Format Pills Grid) -->
        <div class="format-modal-body">
          
          <!-- LEFT: Categories List -->
          <nav class="format-cat-nav" id="format-cat-nav">
            ${FORMAT_CATALOG.map((cat, idx) => `
              <button class="format-cat-btn ${idx === 0 ? 'active' : ''}" data-cat-id="${cat.id}">
                <span class="format-cat-name">${cat.name}</span>
                <span class="format-cat-preview">${cat.preview}</span>
              </button>
            `).join('')}
          </nav>

          <!-- RIGHT: Format Pills Panel -->
          <div class="format-pills-panel" id="format-pills-panel">
            <div class="format-pills-grid" id="format-pills-grid">
              <!-- Rendered dynamically -->
            </div>
            <div id="format-empty-state" class="format-empty-state" style="display: none;">
              <p>No format found matching "<span id="format-empty-query"></span>"</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}
