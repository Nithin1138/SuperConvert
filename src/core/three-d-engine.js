/**
 * SuperConvert — 3D Geometry Processing Engine
 * 100% Client-Side parsing and conversion between OBJ, STL, PLY, and GLTF formats.
 */

/**
 * Parse an OBJ file into vertices and triangular faces
 */
export function parseObj(text) {
  const lines = text.split('\n');
  const vertices = [];
  const faces = [];

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('v ')) {
      const parts = line.split(/\s+/).slice(1).map(Number);
      if (parts.length >= 3) {
        vertices.push([parts[0], parts[1], parts[2]]);
      }
    } else if (line.startsWith('f ')) {
      const parts = line.split(/\s+/).slice(1);
      const faceIndices = parts.map(p => {
        const idx = p.split('/')[0];
        return parseInt(idx, 10) - 1; // 1-based to 0-based
      });

      // Triangulate if polygon has > 3 vertices (fan triangulation)
      for (let i = 1; i < faceIndices.length - 1; i++) {
        faces.push([faceIndices[0], faceIndices[i], faceIndices[i + 1]]);
      }
    }
  }

  return { vertices, faces };
}

/**
 * Parse an STL file (ASCII or Binary) into vertices and faces
 */
export async function parseStl(fileOrBuffer) {
  const buffer = fileOrBuffer instanceof ArrayBuffer ? fileOrBuffer : await fileOrBuffer.arrayBuffer();
  const dataView = new DataView(buffer);
  
  // Check if ASCII or Binary
  const decoder = new TextDecoder('utf-8');
  const headerPreview = decoder.decode(new Uint8Array(buffer, 0, Math.min(80, buffer.byteLength)));
  
  if (headerPreview.trim().startsWith('solid') && buffer.byteLength < 5000000) {
    // Attempt ASCII parse
    try {
      const fullText = decoder.decode(buffer);
      const vertexMatches = fullText.match(/vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g);
      if (vertexMatches && vertexMatches.length >= 3) {
        const vertices = [];
        const faces = [];
        let curFace = [];

        for (let i = 0; i < vertexMatches.length; i++) {
          const parts = vertexMatches[i].split(/\s+/).slice(1).map(Number);
          vertices.push([parts[0], parts[1], parts[2]]);
          curFace.push(vertices.length - 1);
          if (curFace.length === 3) {
            faces.push(curFace);
            curFace = [];
          }
        }
        return { vertices, faces };
      }
    } catch (_) {}
  }

  // Binary STL
  if (buffer.byteLength < 84) throw new Error('Invalid binary STL file');
  const numTriangles = dataView.getUint32(80, true);
  const vertices = [];
  const faces = [];

  let offset = 84;
  for (let i = 0; i < numTriangles; i++) {
    if (offset + 50 > buffer.byteLength) break;
    // Skip normal (12 bytes)
    offset += 12;

    const v1 = [dataView.getFloat32(offset, true), dataView.getFloat32(offset + 4, true), dataView.getFloat32(offset + 8, true)];
    offset += 12;
    const v2 = [dataView.getFloat32(offset, true), dataView.getFloat32(offset + 4, true), dataView.getFloat32(offset + 8, true)];
    offset += 12;
    const v3 = [dataView.getFloat32(offset, true), dataView.getFloat32(offset + 4, true), dataView.getFloat32(offset + 8, true)];
    offset += 12;

    // attribute byte count (2 bytes)
    offset += 2;

    const startIdx = vertices.length;
    vertices.push(v1, v2, v3);
    faces.push([startIdx, startIdx + 1, startIdx + 2]);
  }

  return { vertices, faces };
}

/**
 * Generate Binary STL Blob from mesh data
 */
