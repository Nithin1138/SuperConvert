/**
 * SuperConvert — Image Processing Engine
 * 100% browser-side image manipulation using Canvas API.
 */

/**
 * Load an image file into an HTMLImageElement
 */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

/**
 * Get canvas MIME type for output
 */
function getMimeType(format) {
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp'
  };
  return map[format] || 'image/png';
}

/**
 * Canvas to Blob helper
 */
function canvasToBlob(canvas, mimeType, quality = 0.92) {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      mimeType,
      quality
    );
  });
}

/**
 * Get file extension from file name
 */
function getExtension(filename) {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return ext || '.png';
}

/**
 * Parse target size in bytes from preset or custom KB
 */
function parseTargetBytes(settings) {
  const preset = settings.sizePreset || 'Auto (Quality Slider)';
  if (preset.includes('100 KB')) return 100 * 1024;
  if (preset.includes('250 KB')) return 250 * 1024;
  if (preset.includes('500 KB')) return 500 * 1024;
  if (preset.includes('1 MB')) return 1024 * 1024;
  if (preset.includes('2 MB')) return 2048 * 1024;
  if (preset.includes('Custom') && settings.customKb) {
    return Math.max(10, Number(settings.customKb)) * 1024;
  }
  return 0; // 0 means use quality slider directly
}

/**
 * Compress an image preserving its EXACT SAME format, with target size templates & quality tuning
 */
