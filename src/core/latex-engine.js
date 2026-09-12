/**
 * SuperConvert — High-Fidelity LaTeX & Overleaf Engine
 * Converts Text, Markdown, Word (.docx), and Plain Text into production-ready,
 * fully compilable LaTeX (.tex) code and 1-click Overleaf ZIP project archives.
 */

import { marked } from 'marked';
import JSZip from 'jszip';

/**
 * Escapes standard text for LaTeX while preserving already-protected math & placeholders.
 */
function escapeLatexText(text) {
  if (!text) return '';
  return text
    // Replace backslashes that are NOT part of placeholders
    .replace(/\\(?![a-zA-Z]+|MATH_|CODE_)/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

/**
 * Extract YAML frontmatter
 */
function extractFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    return { meta: {}, body: text };
  }
  const meta = {};
  match[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim().toLowerCase();
      const val = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      meta[key] = val;
    }
  });
  return { meta, body: text.slice(match[0].length) };
}

/**
 * Language map for LaTeX lstlisting
 */
const LANGUAGE_MAP = {
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  python: 'Python',
  py: 'Python',
  c: 'C',
  cpp: 'C++',
  'c++': 'C++',
  csharp: 'C#',
  'c#': 'C#',
  java: 'Java',
  html: 'HTML',
  xml: 'XML',
  css: 'CSS',
  sql: 'SQL',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  json: 'json',
  ruby: 'Ruby',
  rb: 'Ruby',
  go: 'Go',
  golang: 'Go',
  rust: 'Rust',
  rs: 'Rust',
  php: 'PHP',
  r: 'R',
  matlab: 'Matlab',
  tex: 'TeX',
  latex: 'TeX'
};

/**
 * Converts Markdown / Text content into compilable LaTeX (.tex) code
 */
