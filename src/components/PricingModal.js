export function renderPricingModal() {
  return `
    <div id="modal-pricing" class="modal-backdrop">
      <div class="modal-dialog" style="max-width: 860px;">
        <div class="modal-header">
          <div class="modal-title">Simple, Transparent Micro-SaaS Pricing</div>
          <button class="modal-close-btn" data-close="modal-pricing">&times;</button>
        </div>

        <div class="modal-content">
          <p style="color: var(--text-secondary); text-align: center; margin-bottom: 24px;">
            Choose the plan that fits your personal workflow or enterprise engineering pipeline.
          </p>

          <div class="pricing-grid">
            <!-- Free Client Plan -->
            <div class="pricing-card">
              <div>
                <span class="pricing-badge" style="background: rgba(255,255,255,0.1); color: #FFF;">Client-Side Free</span>
                <div class="pricing-price">$0 <span>/ forever</span></div>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 16px;">
                  Ideal for casual developers, students, and personal note taking.
                </p>
                <ul class="pricing-features">
                  <li><span class="pricing-check">✓</span> 100% Client-side conversions</li>
                  <li><span class="pricing-check">✓</span> Unlimited document compiles</li>
                  <li><span class="pricing-check">✓</span> All 5 typography presets</li>
                  <li><span class="pricing-check">✓</span> Direct Vector Print output</li>
                </ul>
              </div>
              <button class="btn btn-secondary btn-sm" style="width: 100%;" data-close="modal-pricing">Current Plan</button>
            </div>

            <!-- Pro Solo Plan -->
            <div class="pricing-card featured">
              <div>
                <span class="pricing-badge" style="background: var(--brand-primary); color: #FFF;">Most Popular</span>
                <div class="pricing-price">$9 <span>/ month</span></div>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 16px;">
                  For freelancers, consultants, and power documentation writers.
                </p>
                <ul class="pricing-features">
                  <li><span class="pricing-check">✓</span> Everything in Free</li>
                  <li><span class="pricing-check">✓</span> Custom CSS & font uploads</li>
                  <li><span class="pricing-check">✓</span> Multi-file batch compilation</li>
                  <li><span class="pricing-check">✓</span> Custom watermark & branding</li>
                  <li><span class="pricing-check">✓</span> Priority bugfix support</li>
                </ul>
              </div>
              <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="alert('SuperConvert Pro checkout mock activated!')">Upgrade to Pro</button>
            </div>

            <!-- Enterprise API Plan -->
            <div class="pricing-card">
              <div>
                <span class="pricing-badge" style="background: var(--accent-lime-dim); color: var(--accent-lime);">Developer API</span>
                <div class="pricing-price">$49 <span>/ month</span></div>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 16px;">
                  High-scale headless automation for apps, CI/CD, and document portals.
                </p>
                <ul class="pricing-features">
                  <li><span class="pricing-check">✓</span> 50,000 API conversions/mo</li>
                  <li><span class="pricing-check">✓</span> Webhooks & streaming responses</li>
                  <li><span class="pricing-check">✓</span> 99.99% Edge SLA</li>
                  <li><span class="pricing-check">✓</span> Dedicated support Slack</li>
                </ul>
              </div>
              <button class="btn btn-secondary btn-sm" style="width: 100%;" onclick="alert('Enterprise API registration mock activated!')">Get API Key</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