export async function compressImage(file, settings = {}) {
  const ext = getExtension(file.name);
  
  // Ensure output format is EXACTLY the same as input
  let outputMime = 'image/jpeg';
  let outputExt = '.jpg';
  
  if (ext === '.webp') {
    outputMime = 'image/webp';
    outputExt = '.webp';
  } else if (ext === '.png') {
    outputMime = 'image/png';
    outputExt = '.png';
  } else if (ext === '.jpg' || ext === '.jpeg') {
    outputMime = 'image/jpeg';
    outputExt = ext;
  }

  const targetBytes = parseTargetBytes(settings);
  const baseQuality = (settings.quality || 75) / 100;
  const img = await loadImage(file);
  const baseName = file.name.replace(/\.[^.]+$/, '');

  // Case 1: Standard compression using Quality Slider (no target byte cap)
  if (!targetBytes) {
    const canvas = document.createElement('canvas');
    let scale = 1.0;

    // For PNG: if quality slider is under 80%, slightly scale resolution to achieve true PNG byte reduction
    if (outputMime === 'image/png' && baseQuality < 0.85) {
      scale = Math.max(0.4, Math.sqrt(baseQuality));
    }

    canvas.width = Math.max(80, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(80, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await canvasToBlob(canvas, outputMime, baseQuality);
    return {
      blob,
      filename: `${baseName}-compressed${outputExt}`,
      originalSize: file.size,
      compressedSize: blob.size,
      savings: Math.max(0, Math.round((1 - blob.size / file.size) * 100))
    };
  }

  // Case 2: Target Size Template Optimization (Adaptive search to match or beat targetBytes)
  let bestBlob = null;
  let attempts = 0;
  let curQuality = Math.min(0.92, baseQuality);
  let curScale = 1.0;

  while (attempts < 8) {
    attempts++;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(80, Math.round(img.naturalWidth * curScale));
    canvas.height = Math.max(80, Math.round(img.naturalHeight * curScale));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const testBlob = await canvasToBlob(canvas, outputMime, curQuality);
    bestBlob = testBlob;

    if (testBlob.size <= targetBytes) {
      break;
    }

    // Step down to meet target size
    if (outputMime === 'image/png') {
      curScale *= 0.82;
    } else {
      if (curQuality > 0.35) {
        curQuality -= 0.18;
      } else {
        curScale *= 0.8;
      }
    }
  }

  return {
    blob: bestBlob,
    filename: `${baseName}-compressed${outputExt}`,
    originalSize: file.size,
    compressedSize: bestBlob.size,
    savings: Math.max(0, Math.round((1 - bestBlob.size / file.size) * 100))
  };
}

/**
 * Combined Tool: Format Change + Size Compression
 */
export async function compressAndConvert(file, settings = {}) {
  const targetFormat = settings.targetFormat || '.webp';
  const targetMime = getMimeType(targetFormat);
  const bgColor = settings.bgColor || '#ffffff';
  const targetBytes = parseTargetBytes(settings);
  const baseQuality = (settings.quality || 80) / 100;
  const img = await loadImage(file);
  const baseName = file.name.replace(/\.[^.]+$/, '');

  let curQuality = baseQuality;
  let curScale = 1.0;
  let bestBlob = null;
  let attempts = 0;

  while (attempts < 8) {
    attempts++;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(80, Math.round(img.naturalWidth * curScale));
    canvas.height = Math.max(80, Math.round(img.naturalHeight * curScale));
    const ctx = canvas.getContext('2d');

    if (targetFormat === '.jpg' || targetFormat === '.jpeg') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const testBlob = await canvasToBlob(canvas, targetMime, curQuality);
    bestBlob = testBlob;

    if (!targetBytes || testBlob.size <= targetBytes) {
      break;
    }

    if (targetMime === 'image/png') {
      curScale *= 0.82;
    } else {
      if (curQuality > 0.35) {
        curQuality -= 0.18;
      } else {
        curScale *= 0.8;
      }
    }
  }

  return {
    blob: bestBlob,
    filename: `${baseName}-optimized${targetFormat}`,
    originalSize: file.size,
    outputSize: bestBlob.size,
    savings: Math.max(0, Math.round((1 - bestBlob.size / file.size) * 100))
  };
}

/**
 * Canvas to 24-bit uncompressed BMP Blob
 */
function canvasToBmpBlob(canvas) {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, width, height).data;

  const rowPadding = (4 - ((width * 3) % 4)) % 4;
  const rowSize = width * 3 + rowPadding;
  const pixelArraySize = rowSize * height;
  const fileSize = 54 + pixelArraySize;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  // BITMAPFILEHEADER
  view.setUint16(0, 0x4D42, false); // 'BM'
  view.setUint32(2, fileSize, true);
  view.setUint32(6, 0, true);
  view.setUint32(10, 54, true); // data offset

  // BITMAPINFOHEADER
  view.setUint32(14, 40, true); // header size
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true); // color planes
  view.setUint16(28, 24, true); // bits per pixel
  view.setUint32(30, 0, true); // compression (none)
  view.setUint32(34, pixelArraySize, true);
  view.setInt32(38, 2835, true); // horiz resolution 72 DPI
  view.setInt32(42, 2835, true); // vert resolution 72 DPI
  view.setUint32(46, 0, true);
  view.setUint32(50, 0, true);

  // Write BGR pixels bottom-to-top
  let offset = 54;
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      view.setUint8(offset++, imgData[srcIdx + 2]); // B
      view.setUint8(offset++, imgData[srcIdx + 1]); // G
      view.setUint8(offset++, imgData[srcIdx]);     // R
    }
    for (let p = 0; p < rowPadding; p++) {
      view.setUint8(offset++, 0);
    }
  }

  return new Blob([buffer], { type: 'image/bmp' });
}

/**
 * Canvas to Baseline TIFF Blob
 */