export function convertToLatex(inputContent, options = {}) {
  const {
    documentClass = 'article', // 'article' | 'IEEEtran' | 'report' | 'beamer' | 'minimal'
    paperSize = 'a4paper',       // 'a4paper' | 'letterpaper'
    fontSize = '11pt',           // '10pt' | '11pt' | '12pt'
    margin = '1in',              // '1in' | '0.75in' | '0.5in'
    includeMath = true,
    includeCodeListings = true,
    includeBooktabs = true,
    includeHyperref = true,
    twoColumn = false,
    standalone = true
  } = options;

  let raw = String(inputContent || '').trim();
  const { meta, body } = extractFrontmatter(raw);

  // Auto-detect title, author, date, abstract
  let detectedTitle = meta.title || '';
  let detectedAuthor = meta.author || 'SuperConvert Author';
  let detectedDate = meta.date || '\\today';
  let detectedAbstract = meta.abstract || '';

  // If no title in frontmatter, look for first H1
  let workingBody = body;
  if (!detectedTitle) {
    const h1Match = workingBody.match(/^#\s+(.+)$/m);
    if (h1Match) {
      detectedTitle = h1Match[1].trim();
      // Remove that H1 from body so it's not duplicated
      workingBody = workingBody.replace(/^#\s+(.+)$/m, '').trim();
    }
  }
  if (!detectedTitle) {
    detectedTitle = 'Document Title';
  }

  // 1. Extract and protect Display Math & Inline Math
  const mathPlaceholders = [];
  function protectMath(mathStr) {
    const id = `%%%SUPERCONVERT_MATH_${mathPlaceholders.length}%%%`;
    mathPlaceholders.push(mathStr);
    return id;
  }

  // Display math: $$ ... $$ or \[ ... \] or \begin{equation} ... \end{equation}
  workingBody = workingBody.replace(/\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, (m) => protectMath(m));
  workingBody = workingBody.replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, (m) => protectMath(m));
  workingBody = workingBody.replace(/\\begin\{gather\*?\}([\s\S]*?)\\end\{gather\*?\}/g, (m) => protectMath(m));
  workingBody = workingBody.replace(/\$\$([\s\S]*?)\$\$/g, (m, eq) => {
    return protectMath(`\\begin{equation}\n${eq.trim()}\n\\end{equation}`);
  });
  workingBody = workingBody.replace(/\\\[([\s\S]*?)\\\]/g, (m, eq) => {
    return protectMath(`\\begin{equation}\n${eq.trim()}\n\\end{equation}`);
  });

  // Inline math: $ ... $ (making sure not to match escaped \$)
  workingBody = workingBody.replace(/(^|[^\\])\$([^$\n]+?)\$/g, (m, prefix, eq) => {
    return `${prefix}${protectMath(`$${eq}$`)}`;
  });
  // \( ... \)
  workingBody = workingBody.replace(/\\\(([\s\S]*?)\\\)/g, (m, eq) => {
    return protectMath(`$${eq}$`);
  });

  // 2. Tokenize using marked.lexer
  const tokens = marked.lexer(workingBody);

  // 3. Render Tokens into LaTeX elements
  let bodyLatex = renderTokensToLatex(tokens, { documentClass });

  // 4. Restore Math Placeholders
  mathPlaceholders.forEach((mathStr, idx) => {
    const id = `%%%SUPERCONVERT_MATH_${idx}%%%`;
    bodyLatex = bodyLatex.split(id).join(mathStr);
  });

  // If standalone document is NOT requested, return just the body snippet
  if (!standalone) {
    return bodyLatex.trim();
  }

  // 5. Assemble Complete Overleaf-Ready Document with Preamble
  return buildFullLatexDocument({
    bodyLatex: bodyLatex.trim(),
    documentClass,
    paperSize,
    fontSize,
    margin,
    twoColumn,
    includeMath,
    includeCodeListings,
    includeBooktabs,
    includeHyperref,
    title: detectedTitle,
    author: detectedAuthor,
    date: detectedDate,
    abstract: detectedAbstract
  });
}

/**
 * Renders parsed Markdown tokens into LaTeX body text
 */
function renderTokensToLatex(tokens, opts = {}) {
  const { documentClass } = opts;
  let out = '';
  let inBeamerFrame = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    switch (token.type) {
      case 'heading': {
        const title = renderInlineLatex(token.text);
        if (documentClass === 'beamer') {
          if (token.depth === 1) {
            if (inBeamerFrame) {
              out += `\\end{frame}\n\n`;
              inBeamerFrame = false;
            }
            out += `\\section{${title}}\n\n`;
          } else {
            if (inBeamerFrame) {
              out += `\\end{frame}\n\n`;
            }
            out += `\\begin{frame}{${title}}\n`;
            inBeamerFrame = true;
          }
        } else if (documentClass === 'report') {
          if (token.depth === 1) out += `\\chapter{${title}}\n\n`;
          else if (token.depth === 2) out += `\\section{${title}}\n\n`;
          else if (token.depth === 3) out += `\\subsection{${title}}\n\n`;
          else if (token.depth === 4) out += `\\subsubsection{${title}}\n\n`;
          else out += `\\paragraph{${title}}\n\n`;
        } else {
          // article / IEEEtran / minimal
          if (token.depth === 1) out += `\\section{${title}}\n\n`;
          else if (token.depth === 2) out += `\\subsection{${title}}\n\n`;
          else if (token.depth === 3) out += `\\subsubsection{${title}}\n\n`;
          else if (token.depth === 4) out += `\\paragraph{${title}}\n\n`;
          else out += `\\subparagraph{${title}}\n\n`;
        }
        break;
      }

      case 'paragraph': {
        const pText = renderInlineLatex(token.text);
        out += `${pText}\n\n`;
        break;
      }

      case 'code': {
        const lang = (token.lang || '').toLowerCase().trim();
        const mappedLang = LANGUAGE_MAP[lang] || '';
        const langOpt = mappedLang ? `[language=${mappedLang}]` : '';
        out += `\\begin{lstlisting}${langOpt}\n${token.text}\n\\end{lstlisting}\n\n`;
        break;
      }

      case 'table': {
        out += renderTableToLatex(token);
        break;
      }

      case 'list': {
        out += renderListToLatex(token);
        break;
      }

      case 'blockquote': {
        const innerText = renderInlineLatex(token.text.replace(/^>\s*/gm, ''));
        out += `\\begin{quote}\n${innerText}\n\\end{quote}\n\n`;
        break;
      }

      case 'hr': {
        out += `\\noindent\\rule{\\textwidth}{0.4pt}\n\n`;
        break;
      }

      case 'space': {
        // Just spacing
        break;
      }

      default: {
        if (token.text) {
          out += `${renderInlineLatex(token.text)}\n\n`;
        }
        break;
      }
    }
  }

  if (inBeamerFrame) {
    out += `\\end{frame}\n\n`;
  }

  return out;
}

