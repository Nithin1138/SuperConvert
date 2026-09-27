/**
 * SuperConvert — Data Format Conversion Engine
 * Browser-side transforms between CSV, JSON, Excel, XML, YAML, Base64, etc.
 */

function getDelimiterChar(delimSetting) {
  if (!delimSetting) return ',';
  if (delimSetting.includes('Semicolon') || delimSetting === ';') return ';';
  if (delimSetting.includes('Tab') || delimSetting === '\t') return '\t';
  if (delimSetting.includes('Pipe') || delimSetting === '|') return '|';
  return ',';
}

/**
 * CSV string → JSON array / columnar object
 */
export function csvToJson(csvString, settings = {}) {
  const delim = getDelimiterChar(settings.delimiter);
  const lines = csvString.trim().split(/\r?\n/);
  if (lines.length === 0) return [];
  
  const hasHeader = settings.headerRow !== false;
  const headers = hasHeader 
    ? parseCSVLine(lines[0], delim).map(h => h.trim()) 
    : parseCSVLine(lines[0], delim).map((_, i) => `col_${i + 1}`);

  const startIdx = hasHeader ? 1 : 0;
  const autoNum = settings.autoParseNumbers !== false;
  const autoBool = settings.autoParseBooleans !== false;
  const rows = [];

  for (let i = startIdx; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    const values = parseCSVLine(lines[i], delim);
    const row = {};
    headers.forEach((h, idx) => {
      let val = values[idx] ?? '';
      if (typeof val === 'string') {
        const trimmed = val.trim();
        if (autoNum && trimmed !== '' && !isNaN(trimmed) && !trimmed.startsWith('0x')) {
          val = Number(trimmed);
        } else if (autoBool && (trimmed.toLowerCase() === 'true' || trimmed.toLowerCase() === 'false')) {
          val = trimmed.toLowerCase() === 'true';
        }
      }
      row[h] = val;
    });
    rows.push(row);
  }

  if (settings.jsonStructure === 'Object of Arrays (Columnar)') {
    const columnar = {};
    headers.forEach(h => {
      columnar[h] = rows.map(r => r[h]);
    });
    return columnar;
  }
  if (settings.jsonStructure === '2D Array (Rows without keys)') {
    return [headers, ...rows.map(r => headers.map(h => r[h]))];
  }
  
  return rows;
}

/**
 * Parse a single CSV line (handles quoted fields & custom delimiters)
 */