function canvasToTiffBlob(canvas) {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, width, height).data;

  // Uncompressed RGBA TIFF
  const imageBytes = width * height * 4;
  const headerSize = 8;
  const numEntries = 10;
  const ifdSize = 2 + numEntries * 12 + 4;
  const bitsPerSampleSize = 8; // 4 uint16 values: 8, 8, 8, 8
  const extraOffset = headerSize + ifdSize;
  const dataOffset = extraOffset + bitsPerSampleSize;
  const totalSize = dataOffset + imageBytes;

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // Header: II (little endian), magic 42, offset to first IFD = 8
  view.setUint8(0, 0x49);
  view.setUint8(1, 0x49);
  view.setUint16(2, 42, true);
  view.setUint32(4, 8, true);

  let ifd = 8;
  view.setUint16(ifd, numEntries, true);
  ifd += 2;

  function writeTag(tag, type, count, valOrOffset) {
    view.setUint16(ifd, tag, true);
    view.setUint16(ifd + 2, type, true);
    view.setUint32(ifd + 4, count, true);
    view.setUint32(ifd + 8, valOrOffset, true);
    ifd += 12;
  }

  writeTag(256, 4, 1, width); // ImageWidth
  writeTag(257, 4, 1, height); // ImageLength
  writeTag(258, 3, 4, extraOffset); // BitsPerSample -> extraOffset
  writeTag(259, 3, 1, 1); // Compression (none)
  writeTag(262, 3, 1, 2); // PhotometricInterpretation (RGB)
  writeTag(273, 4, 1, dataOffset); // StripOffsets
  writeTag(277, 3, 1, 4); // SamplesPerPixel
  writeTag(278, 4, 1, height); // RowsPerStrip
  writeTag(279, 4, 1, imageBytes); // StripByteCounts
  writeTag(284, 3, 1, 1); // PlanarConfiguration

  view.setUint32(ifd, 0, true); // Next IFD = 0

  // Write BitsPerSample: 8, 8, 8, 8
  view.setUint16(extraOffset, 8, true);
  view.setUint16(extraOffset + 2, 8, true);
  view.setUint16(extraOffset + 4, 8, true);
  view.setUint16(extraOffset + 6, 8, true);

  // Write RGBA bytes
  new Uint8Array(buffer, dataOffset).set(imgData);

  return new Blob([buffer], { type: 'image/tiff' });
}

/**
 * Canvas to SVG Vector Container Blob
 */
