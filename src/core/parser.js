import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

// Configure marked with highlight.js syntax highlighting
marked.setOptions({
  gfm: true,
  breaks: true,
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    try {
      return hljs.highlight(code, { language }).value;
    } catch {
      return hljs.highlightAuto(code).value;
    }
  }
});

/**
 * Extract YAML-like frontmatter from markdown
 */
export function extractFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    return { metadata: {}, content: markdown };
  }

  const rawMeta = match[1];
  const content = markdown.slice(match[0].length);
  const metadata = {};

  rawMeta.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();
      metadata[key] = val;
    }
  });

  return { metadata, content };
}

/**
 * Parses markdown into secure, highlighted HTML
 */
export function parseMarkdown(rawMarkdown) {
  const { metadata, content } = extractFrontmatter(rawMarkdown);

  // Compute stats
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const chars = content.length;
  const estimatedPages = Math.max(1, Math.ceil(words / 450));

  // Preprocess custom pagebreak tokens into recognized page-break markers
  const processedContent = content
    .replace(/<!--\s*(page-?break|new-?page)\s*-->/gi, '\n\n<div class="page-break" style="page-break-after: always; break-after: page; height: 1px;"></div>\n\n')
    .replace(/\\pagebreak/gi, '\n\n<div class="page-break" style="page-break-after: always; break-after: page; height: 1px;"></div>\n\n')
    .replace(/\[(page-?break|new-?page)\]/gi, '\n\n<div class="page-break" style="page-break-after: always; break-after: page; height: 1px;"></div>\n\n');

  // Render markdown to HTML
  const rawHtml = marked.parse(processedContent);

  // Sanitize HTML
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ['target', 'rel', 'class', 'style']
  });

  return {
    html: cleanHtml,
    metadata,
    stats: {
      words,
      chars,
      estimatedPages
    }
  };
}
