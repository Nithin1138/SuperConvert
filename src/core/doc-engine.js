/**
 * SuperConvert — Document Conversion Engine
 * Robust browser-side conversions between document formats.
 * Fixes blank PDF generation by ensuring proper DOM layout coordinates, image decoding,
 * and direct jsPDF integration for vector-sharp output.
 */

import { parseMarkdown } from './parser.js';
import { canvasToPdf } from './pdf-engine.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * HTML string → PDF download via direct html2canvas + jsPDF with deterministic multi-page support
 */
export async function htmlToPdf(htmlString, filename = 'document.pdf', options = {}) {
  const {
    format = 'a4',
    orientation = 'portrait',
    margin = 15
  } = options;

  const container = document.createElement('div');
  container.className = 'paper-sheet theme-super-modern';
  container.style.cssText = `
    position: absolute;
    left: 0;
    top: 0;
    width: 794px;
    min-height: 1123px;
    background: #ffffff !important;
    color: #1a202c !important;
    padding: 36px 44px;
    z-index: 999999;
    opacity: 1;
    pointer-events: none;
    overflow: visible;
    box-sizing: border-box;
  `;
  container.innerHTML = typeof htmlString === 'string' ? htmlString : (htmlString?.html || '');
  document.body.appendChild(container);

  try {
    // Wait for any embedded images to fully load and decode
    const images = Array.from(container.querySelectorAll('img'));
    if (images.length > 0) {
      await Promise.all(images.map(img => {
        if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 800);
        });
      }));
    }

    // Allow CSS computation and paint tick
    await new Promise(r => setTimeout(r, 60));

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0
    });

    const { blob, filename: outName } = canvasToPdf(canvas, {
      format,
      orientation,
      margin,
      filename,
      element: container
    });

    return { blob, filename: outName };
  } finally {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Microsoft Word (.docx) → PDF using mammoth + html2pdf
 */
export async function docxToPdf(docxFile, filename = 'document.pdf', options = {}) {
  const mammoth = await import('mammoth');
  
  let arrayBuffer;
  if (docxFile instanceof ArrayBuffer) {
    arrayBuffer = docxFile;
  } else if (docxFile && docxFile.arrayBuffer) {
    arrayBuffer = await docxFile.arrayBuffer();
  } else {
    throw new Error('Please upload a valid Word (.docx) document file');
  }

  const result = await mammoth.convertToHtml({ arrayBuffer });
  
  const styledHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11pt; line-height: 1.65; color: #1e293b;">
      <style>
        h1, h2, h3, h4 { color: #0f172a; margin-top: 1.4em; margin-bottom: 0.5em; font-weight: 700; }
        h1 { font-size: 22pt; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
        h2 { font-size: 16pt; }
        h3 { font-size: 13pt; }
        p { margin: 0 0 1em 0; }
        table { border-collapse: collapse; width: 100%; margin: 1.5em 0; font-size: 10pt; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
        th { background: #f1f5f9; font-weight: 600; color: #0f172a; }
        ul, ol { padding-left: 24px; margin-bottom: 1em; }
        li { margin-bottom: 0.3em; }
        img { max-width: 100%; height: auto; border-radius: 4px; }
        blockquote { border-left: 4px solid #4f46e5; margin: 1.5em 0; padding-left: 16px; color: #475569; font-style: italic; }
      </style>
      ${result.value || '<p>No readable text content found in document.</p>'}
    </div>
  `;
  
  return htmlToPdf(styledHtml, filename, options);
}

/**
 * Image (.png, .jpg, .webp, .svg, .bmp) → PDF
 * Directly embeds image into jsPDF for 100% reliable, razor-sharp vector output without html2canvas blank page issues.
 */
export async function imageToPdf(imageFile, filename = 'image.pdf', options = {}) {
  const {
    format = 'a4',
    orientation = 'portrait',
    fit = 'Fit to Page'
  } = options;

  // Load image bytes into data URL
  let dataUrl;
  if (typeof imageFile === 'string') {
    dataUrl = imageFile;
  } else {
    dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  }

  // Decode image to extract dimensions
  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to parse uploaded image file.'));
    image.src = dataUrl;
  });

  const isFullBleed = fit === 'Full Bleed';
  
  let finalOrientation = orientation;
  if (orientation === 'auto') {
    finalOrientation = img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait';
  }

  const doc = new jsPDF({
    orientation: finalOrientation,
    unit: 'mm',
    format: format
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let renderWidth = pageWidth;
  let renderHeight = pageHeight;
  let x = 0;
  let y = 0;

  if (isFullBleed) {
    renderWidth = pageWidth;
    renderHeight = pageHeight;
    x = 0;
    y = 0;
  } else {
    const margin = 12;
    const maxW = pageWidth - margin * 2;
    const maxH = pageHeight - margin * 2;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const pageRatio = maxW / maxH;

    if (imgRatio > pageRatio) {
      renderWidth = maxW;
      renderHeight = maxW / imgRatio;
      x = margin;
      y = margin + (maxH - renderHeight) / 2;
    } else {
      renderHeight = maxH;
      renderWidth = maxH * imgRatio;
      x = margin + (maxW - renderWidth) / 2;
      y = margin;
    }
  }

  const fileNameStr = (typeof imageFile === 'object' && imageFile?.name) ? imageFile.name : filename;
  const ext = fileNameStr.slice(fileNameStr.lastIndexOf('.')).toLowerCase();
  const formatType = (ext === '.png') ? 'PNG' : (ext === '.webp') ? 'WEBP' : 'JPEG';

  doc.addImage(img, formatType, x, y, renderWidth, renderHeight);
  const blob = doc.output('blob');
  return { blob, filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf` };
}

/**
 * Plain text → PDF (wraps in styled HTML)
 */
export async function textToPdf(plainText, filename = 'document.pdf', options = {}) {
  const textStr = typeof plainText === 'string' ? plainText : await plainText.text();
  const styledHtml = `
    <div style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10.5pt; line-height: 1.7; white-space: pre-wrap; word-wrap: break-word; color: #1e293b;">
      ${textStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
    </div>
  `;
  return htmlToPdf(styledHtml, filename, options);
}

/**
 * Markdown → DOCX using the docx npm package
 */
export async function markdownToDocx(mdString, filename = 'document.docx') {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = await import('docx');
  
  const textContent = typeof mdString === 'string' ? mdString : await mdString.text();
  const lines = textContent.split('\n');
  const children = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        children.push(new Paragraph({
          children: [new TextRun({ text: codeBuffer.join('\n'), font: 'Courier New', size: 18, color: '2D3748' })],
          spacing: { before: 100, after: 100 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
            left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
            right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }
          },
          shading: { fill: 'F7FAFC' }
        }));
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }
    
    if (line.startsWith('# ')) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.slice(2), bold: true, size: 32, color: '1A202C' })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 }
      }));
    } else if (line.startsWith('## ')) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.slice(3), bold: true, size: 28, color: '2D3748' })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }));
    } else if (line.startsWith('### ')) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.slice(4), bold: true, size: 24, color: '4A5568' })],
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 160, after: 80 }
      }));
    } else if (/^[-*_]{3,}\s*$/.test(line.trim())) {
      children.push(new Paragraph({
        children: [],
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E0' } },
        spacing: { before: 200, after: 200 }
      }));
    } else if (line.startsWith('> ')) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.slice(2), italics: true, color: '718096', size: 22 })],
        indent: { left: 720 },
        border: { left: { style: BorderStyle.SINGLE, size: 6, color: '4D43FE' } },
        spacing: { before: 80, after: 80 }
      }));
    } else if (/^\s*[-*+]\s/.test(line)) {
      const text = line.replace(/^\s*[-*+]\s/, '');
      children.push(new Paragraph({
        children: parseInlineFormatting(text),
        bullet: { level: 0 },
        spacing: { before: 40, after: 40 }
      }));
    } else if (/^\s*\d+\.\s/.test(line)) {
      const text = line.replace(/^\s*\d+\.\s/, '');
      children.push(new Paragraph({
        children: parseInlineFormatting(text),
        numbering: { reference: 'default-numbering', level: 0 },
        spacing: { before: 40, after: 40 }
      }));
    } else if (line.trim() === '') {
      children.push(new Paragraph({ children: [], spacing: { before: 80, after: 80 } }));
    } else {
      children.push(new Paragraph({
        children: parseInlineFormatting(line),
        spacing: { before: 60, after: 60 }
      }));
    }
  }
  
  const doc = new Document({
    numbering: {
      config: [{
        reference: 'default-numbering',
        levels: [{ level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.LEFT }]
      }]
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children
    }]
  });
  
  const blob = await Packer.toBlob(doc);
  return { blob, filename: filename.endsWith('.docx') ? filename : `${filename}.docx` };
}

