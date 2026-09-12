# SuperConvert — Universal In-Browser Transformation Platform

<p align="center">
  <img src="public/favicon.svg" alt="SuperConvert Logo" width="84" height="84" />
</p>

<p align="center">
  <strong>Universal file conversions executed 100% inside your browser.</strong><br />
  Documents, 3D meshes, ultra-compressed images, audio, video, and spreadsheets — zero server uploads, zero latency, absolute privacy.
</p>

<p align="center">
  <a href="https://github.com/Nithin1138/SuperConvert/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
  <a href="#"><img src="https://img.shields.io/badge/privacy-100%25%20client--side-brightgreen.svg" alt="100% Client-Side" /></a>
  <a href="#"><img src="https://img.shields.io/badge/servers-zero%20uploads-blueviolet.svg" alt="Zero Server Uploads" /></a>
  <a href="#"><img src="https://img.shields.io/badge/speed-hardware--accelerated-orange.svg" alt="Hardware Accelerated" /></a>
  <a href="#"><img src="https://img.shields.io/badge/motion-GSAP%20%2B%20Lenis-pink.svg" alt="GSAP & Lenis" /></a>
</p>

---

## 🌟 Highlights

- 🛡️ **100% Zero-Knowledge Privacy**: Files never leave your local device. Conversions happen in browser RAM using WebAssembly, HTML5 Canvas, and the Web Audio API.
- ⚡ **Zero Cloud Latency**: No waiting in upload queues, no network throttling, and no remote server timeouts.
- 📴 **Offline Ready**: Fully functional without an active internet connection once loaded.
- ♾️ **No Artificial Limits**: Convert gigabyte-scale images, long documents, and multi-track audio without paywalls or file caps.
- 🎨 **Cinematic Scrollytelling Experience**: Built with React 19, GSAP (ScrollTrigger & Observer), and Lenis smooth-scroll physics.

---

## 🚀 Supported Formats & Capabilities

SuperConvert features a universal converter hub with 43+ specialized conversion tools spanning 5 major media spectrums:

| Category | Supported Formats | Engine Pipeline |
| :--- | :--- | :--- |
| **Documents** | `PDF`, `LaTeX (.tex)`, `DOCX`, `Markdown (.md)`, `TXT`, `PPTX`, `XLSX`, `CSV`, `HTML` | `pdfjs-dist`, `docx`, `xlsx`, `jszip`, `marked`, `mammoth`, `SuperConvert LaTeX Engine` |
| **Images** | `JPG`, `PNG`, `WEBP`, `GIF`, `TIFF / TIF`, `AVIF`, `HEIC / HEIF`, `ICO`, `BMP`, `SVG` | HTML5 Canvas 2D, Pure JS BMP/TIFF/ICO binary encoders |
| **3D Models** | `OBJ`, `FBX`, `STL`, `GLTF 2.0` | Wavefront OBJ/STL polygon parser, IEEE 754 float binary STL & glTF compiler |
| **Audio** | `WAV`, `MP3`, `OGG`, `AAC`, `FLAC`, `M4A` | Web Audio API `AudioContext` & 16-bit stereo PCM RIFF WAV synthesizer |
| **Video** | `MP4`, `WEBM`, `MOV`, `AVI`, `MKV` (plus Video → GIF / MP3) | `MediaRecorder`, Web Audio track extraction, Canvas frame slicer |

---

## ✨ Flagship Features

### 1. Smart Element-Aware Page Breaks (`PDF Engine`)
Unlike standard HTML-to-PDF tools that blindly slice pages and cut text lines or tables in half, SuperConvert's PDF engine features:
- **Intelligent Element Avoidance**: Automatically calculates DOM geometry to push headings (`h1`–`h6`), table rows (`tr`), code snippets (`pre`), and blockquotes cleanly onto the next page.
- **Canvas Row Pixel Inspection**: Scans canvas pixels to snap cuts strictly into natural blank whitespace.
- **Manual Page Break Directives**: Full support for `<!-- pagebreak -->`, `<!-- page-break -->`, `\pagebreak`, and `[pagebreak]`.

### 2. Live Markdown Studio
An interactive document workspace featuring:
- **Real-Time Vector Pagination**: View live A4/Letter page boundaries as you type.
- **Professional Themes**: *Super Modern*, *Editorial Serif*, *GitHub Classic*, *Boxed*, and *Dark Luxury*.
- **Customizable Watermarking**: Real-time watermark text with live controls for font size slider (32px–104px), rotation angle (-45° cross to 0° straight), opacity slider, and single-center vs. full-page tile repeats.
- **Template Presets**: Pre-built templates for engineering specs, ATS resumes, and legal contracts.

### 3. Intelligent Text to Markdown Engine (`text-to-md`)
Paste or upload raw unformatted text to transform it into clean GitHub Flavored Markdown (GFM):
- Automatic detection of Setext (`===` / `---`) and ATX (`#`) headings.
- Numbered outline recognition (`1. Introduction`, `1.1 Architecture`).
- Normalization of Unicode bullet markers (`•`, `⁃`, `◦`, `▪`, `▫`, `–`, `—`) and checklists (`[ ]`, `[x]`).
- Auto-conversion of tab-separated (TSV) and pipe-delimited text into GFM markdown tables.
- Autolinking bare URLs and email addresses.

