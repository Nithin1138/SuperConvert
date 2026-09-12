export function renderMarqueeTicker() {
  const items = [
    { text: '⚡ spec.md → Vector PDF in 18ms', accent: true },
    { text: '🔒 100% Client-Side Private', accent: false },
    { text: '⚡ README.md → PDF in 12ms', accent: true },
    { text: '📄 A4, US Letter & Legal Paper Sizes', accent: false },
    { text: '⚡ financial_q3.md → PDF in 24ms', accent: true },
    { text: '💎 5 Handcrafted Studio Themes', accent: false },
    { text: '⚡ research_paper.md → PDF in 35ms', accent: true },
    { text: '🚀 Zero Server Compute Costs', accent: false },
  ];

  const html = items.map(item => `
    <span class="marquee-pill ${item.accent ? 'marquee-pill-accent' : ''}">
      ${item.text}
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