/**
 * Parse inline Markdown formatting to TextRun objects
 */
function parseInlineFormatting(text) {
  const runs = [];
  let remaining = text;
  
  const segments = [];
  let lastIndex = 0;
  const combined = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|~~(.+?)~~)/g;
  let match;
  
  while ((match = combined.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: remaining.slice(lastIndex, match.index), style: {} });
    }
    
    if (match[2]) segments.push({ text: match[2], style: { bold: true } });
    else if (match[3]) segments.push({ text: match[3], style: { italics: true } });
    else if (match[4]) segments.push({ text: match[4], style: { font: 'Courier New', size: 20, color: '4D43FE' } });
    else if (match[5]) segments.push({ text: match[5], style: { strike: true } });
    
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < remaining.length) {
    segments.push({ text: remaining.slice(lastIndex), style: {} });
  }
  
  if (segments.length === 0) {
    segments.push({ text: remaining, style: {} });
  }
  
  return segments.map(s => new TextRun({ text: s.text, size: 22, ...s.style }));
}

/**
 * HTML → DOCX
 */
export async function htmlToDocx(htmlString, filename = 'document.docx') {
  const temp = document.createElement('div');
  temp.innerHTML = htmlString;
  const plainText = temp.innerText || temp.textContent || '';
  return markdownToDocx(plainText, filename);
}