function canvasToSvgBlob(canvas) {
  const width = canvas.width;
  const height = canvas.height;
  const dataUrl = canvas.toDataURL('image/png');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <image width="${width}" height="${height}" href="${dataUrl}"/>
</svg>`;
  return new Blob([svg], { type: 'image/svg+xml' });
}

/**
 * Convert image format (PNG, JPG, WEBP, BMP, TIFF, SVG, GIF, AVIF, ICO)
 */
export async function convertImageFormat(file, targetFormat, settings = {}) {
  const quality = (settings.quality || 90) / 100;
  const bgColor = settings.bgColor || '#ffffff';
  const img = await loadImage(file);
  const cleanTarget = targetFormat.startsWith('.') ? targetFormat.toLowerCase() : `.${targetFormat.toLowerCase()}`;
  
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  
  const ctx = canvas.getContext('2d');
  
  // Fill background for JPEG / BMP (no alpha channel)
  if (['.jpg', '.jpeg', '.bmp'].includes(cleanTarget)) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  ctx.drawImage(img, 0, 0);
  
  let blob;
  if (cleanTarget === '.bmp') {
    blob = canvasToBmpBlob(canvas);
  } else if (cleanTarget === '.tiff' || cleanTarget === '.tif') {
    blob = canvasToTiffBlob(canvas);
  } else if (cleanTarget === '.svg') {
    blob = canvasToSvgBlob(canvas);
  } else if (cleanTarget === '.ico') {
    blob = await canvasToBlob(canvas, 'image/png');
  } else if (cleanTarget === '.gif') {
    blob = await canvasToBlob(canvas, 'image/gif');
  } else if (cleanTarget === '.avif') {
    blob = await canvasToBlob(canvas, 'image/avif', quality);
  } else {
    const mimeType = getMimeType(cleanTarget);
    blob = await canvasToBlob(canvas, mimeType, quality);
  }

  const baseName = file.name.replace(/\.[^.]+$/, '');
  
  return {
    blob,
    filename: `${baseName}${cleanTarget}`,
    originalSize: file.size,
    outputSize: blob.size
  };
}

/**
 * Resize image to specific dimensions
 */
export async function resizeImage(file, settings = {}) {
  const targetWidth = settings.width || 800;
  const targetHeight = settings.height || 600;
  const maintainAspect = settings.maintainAspect !== false;
  const img = await loadImage(file);
  
  let newWidth = targetWidth;
  let newHeight = targetHeight;
  
  if (maintainAspect) {
    const ratio = Math.min(targetWidth / img.naturalWidth, targetHeight / img.naturalHeight);
    newWidth = Math.round(img.naturalWidth * ratio);
    newHeight = Math.round(img.naturalHeight * ratio);
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, newWidth, newHeight);
  
  const ext = getExtension(file.name);
  const mimeType = getMimeType(ext);
  const blob = await canvasToBlob(canvas, mimeType, 0.95);
  const baseName = file.name.replace(/\.[^.]+$/, '');
  
  return {
    blob,
    filename: `${baseName}-${newWidth}x${newHeight}${ext}`,
    originalDimensions: { width: img.naturalWidth, height: img.naturalHeight },
    newDimensions: { width: newWidth, height: newHeight }
  };
}

/**
 * Crop image to a specific region or aspect ratio
 */
export async function cropImage(file, settings = {}) {
  const img = await loadImage(file);
  const cropRatio = settings.cropRatio || 'Free';
  
  let cropX = 0, cropY = 0, cropW = img.naturalWidth, cropH = img.naturalHeight;
  
  if (cropRatio !== 'Free') {
    const [rw, rh] = cropRatio.split(':').map(Number);
    const targetRatio = rw / rh;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    
    if (imgRatio > targetRatio) {
      cropW = Math.round(img.naturalHeight * targetRatio);
      cropH = img.naturalHeight;
      cropX = Math.round((img.naturalWidth - cropW) / 2);
    } else {
      cropW = img.naturalWidth;
      cropH = Math.round(img.naturalWidth / targetRatio);
      cropY = Math.round((img.naturalHeight - cropH) / 2);
    }
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = cropW;
  canvas.height = cropH;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
  
  const ext = getExtension(file.name);
  const mimeType = getMimeType(ext);
  const blob = await canvasToBlob(canvas, mimeType, 0.95);
  const baseName = file.name.replace(/\.[^.]+$/, '');
  
  return {
    blob,
    filename: `${baseName}-cropped${ext}`,
    dimensions: { width: cropW, height: cropH }
  };
}

/**
 * Convert image to grayscale
 */
export async function grayscaleImage(file) {
  const img = await loadImage(file);
  
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const avg = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  const ext = getExtension(file.name);
  const mimeType = getMimeType(ext);
  const blob = await canvasToBlob(canvas, mimeType, 0.95);
  const baseName = file.name.replace(/\.[^.]+$/, '');
  
  return {
    blob,
    filename: `${baseName}-grayscale${ext}`
  };
}

/**
 * Add text watermark to image
 */
export async function addWatermark(file, settings = {}) {
  const text = settings.watermarkText || 'CONFIDENTIAL';
  
  // Opacity parsing
  let opacity = 0.2;
  if (typeof settings.opacity === 'string') {
    opacity = (parseFloat(settings.opacity) || 20) / 100;
  } else if (typeof settings.opacity === 'number') {
    opacity = settings.opacity / 100;
  }
  
  // Repeat mode
  const isRepeat = settings.watermarkRepeat === 'Repeat Tiled Pattern' || settings.position === 'Tiled';
  
  // Angle: Straight (0°), Cross (-45°), Subtle (-30°), Vertical (-90°)
  let angleRad = -Math.PI / 4; // -45 deg default
  if (settings.watermarkDegree) {
    if (settings.watermarkDegree.includes('Straight') || settings.watermarkDegree.includes('0°')) {
      angleRad = 0;
    } else if (settings.watermarkDegree.includes('-30°')) {
      angleRad = -Math.PI / 6;
    } else if (settings.watermarkDegree.includes('-90°') || settings.watermarkDegree.includes('Vertical')) {
      angleRad = -Math.PI / 2;
    } else if (settings.watermarkDegree.includes('-45°') || settings.watermarkDegree.includes('Cross')) {
      angleRad = -Math.PI / 4;
    }
  }

  const img = await loadImage(file);
  
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  ctx.globalAlpha = opacity;
  
  // Size calculation (supports both slider pixels and preset names)
  let fontSize = 50;
  if (typeof settings.watermarkSize === 'number' || (!isNaN(Number(settings.watermarkSize)) && Number(settings.watermarkSize) > 0)) {
    const scaleFactor = Math.max(0.5, canvas.width / 800);
    fontSize = Math.max(16, Math.round(Number(settings.watermarkSize) * scaleFactor));
  } else {
    let baseRatio = 18;
    if (settings.watermarkSize === 'Small') baseRatio = 26;
    if (settings.watermarkSize === 'Large') baseRatio = 12;
    if (settings.watermarkSize === 'Extra Large') baseRatio = 8;
    fontSize = Math.max(20, Math.round(canvas.width / baseRatio));
  }
  ctx.font = `bold ${fontSize}px "Plus Jakarta Sans", -apple-system, sans-serif`;
  ctx.fillStyle = '#000000';
  
  if (isRepeat) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angleRad);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    
    const spacingX = fontSize * 7;
    const spacingY = fontSize * 4;
    
    for (let y = -canvas.height; y < canvas.height * 2; y += spacingY) {
      for (let x = -canvas.width; x < canvas.width * 2; x += spacingX) {
        ctx.fillText(text, x, y);
      }
    }
    ctx.restore();
  } else {
    // Single Stamp (Straight or Cross at Center)
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angleRad);
    const metrics = ctx.measureText(text);
    ctx.fillText(text, -metrics.width / 2, fontSize / 3);
    ctx.restore();
  }
  
  ctx.globalAlpha = 1;
  
  const ext = getExtension(file.name);
  const mimeType = getMimeType(ext);
  const blob = await canvasToBlob(canvas, mimeType, 0.95);
  const baseName = file.name.replace(/\.[^.]+$/, '');
  
  return {
    blob,
    filename: `${baseName}-watermarked${ext}`
  };
}

/**
 * Route image conversion based on tool ID
 */
export async function processImageTool(toolId, file, settings = {}) {
  switch (toolId) {
    case 'image-convert': {
      const targetFormat = settings.targetFormat || '.webp';
      return convertImageFormat(file, targetFormat, settings);
    }
    case 'image-compress': {
      return compressImage(file, settings);
    }
    case 'image-compress-convert': {
      return compressAndConvert(file, settings);
    }
    case 'image-resize': {
      if (settings.cropRatio && settings.cropRatio !== 'Free') {
        return cropImage(file, settings);
      }
      return resizeImage(file, settings);
    }
    case 'image-effects': {
      if (settings.effect === 'Watermark') {
        return addWatermark(file, settings);
      }
      return grayscaleImage(file);
    }

    // Dedicated popular formats
    case 'png-to-jpg':
      return convertImageFormat(file, '.jpg', settings);
    case 'jpg-to-png':
      return convertImageFormat(file, '.png', settings);
    case 'webp-to-png':
      return convertImageFormat(file, '.png', settings);
    case 'png-to-webp':
      return convertImageFormat(file, '.webp', settings);
    case 'png-to-ico':
    case 'image-to-ico':
      return convertImageToIco(file);
    case 'png-to-bmp':
    case 'image-to-bmp':
      return convertImageFormat(file, '.bmp', settings);
    case 'png-to-tiff':
    case 'image-to-tiff':
      return convertImageFormat(file, '.tiff', settings);
    case 'image-to-svg':
      return convertImageFormat(file, '.svg', settings);
    case 'image-to-gif':
      return convertImageFormat(file, '.gif', settings);
    case 'image-crop':
      return cropImage(file, settings);
    case 'image-grayscale':
      return grayscaleImage(file);
    case 'image-watermark':
      return addWatermark(file, settings);
    default: {
      const target = settings.targetFormat || (toolId.includes('-to-') ? `.${toolId.split('-to-')[1]}` : '.png');
      return convertImageFormat(file, target, settings);
    }
  }
}

/**
 * Convert Image to ICO Favicon format
 */
export async function convertImageToIco(file) {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, 64, 64);
  const blob = await canvasToBlob(canvas, 'image/png');
  const baseName = file.name.replace(/\.[^.]+$/, '');
  return {
    blob,
    filename: `${baseName}.ico`,
    originalSize: file.size,
    outputSize: blob.size
  };
}