### 4. Text & File to LaTeX Engine for Overleaf (`text-to-latex` & `file-to-latex`)
Transform plain text, notes, Markdown, and Microsoft Word (`.docx`) files directly into complete, compilable LaTeX code with 1-click Overleaf project export:
- **Math & Equation Preservation**: Smartly detects and protects inline math (`$...$`) and display equations (`$$...$$`, `\begin{equation}...\end{equation}`) without accidental double-escaping of backslashes or brackets.
- **Booktabs Tables**: Generates clean, professional `\toprule`, `\midrule`, and `\bottomrule` table structures.
- **Code Listings**: Automatically maps languages (`python`, `js`, `cpp`, `sql`, etc.) to `\begin{lstlisting}` with custom syntax themes.
- **Compilable Templates**: Supports `article` (standard), `IEEEtran` (conference/journal), `report` (chapters/thesis), `beamer` (presentation slides), and `minimal` (homework/notes).
- **1-Click Overleaf Export**: Download a pre-structured Overleaf `.zip` containing `main.tex`, `README.md`, and sample asset directory, ready to drag-and-drop into Overleaf's *New Project $\rightarrow$ Upload Project*.

### 5. Immersive Scrollytelling Landing Page
Accessible via `#/story`:
- **Lenis Smooth Scroll Physics**: Weighted inertia scrolling (`lerp: 0.09`) locked to GSAP's internal ticker for buttery 60fps/120fps motion.
- **Scroll Pinning & Scrubbing**: Major sections freeze in the viewport while the scrollbar advances multi-phase file morphing animations.
- **Inline to Full-Bleed Viewport Morphing**: Interactive cards fluidly expand from inline components to full-screen hero stages.
- **Editorial Typography**: Styled with the Google *Outfit* display typeface and iridescent gradient shimmer.
- **Magnetic Micro-Interactions**: Cursor-trapping and elastic attraction physics on interactive elements.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Animation & Motion**: [GSAP 3](https://greensock.com/gsap/) (`ScrollTrigger`, `Observer`)
- **Smooth Scrolling**: [Lenis v1.3](https://lenis.darkroom.engineering/)
- **Document & PDF Processing**: `pdfjs-dist`, `docx`, `xlsx`, `jszip`, `mammoth`, `marked`, `dompurify`
- **Typography & Icons**: Google Fonts (*Outfit*, *Plus Jakarta Sans*, *JetBrains Mono*), Lucide Icons
- **Styling**: Vanilla CSS with strict GPU hardware acceleration (`translate3d`, `will-change`)

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20 & v24)
- npm or pnpm / yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nithin1138/SuperConvert.git
   cd SuperConvert
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The static distribution bundle will be created in `dist/`.

---

## 📂 Project Structure

```
SuperConvert/
├── index.html                   # HTML entry point with Google Fonts
├── vite.config.js               # Vite config with @vitejs/plugin-react
├── package.json                 # Project dependencies & scripts
├── public/                      # Static icons and assets
└── src/
    ├── main.js                  # Application entry point & hash router
    ├── components/              # UI components
    │   ├── Navbar.js            # Main navigation header
    │   ├── Hero.js              # Home hero banner
    │   ├── FormatModal.js       # Interactive format picker catalog
    │   ├── ToolConverter.js     # Universal tool workspace
    │   ├── Converter.js         # Live Studio editor & preview
    │   ├── MarqueeTicker.js     # Animated format ticker
    │   └── ...                  # Modals (Pricing, API Docs, Command Palette)
    ├── core/                    # In-browser conversion engines
    │   ├── pdf-engine.js        # Smart element-aware PDF compiler
    │   ├── doc-engine.js        # Word, Text-to-MD, PPTX & XLSX generator
    │   ├── image-engine.js      # Canvas image compressor & binary encoders
    │   ├── audio-video-engine.js# Web Audio WAV synthesis & video transcoder
    │   ├── three-d-engine.js    # OBJ/STL mesh parser & glTF 2.0 generator
    │   ├── converter-registry.js# Master catalog of 43+ tools & aliases
    │   └── parser.js            # Markdown parser & syntax highlighter
    ├── scrollytelling/          # Immersive React + GSAP + Lenis experience
    │   ├── StoryApp.jsx         # Master scrollytelling container
    │   ├── hooks/
    │   │   └── useLenisGsap.js  # Lenis + GSAP ticker synchronization
    │   ├── components/
    │   │   ├── CustomCursor.jsx # Magnetic follower cursor
    │   │   ├── HeroSection.jsx  # Split-text reveal & orbital parallax
    │   │   ├── PinnedMorphSection.jsx # Scroll-pinned transformation theater
    │   │   ├── PrivacyMatrixSection.jsx # Zero-knowledge security matrix
    │   │   ├── FullBleedMorphSection.jsx# Card-to-viewport morphing stage
    │   │   ├── InteractiveShowcase.jsx  # 3D interactive format cards
    │   │   └── CtaLaunchSection.jsx     # Launch CTA finale
    │   └── styles/
    │       └── scrollytelling.css# Dark luxury styling & 60fps GPU acceleration
    └── styles/                  # Global CSS design system
```

---

## 🔒 Security & Privacy Architecture

```
User File (Local Disk)
       │
       ▼
Browser File API / Blob
       │
       ▼
In-Memory WebAssembly / Canvas / AudioContext (Client RAM)
       │
       ▼
Instant Download Blob (Local Disk)

   🚫 ZERO Network Requests
   🚫 ZERO Third-Party Cloud Buckets
   🚫 ZERO Analytics Tracking of Document Content
```

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute it for personal and commercial projects.