/**
 * Render inline markdown tokens (bold, italic, code, links, math placeholders) to LaTeX
 */
function renderInlineLatex(text) {
  if (!text) return '';

  // Extract math placeholders so they aren't damaged by inline parsing
  const extractedPlaceholders = [];
  let s = text.replace(/%%%SUPERCONVERT_MATH_\d+%%%/g, match => {
    const idx = extractedPlaceholders.length;
    extractedPlaceholders.push(match);
    return `§§MATHPH${idx}§§`;
  });

  // Escape special LaTeX characters first
  s = escapeLatexText(s);

  // Bold & Italic: ***text***
  s = s.replace(/(\*{3}|_{3})(.*?)\1/g, '\\textbf{\\textit{$2}}');

  // Bold: **text** or __text__
  s = s.replace(/(\*{2}|_{2})(.*?)\1/g, '\\textbf{$2}');

  // Italic: *text* or _text_
  s = s.replace(/(\*|_)(.*?)\1/g, '\\textit{$2}');

  // Inline code: `code`
  s = s.replace(/`([^`]+)`/g, '\\texttt{$1}');

  // Strikethrough: ~~text~~
  s = s.replace(/~~(.*?)~~/g, '\\sout{$1}');

  // Hyperlinks: [label](url)
  s = s.replace(/\[(.*?)\]\((.*?)\)/g, '\\href{$2}{$1}');

  // Image: ![alt](url)
  s = s.replace(/!\[(.*?)\]\((.*?)\)/g, '\\begin{figure}[htbp]\\centering\\includegraphics[width=0.75\\textwidth]{$2}\\caption{$1}\\end{figure}');

  // Restore math placeholders
  extractedPlaceholders.forEach((ph, idx) => {
    s = s.replace(new RegExp(`§§MATHPH${idx}§§`, 'g'), ph);
  });

  return s;
}

/**
 * Render Markdown Table into clean LaTeX booktabs table
 */
function renderTableToLatex(token) {
  const colCount = token.header ? token.header.length : 1;
  const alignments = (token.align || []).map(a => {
    if (a === 'right') return 'r';
    if (a === 'center') return 'c';
    return 'l';
  });

  // Fill in any missing alignments
  while (alignments.length < colCount) {
    alignments.push('l');
  }

  const colSpec = alignments.join(' ');

  let tableLatex = `\\begin{table}[htbp]\n\\centering\n\\begin{tabular}{${colSpec}}\n\\toprule\n`;

  // Headers
  if (token.header && token.header.length > 0) {
    const headerCells = token.header.map(h => `\\textbf{${renderInlineLatex(h.text || h)}}`);
    tableLatex += `  ${headerCells.join(' & ')} \\\\\n\\midrule\n`;
  }

  // Rows
  if (token.rows && token.rows.length > 0) {
    token.rows.forEach(row => {
      const rowCells = row.map(cell => renderInlineLatex(cell.text || cell));
      tableLatex += `  ${rowCells.join(' & ')} \\\\\n`;
    });
  }

  tableLatex += `\\bottomrule\n\\end{tabular}\n\\end{table}\n\n`;
  return tableLatex;
}

/**
 * Render Markdown lists (unordered & ordered, with nested support)
 */
function renderListToLatex(token) {
  const env = token.ordered ? 'enumerate' : 'itemize';
  let out = `\\begin{${env}}\n`;

  if (token.items) {
    token.items.forEach(item => {
      let itemText = '';
      if (item.tokens && item.tokens.length > 0) {
        // Collect text and nested lists
        const nestedLists = [];
        const textParts = [];

        item.tokens.forEach(sub => {
          if (sub.type === 'list') {
            nestedLists.push(renderListToLatex(sub));
          } else {
            textParts.push(renderInlineLatex(sub.text || ''));
          }
        });

        itemText = textParts.join(' ').trim();
        out += `  \\item ${itemText}\n`;
        nestedLists.forEach(nl => {
          out += `    ${nl.trim().split('\n').join('\n    ')}\n`;
        });
      } else {
        itemText = renderInlineLatex(item.text || '');
        out += `  \\item ${itemText}\n`;
      }
    });
  }

  out += `\\end{${env}}\n\n`;
  return out;
}

/**
 * Builds the complete LaTeX document with preamble, packages, and Overleaf configurations
 */
function buildFullLatexDocument(params) {
  const {
    bodyLatex,
    documentClass,
    paperSize,
    fontSize,
    margin,
    twoColumn,
    includeMath,
    includeCodeListings,
    includeBooktabs,
    includeHyperref,
    title,
    author,
    date,
    abstract
  } = params;

  let docClassLine = '';
  const classOpts = [];
  if (fontSize) classOpts.push(fontSize);
  if (paperSize && documentClass !== 'beamer') classOpts.push(paperSize);
  if (twoColumn && documentClass !== 'beamer') classOpts.push('twocolumn');

  const optStr = classOpts.length > 0 ? `[${classOpts.join(',')}]` : '';

  if (documentClass === 'beamer') {
    docClassLine = `\\documentclass{beamer}\n\\usetheme{Madrid}\n\\usecolortheme{default}`;
  } else if (documentClass === 'IEEEtran') {
    docClassLine = `\\documentclass[conference,10pt]{IEEEtran}`;
  } else if (documentClass === 'report') {
    docClassLine = `\\documentclass${optStr}{report}`;
  } else if (documentClass === 'minimal') {
    docClassLine = `\\documentclass[11pt]{article}`;
  } else {
    docClassLine = `\\documentclass${optStr}{article}`;
  }

  let preamble = `% =========================================================================
