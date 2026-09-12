export function renderFaq() {
  return `
    <section id="faq" class="faq-section">
      <div class="container">
        <div class="faq-header">
          <div class="badge badge-brand" style="margin-bottom: 16px;">
            <span>Got Questions?</span>
          </div>
          <h2 class="faq-title">Frequently Asked Questions</h2>
          <p style="color: var(--text-secondary); max-width: 540px; margin: 0 auto;">
            Everything you need to know about our privacy-first conversion engine and high-scale architecture.
          </p>
        </div>

        <div class="faq-list">
          <!-- Q1 -->
          <div class="faq-item active">
            <button class="faq-trigger">
              <span>Is my markdown content sent to any remote server?</span>
              <span class="faq-icon-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </span>
            </button>
            <div class="faq-body">
              <p class="faq-text">
                <strong>No, never.</strong> Unlike legacy document converters that transmit your files across the internet to compute clusters, SuperConvert operates 100% within your local browser runtime via Web Workers and vector rendering engines. Your data never leaves your device memory.
              </p>
            </div>
          </div>

          <!-- Q2 -->
          <div class="faq-item">
            <button class="faq-trigger">
              <span>What is the difference between "Vector Print" and "Download PDF"?</span>
              <span class="faq-icon-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </span>
            </button>
            <div class="faq-body">
              <p class="faq-text">
                <strong>Download PDF</strong> performs direct client-side generation and immediately triggers a file download in your browser. <strong>Vector Print</strong> invokes the browser's hardware-accelerated print driver, generating 100% vector-sharp, selectable text with infinite resolution — ideal for professional document submissions.
              </p>
            </div>
          </div>

          <!-- Q3 -->
          <div class="faq-item">
            <button class="faq-trigger">
              <span>Can I use this micro-SaaS inside my company or for high-scale batch jobs?</span>
              <span class="faq-icon-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </span>
            </button>
            <div class="faq-body">
              <p class="faq-text">
                Yes! We provide an enterprise-grade Headless REST API and SDKs for Node.js and Python. You can automate 50,000+ conversions per hour for invoices, automated reports, contracts, and software documentation with sub-50ms latency.
              </p>
            </div>
          </div>

          <!-- Q4 -->
          <div class="faq-item">
            <button class="faq-trigger">
              <span>Which Markdown extensions and formatting styles are supported?</span>
              <span class="faq-icon-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </span>
            </button>
            <div class="faq-body">
              <p class="faq-text">
                SuperConvert supports full GitHub Flavored Markdown (GFM), including data tables, checklist tasks, blockquotes, code fences with syntax highlighting across 50+ languages, YAML frontmatter metadata, and mathematical formulas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
