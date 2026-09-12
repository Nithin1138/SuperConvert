/**
 * SuperConvert — Data Format Conversion Engine
 * Browser-side transforms between CSV, JSON, Excel, XML, YAML, Base64, etc.
 */

/**
 * CSV string → JSON array
 */
export function csvToJson(csvString) {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = parseCSVLine(lines[0]);
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => {
      let val = values[idx] || '';
      // Auto-detect numbers
      if (val !== '' && !isNaN(val) && val.trim() !== '') {
        val = Number(val);
      }
      row[h.trim()] = val;
    });
    result.push(row);
  }
  
  return result;
}

/**
 * Parse a single CSV line (handles quoted fields)
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

/**
 * JSON array → CSV string
 */
export function jsonToCsv(jsonArray) {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) return '';
  
  const headers = Object.keys(jsonArray[0]);
  const csvLines = [headers.join(',')];
  
  jsonArray.forEach(row => {
    const values = headers.map(h => {
      let val = row[h] ?? '';
      val = String(val);
      // Quote if contains comma, newline, or quote
      if (val.includes(',') || val.includes('\n') || val.includes('"')) {
        val = '"' + val.replace(/"/g, '""') + '"';
      }
      return val;
    });
    csvLines.push(values.join(','));
  });
  
  return csvLines.join('\n');
}

/**
 * CSV string → Excel workbook (.xlsx) via SheetJS
 */
export async function csvToExcel(csvString, sheetName = 'Sheet1') {
  const XLSX = await import('xlsx');
  const jsonData = csvToJson(csvString);
  
  const ws = XLSX.utils.json_to_sheet(jsonData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

/**
 * JSON array → Excel workbook (.xlsx) via SheetJS
 */
export async function jsonToExcel(jsonArray, sheetName = 'Sheet1') {
  const XLSX = await import('xlsx');
  
  const ws = XLSX.utils.json_to_sheet(jsonArray);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

/**
 * Excel workbook → CSV string via SheetJS
 */
export async function excelToCsv(excelFile) {
  const XLSX = await import('xlsx');
  const arrayBuffer = await excelFile.arrayBuffer();
  const wb = XLSX.read(arrayBuffer, { type: 'array' });
  
  // Get first sheet
  const firstSheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_csv(firstSheet);
}

/**
 * Pretty-print JSON
 */
export function formatJson(jsonString, indent = 2) {
  const parsed = JSON.parse(jsonString);
  return JSON.stringify(parsed, null, indent);
}

/**
 * XML string → JSON object (DOM-based)
 */
export function xmlToJson(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('Invalid XML: ' + errorNode.textContent);
  }
  
  function nodeToJson(node) {
    const obj = {};
    
    // Attributes
    if (node.attributes && node.attributes.length > 0) {
      obj['@attributes'] = {};
      for (let i = 0; i < node.attributes.length; i++) {
        obj['@attributes'][node.attributes[i].name] = node.attributes[i].value;
      }
    }
    
    // Children
    if (node.childNodes && node.childNodes.length > 0) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent.trim();
          if (text) {
            if (node.childNodes.length === 1) return text;
            obj['#text'] = text;
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const childResult = nodeToJson(child);
          
          if (obj[child.nodeName]) {
            if (!Array.isArray(obj[child.nodeName])) {
              obj[child.nodeName] = [obj[child.nodeName]];
            }
            obj[child.nodeName].push(childResult);
          } else {
            obj[child.nodeName] = childResult;
          }
        }
      }
    }
    
    return Object.keys(obj).length === 0 ? '' : obj;
  }
  
  const result = {};
  result[doc.documentElement.nodeName] = nodeToJson(doc.documentElement);
  return result;
}

/**
 * YAML string → JSON using js-yaml
 */
export async function yamlToJson(yamlString) {
  const jsYaml = await import('js-yaml');
  return jsYaml.load(yamlString);
}

/**
 * Base64 encode
 */