/**
 * PDF → Text extraction using pdfjs-dist
 */
export async function pdfToText(pdfFile, filename = 'extracted.txt') {
  const pdfjsLib = await import('pdfjs-dist');
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }
  
  let arrayBuffer;
  if (pdfFile instanceof ArrayBuffer) {
    arrayBuffer = pdfFile;
  } else if (pdfFile && pdfFile.arrayBuffer) {
    arrayBuffer = await pdfFile.arrayBuffer();
  } else {
    throw new Error('Please upload a valid .pdf file to extract text');
  }

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  const totalPages = pdf.numPages;
  
  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += `--- Page ${i} of ${totalPages} ---\n${pageText}\n\n`;
  }
  
  const blob = new Blob([fullText.trim()], { type: 'text/plain;charset=utf-8;' });
  return { blob, filename: filename.endsWith('.txt') ? filename : `${filename}.txt`, text: fullText.trim(), preview: fullText.trim(), pageCount: totalPages };
}

/**
 * PDF → Word (.docx) using pdfjs-dist + docx
 */
export async function pdfToDocx(pdfFile, filename = 'document.docx') {
  const pdfjsLib = await import('pdfjs-dist');
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }

  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');

  let arrayBuffer;
  if (pdfFile instanceof ArrayBuffer) {
    arrayBuffer = pdfFile;
  } else if (pdfFile && pdfFile.arrayBuffer) {
    arrayBuffer = await pdfFile.arrayBuffer();
  } else {
    throw new Error('Please upload a valid .pdf file to convert to Word');
  }

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const children = [];
  const totalPages = pdf.numPages;

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    const lineMap = new Map();
    for (const item of textContent.items) {
      if (!item.str || !item.str.trim()) continue;
      const y = Math.round(item.transform[5] / 4) * 4;
      if (!lineMap.has(y)) {
        lineMap.set(y, []);
      }
      lineMap.get(y).push(item);
    }

    const sortedY = Array.from(lineMap.keys()).sort((a, b) => b - a);

    for (const y of sortedY) {
      const items = lineMap.get(y).sort((a, b) => a.transform[4] - b.transform[4]);
      const lineText = items.map(it => it.str).join(' ').trim();
      if (!lineText) continue;

      const maxHeight = Math.max(...items.map(it => it.height || 12));
      const isBold = items.some(it => (it.fontName || '').toLowerCase().includes('bold'));

      if (maxHeight > 18) {
        children.push(new Paragraph({
          children: [new TextRun({ text: lineText, bold: true, size: 28, color: '0F172A' })],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 }
        }));
      } else if (maxHeight > 14) {
        children.push(new Paragraph({
          children: [new TextRun({ text: lineText, bold: true, size: 24, color: '1E293B' })],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 160, after: 80 }
        }));
      } else {
        children.push(new Paragraph({
          children: [new TextRun({ text: lineText, bold: isBold, size: 22, color: '334155' })],
          spacing: { before: 50, after: 50 }
        }));
      }
    }

    if (i < totalPages) {
      children.push(new Paragraph({
        children: [new TextRun({ text: '' })],
        pageBreakBefore: true
      }));
    }
  }

  if (children.length === 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: 'Converted from PDF.', size: 22 })]
    }));
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children
    }]
  });

  const blob = await Packer.toBlob(doc);
  return { blob, filename: filename.endsWith('.docx') ? filename : `${filename}.docx`, pageCount: totalPages };
}