% Generated by SuperConvert — Overleaf Ready LaTeX Document
% Compile with: pdfLaTeX, XeLaTeX, or LuaLaTeX on Overleaf (https://www.overleaf.com)
% =========================================================================

${docClassLine}

% UTF-8 and Font Encoding
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{microtype}
`;

  if (documentClass !== 'beamer' && documentClass !== 'minimal') {
    preamble += `
% Page Geometry & Margins
\\usepackage[margin=${margin}]{geometry}
`;
  }

  if (includeMath) {
    preamble += `
% Mathematical Formatting & Symbols
\\usepackage{amsmath,amssymb,amsfonts,amsthm}
`;
  }

  preamble += `
% Graphics & Visuals
\\usepackage{graphicx}
\\usepackage{xcolor}
\\usepackage[normalem]{ulem} % for strikethrough (\\sout)
`;

  if (includeBooktabs) {
    preamble += `
% Advanced Tables
\\usepackage{booktabs}
\\usepackage{tabularx}
\\usepackage{array}
`;
  }

  if (includeCodeListings) {
    preamble += `
% Syntax-Highlighted Code Listings
\\usepackage{listings}
\\lstset{
    basicstyle=\\ttfamily\\footnotesize,
    breaklines=true,
    captionpos=b,
    frame=single,
    numbers=left,
    numberstyle=\\tiny\\color{gray},
    keywordstyle=\\color{blue}\\bfseries,
    commentstyle=\\color{green!60!black}\\itshape,
    stringstyle=\\color{orange!80!black},
    showstringspaces=false,
    tabsize=2
}
`;
  }

  if (includeHyperref && documentClass !== 'beamer') {
    preamble += `
% Hyperlinks & Navigation
\\usepackage{hyperref}
\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    filecolor=magenta,
    urlcolor=teal,
    citecolor=blue,
    pdftitle={${escapeLatexText(title)}},
    pdfauthor={${escapeLatexText(author)}}
}
`;
  }

  preamble += `
% Document Metadata
\\title{${escapeLatexText(title)}}
\\author{${escapeLatexText(author)}}
\\date{${date || '\\today'}}

\\begin{document}
`;

  if (documentClass === 'beamer') {
    preamble += `
\\begin{frame}
  \\titlepage
\\end{frame}
`;
  } else {
    preamble += `
\\maketitle
`;
  }

  if (abstract && documentClass !== 'beamer') {
    preamble += `
\\begin{abstract}
${escapeLatexText(abstract)}
\\end{abstract}
`;
  }

  const postamble = `
\\end{document}
`;

  return `${preamble}\n${bodyLatex}\n${postamble}`.trim();
}

/**
 * Creates an Overleaf-ready ZIP archive
 * Contains main.tex, README.md with compilation instructions, and an empty figures/ folder.
 */
export async function createOverleafZip(latexCode, projectTitle = 'superconvert-overleaf') {
  const zip = new JSZip();

  // 1. main.tex
  zip.file('main.tex', latexCode);

  // 2. README.md with Overleaf guide
  const readmeContent = `# ${projectTitle} — Overleaf Project

