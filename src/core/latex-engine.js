/**
 * SuperConvert — High-Fidelity LaTeX & Overleaf Engine
 * Converts Text, Markdown, Word (.docx), and Plain Text into production-ready,
 * fully compilable LaTeX (.tex) code and 1-click Overleaf ZIP project archives.
 */

import { marked } from 'marked';
import JSZip from 'jszip';
import katex from 'katex';

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
        } else if (documentClass === 'cv') {
          if (token.depth === 1) out += `\\cvsection{${title}}\n\n`;
          else if (token.depth === 2) out += `\\subsection*{${title}}\n\n`;
          else out += `\\textbf{${title}}\\\\[0.2em]\n\n`;
        } else if (documentClass === 'assignment') {
          if (token.depth === 1) out += `\\section*{${title}}\n\n`;
          else if (token.depth === 2) out += `\\subsection*{${title}}\n\n`;
          else out += `\\subsubsection*{${title}}\n\n`;
        } else {
          // article / IEEEtran / executive / minimal
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
    documentClass = 'article',
    paperSize = 'a4paper',
    fontSize = '11pt',
    margin = '1in',
    twoColumn = false,
    includeMath = true,
    includeCodeListings = true,
    includeBooktabs = true,
    includeHyperref = true,
    title = 'SuperConvert Document',
    author = 'SuperConvert Author',
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
    docClassLine = `\\documentclass[aspectratio=169,11pt]{beamer}\n\\usetheme{Madrid}\n\\usecolortheme{whale}\n\\setbeamertemplate{navigation symbols}{}\n\\setbeamertemplate{footline}[page number]`;
  } else if (documentClass === 'IEEEtran') {
    docClassLine = `\\documentclass[conference,10pt]{IEEEtran}`;
  } else if (documentClass === 'report') {
    docClassLine = `\\documentclass${optStr}{report}`;
  } else if (documentClass === 'cv') {
    docClassLine = `\\documentclass[10pt,${paperSize}]{article}`;
  } else if (documentClass === 'assignment') {
    docClassLine = `\\documentclass[11pt,${paperSize}]{article}`;
  } else if (documentClass === 'executive') {
    docClassLine = `\\documentclass[11pt,${paperSize}]{article}`;
  } else if (documentClass === 'minimal') {
    docClassLine = `\\documentclass[11pt]{article}`;
  } else {
    docClassLine = `\\documentclass${optStr}{article}`;
  }

  let preamble = `% =========================================================================
% Generated by SuperConvert — Production Ready LaTeX Document
% Template: ${documentClass.toUpperCase()}
% Compatible with: pdfLaTeX, XeLaTeX, LuaLaTeX & Overleaf
% =========================================================================

${docClassLine}

% UTF-8 and Standard Typography Encoding
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{microtype}
`;

  if (documentClass !== 'beamer' && documentClass !== 'minimal') {
    const effectiveMargin = documentClass === 'cv' ? '0.75in' : margin;
    preamble += `
% Page Geometry & Margins
\\usepackage[margin=${effectiveMargin}]{geometry}
`;
  }

  if (includeMath) {
    preamble += `
% Mathematical Formatting & Advanced Symbols
\\usepackage{amsmath,amssymb,amsfonts,amsthm}
\\usepackage{mathtools}
`;
  }

  preamble += `
% Graphics & Visual Styling
\\usepackage{graphicx}
\\usepackage{xcolor}
\\usepackage[normalem]{ulem} % for strikethrough (\\sout)
`;

  if (includeBooktabs) {
    preamble += `
% Advanced Academic Tables
\\usepackage{booktabs}
\\usepackage{tabularx}
\\usepackage{array}
\\usepackage{multirow}
`;
  }

  if (includeCodeListings) {
    preamble += `
% Code Listings with Modern Palette
\\usepackage{listings}
\\lstset{
    basicstyle=\\ttfamily\\footnotesize,
    breaklines=true,
    captionpos=b,
    frame=single,
    rulecolor=\\color{black!20},
    numbers=left,
    numberstyle=\\tiny\\color{gray},
    keywordstyle=\\color{blue!80!black}\\bfseries,
    commentstyle=\\color{green!60!black}\\itshape,
    stringstyle=\\color{orange!80!black},
    showstringspaces=false,
    tabsize=2,
    backgroundcolor=\\color{gray!5}
}
`;
  }

  if (includeHyperref && documentClass !== 'beamer') {
    preamble += `
% Hyperlinks & PDF Metadata
\\usepackage{hyperref}
\\hypersetup{
    colorlinks=true,
    linkcolor=blue!70!black,
    filecolor=magenta,
    urlcolor=teal,
    citecolor=blue!70!black,
    pdftitle={${escapeLatexText(title)}},
    pdfauthor={${escapeLatexText(author)}}
}
`;
  }

  // Template-specific enhancements
  if (documentClass === 'article') {
    preamble += `
% Academic Theorem & Proof Environments
\\theoremstyle{plain}
\\newtheorem{theorem}{Theorem}[section]
\\newtheorem{lemma}[theorem]{Lemma}
\\newtheorem{corollary}[theorem]{Corollary}
\\theoremstyle{definition}
\\newtheorem{definition}{Definition}[section]
\\newtheorem{example}{Example}[section]
\\theoremstyle{remark}
\\newtheorem{remark}{Remark}

% Headers & Footers
\\usepackage{fancyhdr}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\small\\itshape ${escapeLatexText(title)}}
\\fancyhead[R]{\\small\\thepage}
\\renewcommand{\\headrulewidth}{0.4pt}
`;
  } else if (documentClass === 'report') {
    preamble += `
% Dissertation & Thesis Styling
\\usepackage{setspace}
\\onehalfspacing
\\usepackage{fancyhdr}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\slshape \\leftmark}
\\fancyhead[R]{\\thepage}
\\renewcommand{\\headrulewidth}{0.4pt}
`;
  } else if (documentClass === 'cv') {
    preamble += `
% Modern Curriculum Vitae Command Definitions
\\newcommand{\\cvsection}[1]{%
  \\vspace{1.2em}%
  \\noindent{\\Large\\bfseries\\color{blue!70!black} #1}\\\\[-0.4em]%
  \\noindent{\\color{blue!70!black}\\rule{\\textwidth}{1.2pt}}%
  \\vspace{0.4em}%
}
\\newcommand{\\cventry}[4]{%
  \\noindent\\textbf{#1} \\hfill \\textit{#2}\\\\%
  \\textsl{#3} \\hfill \\footnotesize{#4}\\%
  \\vspace{0.3em}%
}
\\pagestyle{empty}
`;
  } else if (documentClass === 'assignment') {
    preamble += `
% Homework & Assignment Environments
\\newcounter{probcount}
\\newcommand{\\problem}[1][]{%
  \\stepcounter{probcount}%
  \\vspace{1.2em}%
  \\noindent\\colorbox{gray!15}{%
    \\parbox{\\dimexpr\\textwidth-2\\fboxsep}{%
      \\textbf{\\large Problem \\theprobcount}%
      \\ifstrempty{#1}{}{ (#1)}%
    }%
  }%
  \\vspace{0.5em}%
}
\\newenvironment{solution}{%
  \\vspace{0.3em}%
  \\noindent\\textbf{\\textit{Solution:}}%
}{%
  \\hfill$\\blacksquare$\\vspace{1em}%
}
`;
  } else if (documentClass === 'executive') {
    preamble += `
% Executive Whitepaper Letterhead
\\usepackage{fancyhdr}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\textbf{\\color{blue!80!black}EXECUTIVE BRIEFING} $\\vert$ \\small ${escapeLatexText(title)}}
\\fancyhead[R]{\\small\\thepage}
\\renewcommand{\\headrulewidth}{0.5pt}
\\newenvironment{execsummary}{%
  \\begin{center}%
  \\begin{minipage}{0.92\\textwidth}%
  \\small\\itshape\\textbf{Executive Summary:}\\par\\vspace{0.3em}%
}{%
  \\end{minipage}%
  \\end{center}%
  \\vspace{1.2em}%
}
`;
  }

  // Document metadata & Begin
  preamble += `
% Document Metadata
\\title{\\textbf{${escapeLatexText(title)}}}
`;

  if (documentClass === 'IEEEtran') {
    preamble += `\\author{\\IEEEauthorblockN{${escapeLatexText(author)}}
\\IEEEauthorblockA{\\textit{Research & Development} \\\\
\\textit{Institution / Organization} \\\\
Email: author@example.edu}}
`;
  } else {
    preamble += `\\author{${escapeLatexText(author)}}
`;
  }

  preamble += `\\date{${date || '\\today'}}

\\begin{document}
`;

  // Title / Opening structure
  if (documentClass === 'beamer') {
    preamble += `\\begin{frame}
  \\titlepage
\\end{frame}
`;
  } else if (documentClass === 'report') {
    preamble += `\\begin{titlepage}
\\centering
\\vspace*{2cm}
{\\Huge\\bfseries ${escapeLatexText(title)}\\par}
\\vspace{1.5cm}
{\\Large\\itshape ${escapeLatexText(author)}\\par}
\\vspace{2cm}
A Thesis / Report Submitted in Partial Fulfillment of Requirements\\par
\\vspace{1cm}
{\\large ${date || '\\today'}\\par}
\\vfill
\\end{titlepage}
\\tableofcontents
\\newpage
`;
  } else if (documentClass === 'cv') {
    preamble += `\\begin{center}
{\\Huge\\bfseries ${escapeLatexText(author)}}\\\\[0.4em]
{\\large ${escapeLatexText(title)}}\\\\[0.3em]
\\small Email: contact@example.com $\\vert$ Phone: +1 (555) 019-2831 $\\vert$ Location: San Francisco, CA $\\vert$ LinkedIn: /in/profile
\\end{center}
\\vspace{1em}
`;
  } else {
    preamble += `\\maketitle
`;
  }

  // Abstract / Keywords
  if (abstract && documentClass !== 'beamer' && documentClass !== 'cv') {
    if (documentClass === 'IEEEtran') {
      preamble += `\\begin{abstract}
${escapeLatexText(abstract)}
\\end{abstract}
\\begin{IEEEkeywords}
Engineering, LaTeX, Document Processing, Overleaf, Automation.
\\end{IEEEkeywords}
`;
    } else {
      preamble += `\\begin{abstract}
${escapeLatexText(abstract)}
\\end{abstract}
`;
    }
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
 * Helper to convert LaTeX math formulas and symbols into clean Unicode text for Word documents
 */
export function cleanLatexMathToText(mathStr) {
  if (!mathStr) return '';
  return mathStr
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\mathrm\{([^}]+)\}/g, '$1')
    .replace(/\\mathcal\{([A-Za-z])\}/g, '$1')
    .replace(/\\mathbb\{([A-Za-z])\}/g, '$1')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\boldsymbol\{([^}]+)\}/g, '$1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '∑[$1 to $2] ')
    .replace(/\\sum/g, '∑')
    .replace(/\\prod_\{([^}]+)\}\^\{([^}]+)\}/g, '∏[$1 to $2] ')
    .replace(/\\prod/g, '∏')
    .replace(/\\int_\{([^}]+)\}\^\{([^}]+)\}/g, '∫[$1 to $2] ')
    .replace(/\\int/g, '∫')
    .replace(/\\min_\{([^}]+)\}/g, 'min[$1]')
    .replace(/\\max_\{([^}]+)\}/g, 'max[$1]')
    .replace(/\\partial/g, '∂')
    .replace(/\\nabla/g, '∇')
    .replace(/\\infty/g, '∞')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\epsilon|\\varepsilon/g, 'ε')
    .replace(/\\theta/g, 'θ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\pi/g, 'π')
    .replace(/\\omega/g, 'ω')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\ne/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\equiv/g, '≡')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\pm/g, '±')
    .replace(/\\in/g, '∈')
    .replace(/\\notin/g, '∉')
    .replace(/\\subset/g, '⊂')
    .replace(/\\subseteq/g, '⊆')
    .replace(/\\cup/g, '∪')
    .replace(/\\cap/g, '∩')
    .replace(/\\forall/g, '∀')
    .replace(/\\exists/g, '∃')
    .replace(/\\rightarrow|\\to/g, '→')
    .replace(/\\leftarrow/g, '←')
    .replace(/\\leftrightarrow/g, '↔')
    .replace(/\\Rightarrow/g, '⇒')
    .replace(/\\Leftarrow/g, '⇐')
    .replace(/\\Leftrightarrow/g, '⇔')
    .replace(/\\|/g, '‖')
    .replace(/\\left|\\right/g, '')
    .replace(/\\{/g, '{')
    .replace(/\\}/g, '}')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clean inline LaTeX markup (bold, italic, links, codes, escapes)
 */