/**
 * PDF → JPG Image Converter using pdfjs-dist
 */
export async function pdfToJpg(pdfFile, filename = 'document.jpg') {
  const pdfjsLib = await import('pdfjs-dist');
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }

  let arrayBuffer;
  if (pdfFile instanceof ArrayBuffer) {
    arrayBuffer = pdfFile;
  } else if (pdfFile && pdfFile.arrayBuffer) {
    arrayBuffer = await pdfFile.arrayBuffer();
  } else {
    throw new Error('Please upload a valid .pdf file to convert to JPG');
  }

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2.0 });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');

  await page.render({ canvasContext: ctx, viewport }).promise;

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.95));
  const baseName = filename.replace(/\.[^.]+$/, '');
  return {
    blob,
    filename: `${baseName}.jpg`,
    originalSize: pdfFile.size || 0,
    outputSize: blob.size,
    pageCount: pdf.numPages
  };
}

/**
 * Route document conversion based on tool ID (handles both Files and pasted text)
 */
export async function processDocTool(toolId, input, settings = {}) {
  const isFile = typeof input === 'object' && input !== null && 'name' in input;
  const fileName = isFile ? input.name : 'document.txt';
  const baseName = fileName.replace(/\.[^.]+$/, '');
  const ext = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')).toLowerCase() : '.txt';
  
  switch (toolId) {
    case 'pdf-to-jpg':
    case 'pdf-to-img': {
      return pdfToJpg(input, `${baseName}.jpg`);
    }

    case 'png-to-pdf':
    case 'image-to-pdf':
    case 'img-to-pdf': {
      return imageToPdf(input, `${baseName}.pdf`, settings);
    }

    case 'pdf-to-docx':
    case 'pdf-to-word': {
      return pdfToDocx(input, `${baseName}.docx`);
    }

    case 'docx-to-pdf':
    case 'word-to-pdf': {
      return docxToPdf(input, `${baseName}.pdf`, settings);
    }

    case 'md-to-pdf':
    case 'doc-to-pdf':
    case 'html-to-pdf':
    case 'txt-to-pdf': {
      if (ext === '.docx' || ext === '.doc') {
        return docxToPdf(input, `${baseName}.pdf`, settings);
      } else if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.bmp'].includes(ext)) {
        return imageToPdf(input, `${baseName}.pdf`, settings);
      } else if (ext === '.html' || ext === '.htm') {
        const htmlContent = isFile ? await input.text() : input;
        return htmlToPdf(htmlContent, `${baseName}.pdf`, settings);
      } else if (ext === '.md' || ext === '.markdown') {
        const mdContent = isFile ? await input.text() : input;
        const parsed = parseMarkdown(mdContent);
        const html = typeof parsed === 'string' ? parsed : (parsed.html || '');
        return htmlToPdf(html, `${baseName}.pdf`, settings);
      } else {
        const textContent = isFile ? await input.text() : input;
        return textToPdf(textContent, `${baseName}.pdf`, settings);
      }
    }

    case 'doc-to-docx':
    case 'md-to-docx':
    case 'html-to-docx': {
      if (ext === '.html' || ext === '.htm') {
        const htmlContent = isFile ? await input.text() : input;
        return htmlToDocx(htmlContent, `${baseName}.docx`);
      } else {
        const mdContent = isFile ? await input.text() : input;
        return markdownToDocx(mdContent, `${baseName}.docx`);
      }
    }

    case 'pdf-to-text':
    case 'doc-to-txt': {
      return pdfToText(input, `${baseName}.txt`);
    }

    case 'doc-to-pptx':
    case 'pdf-to-pptx':
    case 'pptx': {
      return createPptxPresentation(input, `${baseName}.pptx`);
    }

    case 'doc-to-xlsx':
    case 'csv-to-xlsx':
    case 'xlsx': {
      return documentToXlsx(input, `${baseName}.xlsx`);
    }

    case 'text-to-md':
    case 'txt-to-md':
    case 'text-to-markdown':
    case 'txt-to-markdown':
    case 'text-md': {
      return textToMarkdown(input, `${baseName}.md`, settings);
    }

    case 'text-to-latex':
    case 'file-to-latex':
    case 'md-to-latex':
    case 'docx-to-latex':
    case 'doc-to-latex':
    case 'latex': {
      const { processLatexTool } = await import('./latex-engine.js');
      return processLatexTool(toolId, input, settings);
    }

    default: {
      const cleanTarget = settings.targetFormat || (toolId.includes('-to-') ? toolId.split('-to-')[1] : 'pdf');
      if (cleanTarget.includes('docx') || cleanTarget.includes('word')) {
        return markdownToDocx(isFile ? await input.text() : input, `${baseName}.docx`);
      }
      if (cleanTarget.includes('pptx')) {
        return createPptxPresentation(input, `${baseName}.pptx`);
      }
      if (cleanTarget.includes('xlsx')) {
        return documentToXlsx(input, `${baseName}.xlsx`);
      }
      if (cleanTarget.includes('md') || cleanTarget.includes('markdown')) {
        return textToMarkdown(input, `${baseName}.md`, settings);
      }
      if (cleanTarget.includes('txt')) {
        return pdfToText(input, `${baseName}.txt`);
      }
      if (cleanTarget.includes('latex') || cleanTarget.includes('tex')) {
        const { processLatexTool } = await import('./latex-engine.js');
        return processLatexTool(toolId, input, settings);
      }
      return textToPdf(isFile ? await input.text() : input, `${baseName}.pdf`, settings);
    }
  }
}