export function base64Encode(input) {
  if (typeof input === 'string') {
    return btoa(unescape(encodeURIComponent(input)));
  }
  // ArrayBuffer
  const uint8 = new Uint8Array(input);
  let binary = '';
  uint8.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary);
}

/**
 * Base64 decode
 */
export function base64Decode(base64String) {
  try {
    return decodeURIComponent(escape(atob(base64String.trim())));
  } catch {
    return atob(base64String.trim());
  }
}

/**
 * URL encode
 */
export function urlEncode(input) {
  return encodeURIComponent(input);
}

/**
 * URL decode
 */
export function urlDecode(input) {
  return decodeURIComponent(input);
}

/**
 * Minify HTML
 */
export function minifyHtml(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s+>/g, '>')
    .replace(/<\s+/g, '<')
    .trim();
}

/**
 * Minify CSS
 */
export function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

/**
 * Minify JavaScript (basic)
 */
export function minifyJs(js) {
  return js
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,=+\-*/<>!&|?:])\s*/g, '$1')
    .trim();
}

/**
 * Route data/code tool processing
 */
export async function processDataTool(toolId, input, settings = {}) {
  const isFile = input instanceof File;
  const textContent = isFile ? await input.text() : input;
  const baseName = isFile ? input.name.replace(/\.[^.]+$/, '') : 'output';
  
  switch (toolId) {
    case 'csv-to-json': {
      const json = csvToJson(textContent);
      const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
      return { blob, filename: `${baseName}.json`, preview: JSON.stringify(json, null, 2), rowCount: json.length };
    }
    
    case 'data-to-json':
    case 'csv-to-json': {
      if (ext === '.xlsx' || ext === '.xls') {
        const XLSX = await import('xlsx');
        const buffer = await input.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(firstSheet);
        const pretty = JSON.stringify(json, null, 2);
        const blob = new Blob([pretty], { type: 'application/json' });
        return { blob, filename: `${baseName}.json`, preview: pretty, rowCount: json.length };
      } else if (ext === '.xml') {
        const json = xmlToJson(textContent);
        const pretty = JSON.stringify(json, null, 2);
        const blob = new Blob([pretty], { type: 'application/json' });
        return { blob, filename: `${baseName}.json`, preview: pretty };
      } else if (ext === '.yaml' || ext === '.yml') {
        const json = await yamlToJson(textContent);
        const pretty = JSON.stringify(json, null, 2);
        const blob = new Blob([pretty], { type: 'application/json' });
        return { blob, filename: `${baseName}.json`, preview: pretty };
      } else {
        const json = csvToJson(textContent);
        const pretty = JSON.stringify(json, null, 2);
        const blob = new Blob([pretty], { type: 'application/json' });
        return { blob, filename: `${baseName}.json`, preview: pretty, rowCount: json.length };
      }
    }

    case 'data-to-sheet': {
      const outputType = settings.outputType || '.xlsx';
      let jsonArray;
      if (ext === '.xml') {
        const parsed = xmlToJson(textContent);
        jsonArray = Array.isArray(parsed) ? parsed : [parsed];
      } else if (ext === '.csv') {
        jsonArray = csvToJson(textContent);
      } else {
        try {
          jsonArray = JSON.parse(textContent);
          if (!Array.isArray(jsonArray)) jsonArray = [jsonArray];
        } catch {
          jsonArray = csvToJson(textContent);
        }
      }

      if (outputType === '.csv') {
        const csv = jsonToCsv(jsonArray);
        const blob = new Blob([csv], { type: 'text/csv' });
        return { blob, filename: `${baseName}.csv`, preview: csv };
      } else {
        const excelBlob = await jsonToExcel(jsonArray);
        return { blob: excelBlob, filename: `${baseName}.xlsx` };
      }
    }
    
    case 'json-to-csv': {
      const jsonData = JSON.parse(textContent);
      const csv = jsonToCsv(Array.isArray(jsonData) ? jsonData : [jsonData]);
      const blob = new Blob([csv], { type: 'text/csv' });
      return { blob, filename: `${baseName}.csv`, preview: csv };
    }
    
    case 'csv-to-excel': {
      const excelBlob = await csvToExcel(textContent);
      return { blob: excelBlob, filename: `${baseName}.xlsx` };
    }
    
    case 'json-to-excel': {
      const jsonData = JSON.parse(textContent);
      const arr = Array.isArray(jsonData) ? jsonData : [jsonData];
      const excelBlob = await jsonToExcel(arr);
      return { blob: excelBlob, filename: `${baseName}.xlsx` };
    }
    
    case 'excel-to-csv': {
      if (!isFile) throw new Error('Excel conversion requires a file upload');
      const csv = await excelToCsv(input);
      const blob = new Blob([csv], { type: 'text/csv' });
      return { blob, filename: `${baseName}.csv`, preview: csv };
    }
    
    case 'json-formatter': {
      const indent = settings.indent === '4 spaces' ? 4 : settings.indent === 'Tab' ? '\t' : 2;
      const formatted = formatJson(textContent, indent);
      const blob = new Blob([formatted], { type: 'application/json' });
      return { blob, filename: `${baseName}-formatted.json`, preview: formatted };
    }
    
    case 'xml-to-json': {
      const json = xmlToJson(textContent);
      const pretty = JSON.stringify(json, null, 2);
      const blob = new Blob([pretty], { type: 'application/json' });
      return { blob, filename: `${baseName}.json`, preview: pretty };
    }
    
    case 'yaml-to-json': {
      const json = await yamlToJson(textContent);
      const pretty = JSON.stringify(json, null, 2);
      const blob = new Blob([pretty], { type: 'application/json' });
      return { blob, filename: `${baseName}.json`, preview: pretty };
    }

    case 'base64-studio':
    case 'base64-encode':
    case 'base64-decode': {
      const mode = settings.mode || (toolId === 'base64-decode' ? 'Decode' : 'Encode');
      if (mode === 'Decode') {
        const decoded = base64Decode(textContent);
        const blob = new Blob([decoded], { type: 'text/plain' });
        return { blob, filename: `${baseName}-decoded.txt`, preview: decoded };
      } else {
        let encoded;
        if (isFile && input.type && !input.type.startsWith('text/')) {
          const buffer = await input.arrayBuffer();
          encoded = base64Encode(buffer);
        } else {
          encoded = base64Encode(textContent);
        }
        const blob = new Blob([encoded], { type: 'text/plain' });
        return { blob, filename: `${baseName}-base64.txt`, preview: encoded };
      }
    }

    case 'url-codec':
    case 'url-encode': {
      const mode = settings.mode || 'Encode';
      const result = mode === 'Decode' ? urlDecode(textContent) : urlEncode(textContent);
      const blob = new Blob([result], { type: 'text/plain' });
      return { blob, filename: `${baseName}-${mode.toLowerCase()}.txt`, preview: result };
    }
    
    case 'code-minify':
    case 'minify': {
      let lang = (settings.language || 'Auto-Detect').toLowerCase();
      if (lang === 'auto-detect') {
        if (ext === '.css') lang = 'css';
        else if (ext === '.js') lang = 'javascript';
        else lang = 'html';
      }

      let result;
      if (lang === 'css') result = minifyCss(textContent);
      else if (lang === 'javascript') result = minifyJs(textContent);
      else result = minifyHtml(textContent);
      
      const outExt = lang === 'css' ? '.css' : lang === 'javascript' ? '.js' : '.html';
      const blob = new Blob([result], { type: 'text/plain' });
      const origSize = new Blob([textContent]).size;
      const newSize = blob.size;
      return { 
        blob, 
        filename: `${baseName}.min${outExt}`, 
        preview: result,
        originalSize: origSize,
        compressedSize: newSize,
        savings: Math.round((1 - newSize / (origSize || 1)) * 100)
      };
    }
    
    default:
      throw new Error(`Unknown data tool: ${toolId}`);
  }
}