This LaTeX project was generated automatically by **SuperConvert** and is formatted for immediate compilation on **Overleaf**.

## Quick Start on Overleaf
1. Go to [Overleaf](https://www.overleaf.com/project).
2. Click **New Project** $\\rightarrow$ **Upload Project**.
3. Select this \`.zip\` archive or drag & drop it directly into your browser.
4. Click the green **Recompile** button in Overleaf.

## Recommended Compiler Settings
- **Compiler**: pdfLaTeX, XeLaTeX, or LuaLaTeX (default pdfLaTeX is 100% compatible).
- **TeX Live Version**: 2022 or newer.
- **Main Document**: \`main.tex\`

## Included Packages
- \`amsmath, amssymb, amsfonts, amsthm\` (Math formulas and theorems)
- \`booktabs, tabularx\` (Professional tables)
- \`listings\` (Code syntax highlighting)
- \`graphicx, xcolor\` (Images and color formatting)
- \`hyperref\` (Clickable URLs and PDF bookmarks)

Enjoy writing in LaTeX!
`;
  zip.file('README.md', readmeContent);

  // 3. Figures placeholder
  const figuresFolder = zip.folder('figures');
  if (figuresFolder) {
    figuresFolder.file('.gitkeep', '');
  }

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  return zipBlob;
}

/**
 * Converts Word (.docx) file to Markdown/LaTeX
 */
export async function docxToLatex(docxFile, options = {}) {
  const mammoth = await import('mammoth');

  let arrayBuffer;
  if (docxFile instanceof ArrayBuffer) {
    arrayBuffer = docxFile;
  } else if (docxFile && docxFile.arrayBuffer) {
    arrayBuffer = await docxFile.arrayBuffer();
  } else {
    throw new Error('Please upload a valid Microsoft Word (.docx) document');
  }

  const mammothResult = await mammoth.convertToHtml({ arrayBuffer });
  const html = mammothResult.value;

  // Convert HTML to structured Markdown
  let md = html
    .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
    .replace(/<code>(.*?)<\/code>/gi, '`$1`')
    .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<ul>([\s\S]*?)<\/ul>/gi, '$1\n')
    .replace(/<ol>([\s\S]*?)<\/ol>/gi, '$1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  return convertToLatex(md, options);
}

/**
 * Main tool handler called by SuperConvert router
 */
export async function processLatexTool(toolId, input, settings = {}) {
  let content = '';
  let baseName = 'document';

  const isFile = input instanceof File || input instanceof Blob;

  if (isFile) {
    const rawName = input.name || 'document.txt';
    baseName = rawName.replace(/\.[^/.]+$/, '');

    if (rawName.match(/\.(docx|doc)$/i)) {
      const latexCode = await docxToLatex(input, settings);
      const latexBlob = new Blob([latexCode], { type: 'application/x-tex;charset=utf-8' });
      const zipBlob = await createOverleafZip(latexCode, baseName);

      return {
        blob: latexBlob,
        filename: `${baseName}.tex`,
        preview: latexCode,
        latex: latexCode,
        isLatex: true,
        overleafZipBlob: zipBlob,
        overleafZipName: `${baseName}-overleaf.zip`,
        originalSize: input.size,
        compressedSize: latexBlob.size,
        stats: {
          lines: latexCode.split('\n').length,
          chars: latexCode.length,
          words: latexCode.split(/\s+/).length
        }
      };
    } else {
      content = await input.text();
    }
  } else if (typeof input === 'string') {
    content = input;
    baseName = settings.title ? settings.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'document';
  } else {
    content = String(input || '');
  }

  if (!content.trim()) {
    throw new Error('Please enter some text, markdown, or upload a file to convert to LaTeX');
  }

  const latexCode = convertToLatex(content, settings);
  const latexBlob = new Blob([latexCode], { type: 'application/x-tex;charset=utf-8' });
  const zipBlob = await createOverleafZip(latexCode, baseName);

  return {
    blob: latexBlob,
    filename: `${baseName}.tex`,
    preview: latexCode,
    latex: latexCode,
    isLatex: true,
    overleafZipBlob: zipBlob,
    overleafZipName: `${baseName}-overleaf.zip`,
    originalSize: isFile ? input.size : new Blob([content]).size,
    compressedSize: latexBlob.size,
    stats: {
      lines: latexCode.split('\n').length,
      chars: latexCode.length,
      words: latexCode.split(/\s+/).length
    }
  };
}