/**
 * Generate PowerPoint PPTX presentation from document text/markdown
 */
export async function createPptxPresentation(content, filename = 'presentation.pptx') {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  const text = typeof content === 'string' ? content : (content.text ? await content.text() : '');
  const lines = text.split('\n');
  const slides = [];
  let currentSlide = { title: 'Presentation', body: [] };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
      if (currentSlide.body.length > 0 || currentSlide.title !== 'Presentation') {
        slides.push(currentSlide);
      }
      currentSlide = { title: trimmed.replace(/^#+\s*/, ''), body: [] };
    } else if (trimmed) {
      currentSlide.body.push(trimmed.replace(/^[-*+]\s*/, ''));
    }
  }
  slides.push(currentSlide);

  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  ${slides.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join('\n  ')}
</Types>`);

  zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`);

  zip.file('ppt/presentation.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <p:sldIdLst>
    ${slides.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 1}"/>`).join('\n    ')}
  </p:sldIdLst>
  <p:sldSz cx="9144000" cy="5143500"/>
</p:presentation>`);

  zip.file('ppt/_rels/presentation.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${slides.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`).join('\n  ')}
</Relationships>`);

  slides.forEach((slide, i) => {
    const escapedTitle = slide.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const bodyXml = slide.body.slice(0, 6).map(b => {
      const esc = b.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<a:p><a:r><a:rPr lang="en-US" sz="1600"/><a:t>${esc}</a:t></a:r></a:p>`;
    }).join('');

    zip.file(`ppt/slides/slide${i + 1}.xml`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr/>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
        <p:spPr><a:xfrm><a:off x="685800" y="457200"/><a:ext cx="7772400" cy="914400"/></a:xfrm></p:spPr>
        <p:txBody><a:bodyPr/><a:p><a:r><a:rPr b="1" sz="3200"/><a:t>${escapedTitle}</a:t></a:r></a:p></p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="3" name="Content"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
        <p:spPr><a:xfrm><a:off x="685800" y="1600200"/><a:ext cx="7772400" cy="3000000"/></a:xfrm></p:spPr>
        <p:txBody><a:bodyPr/>${bodyXml}</p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
</p:sld>`);
  });

  const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
  const baseName = filename.replace(/\.[^.]+$/, '');
  return {
    blob,
    filename: `${baseName}.pptx`,
    pageCount: slides.length
  };
}

/**
 * Generate Excel XLSX from text or table data
 */
export async function documentToXlsx(input, filename = 'data.xlsx') {
  const XLSX = await import('xlsx');
  const text = typeof input === 'string' ? input : (input.text ? await input.text() : '');
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const rows = lines.map(line => {
    if (line.includes('\t')) return line.split('\t');
    if (line.includes(',')) return line.split(',');
    if (line.includes('|')) return line.split('|').map(c => c.trim()).filter(Boolean);
    return [line];
  });

  const ws = XLSX.utils.aoa_to_sheet(rows.length > 0 ? rows : [['Content']]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const baseName = filename.replace(/\.[^.]+$/, '');
  return {
    blob,
    filename: `${baseName}.xlsx`,
    rowCount: rows.length
  };
}

/**
 * Plain text / unformatted text → clean, structured Markdown (.md)
 * Automatically detects headings (setext, outline, ALL CAPS), bulleted/numbered lists,
 * tables (TSV, pipe-delimited), quotes, callouts, and URLs.
 */
export async function textToMarkdown(input, filename = 'document.md', settings = {}) {
  const {
    detectHeadings = true,
    detectTables = true,
    linkify = true
  } = settings;

  let text = '';
  if (typeof input === 'string') {
    text = input;
  } else if (input instanceof File || input instanceof Blob) {
    text = await input.text();
  } else if (input && typeof input.text === 'function') {
    text = await input.text();
  } else {
    text = String(input || '');
  }

  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const rawLines = text.split('\n');
  const processedLines = [];
  let inCodeBlock = false;
  let codeFenceMarker = '';

  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // 1. Code fence detection (``` or ~~~)
    const codeFenceMatch = line.match(/^(\s*)(```|~~~)(.*)$/);
    if (codeFenceMatch) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeFenceMarker = codeFenceMatch[2];
        processedLines.push(line);
      } else if (codeFenceMatch[2] === codeFenceMarker) {
        inCodeBlock = false;
        codeFenceMarker = '';
        processedLines.push(line);
      } else {
        processedLines.push(line);
      }
      i++;
      continue;
    }

    if (inCodeBlock) {
      processedLines.push(line);
      i++;
      continue;
    }

    // 2. Setext headings (Line followed by === or ---)
    if (detectHeadings && trimmed.length > 0 && i + 1 < rawLines.length) {
      const nextTrimmed = rawLines[i + 1].trim();
      if (/^={3,}$/.test(nextTrimmed)) {
        processedLines.push(`# ${trimmed}`);
        i += 2;
        continue;
      } else if (/^-{3,}$/.test(nextTrimmed) && !/^[-*+]\s+/.test(trimmed)) {
        processedLines.push(`## ${trimmed}`);
        i += 2;
        continue;
      }
    }

    // 3. Table detection (TSV, Pipe, or aligned data)
    if (detectTables && trimmed.length > 0) {
      const isTabTable = line.includes('\t') && line.split('\t').filter(c => c.trim().length > 0).length >= 2;
      const isPipeTable = line.includes('|') && line.split('|').filter(c => c.trim().length > 0).length >= 2;

      if (isTabTable || isPipeTable) {
        const tableLines = [];
        while (i < rawLines.length) {
          const tLine = rawLines[i];
          const tTrim = tLine.trim();
          if (!tTrim) break;
          const cols = isTabTable
            ? tLine.split('\t').map(c => c.trim())
            : tLine.split('|').map(c => c.trim()).filter((c, idx, arr) => !(idx === 0 && c === '') && !(idx === arr.length - 1 && c === ''));

          if (cols.length >= 2) {
            tableLines.push(cols);
            i++;
          } else {
            break;
          }
        }

        if (tableLines.length >= 2) {
          const maxCols = Math.max(...tableLines.map(r => r.length));
          const header = tableLines[0];
          while (header.length < maxCols) header.push('');

          const formattedTable = [];
          formattedTable.push(`| ${header.join(' | ')} |`);
          formattedTable.push(`| ${header.map(() => '---').join(' | ')} |`);

          for (let r = 1; r < tableLines.length; r++) {
            const row = tableLines[r];
            if (row.every(cell => /^[-:]+$/.test(cell))) continue;
            while (row.length < maxCols) row.push('');
            formattedTable.push(`| ${row.join(' | ')} |`);
          }

          processedLines.push(formattedTable.join('\n'));
          continue;
        }
      }
    }

    // 4. ATX headings (already starts with #)
    if (/^#{1,6}\s+/.test(trimmed)) {
      processedLines.push(trimmed);
      i++;
      continue;
    }

    // 5. Headings from Outlines & Numbering
    if (detectHeadings) {
      // Chapter / Section / Part
      const chapterMatch = trimmed.match(/^(Chapter|Section|Part)\s+(\d+|[IVXLCDM]+)[:.]?\s*(.*)$/i);
      if (chapterMatch) {
        const title = chapterMatch[3] ? ` ${chapterMatch[3]}` : '';
        processedLines.push(`## ${chapterMatch[1]} ${chapterMatch[2]}${title}`);
        i++;
        continue;
      }

      // Multi-level numbered sections: 1.1.1 Title or 1.1 Title
      const subSecMatch = trimmed.match(/^(\d+\.\d+\.\d+)\s+([A-Z].*)$/);
      if (subSecMatch) {
        processedLines.push(`#### ${subSecMatch[1]} ${subSecMatch[2]}`);
        i++;
        continue;
      }
      const secMatch = trimmed.match(/^(\d+\.\d+)\s+([A-Z].*)$/);
      if (secMatch) {
        processedLines.push(`### ${secMatch[1]} ${secMatch[2]}`);
        i++;
        continue;
      }

      // Single numbered section: 1. TITLE or 1. Title (when isolated or uppercase)
      const topSecMatch = trimmed.match(/^(\d+)\.\s+([A-Z][A-Za-z0-9\s,:—–-]+)$/);
      if (topSecMatch && trimmed.length < 80) {
        const prevEmpty = i === 0 || rawLines[i - 1].trim() === '';
        const nextEmpty = i + 1 >= rawLines.length || rawLines[i + 1].trim() === '';
        if (prevEmpty || nextEmpty || topSecMatch[2] === topSecMatch[2].toUpperCase()) {
          processedLines.push(`## ${topSecMatch[1]}. ${topSecMatch[2]}`);
          i++;
          continue;
        }
      }

      // Standalone ALL-CAPS titles (e.g. "EXECUTIVE SUMMARY", "INTRODUCTION")
      const isAllCaps = /^[A-Z0-9\s,:—–-]{3,60}$/.test(trimmed) && /[A-Z]{3,}/.test(trimmed);
      if (isAllCaps && !trimmed.endsWith('.')) {
        const prevEmpty = i === 0 || rawLines[i - 1].trim() === '';
        const nextEmpty = i + 1 >= rawLines.length || rawLines[i + 1].trim() === '';
        if (prevEmpty && nextEmpty) {
          processedLines.push(`## ${trimmed}`);
          i++;
          continue;
        }
      }
    }

    // 6. Bullet lists (•, ⁃, ◦, ▪, ▫, *, -, +)
    const bulletMatch = line.match(/^(\s*)[•⁃◦▪▫\u2022\u2023\u25E6\u2043\u2219*+-](?:\s+)(.*)$/);
    if (bulletMatch) {
      const indent = bulletMatch[1].replace(/\t/g, '  ');
      const content = bulletMatch[2];
      if (/^\[([ xX])\]\s+/.test(content)) {
        const check = content.charAt(1).toLowerCase() === 'x' ? 'x' : ' ';
        const taskText = content.replace(/^\[[ xX]\]\s+/, '');
        processedLines.push(`${indent}- [${check}] ${taskText}`);
      } else {
        processedLines.push(`${indent}- ${content}`);
      }
      i++;
      continue;
    }

    // 7. Numbered lists (1., 1), (1))
    const numListMatch = line.match(/^(\s*)(?:(\d+)[.)]|\((\d+)\))\s+(.*)$/);
    if (numListMatch) {
      const indent = numListMatch[1].replace(/\t/g, '  ');
      const num = numListMatch[2] || numListMatch[3];
      const content = numListMatch[4];
      processedLines.push(`${indent}${num}. ${content}`);
      i++;
      continue;
    }

    // 8. Key-value callouts (e.g., "NOTE:", "WARNING:", "TIP:", "IMPORTANT:")
    let formattedLine = line;
    formattedLine = formattedLine.replace(/^(NOTE|WARNING|TIP|IMPORTANT|CAUTION|NOTICE):\s*/i, (match, prefix) => {
      return `> **${prefix.toUpperCase()}:** `;
    });

    // 9. Horizontal rule
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      processedLines.push('---');
      i++;
      continue;
    }

    // 10. Linkify URLs & emails
    if (linkify) {
      formattedLine = formattedLine.replace(/(?<![\[\(<])(https?:\/\/[^\s<>()]+)(?![\]\)>])/g, '<$1>');
      formattedLine = formattedLine.replace(/(?<![\[\(<:\w])([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?![\]\)>])/g, '<$1>');
    }

    processedLines.push(formattedLine);
    i++;
  }

  let markdownResult = processedLines.join('\n');
  markdownResult = markdownResult.replace(/\n{3,}/g, '\n\n').trim() + '\n';

  const outName = filename.endsWith('.md') ? filename : `${filename.replace(/\.[^.]+$/, '')}.md`;
  const blob = new Blob([markdownResult], { type: 'text/markdown;charset=utf-8;' });
  
  return {
    blob,
    filename: outName,
    text: markdownResult,
    preview: markdownResult,
    lineCount: markdownResult.split('\n').length
  };
}