function cleanLatexInlineFormatting(str) {
  if (!str) return '';
  return str
    .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
    .replace(/\\mathbf\{([^}]+)\}/g, '<strong>$1</strong>')
    .replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
    .replace(/\\emph\{([^}]+)\}/g, '<em>$1</em>')
    .replace(/\\texttt\{([^}]+)\}/g, '<code>$1</code>')
    .replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>')
    .replace(/\\sout\{([^}]+)\}/g, '<del>$1</del>')
    .replace(/\\href\{([^}]+)\}\{([^}]+)\}/g, '<a href="$1" target="_blank" rel="noopener">$2</a>')
    .replace(/\\url\{([^}]+)\}/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/\\%/g, '%')
    .replace(/\\&/g, '&')
    .replace(/\\_/g, '_')
    .replace(/\\#/g, '#')
    .replace(/\\\$/g, '$')
    .replace(/\\~/g, '~')
    .replace(/\\textbackslash\{\}/g, '\\');
}

/**
 * Converts raw LaTeX source into rich academic HTML with KaTeX rendered math equations
 */
export function latexToHtml(latexString, options = {}) {
  let text = String(latexString || '').trim();

  // Extract Title, Author, Date, Abstract
  let title = '';
  let author = '';
  let date = '';
  let abstract = '';

  const titleMatch = text.match(/\\title\{([\s\S]*?)\}/);
  if (titleMatch) title = cleanLatexInlineFormatting(titleMatch[1]);

  const authorMatch = text.match(/\\author\{([\s\S]*?)\}/);
  if (authorMatch) author = cleanLatexInlineFormatting(authorMatch[1].replace(/\\and/g, ' • ').replace(/\\IEEEauthorblock[NA]\{/g, '').replace(/\\textit\{/g, '').replace(/\}/g, ''));

  const dateMatch = text.match(/\\date\{([\s\S]*?)\}/);
  if (dateMatch) date = cleanLatexInlineFormatting(dateMatch[1].replace(/\\today/g, new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })));

  const abstractMatch = text.match(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/);
  if (abstractMatch) abstract = cleanLatexInlineFormatting(abstractMatch[1]);

  // Extract body between \begin{document} and \end{document}
  const docMatch = text.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
  let body = docMatch ? docMatch[1] : text;

  // Clean out LaTeX structural commands
  body = body.replace(/\\maketitle/g, '');
  body = body.replace(/\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/g, '');
  body = body.replace(/\\begin\{titlepage\}[\s\S]*?\\end\{titlepage\}/g, '');
  body = body.replace(/\\tableofcontents/g, '');
  body = body.replace(/\\newpage/g, '');

  // Render Display Math environments with KaTeX
  body = body.replace(/\\begin\{(?:equation|align|gather|multline)\*?\}([\s\S]*?)\\end\{(?:equation|align|gather|multline)\*?\}/g, (m, math) => {
    try {
      return `<div class="latex-math-block">${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`;
    } catch {
      return `<div class="latex-math-block"><code>${escapeLatexText(math.trim())}</code></div>`;
    }
  });

  body = body.replace(/\$\$([\s\S]*?)\$\$/g, (m, math) => {
    try {
      return `<div class="latex-math-block">${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`;
    } catch {
      return `<div class="latex-math-block"><code>${escapeLatexText(math.trim())}</code></div>`;
    }
  });

  body = body.replace(/\\\[([\s\S]*?)\\\]/g, (m, math) => {
    try {
      return `<div class="latex-math-block">${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`;
    } catch {
      return `<div class="latex-math-block"><code>${escapeLatexText(math.trim())}</code></div>`;
    }
  });

  // Render Inline Math with KaTeX
  body = body.replace(/\$([^\$\n]+?)\$/g, (m, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `<code>${escapeLatexText(math.trim())}</code>`;
    }
  });

  body = body.replace(/\\\(([^\n]+?)\\\)/g, (m, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `<code>${escapeLatexText(math.trim())}</code>`;
    }
  });

  // Parse lstlisting and verbatim code blocks
  body = body.replace(/\\begin\{lstlisting\}(?:\[.*?\])?([\s\S]*?)\\end\{lstlisting\}/g, (m, code) => {
    return `<pre class="latex-code-block"><code>${escapeLatexText(code.trim())}</code></pre>`;
  });
  body = body.replace(/\\begin\{verbatim\}([\s\S]*?)\\end\{verbatim\}/g, (m, code) => {
    return `<pre class="latex-code-block"><code>${escapeLatexText(code.trim())}</code></pre>`;
  });

  // Parse Tables
  body = body.replace(/\\begin\{tabular\}\{([^}]*)\}([\s\S]*?)\\end\{tabular\}/g, (m, align, content) => {
    const lines = content.trim().split(/\\\\(?:\s*\[.*?\])?/);
    let tableHtml = '<div class="latex-table-wrap"><table class="latex-table"><tbody>';
    
    lines.forEach((line, idx) => {
      const cleanLine = line.replace(/\\toprule|\\midrule|\\bottomrule|\\hline/g, '').trim();
      if (!cleanLine) return;
      const cells = cleanLine.split('&');
      const isHeader = idx === 0 || line.includes('\\toprule') || line.includes('\\midrule');
      const tag = isHeader && idx === 0 ? 'th' : 'td';
      tableHtml += '<tr>' + cells.map(c => `<${tag}>${cleanLatexInlineFormatting(c.trim())}</${tag}>`).join('') + '</tr>';
    });

    tableHtml += '</tbody></table></div>';
    return tableHtml;
  });

  // Parse Lists
  body = body.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (m, content) => {
    const items = content.split(/\\item\s+/).filter(Boolean);
    return '<ul class="latex-list">' + items.map(it => `<li>${cleanLatexInlineFormatting(it.trim())}</li>`).join('') + '</ul>';
  });

  body = body.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (m, content) => {
    const items = content.split(/\\item\s+/).filter(Boolean);
    return '<ol class="latex-list">' + items.map(it => `<li>${cleanLatexInlineFormatting(it.trim())}</li>`).join('') + '</ol>';
  });

  // Parse Headings
  body = body.replace(/\\chapter\*?\{([^}]+)\}/g, '<h1 class="latex-chapter">$1</h1>');
  body = body.replace(/\\section\*?\{([^}]+)\}/g, '<h2 class="latex-section">$1</h2>');
  body = body.replace(/\\subsection\*?\{([^}]+)\}/g, '<h3 class="latex-subsection">$1</h3>');
  body = body.replace(/\\subsubsection\*?\{([^}]+)\}/g, '<h4 class="latex-subsubsection">$1</h4>');
  body = body.replace(/\\paragraph\*?\{([^}]+)\}/g, '<h5 class="latex-paragraph">$1</h5>');

  // Parse Theorems, Proofs, Quotes
  body = body.replace(/\\begin\{theorem\}([\s\S]*?)\\end\{theorem\}/g, '<div class="latex-callout theorem"><strong>Theorem.</strong> $1</div>');
  body = body.replace(/\\begin\{lemma\}([\s\S]*?)\\end\{lemma\}/g, '<div class="latex-callout lemma"><strong>Lemma.</strong> $1</div>');
  body = body.replace(/\\begin\{definition\}([\s\S]*?)\\end\{definition\}/g, '<div class="latex-callout definition"><strong>Definition.</strong> $1</div>');
  body = body.replace(/\\begin\{proof\}([\s\S]*?)\\end\{proof\}/g, '<div class="latex-proof"><em>Proof.</em> $1 <span class="latex-qed">∎</span></div>');
  body = body.replace(/\\begin\{quote\}([\s\S]*?)\\end\{quote\}/g, '<blockquote class="latex-blockquote">$1</blockquote>');

  // Inlines
  body = cleanLatexInlineFormatting(body);

  // Table & Figure wrappers
  body = body.replace(/\\begin\{table\}[\s\S]*?\\end\{table\}/g, m => {
    const capMatch = m.match(/\\caption\{([^}]+)\}/);
    const caption = capMatch ? `<p class="latex-table-caption"><strong>Table:</strong> ${capMatch[1]}</p>` : '';
    const cleanTbl = m.replace(/\\begin\{table\}[^]*?\\centering/g, '').replace(/\\caption\{[^}]+\}/g, '').replace(/\\label\{[^}]+\}/g, '').replace(/\\end\{table\}/g, '');
    return `<div class="latex-table-container">${cleanTbl}${caption}</div>`;
  });

  body = body.replace(/\\caption\{([^}]+)\}/g, '<p class="latex-caption">$1</p>');
  body = body.replace(/\\label\{([^}]+)\}/g, '');
  body = body.replace(/\\ref\{([^}]+)\}/g, '<span class="latex-ref">[$1]</span>');
  body = body.replace(/\\cite\{([^}]+)\}/g, '<span class="latex-cite">[$1]</span>');

  // Paragraphs
  const rawParagraphs = body.split(/\n\s*\n/).map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<div') || p.startsWith('<ul') || p.startsWith('<ol') || p.startsWith('<table') || p.startsWith('<pre') || p.startsWith('<blockquote')) {
      return p;
    }
    return `<p class="latex-p">${p.replace(/\\\\\s*/g, '<br>')}</p>`;
  }).filter(Boolean);

  const theme = options.theme || 'academic';
  let fullHtml = `
  <style>
    .latex-academic-document {
      font-family: 'Merriweather', Georgia, 'Times New Roman', serif;
      line-height: 1.7;
      color: #1a202c;
      max-width: 100%;
      margin: 0 auto;
      padding: 10px;
    }
    .latex-doc-title {
      font-size: 1.85rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 0.5rem;
      color: #111827;
    }
    .latex-doc-author {
      font-size: 1rem;
      text-align: center;
      color: #4b5563;
      margin-bottom: 0.25rem;
      font-style: italic;
    }
    .latex-doc-date {
      font-size: 0.85rem;
      text-align: center;
      color: #6b7280;
      margin-bottom: 1.5rem;
    }
    .latex-doc-abstract {
      background: #f8fafc;
      border-left: 3px solid #3b82f6;
      padding: 12px 18px;
      margin: 1.5rem 1.5rem;
      border-radius: 4px;
      font-size: 0.92rem;
    }
    .latex-abstract-heading {
      font-weight: 700;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.82rem;
      margin-bottom: 6px;
      color: #1e293b;
    }
    .latex-section {
      font-size: 1.35rem;
      font-weight: 700;
      margin-top: 1.8rem;
      margin-bottom: 0.6rem;
      color: #1e293b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    .latex-subsection {
      font-size: 1.15rem;
      font-weight: 600;
      margin-top: 1.4rem;
      margin-bottom: 0.4rem;
      color: #334155;
    }
    .latex-p {
      margin-bottom: 1rem;
      text-align: justify;
    }
    .latex-math-block {
      display: flex;
      justify-content: center;
      margin: 1.2rem 0;
      overflow-x: auto;
    }
    .latex-table-wrap {
      margin: 1.2rem 0;
      overflow-x: auto;
      display: flex;
      justify-content: center;
    }
    .latex-table {
      border-collapse: collapse;
      font-size: 0.9rem;
      margin: 0 auto;
    }
    .latex-table th {
      border-top: 2px solid #1e293b;
      border-bottom: 1px solid #1e293b;
      padding: 8px 14px;
      font-weight: 600;
    }
    .latex-table td {
      padding: 6px 14px;
      border-bottom: 1px solid #e2e8f0;
    }
    .latex-table tr:last-child td {
      border-bottom: 2px solid #1e293b;
    }
    .latex-table-caption {
      text-align: center;
      font-size: 0.85rem;
      color: #64748b;
      margin-top: 6px;
    }
    .latex-list {
      margin: 0.8rem 0 1rem 1.5rem;
      padding-left: 1rem;
    }
    .latex-list li {
      margin-bottom: 0.4rem;
    }
    .latex-callout {
      border-left: 4px solid #6366f1;
      background: #f8fafc;
      padding: 10px 16px;
      margin: 1.2rem 0;
      border-radius: 4px;
    }
    .latex-code-block {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      overflow-x: auto;
      margin: 1rem 0;
    }
  </style>
  <div class="latex-academic-document theme-${theme}">
  `;

  if (title) fullHtml += `<h1 class="latex-doc-title">${title}</h1>`;
  if (author) fullHtml += `<div class="latex-doc-author">${author}</div>`;
  if (date) fullHtml += `<div class="latex-doc-date">${date}</div>`;
  if (abstract) fullHtml += `<div class="latex-doc-abstract"><div class="latex-abstract-heading">Abstract</div><p>${abstract}</p></div>`;
  fullHtml += rawParagraphs.join('\n\n');
  fullHtml += `</div>`;

  return fullHtml;
}

