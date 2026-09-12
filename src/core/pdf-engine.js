import confetti from 'canvas-confetti';
import JSZip from 'jszip';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { parseMarkdown } from './parser.js';

/**
 * Triggers celebratory confetti animation
 */
export function fireCelebration() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#4D43FE', '#B5EF85', '#E72BE7', '#00F5FF', '#FDB73E']
  });
}

/**
/**
 * Calculates smart, element-aware page break boundaries.
 * Prevents slicing through headings, paragraphs, images, tables, or code blocks.
 */
export function calculateSmartPageBreaks(canvas, options = {}) {
  const {
    element = null,
    printWidth = 180,
    pageUsableHeight = 267
  } = options;

  const totalHeight = canvas.height;
  const pxPerMm = canvas.width / printWidth;
  const pageUsableHeightPx = pageUsableHeight * pxPerMm;

  // Single page document
  if (totalHeight <= pageUsableHeightPx + 10) {
    return [0, totalHeight];
  }

  // Sample background color (usually white)
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let bgR = 255, bgG = 255, bgB = 255;
  try {
    const bgData = ctx.getImageData(4, 4, 1, 1).data;
    bgR = bgData[0];
    bgG = bgData[1];
    bgB = bgData[2];
  } catch (e) {
    // fallback to white
  }

  const width = canvas.width;
  const step = Math.max(4, Math.floor(width / 120));

  function isRowBlank(y) {
    if (y < 0 || y >= totalHeight) return true;
    try {
      const rowData = ctx.getImageData(0, y, width, 1).data;
      const startX = Math.floor(width * 0.04);
      const endX = Math.floor(width * 0.96);

      for (let x = startX; x < endX; x += step) {
        const idx = x * 4;
        const a = rowData[idx + 3];
        if (a < 30) continue;
        const r = rowData[idx];
        const g = rowData[idx + 1];
        const b = rowData[idx + 2];

        if (Math.abs(r - bgR) > 18 || Math.abs(g - bgG) > 18 || Math.abs(b - bgB) > 18) {
          return false;
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  const domBreaks = [];
  const forcedBreaks = [];

  if (element && (element.scrollHeight > 0 || element.offsetHeight > 0)) {
    const containerRect = element.getBoundingClientRect();
    const elHeight = containerRect.height || element.scrollHeight || element.offsetHeight;
    const scaleY = totalHeight / elHeight;

    // Explicit page breaks
    const explicitBreaks = element.querySelectorAll('.page-break, [style*="page-break"], [style*="break-after: page"], [style*="break-before: page"]');
    explicitBreaks.forEach(el => {
      const rect = el.getBoundingClientRect();
      const topPx = Math.round((rect.top - containerRect.top) * scaleY);
      if (topPx > 20 && topPx < totalHeight - 20) {
        forcedBreaks.push(topPx);
      }
    });

    // Block elements
    const blockSelectors = 'h1, h2, h3, h4, h5, h6, table, tr, pre, blockquote, img, figure, p, ul, ol, .toc-container';
    const blocks = element.querySelectorAll(blockSelectors);
    blocks.forEach(el => {
      const rect = el.getBoundingClientRect();
      const topPx = Math.round((rect.top - containerRect.top) * scaleY);
      const bottomPx = Math.round((rect.bottom - containerRect.top) * scaleY);
      const isHeading = /^H[1-6]$/i.test(el.tagName);
      const isAtomic = /^(TABLE|TR|PRE|IMG|FIGURE|BLOCKQUOTE)$/i.test(el.tagName);

      domBreaks.push({
        top: topPx,
        bottom: bottomPx,
        height: bottomPx - topPx,
        isHeading,
        isAtomic,
        tagName: el.tagName
      });
    });
  }

  const cuts = [0];
  let currentY = 0;

  while (currentY < totalHeight) {
    const maxCut = currentY + pageUsableHeightPx;
    if (maxCut >= totalHeight - 10) {
      cuts.push(totalHeight);
      break;
    }

    // Check if there is an explicit forced page break in this page range
    const nextForced = forcedBreaks.find(fb => fb > currentY + 40 && fb <= maxCut);
    if (nextForced) {
      cuts.push(nextForced);
      currentY = nextForced;
      continue;
    }

    // Standard search region: between 70% and 100% of usable page height
    const searchMin = Math.round(currentY + pageUsableHeightPx * 0.70);
    const searchMax = Math.round(maxCut);

    let chosenCut = null;

    // Check DOM blocks
    if (domBreaks.length > 0) {
      for (const block of domBreaks) {
        // Prevent orphan headings near bottom
        if (block.isHeading && block.top >= searchMin && block.top < maxCut) {
          if (block.top > currentY + 60) {
            chosenCut = block.top;
            break;
          }
        }
        // Prevent cutting atomic blocks in half
        if (block.isAtomic && block.top >= searchMin && block.top < maxCut && block.bottom > maxCut) {
          if (block.top > currentY + 60) {
            chosenCut = block.top;
            break;
          }
        }
      }
    }

    // Refine with Canvas Blank Gap Scanner to guarantee no glyph is sliced
    const scanStart = chosenCut ? Math.min(chosenCut, searchMax) : searchMax;
    let bestBlankY = null;
    let maxRun = 0;
    let currentRun = 0;

    for (let y = scanStart; y >= searchMin; y--) {
      if (isRowBlank(y)) {
        currentRun++;
        if (currentRun > maxRun) {
          maxRun = currentRun;
          bestBlankY = y + Math.floor(currentRun / 2);
          if (maxRun >= 6) {
            break; // Found solid blank gap between lines
          }
        }
      } else {
        currentRun = 0;
      }
    }

    if (bestBlankY && maxRun >= 3) {
      chosenCut = bestBlankY;
    } else if (!chosenCut) {
      chosenCut = Math.round(currentY + pageUsableHeightPx * 0.95);
    }

    // Safety guard against infinite loops
    if (chosenCut <= currentY + 50) {
      chosenCut = Math.round(currentY + pageUsableHeightPx);
    }

    cuts.push(chosenCut);
    currentY = chosenCut;
  }

  return cuts;
}

/**
 * Converts an HTML5 canvas to a multi-page PDF using intelligent slice rendering.
 * Slices cleanly at whitespace and element boundaries without cutting text or headers.
 */
export function canvasToPdf(canvas, options = {}) {
  const {
    format = 'a4',
    orientation = 'portrait',
    margin = 15,
    filename = 'document.pdf',
    element = null,
    showPageNumbers = true
  } = options;

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const printWidth = pageWidth - (margin * 2);
  const pageUsableHeight = pageHeight - (margin * 2);

  const cuts = calculateSmartPageBreaks(canvas, {
    element,
    printWidth,
    pageUsableHeight
  });

  for (let i = 0; i < cuts.length - 1; i++) {
    const sliceTop = cuts[i];
    const sliceBottom = cuts[i + 1];
    const sliceHeight = sliceBottom - sliceTop;

    if (sliceHeight <= 0) continue;

    // Create a crisp off-screen canvas for this page slice
    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = sliceHeight;
    const sliceCtx = sliceCanvas.getContext('2d');

    // Fill background with white
    sliceCtx.fillStyle = '#ffffff';
    sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceHeight);

    // Draw slice from main canvas
    sliceCtx.drawImage(
      canvas,
      0, sliceTop, canvas.width, sliceHeight,
      0, 0, canvas.width, sliceHeight
    );

    const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.98);
    const sliceHeightMm = (sliceHeight * printWidth) / canvas.width;

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(sliceData, 'JPEG', margin, margin, printWidth, sliceHeightMm, undefined, 'FAST');
  }

  // Render clean, subtle page numbers if multi-page
  if (showPageNumbers && cuts.length > 2) {
    const totalPages = cuts.length - 1;
    for (let p = 1; p <= totalPages; p++) {
      pdf.setPage(p);
      pdf.setFontSize(8.5);
      pdf.setTextColor(140, 140, 140);
      const str = `Page ${p} of ${totalPages}`;
      const textWidth = pdf.getStringUnitWidth(str) * 8.5 / pdf.internal.scaleFactor;
      const x = (pageWidth - textWidth) / 2;
      const y = pageHeight - Math.max(5, margin / 2.5);
      pdf.text(str, x, y);
    }
  }

  const outName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  const blob = pdf.output('blob');
  return { pdf, blob, filename: outName, pageCount: cuts.length - 1 };
}

/**
 * Generates and downloads a single PDF from an in-DOM element (e.g. Live Studio paper-mount)
 * Captures directly with html2canvas and jsPDF to ensure zero blank pages.
 */
export async function downloadPdf(element, options = {}) {
  const {
    filename = 'converted-document.pdf',
    format = 'a4',
    orientation = 'portrait',
    margin = 15
  } = options;

  const wrapper = document.getElementById('paper-sheet-wrapper');
  const prevTransform = wrapper ? wrapper.style.transform : '';
  if (wrapper) wrapper.style.transform = 'none';

  const prevShadow = element.style.boxShadow;
  element.style.boxShadow = 'none';

  let canvas;
  try {
    const images = Array.from(element.querySelectorAll('img'));
    if (images.length > 0) {
      await Promise.all(images.map(img => {
        if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
        return new Promise(r => { img.onload = r; img.onerror = r; setTimeout(r, 600); });
      }));
    }
    await new Promise(r => setTimeout(r, 60));

    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0
    });
  } catch (err) {
    console.error('html2canvas capture error:', err);
    throw err;
  } finally {
    if (wrapper) wrapper.style.transform = prevTransform;
    element.style.boxShadow = prevShadow;
  }

  const { pdf, blob, filename: outName } = canvasToPdf(canvas, {
    format,
    orientation,
    margin,
    filename,
    element,
    showPageNumbers: options.showPageNumbers !== false
  });

  pdf.save(outName);
  fireCelebration();
  return { success: true, blob, filename: outName };
}