function parseCSVLine(line, delimiter = ',') {
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
    } else if (ch === delimiter && !inQuotes) {
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
 * JSON array → CSV string with custom delimiter and quoting
 */
export function jsonToCsv(jsonArray, settings = {}) {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) return '';
  
  const delim = getDelimiterChar(settings.delimiter);
  const lineEnding = settings.lineEnding?.includes('CRLF') ? '\r\n' : '\n';
  const quoteOpt = settings.quoteStrings || 'Only when necessary (Standard)';
  const includeHeader = settings.includeHeader !== false;

  const headers = Object.keys(jsonArray[0]);
  const csvLines = [];
  
  if (includeHeader) {
    csvLines.push(headers.join(delim));
  }

  jsonArray.forEach(row => {
    const values = headers.map(h => {
      let val = row[h] ?? '';
      val = String(val);
      const mustQuote = quoteOpt === 'Always quote all fields' || 
        (quoteOpt !== 'Never quote' && (val.includes(delim) || val.includes('\n') || val.includes('\r') || val.includes('"')));
      if (mustQuote) {
        val = '"' + val.replace(/"/g, '""') + '"';
      }
      return val;
    });
    csvLines.push(values.join(delim));
  });
  
  return csvLines.join(lineEnding);
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

function sortObjectKeys(obj) {
  if (Array.isArray(obj)) return obj.map(sortObjectKeys);
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).sort().reduce((acc, key) => {
      acc[key] = sortObjectKeys(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

/**
 * Pretty-print JSON with optional key sorting and spacing
 */
export function formatJson(jsonString, indent = 2, settings = {}) {
  let parsed = JSON.parse(jsonString);
  if (settings.sortKeys) {
    parsed = sortObjectKeys(parsed);
  }
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
  const isFile = input instanceof File || (typeof Blob !== 'undefined' && input instanceof Blob);
  const fileName = (isFile && input.name) ? input.name : (settings.filename || 'output.txt');
  const baseName = fileName.replace(/\.[^.]+$/, '');
  const ext = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')).toLowerCase() : '';
  const textContent = isFile ? await input.text() : String(input || '');
  
  switch (toolId) {
    case 'csv-to-json': {
      const json = csvToJson(textContent, settings);
      const indent = settings.indentation === '4 Spaces' ? 4 : settings.indentation === 'Compact Minified (1 Line)' ? 0 : 2;
      const pretty = JSON.stringify(json, null, indent);
      const blob = new Blob([pretty], { type: 'application/json' });
      return { blob, filename: `${baseName}.json`, preview: pretty, rowCount: Array.isArray(json) ? json.length : Object.keys(json).length };
    }
    
    case 'data-to-json': {
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
        const json = csvToJson(textContent, settings);
        const pretty = JSON.stringify(json, null, 2);
        const blob = new Blob([pretty], { type: 'application/json' });
        return { blob, filename: `${baseName}.json`, preview: pretty, rowCount: Array.isArray(json) ? json.length : Object.keys(json).length };
      }
    }

    case 'data-to-sheet': {
      const outputType = settings.outputType || '.xlsx';
      let jsonArray;
      if (ext === '.xml') {
        const parsed = xmlToJson(textContent);
        jsonArray = Array.isArray(parsed) ? parsed : [parsed];
      } else if (ext === '.csv') {
        jsonArray = csvToJson(textContent, settings);
      } else {
        try {
          jsonArray = JSON.parse(textContent);
          if (!Array.isArray(jsonArray)) jsonArray = [jsonArray];
        } catch {
          jsonArray = csvToJson(textContent, settings);
        }
      }

      if (outputType === '.csv') {
        const csv = jsonToCsv(jsonArray, settings);
        const blob = new Blob([csv], { type: 'text/csv' });
        return { blob, filename: `${baseName}.csv`, preview: csv };
      } else {
        const excelBlob = await jsonToExcel(jsonArray, settings.sheetName || 'Data');
        return { blob: excelBlob, filename: `${baseName}.xlsx` };
      }
    }
    
    case 'json-to-csv': {
      const jsonData = JSON.parse(textContent);
      const csv = jsonToCsv(Array.isArray(jsonData) ? jsonData : [jsonData], settings);
      const blob = new Blob([csv], { type: 'text/csv' });
      return { blob, filename: `${baseName}.csv`, preview: csv };
    }
    
    case 'csv-to-excel': {
      const excelBlob = await csvToExcel(textContent, settings.sheetName || 'Sheet1');
      return { blob: excelBlob, filename: `${baseName}.xlsx` };
    }
    
    case 'json-to-excel': {
      const jsonData = JSON.parse(textContent);
      const arr = Array.isArray(jsonData) ? jsonData : [jsonData];
      const excelBlob = await jsonToExcel(arr, settings.sheetName || 'Data');
      return { blob: excelBlob, filename: `${baseName}.xlsx` };
    }
    
    case 'excel-to-csv': {
      if (!isFile) throw new Error('Excel conversion requires a file upload');
      const csv = await excelToCsv(input);
      const blob = new Blob([csv], { type: 'text/csv' });
      return { blob, filename: `${baseName}.csv`, preview: csv };
    }
    
    case 'json-formatter': {
      const indent = settings.indent === '4 spaces' ? 4 : settings.indent === 'Tab' ? '\t' : settings.indent === 'Compact Minified' ? 0 : 2;
      const formatted = formatJson(textContent, indent, settings);
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
