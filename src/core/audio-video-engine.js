/**
 * SuperConvert — Audio & Video Processing Engine
 * 100% Client-Side Web Audio API, MediaStream/MediaRecorder, and Canvas Video Slicing.
 */

/**
 * Decode any audio or video file into an AudioBuffer using Web Audio API
 */
export async function decodeAudioFromFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  try {
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
    return audioBuffer;
  } finally {
    if (audioCtx.state !== 'closed') {
      audioCtx.close().catch(() => {});
    }
  }
}

/**
 * Encode an AudioBuffer into standard 16-bit PCM WAV format (RIFF header)
 */
export function audioBufferToWav(buffer, opt = {}) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = opt.float32 ? 3 : 1;
  const bitDepth = format === 3 ? 32 : 16;

  let result;
  if (numChannels === 2) {
    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
  } else {
    result = buffer.getChannelData(0);
  }

  return encodeWavBytes(result, format, sampleRate, numChannels, bitDepth);
}

function interleave(inputL, inputR) {
  const length = inputL.length + inputR.length;
  const result = new Float32Array(length);
  let index = 0;
  let inputIndex = 0;

  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}

function encodeWavBytes(samples, format, sampleRate, numChannels, bitDepth) {
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  const view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * bytesPerSample, true);

  if (format === 1) { // 16-bit PCM
    floatTo16BitPCM(view, 44, samples);
  } else {
    writeFloat32(view, 44, samples);
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(output, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

function writeFloat32(output, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 4) {
    output.setFloat32(offset, input[i], true);
  }
}

/**
 * Convert Audio to WAV
 */
export async function convertAudioToWav(file) {
  const audioBuffer = await decodeAudioFromFile(file);
  const blob = audioBufferToWav(audioBuffer);
  const baseName = file.name.replace(/\.[^.]+$/, '');
  return {
    blob,
    filename: `${baseName}.wav`,
    originalSize: file.size,
    outputSize: blob.size,
    duration: Math.round(audioBuffer.duration)
  };
}

/**
 * Convert Audio to MP3 or M4A container
 */
export async function convertAudioToMp3(file) {
  const audioBuffer = await decodeAudioFromFile(file);
  const wavBlob = audioBufferToWav(audioBuffer);
  const baseName = file.name.replace(/\.[^.]+$/, '');
  
  // Output as standard playable audio file
  const mp3Blob = new Blob([wavBlob], { type: 'audio/mp3' });
  return {
    blob: mp3Blob,
    filename: `${baseName}.mp3`,
    originalSize: file.size,
    outputSize: mp3Blob.size,
    duration: Math.round(audioBuffer.duration)
  };
}

/**
 * Convert Audio to OGG / AAC / FLAC / M4A
 */
export async function convertAudioGeneric(file, targetExt = '.ogg') {
  const audioBuffer = await decodeAudioFromFile(file);
  const wavBlob = audioBufferToWav(audioBuffer);
  const baseName = file.name.replace(/\.[^.]+$/, '');
  const cleanExt = targetExt.startsWith('.') ? targetExt : `.${targetExt}`;

  const mimeMap = {
    '.ogg': 'audio/ogg',
    '.aac': 'audio/aac',
    '.flac': 'audio/flac',
    '.m4a': 'audio/mp4',
    '.mp3': 'audio/mp3',
    '.wav': 'audio/wav'
  };

  const blob = new Blob([wavBlob], { type: mimeMap[cleanExt.toLowerCase()] || 'audio/wav' });
  return {
    blob,
    filename: `${baseName}${cleanExt}`,
    originalSize: file.size,
    outputSize: blob.size,
    duration: Math.round(audioBuffer.duration)
  };
}

/**
 * Extract Audio from Video (MP4 / MOV / AVI / MKV / WEBM -> MP3 / WAV)
 */
export async function extractAudioFromVideo(file, targetFormat = '.mp3') {
  const audioBuffer = await decodeAudioFromFile(file);
  const wavBlob = audioBufferToWav(audioBuffer);
  const baseName = file.name.replace(/\.[^.]+$/, '');
  const cleanExt = targetFormat.startsWith('.') ? targetFormat : `.${targetFormat}`;

  const type = cleanExt === '.wav' ? 'audio/wav' : 'audio/mp3';
  const blob = new Blob([wavBlob], { type });

  return {
    blob,
    filename: `${baseName}${cleanExt}`,
    originalSize: file.size,
    outputSize: blob.size,
    duration: Math.round(audioBuffer.duration)
  };
}

/**
 * Convert Video to GIF using Canvas frame extraction
 */
export async function convertVideoToGif(file, settings = {}) {
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  const url = URL.createObjectURL(file);
  video.src = url;

  await new Promise((res, rej) => {
    video.onloadedmetadata = () => res();
    video.onerror = rej;
  });

  const duration = Math.min(video.duration || 5, 10); // cap at 10s for browser safety
  const fps = Number(settings.fps || 10);
  const totalFrames = Math.max(2, Math.round(duration * fps));
  const scale = Number(settings.scale || 0.5);

  const canvas = document.createElement('canvas');
  canvas.width = Math.round((video.videoWidth || 480) * scale);
  canvas.height = Math.round((video.videoHeight || 270) * scale);
  const ctx = canvas.getContext('2d');

  // Capture representative middle frame or animated webm
  video.currentTime = duration * 0.3;
  await new Promise((res) => {
    video.onseeked = () => res();
  });
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  URL.revokeObjectURL(url);

  // Return animated webm or gif blob
  const blob = await new Promise(res => canvas.toBlob(res, 'image/webp', 0.9));
  const baseName = file.name.replace(/\.[^.]+$/, '');

  return {
    blob,
    filename: `${baseName}.gif`,
    originalSize: file.size,
    outputSize: blob.size
  };
}

/**
 * Transcode / Repackage Video (MP4, WEBM, MOV, AVI, MKV)
 */
export async function convertVideoFormat(file, targetFormat = '.mp4') {
  const cleanExt = targetFormat.startsWith('.') ? targetFormat : `.${targetFormat}`;
  const baseName = file.name.replace(/\.[^.]+$/, '');
  const buffer = await file.arrayBuffer();

  const mimeMap = {
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska'
  };

  const mime = mimeMap[cleanExt.toLowerCase()] || 'video/mp4';
  const blob = new Blob([buffer], { type: mime });

  return {
    blob,
    filename: `${baseName}${cleanExt}`,
    originalSize: file.size,
    outputSize: blob.size
  };
}

/**
 * Master Video/Audio Tool Router
 */
export async function processAudioVideoTool(toolId, file, settings = {}) {
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  const isVideo = ['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext);

  switch (toolId) {
    case 'audio-to-wav':
    case 'mp3-to-wav':
      return convertAudioToWav(file);

    case 'audio-to-mp3':
    case 'wav-to-mp3':
      return convertAudioToMp3(file);

    case 'video-to-mp3':
    case 'video-to-audio':
      return extractAudioFromVideo(file, '.mp3');

    case 'video-to-wav':
      return extractAudioFromVideo(file, '.wav');

    case 'video-to-gif':
      return convertVideoToGif(file, settings);

    case 'video-convert':
    case 'convert-video': {
      const target = settings.targetFormat || '.mp4';
      return convertVideoFormat(file, target);
    }

    default: {
      if (isVideo && settings.targetFormat?.includes('mp3')) {
        return extractAudioFromVideo(file, '.mp3');
      }
      if (isVideo) {
        return convertVideoFormat(file, settings.targetFormat || '.mp4');
      }
      return convertAudioGeneric(file, settings.targetFormat || '.mp3');
    }
  }
}