/**
 * Generates a PDF Blob for a given HTML element
 */
export async function generatePdfBlob(element, options = {}) {
  const {
    format = 'a4',
    orientation = 'portrait',
    margin = 15
  } = options;

  const wrapper = document.getElementById('paper-sheet-wrapper');
  const prevTransform = wrapper ? wrapper.style.transform : '';
  if (wrapper) wrapper.style.transform = 'none';

  const prevShadow = element.style.boxShadow;
  element.style.boxShadow = 'none';

  let canvas;
  try {
    const images = Array.from(element.querySelectorAll('img'));
    if (images.length > 0) {
      await Promise.all(images.map(img => {
        if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
        return new Promise(r => { img.onload = r; img.onerror = r; setTimeout(r, 600); });
      }));
    }
    await new Promise(r => setTimeout(r, 60));

    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0
    });
  } finally {
    if (wrapper) wrapper.style.transform = prevTransform;
    element.style.boxShadow = prevShadow;
  }

  const { blob } = canvasToPdf(canvas, {
    format,
    orientation,
    margin,
    element,
    showPageNumbers: options.showPageNumbers !== false
  });

  return blob;
}

/**
 * Compiles multiple markdown files into a single unified combined PDF
 */
export async function compileCombinedPdf(files, options = {}) {
  const {
    filename = 'combined-documents.pdf',
    theme = 'github',
    format = 'a4',
    orientation = 'portrait',
    margin = 15,
    watermark = '',
    addToc = true,
    pageBreaks = true
  } = options;

  const container = document.createElement('div');
  container.className = `paper-sheet theme-${theme}`;
  container.style.cssText = `
    position: absolute;
    left: 0;
    top: 0;
    width: 794px;
    background: #ffffff !important;
    color: #1a202c !important;
    padding: ${margin * 2}px;
    z-index: 999999;
    pointer-events: none;
    overflow: visible;
    box-sizing: border-box;
    min-height: 1123px;
  `;

  let combinedHtml = '';

  // 1. Table of contents if requested
  if (addToc && files.length > 1) {
    combinedHtml += `
      <div class="toc-container" style="padding-bottom: 30px; margin-bottom: 40px; border-bottom: 2px solid #E2E8F0;">
        <h1 style="margin-top: 0; font-size: 24pt;">Table of Contents</h1>
        <p style="color: #64748B; margin-bottom: 20px;">Combined document package • Generated by SuperConvert</p>
        <ol style="font-size: 11pt; line-height: 2;">
          ${files.map((f, i) => `<li><strong>Document ${i + 1}:</strong> ${f.name.replace(/\.(md|markdown|txt)$/i, '')}</li>`).join('')}
        </ol>
      </div>
      <div style="page-break-after: always; break-after: page; height: 1px;"></div>
    `;
  }

  // 2. Append each document
  files.forEach((file, index) => {
    const { html, metadata } = parseMarkdown(file.content);
    let metaHtml = '';
    if (metadata && Object.keys(metadata).length > 0) {
      const badges = Object.entries(metadata)
        .map(([k, v]) => `<span style="display:inline-block; font-size:0.75rem; background:rgba(0,0,0,0.06); padding:2px 8px; border-radius:4px; margin-right:6px; margin-bottom:6px; text-transform:uppercase; font-weight:700;">${k}: ${v}</span>`)
        .join('');
      metaHtml = `<div style="margin-bottom:1.5em; padding-bottom:1em; border-bottom:1px dashed #CBD5E1;">${badges}</div>`;
    }

    combinedHtml += `
      <div class="combined-doc-section" id="doc-section-${index}">
        ${metaHtml}
        ${html}
      </div>
    `;

    if (pageBreaks && index < files.length - 1) {
      combinedHtml += `<div style="page-break-after: always; break-after: page; height: 1px;"></div>`;
    }
  });

  // Watermark if specified
  if (watermark.trim()) {
    combinedHtml += `
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-35deg); font-size: 4rem; font-weight: 900; color: rgba(0,0,0,0.05); pointer-events: none; text-transform: uppercase;">
        ${watermark.trim()}
      </div>
    `;
  }

  container.innerHTML = combinedHtml;
  document.body.appendChild(container);

  try {
    const images = Array.from(container.querySelectorAll('img'));
    if (images.length > 0) {
      await Promise.all(images.map(img => {
        if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
        return new Promise(r => { img.onload = r; img.onerror = r; setTimeout(r, 600); });
      }));
    }
    await new Promise(r => setTimeout(r, 60));

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0
    });

    const { pdf, blob, filename: outName } = canvasToPdf(canvas, {
      format,
      orientation,
      margin,
      filename,
      element: container,
      showPageNumbers: options.showPageNumbers !== false
    });

    pdf.save(outName);
    fireCelebration();
    return { success: true, blob, filename: outName };
  } finally {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}