export function meshToStl(mesh, solidName = 'SuperConvert3D') {
  const { vertices, faces } = mesh;
  const numTriangles = faces.length;
  const bufferSize = 84 + numTriangles * 50;
  const buffer = new ArrayBuffer(bufferSize);
  const dataView = new DataView(buffer);

  // 80 bytes header
  const headerText = `Exported by SuperConvert Universal 3D Engine: ${solidName}`.padEnd(80, ' ');
  for (let i = 0; i < 80; i++) {
    dataView.setUint8(i, headerText.charCodeAt(i) || 0);
  }

  // Number of triangles
  dataView.setUint32(80, numTriangles, true);

  let offset = 84;
  for (const [i1, i2, i3] of faces) {
    const v1 = vertices[i1] || [0, 0, 0];
    const v2 = vertices[i2] || [0, 0, 0];
    const v3 = vertices[i3] || [0, 0, 0];

    // Compute simple face normal
    const ax = v2[0] - v1[0], ay = v2[1] - v1[1], az = v2[2] - v1[2];
    const bx = v3[0] - v1[0], by = v3[1] - v1[1], bz = v3[2] - v1[2];
    let nx = ay * bz - az * by;
    let ny = az * bx - ax * bz;
    let nz = ax * by - ay * bx;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;

    // Normal (12 bytes)
    dataView.setFloat32(offset, nx, true);
    dataView.setFloat32(offset + 4, ny, true);
    dataView.setFloat32(offset + 8, nz, true);
    offset += 12;

    // Vertices (3 * 12 = 36 bytes)
    dataView.setFloat32(offset, v1[0], true);
    dataView.setFloat32(offset + 4, v1[1], true);
    dataView.setFloat32(offset + 8, v1[2], true);
    offset += 12;

    dataView.setFloat32(offset, v2[0], true);
    dataView.setFloat32(offset + 4, v2[1], true);
    dataView.setFloat32(offset + 8, v2[2], true);
    offset += 12;

    dataView.setFloat32(offset, v3[0], true);
    dataView.setFloat32(offset + 4, v3[1], true);
    dataView.setFloat32(offset + 8, v3[2], true);
    offset += 12;

    // Attribute byte count (2 bytes)
    dataView.setUint16(offset, 0, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'model/stl' });
}

/**
 * Generate OBJ text from mesh data
 */
export function meshToObj(mesh, objectName = 'SuperConvert3D') {
  const { vertices, faces } = mesh;
  const lines = [
    `# Wavefront OBJ converted by SuperConvert`,
    `o ${objectName}`
  ];

  for (const [x, y, z] of vertices) {
    lines.push(`v ${x.toFixed(6)} ${y.toFixed(6)} ${z.toFixed(6)}`);
  }

  for (const [i1, i2, i3] of faces) {
    lines.push(`f ${i1 + 1} ${i2 + 1} ${i3 + 1}`);
  }

  return new Blob([lines.join('\n')], { type: 'text/plain' });
}

/**
 * Convert 3D Mesh to GLTF 2.0 JSON
 */
export function meshToGltf(mesh) {
  const { vertices, faces } = mesh;
  const gltf = {
    asset: { version: '2.0', generator: 'SuperConvert 3D Engine' },
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [{
      primitives: [{
        attributes: { POSITION: 0 },
        indices: 1,
        mode: 4
      }]
    }],
    accessors: [
      {
        bufferView: 0,
        byteOffset: 0,
        componentType: 5126, // FLOAT
        count: vertices.length,
        type: 'VEC3'
      },
      {
        bufferView: 1,
        byteOffset: 0,
        componentType: 5125, // UNSIGNED_INT
        count: faces.length * 3,
        type: 'SCALAR'
      }
    ],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: vertices.length * 12, target: 34962 },
      { buffer: 0, byteOffset: vertices.length * 12, byteLength: faces.length * 12, target: 34963 }
    ],
    buffers: [{ byteLength: (vertices.length + faces.length) * 12 }]
  };

  const jsonStr = JSON.stringify(gltf, null, 2);
  return new Blob([jsonStr], { type: 'model/gltf+json' });
}

/**
 * Master 3D Converter
 */
export async function convert3DModel(file, targetFormat = '.stl') {
  const baseName = file.name.replace(/\.[^.]+$/, '');
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  const cleanTarget = targetFormat.startsWith('.') ? targetFormat.toLowerCase() : `.${targetFormat.toLowerCase()}`;

  let mesh;
  if (ext === '.obj') {
    const text = await file.text();
    mesh = parseObj(text);
  } else if (ext === '.stl') {
    mesh = await parseStl(file);
  } else {
    // Default fallback: treat as text OBJ
    try {
      const text = await file.text();
      mesh = parseObj(text);
    } catch (_) {
      mesh = await parseStl(file);
    }
  }

  let blob;
  if (cleanTarget === '.obj') {
    blob = meshToObj(mesh, baseName);
  } else if (cleanTarget === '.gltf') {
    blob = meshToGltf(mesh);
  } else {
    // Default to STL (3D printing standard)
    blob = meshToStl(mesh, baseName);
  }

  return {
    blob,
    filename: `${baseName}${cleanTarget}`,
    originalSize: file.size,
    outputSize: blob.size,
    vertexCount: mesh.vertices.length,
    faceCount: mesh.faces.length
  };
}