/**
 * Compiles LaTeX source into high-fidelity PDF with KaTeX math rendering
 */
export async function latexToPdf(latexInput, filename = 'document.pdf', options = {}) {
  let latexText = '';
  if (typeof latexInput === 'string') {
    latexText = latexInput;
  } else if (latexInput && typeof latexInput.text === 'function') {
    latexText = await latexInput.text();
  } else {
    latexText = String(latexInput || '');
  }

  const html = latexToHtml(latexText, options);
  const { htmlToPdf } = await import('./doc-engine.js');
  
  const pdfResult = await htmlToPdf(html, filename, {
    theme: options.theme || 'academic',
    format: options.paperSize || 'a4',
    margin: parseInt(options.margin || '15', 10) || 15
  });

  return {
    ...pdfResult,
    htmlPreview: html
  };
}

/**
 * Converts LaTeX document into editable Microsoft Word (.docx) file
 */
export async function latexToDocx(latexInput, filename = 'document.docx', options = {}) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType } = await import('docx');

  let latexText = '';
  if (typeof latexInput === 'string') {
    latexText = latexInput;
  } else if (latexInput && typeof latexInput.text === 'function') {
    latexText = await latexInput.text();
  } else {
    latexText = String(latexInput || '');
  }

  const children = [];
  const baseFont = options.font || 'Calibri';

  // Metadata
  const titleMatch = latexText.match(/\\title\{([\s\S]*?)\}/);
  if (titleMatch) {
    children.push(new Paragraph({
      children: [new TextRun({ text: cleanLatexMathToText(titleMatch[1].trim()), bold: true, size: 36, font: baseFont, color: '1A202C' })],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 120 }
    }));
  }

  const authorMatch = latexText.match(/\\author\{([\s\S]*?)\}/);
  if (authorMatch) {
    const authText = authorMatch[1].replace(/\\and/g, ' • ').replace(/\\IEEEauthorblock[NA]\{/g, '').replace(/\\textit\{/g, '').replace(/\}/g, '').trim();
    children.push(new Paragraph({
      children: [new TextRun({ text: cleanLatexMathToText(authText), italics: true, size: 22, font: baseFont, color: '4A5568' })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 180 }
    }));
  }

  const abstractMatch = latexText.match(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/);
  if (abstractMatch) {
    children.push(new Paragraph({
      children: [new TextRun({ text: 'ABSTRACT', bold: true, size: 20, font: baseFont, color: '2D3748' })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 80 }
    }));
    children.push(new Paragraph({
      children: [new TextRun({ text: cleanLatexMathToText(abstractMatch[1].trim()), italics: true, size: 21, font: baseFont, color: '4A5568' })],
      indent: { left: 720, right: 720 },
      spacing: { before: 60, after: 240 }
    }));
  }

  const docMatch = latexText.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
  let body = docMatch ? docMatch[1] : latexText;
  body = body.replace(/\\maketitle/g, '');
  body = body.replace(/\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/g, '');
  body = body.replace(/\\begin\{titlepage\}[\s\S]*?\\end\{titlepage\}/g, '');

  const lines = body.split('\n');
  let inEquation = false;
  let eqBuffer = [];
  let inTabular = false;
  let tabBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    if (!line) continue;

    // Check equations
    if (line.match(/\\begin\{(equation|align|gather)\*?\}/) || line === '$$' || line === '\\[') {
      inEquation = true;
      eqBuffer = [];
      continue;
    }
    if (inEquation) {
      if (line.match(/\\end\{(equation|align|gather)\*?\}/) || line === '$$' || line === '\\]') {
        inEquation = false;
        const cleanedEq = cleanLatexMathToText(eqBuffer.join(' '));
        children.push(new Paragraph({
          children: [new TextRun({ text: cleanedEq, italics: true, font: 'Cambria Math', size: 24, color: '1A365D' })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 160, after: 160 }
        }));
        eqBuffer = [];
      } else {
        eqBuffer.push(line);
      }
      continue;
    }

    // Check tables
    if (line.match(/\\begin\{tabular\}/)) {
      inTabular = true;
      tabBuffer = [];
      continue;
    }
    if (inTabular) {
      if (line.match(/\\end\{tabular\}/)) {
        inTabular = false;
        const rows = tabBuffer.join('\n').split(/\\\\/).filter(r => r.trim());
        const docxRows = rows.map((r, rIdx) => {
          const cells = r.replace(/\\toprule|\\midrule|\\bottomrule|\\hline/g, '').split('&');
          return new TableRow({
            children: cells.map(c => new TableCell({
              children: [new Paragraph({
                children: [new TextRun({
                  text: cleanLatexMathToText(c.replace(/\\textbf\{([^}]+)\}/g, '$1')),
                  bold: rIdx === 0,
                  font: baseFont,
                  size: 20
                })]
              })],
              shading: rIdx === 0 ? { fill: 'EDF2F7' } : undefined
            }))
          });
        });

        if (docxRows.length > 0) {
          children.push(new Table({
            rows: docxRows,
            width: { size: 100, type: WidthType.PERCENTAGE }
          }));
        }
        tabBuffer = [];
      } else {
        tabBuffer.push(line);
      }
      continue;
    }

    // Check headings
    const h1 = line.match(/\\(?:chapter|section)\*?\{([^}]+)\}/);
    if (h1) {
      children.push(new Paragraph({
        children: [new TextRun({ text: cleanLatexMathToText(h1[1]), bold: true, size: 28, font: baseFont, color: '1A202C' })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 }
      }));
      continue;
    }

    const h2 = line.match(/\\subsection\*?\{([^}]+)\}/);
    if (h2) {
      children.push(new Paragraph({
        children: [new TextRun({ text: cleanLatexMathToText(h2[1]), bold: true, size: 24, font: baseFont, color: '2D3748' })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }));
      continue;
    }

    const h3 = line.match(/\\subsubsection\*?\{([^}]+)\}/);
    if (h3) {
      children.push(new Paragraph({
        children: [new TextRun({ text: cleanLatexMathToText(h3[1]), bold: true, size: 22, font: baseFont, color: '4A5568' })],
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 160, after: 80 }
      }));
      continue;
    }

    // List item
    const itemMatch = line.match(/\\item\s+(.+)$/);
    if (itemMatch) {
      const itemText = cleanLatexMathToText(itemMatch[1]);
      children.push(new Paragraph({
        children: [new TextRun({ text: itemText, font: baseFont, size: 22 })],
        bullet: { level: 0 },
        spacing: { before: 40, after: 40 }
      }));
      continue;
    }

    // General text paragraph
    if (!line.startsWith('\\') || line.startsWith('\\text')) {
      const cleanPara = cleanLatexMathToText(line);
      if (cleanPara) {
        children.push(new Paragraph({
          children: [new TextRun({ text: cleanPara, font: baseFont, size: 22 })],
          spacing: { before: 80, after: 80 }
        }));
      }
    }
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children
    }]
  });

  const blob = await Packer.toBlob(doc);
  return {
    blob,
    filename,
    originalSize: new Blob([latexText]).size,
    outputSize: blob.size,
    stats: {
      lines: latexText.split('\n').length,
      paragraphs: children.length
    }
  };
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

    if (rawName.match(/\.(docx|doc)$/i) && !toolId.includes('pdf') && !toolId.includes('docx')) {
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
        outputSize: latexBlob.size,
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
    throw new Error('Please enter some text, markdown, or upload a file to convert');
  }

  // Handle LaTeX to PDF (.tex -> PDF)
  if (toolId.includes('pdf')) {
    return await latexToPdf(content, `${baseName}.pdf`, settings);
  }

  // Handle LaTeX to Word (.tex -> DOCX)
  if (toolId.includes('docx') || toolId.includes('word')) {
    return await latexToDocx(content, `${baseName}.docx`, settings);
  }

  // Handle standard Text/File to LaTeX (.tex)
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
    outputSize: latexBlob.size,
    stats: {
      lines: latexCode.split('\n').length,
      chars: latexCode.length,
      words: latexCode.split(/\s+/).length
    }
  };
}