/**
 * Compiles multiple files into separate PDFs and bundles them into a ZIP file
 */
export async function compileBatchZip(files, options = {}, onProgress = () => {}) {
  const {
    zipName = 'converted-documents.zip',
    theme = 'github',
    format = 'a4',
    orientation = 'portrait',
    margin = 15,
    watermark = ''
  } = options;

  const zip = new JSZip();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress(i + 1, files.length, file.name);

    const container = document.createElement('div');
    container.className = `paper-sheet theme-${theme}`;
    container.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      width: 794px;
      background: #ffffff !important;
      color: #1a202c !important;
      padding: ${margin * 2}px;
      z-index: 999999;
      pointer-events: none;
      overflow: visible;
      box-sizing: border-box;
      min-height: 1123px;
    `;

    const { html, metadata } = parseMarkdown(file.content);
    let metaHtml = '';
    if (metadata && Object.keys(metadata).length > 0) {
      const badges = Object.entries(metadata)
        .map(([k, v]) => `<span style="display:inline-block; font-size:0.75rem; background:rgba(0,0,0,0.06); padding:2px 8px; border-radius:4px; margin-right:6px; margin-bottom:6px; text-transform:uppercase; font-weight:700;">${k}: ${v}</span>`)
        .join('');
      metaHtml = `<div style="margin-bottom:1.5em; padding-bottom:1em; border-bottom:1px dashed #CBD5E1;">${badges}</div>`;
    }

    container.innerHTML = metaHtml + html;

    if (watermark.trim()) {
      container.innerHTML += `
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-35deg); font-size: 4rem; font-weight: 900; color: rgba(0,0,0,0.05); pointer-events: none; text-transform: uppercase;">
          ${watermark.trim()}
        </div>
      `;
    }

    document.body.appendChild(container);

    try {
      const images = Array.from(container.querySelectorAll('img'));
      if (images.length > 0) {
        await Promise.all(images.map(img => {
          if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
          return new Promise(r => { img.onload = r; img.onerror = r; setTimeout(r, 600); });
        }));
      }
      await new Promise(r => setTimeout(r, 50));

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0
      });

      const pdfBaseName = file.name.replace(/\.(md|markdown|txt)$/i, '') || `document-${i + 1}`;
      const { blob } = canvasToPdf(canvas, {
        format,
        orientation,
        margin,
        filename: `${pdfBaseName}.pdf`,
        element: container,
        showPageNumbers: options.showPageNumbers !== false
      });

      zip.file(`${pdfBaseName}.pdf`, blob);
    } finally {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = zipName;
  a.click();
  URL.revokeObjectURL(downloadUrl);

  fireCelebration();
  return { success: true };
}

/**
 * Native Vector Print Driver
 */
export function printVector() {
  window.print();
}
