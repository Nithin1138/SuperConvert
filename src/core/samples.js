export const SAMPLES = {
  techSpec: `---
title: SuperConvert Cloud Architecture Specification
author: Antigravity Systems Team
date: 2026-09-12
version: 2.4.0
status: Approved
---

# SuperConvert Architecture Specification

## 1. Executive Summary
**SuperConvert** is an enterprise-grade, privacy-first document engine designed to transform Markdown documents into studio-quality PDFs with sub-100ms latency. By leveraging client-side Web Workers and vector print rendering pipelines, it achieves unlimited scale at zero compute cost.

> **Key Architectural Goal**: 100% Client-side zero-knowledge execution for security, paired with an optional serverless edge micro-worker tier for batch automation.

---

## 2. Benchmark Metrics & Throughput

| Component | Architecture | P95 Latency | Memory Footprint |
| :--- | :--- | :--- | :--- |
| **Markdown AST** | Marked.js + GFM | 12ms | 4.2 MB |
| **Sanitizer** | DOMPurify Worker | 8ms | 2.1 MB |
| **Syntax Styler** | Highlight.js High-Throughput | 24ms | 6.5 MB |
| **Vector Engine** | Native Headless Chrome (Skia m152) | 42ms | Hardware Accel |

---

## 3. Core Engine Implementation

Below is the streaming worker pipeline used for processing large document payloads:

\`\`\`typescript
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface ConvertOptions {
  theme: 'super-modern' | 'academic' | 'github' | 'executive';
  paperSize: 'a4' | 'letter';
  enablePageNumbers: boolean;
}

export async function processMarkdown(raw: string, opts: ConvertOptions): Promise<string> {
  // 1. Extract frontmatter and parse AST
  const html = await marked.parse(raw, { gfm: true, breaks: true });
  
  // 2. Sanitize against XSS attacks
  const cleanHtml = DOMPurify.sanitize(html);
  
  // 3. Wrap with selected theme classes
  return \`<div class="theme-\${opts.theme}">\${cleanHtml}</div>\`;
}
\`\`\`

---

## 4. Production Checklist
- [x] Zero-knowledge client memory isolation
- [x] GFM Table rendering support
- [x] Syntax highlighting for 50+ languages
- [x] Multi-format paper output (A4, Letter, Legal)
- [ ] Direct Webhook push to Slack / Discord
`,

  designNote: `# System Architecture & Low-Level Design Document

## 1. Executive Summary
The **LLD Practice Platform** is a focused educational platform designed to help software engineering learners practice Low-Level Design iteratively. It evaluates student-submitted software designs against a standardized, 100-point rubric and provides evidence-backed, explainable feedback.

This prototype demonstrates disciplined domain modeling, strict database constraints, clean state transitions, and a resilient evaluation architecture within a simple, maintainable modular monolith.

---

## 2. Core Domain Architecture

\`\`\`text
┌────────────────┐
│    Problem     │
└───────┬────────┘
        │ 1
        │
        │ N
┌───────┴────────┐
│    Attempt     │
└───────┬────────┘
        │ 1
        │
        │ 1 (UNIQUE attempt_id)
┌───────┴────────┐
│   Submission   │
└───────┬────────┘
        │ 1
        │
        │ 1 (UNIQUE submission_id)
┌───────┴────────┐                    ┌──────────────────┐
│   Evaluation   │                    │      Rubric      │
└───────┬────────┘                    └────────┬─────────┘
        │ 1                                    │ 1
        │                                      │
        │ N                                    │ N
┌───────┴────────┐                    ┌────────┴─────────┐
│    Feedback    ├───────────────────►│ RubricCriterion  │
└────────────────┘  0..1 (criterion_id) └──────────────────┘
\`\`\`

### Entity Responsibilities & Invariants

| Entity | Primary Responsibility | Invariants & Constraints |
|---|---|---|
| **\`Problem\`** | Defines the LLD challenge requirements, constraints, and scope. | \`slug\` is unique. Protected from accidental deletion (\`onDelete: Restrict\`). |
| **\`Attempt\`** | Represents one distinct learner practice session on a problem. | Preserves chronological history. Unlimited attempts allowed. Starts in \`IN_PROGRESS\`. |
| **\`Submission\`** | Represents the actual design artifact submitted by learner. | Strictly 1:1 with \`Attempt\`. Immutable upon submission. Holds content type. |
| **\`Evaluation\`** | Represents evaluation process, total score, and lifecycle. | Strictly 1:1 with \`Submission\` via \`@unique\` on \`submission_id\`. |
| **\`Feedback\`** | Contains structured assessment for a specific rubric dimension. | Captures evidence, concern, suggestion, score, and maxScore. |

---

## 3. Evaluation Architecture & Rubric Design

### Standard 100-Point Evaluation Rubric

| Criterion ID | Criterion Dimension | Max Points | Evaluation Focus |
|---|---|---|---|
| **REQ_COMPLETENESS** | Functional Requirements Coverage | 20 | All mandatory user stories addressed |
| **MODULARITY_SOLID** | SOLID Principles & Clean Code | 25 | Single Responsibility, Interface Segregation |
| **CONCURRENCY_SAFETY**| Thread Safety & Lock Semantics | 20 | Deadlock prevention, race-condition mitigation |
| **EXTENSIBILITY** | Design Patterns & Coupling | 20 | Strategy, Factory, Observer implementation |
| **EDGE_CASES** | Boundary Conditions & Error Handling | 15 | Nil pointers, timeouts, idempotency |
`,

  atsResume: `# ALEX CHEN, SENIOR DISTRIBUTED SYSTEMS ENGINEER
San Francisco, CA • (555) 234-5678 • alex.chen@alumni.stanford.edu • linkedin.com/in/alexchen • github.com/alexchen

---

## SUMMARY
Senior Distributed Systems and Infrastructure Engineer with 7+ years of experience designing fault-tolerant, high-throughput micro-services in Go, Rust, and TypeScript. Proven track record scaling platforms from 10k to 2.4M QPS while cutting cloud spend by 42%.

---

## TECHNICAL SKILLS
- **Languages:** Go (Golang), Rust, TypeScript, Python, C++, SQL, Bash
- **Systems & Cloud:** Kubernetes, Docker, AWS (EKS, DynamoDB, S3, Aurora), GCP, Terraform, Kafka, Redis
- **Architecture:** Distributed Consensus (Raft), Event-Driven Architecture, Microservices, Zero-Trust Security, gRPC

---

## WORK EXPERIENCE

### Staff Systems Architect | Datamesh Corp
*2022 – Present | San Francisco, CA*
- Architected a multi-region distributed event streaming bus handling **14.2 Billion events/day** with P99 latency under 4ms.
- Migrated 40+ containerized micro-services to Kubernetes with zero downtime, reducing annual AWS infrastructure costs by **$420,000**.
- Implemented Raft-based distributed consensus in Go for leader election, achieving 99.999% system availability SLA.
- Spearheaded engineering interview process, hiring and mentoring 12 senior and staff infrastructure engineers.

### Senior Backend Engineer | Veloce Networks
*2019 – 2022 | Sunnyvale, CA*
- Designed high-throughput gRPC routing layer processing **350,000 requests/second** using asynchronous Rust and Tokio.
- Eliminated critical database lock contention in PostgreSQL by redesigning transactional partition boundaries, improving write throughput by **310%**.
- Authored automated disaster recovery failover framework tested in chaos engineering fire-drills.

---

## EDUCATION
**Stanford University** — B.S. in Computer Science (Systems Specialization) | *GPA: 3.92 / 4.00 (Cum Laude)*

---

## HONORS & PATENTS
- **US Patent #11,842,910**: High-Concurrency Non-Blocking Memory Ring Buffer for Network Ingestion.
- Winner, IEEE Global Systems Hackathon (Distributed Edge Computing Track).
`,

  legalContract: `# MASTER SERVICES AGREEMENT & SCOPE OF WORK
**Contract Reference:** MSA-2026-0912-SC  
**Effective Date:** September 12, 2026

---

## 1. PARTIES
This Master Services Agreement ("Agreement") is made effective as of the date written above by and between:
- **Client:** Nexus Cloud Technologies Inc., a Delaware Corporation with offices at 100 Montgomery St, San Francisco, CA ("Client")
- **Service Provider:** SuperConvert Engineering Labs LLC, a California Limited Liability Company ("Provider")

---

## 2. SERVICES & DELIVERABLES
Provider agrees to design, implement, and deliver the software systems specified in Exhibit A:
1. **High-Scale Vector Document Engine**: Zero-server client compilation module capable of vector PDF synthesis.
2. **Security & Cryptographic Audit**: End-to-end memory isolation ensuring zero customer data persistence.
3. **Integration Documentation**: Complete OpenAPI 3.1 specification, SDK bindings, and automated regression test suite.

---

## 3. COMPENSATION & PAYMENT TERMS
- **Contract Value:** $48,000 USD (Fixed Fee).
- **Payment Schedule:**
  - 30% upon execution of this Agreement ($14,400).
  - 40% upon completion of Milestone 2 (Beta Staging Deployment) ($19,200).
  - 30% upon final acceptance and handover ($14,400).
- **Invoicing Terms:** Net 15 days via automated wire transfer or ACH.

---

## 4. INTELLECTUAL PROPERTY & CONFIDENTIALITY
All custom source code, documentation, and technical specifications developed under this Agreement shall become the sole and exclusive property of the Client upon receipt of final payment.

---

## 5. EXECUTION & SIGNATURE BLOCKS

IN WITNESS WHEREOF, the parties hereto have caused this Agreement to be executed by their duly authorized representatives:

| For Client: Nexus Cloud Technologies Inc. | For Provider: SuperConvert Labs LLC |
| :--- | :--- |
| **Signature:** ________________________________ | **Signature:** ________________________________ |
| **Name:** Sarah Jenkins | **Name:** David Sterling |
| **Title:** VP of Technology | **Title:** Principal Architect |
| **Date:** September 12, 2026 | **Date:** September 12, 2026 |
`,

  academicPaper: `# High-Throughput Zero-Knowledge Document Synthesis on Edge Client Runtimes

**Julian Vance**, Department of Computer Science, MIT  
**Elena Rostova**, Institute for Distributed Systems, ETH Zürich  
*Correspondence: jvance@cs.mit.edu, rostova@inf.ethz.ch*

---

### Abstract
Modern document conversion pipelines historically rely on server-side headless browsers, creating significant operational latency, egress expenses, and privacy vulnerabilities. In this paper, we present **SuperConvert**, a WebAssembly and Skia-accelerated client compilation engine that achieves sub-50ms vector PDF synthesis entirely within browser memory. Benchmarks demonstrate zero server egress cost and linear scaling across 10,000 concurrent nodes.

---

## 1. Introduction
Cloud document transformation services consume an estimated 4.2 million vCPU hours daily across SaaS applications. Conventional pipelines route sensitive Markdown, financial spreadsheets, and medical reports to multi-tenant worker pools, introducing severe compliance liabilities under HIPAA and GDPR.

### 1.1 Mathematical Formulation of Vector Layout
Let the layout tree \\( T \\) be represented as an acyclic graph of flow boxes \\( B_i \\in T \\). For each box, the computed position \\( (x, y) \\) and bounding rectangle \\( (w, h) \\) are bounded by:

$$P(B_i) = \\sum_{j \\in \\text{children}(B_i)} h(B_j) + 2 \\cdot \\mu_{\\text{margin}}$$

Subject to the pagination constraint:

$$\\max_{i} \\left( y(B_i) + h(B_i) \\right) \\le H_{\\text{page}} - \\Delta_{\\text{footer}}$$

---

## 2. Experimental Results & Performance

| Document Payload | Server Latency (P99) | Client SuperConvert (P99) | Speedup Ratio |
| :--- | :--- | :--- | :--- |
| **Short Spec (2 pgs)** | 1,420 ms | 38 ms | **37.3x** |
| **Technical Thesis (18 pgs)** | 4,890 ms | 142 ms | **34.4x** |
| **Financial Dossier (50 pgs)** | 12,300 ms | 380 ms | **32.3x** |

---

## 3. Conclusion & Citations
Client-side vector compilation eliminates server cost completely while improving privacy guarantees. Future work will investigate hardware-accelerated SIMD WebAssembly font kerning.

**References:**  
[1] J. Smith et al., "Hardware-Accelerated Web Layout Models," *ACM Trans. Graphics*, vol. 41, no. 4, 2024.  
[2] K. Tanaka, "Client-Side Cryptography for Modern Web Applications," *IEEE S&P*, 2025.
`,

  batesLegalMerge: `# IN THE UNITED STATES DISTRICT COURT
### NORTHERN DISTRICT OF CALIFORNIA (SAN FRANCISCO DIVISION)

**CASE NO. 26-CV-04921-SC**

---

### MASTER EVIDENTIARY EXHIBIT INDEX
**Document Reference:** BATES-00101 THROUGH BATES-00150  
**Filing Date:** September 12, 2026

---

## TABLE OF CONTENTS & VERIFIED EXHIBITS

| Bates Range | Exhibit Description | Sponsoring Witness | Date of Origin |
| :--- | :--- | :--- | :--- |
| **BATES-00101 – 00108** | Initial Architecture Agreement & Non-Disclosure Contract | S. Jenkins | Jan 14, 2026 |
| **BATES-00109 – 00122** | Audit Logs & Cloud Infrastructure Telemetry Data | D. Sterling | Mar 22, 2026 |
| **BATES-00123 – 00138** | Technical Source Code Diffs & Verification Signatures | J. Vance | Jun 05, 2026 |
| **BATES-00139 – 00150** | Final Certified Delivery Certificate & Acceptance Memo | A. Chen | Sep 10, 2026 |

---

> **CERTIFICATE OF CONFORMITY**: The undersigned hereby certifies that the attached documents are true and authentic copies stamped with sequential Bates numbers in accordance with Federal Rule of Civil Procedure 26(a)(1).

*Signed this 12th day of September, 2026.*  
Counsel for Plaintiff: **Sterling & Partners LLP**
`,

  dataToReport: `# Q3 FINANCIAL PERFORMANCE & REVENUE LEDGER
**Generated By:** SuperConvert Data Analytics Engine  
**Fiscal Period:** Q3 2026 (July 1 – September 30)

---

## 1. Executive Summary & Revenue Overview
Consolidated revenue across all digital transformation streams reached **$1,482,900**, representing a **+42.8% YoY growth** compared to Q3 2025.

| Revenue Stream | Q3 Budget | Q3 Actual | Variance ($) | Variance (%) |
| :--- | :--- | :--- | :--- | :--- |
| **Enterprise Micro-SaaS** | $500,000 | $642,300 | +$142,300 | +28.5% |
| **Pay-Per-Copy Passes** | $250,000 | $389,400 | +$139,400 | +55.8% |
| **Developer API Credits** | $200,000 | $312,200 | +$112,200 | +56.1% |
| **Custom Enterprise Plugins** | $100,000 | $139,000 | +$39,000 | +39.0% |
| **TOTAL CONSOLIDATED** | **$1,050,000** | **$1,482,900** | **+$432,900** | **+41.2%** |

---

## 2. Operating Expenses & Net Margin

- **Gross Revenue:** $1,482,900
- **Cost of Goods Sold (Compute / Storage):** $18,400 *(Client-side engine saved ~$240k)*
- **Gross Profit Margin:** **98.7%**
- **Sales & Marketing:** $214,000
- **Research & Development:** $380,000
- **Operating Income (EBITDA):** **$870,500** (58.7% Net Margin)
`,

  kdpEbook: `# CHAPTER 1: THE ZERO-KNOWLEDGE PROTOCOL
*From the Novel: "The Silicon Horizon" by Nathan Drake*
**Format:** Amazon KDP 6"x9" Trade Paperback Specification

---

The terminal screen pulsed with a calm, rhythmic green glow in the darkness of the server vault. Marcus adjusted his glasses, watching the hexadecimal stream dissolve into null pointers.

Three years of research, twenty-two encrypted repositories, and it all came down to a single cryptographic question:

> *"If a document is compiled without ever touching a server, does it truly exist anywhere except the mind of its author?"*

Marcus pressed Enter.

---

### I. The First Transmission
The architecture was deceptively simple. While the cloud giants spent billions maintaining vast server farms in Northern Virginia, the new protocol executed silently within the sandbox of the user's personal device. No data center logs. No compliance vulnerabilities. Just pure, immutable mathematical execution.

Outside, rain struck the reinforced glass windows of the 42nd floor. The city lights stretched to the Pacific horizon, billions of bytes of data traversing fiber optic cables beneath the bay.

*"It's done,"* Marcus whispered into the headset.

On the other end of the line, Sarah's voice broke through the static:  
*"They're going to realize within twenty-four hours that their entire server infrastructure has been rendered obsolete."*

---

*Copyright © 2026 Nathan Drake. All rights reserved. Registered with the Library of Congress.*
`
};
