import { ICONS } from '../core/icons.js';

export function renderMarqueeTicker() {
  const items = [
    { icon: ICONS.zap, text: 'spec.md → Vector PDF in 18ms', accent: true },
    { icon: ICONS.shield, text: '100% Client-Side Private', accent: false },
    { icon: ICONS.zap, text: 'README.md → PDF in 12ms', accent: true },
    { icon: ICONS.document, text: 'A4, US Letter & Legal Paper Sizes', accent: false },
    { icon: ICONS.zap, text: 'financial_q3.md → PDF in 24ms', accent: true },
    { icon: ICONS.palette, text: '5 Handcrafted Studio Themes', accent: false },
    { icon: ICONS.zap, text: 'research_paper.md → PDF in 35ms', accent: true },
    { icon: ICONS.sparkles, text: 'Zero Server Compute Costs', accent: false },
  ];

  const html = items.map(item => `
    <span class="marquee-pill ${item.accent ? 'marquee-pill-accent' : ''}" style="display: inline-flex; align-items: center; gap: 6px;">
      ${item.icon}
      <span>${item.text}</span>
    </span>
  `).join('');

  // Duplicate for seamless infinite loop
  return `
    <div class="super-marquee-section">
      <div class="super-marquee-track">
        ${html}
        ${html}
      </div>
    </div>
  `;
}
