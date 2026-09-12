export function renderApiDocsModal() {
  return `
    <div id="modal-api" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title">Developer Headless API</div>
          <button class="modal-close-btn" data-close="modal-api">&times;</button>
        </div>

        <div class="modal-content">
          <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 0.95rem;">
            Automate PDF compilation at high scale. Trigger conversions directly via HTTP or native client SDKs with zero server cold starts.
          </p>

          <div class="api-tabs">
            <button class="api-tab-btn active" data-lang="curl">cURL</button>
            <button class="api-tab-btn" data-lang="node">Node.js</button>
            <button class="api-tab-btn" data-lang="python">Python</button>
          </div>

          <!-- cURL snippet -->
          <div id="snippet-curl" class="code-snippet-box">
            <button class="code-copy-btn" data-target="code-curl">Copy</button>
            <pre id="code-curl">curl -X POST https://api.superconvert.io/v1/compile \\
  -H "Authorization: Bearer sc_live_9f83a82e9" \\
  -H "Content-Type: application/json" \\
  -d '{
    "markdown": "# Quarterly Report\\n\\nAll targets exceeded.",
    "theme": "super-modern",
    "format": "a4",
    "watermark": "CONFIDENTIAL"
  }' \\
  --output report.pdf</pre>
          </div>

          <!-- Node snippet -->
          <div id="snippet-node" class="code-snippet-box" style="display: none;">
            <button class="code-copy-btn" data-target="code-node">Copy</button>
            <pre id="code-node">import { SuperConvert } from '@superconvert/sdk';

const client = new SuperConvert({ apiKey: process.env.SUPERCONVERT_KEY });

const pdfBuffer = await client.compile({
  markdown: fs.readFileSync('./spec.md', 'utf-8'),
  theme: 'github',
  format: 'a4',
  pageNumbers: true
});

fs.writeFileSync('./spec.pdf', pdfBuffer);</pre>
          </div>

          <!-- Python snippet -->
          <div id="snippet-python" class="code-snippet-box" style="display: none;">
            <button class="code-copy-btn" data-target="code-python">Copy</button>
            <pre id="code-python">from superconvert import Client

sc = Client(api_key="sc_live_9f83a82e9")

pdf_bytes = sc.compile(
    markdown="# Automated Report\\n\\nSystem operational.",
    theme="academic",
    format="letter",
    margins="standard"
)

with open("report.pdf", "wb") as f:
    f.write(pdf_bytes)</pre>
          </div>

          <div style="margin-top: 24px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-subtle); pt: 16px;">
            <div style="font-size: 0.85rem; color: var(--text-muted); padding-top: 16px;">
              P99 Latency: <strong style="color: var(--accent-lime);">&lt; 48ms</strong> • Rate Limit: 10,000 req/min
            </div>
            <div style="padding-top: 16px;">
              <button class="btn btn-primary btn-sm" onclick="alert('API Sandbox generated! Demo Key: sc_demo_7482b991')">
                Generate Sandbox Key
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
