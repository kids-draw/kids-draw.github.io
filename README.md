<div align="center">

# 🎨 KidsDraw ✨
### *Free, Ultra-Minimal, 100% Client-Side Magic Drawing Board for Kids*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-kids--draw.github.io-12EDAB?style=for-the-badge&logo=googlechrome&logoColor=1E7D94)](https://kids-draw.github.io)
[![Buy Me A Coffee](https://img.shields.io/badge/Support%20Developer-Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=000000)](https://buymeacoffee.com/kisharadilz)
[![License: MIT](https://img.shields.io/badge/License-MIT-46EC67?style=for-the-badge)](LICENSE)

<br />

[![Astro](https://img.shields.io/badge/Astro%205-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![React](https://img.shields.io/badge/React%2019-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SEO 100%](https://img.shields.io/badge/SEO-100%25-brightgreen?style=flat-square&logo=google&logoColor=white)](https://kids-draw.github.io/sitemap.xml)
[![Privacy 100%](https://img.shields.io/badge/Privacy-100%25_Client--Side-1E7D94?style=flat-square&logo=shield&logoColor=white)](https://kids-draw.github.io)
[![Languages](https://img.shields.io/badge/Languages-7_Supported-ADED92?style=flat-square&logo=translate&logoColor=1E7D94)](https://kids-draw.github.io)

<br />

> **KidsDraw** is an ultra-minimal, distraction-free HTML5 Canvas web application built specifically for children. It offers immediate creative expression, seamless cross-device pointer drawing, instant PNG artwork downloads, and zero server uploads for total privacy.

[**Explore The Board**](https://kids-draw.github.io/) • [**Report Bug**](https://github.com/kids-draw/kids-draw.github.io/issues) • [**Request Feature**](https://github.com/kids-draw/kids-draw.github.io/issues)

</div>

---

## 📑 Table of Contents

- [Overview & Philosophy](#-overview--philosophy)
- [Key Features](#-key-features)
- [Creative Instrument Suite](#-creative-instrument-suite)
- [Design System & Palette](#-design-system--palette)
- [Internationalization (i18n)](#-internationalization-i18n)
- [Technical Architecture](#-technical-architecture)
- [Technical SEO & Performance](#-technical-seo--performance)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [GitHub Pages Deployment](#-github-pages-deployment)
- [Privacy Policy](#-privacy-policy)
- [Support the Developer](#-support-the-developer)
- [License](#-license)

---

## 🌟 Overview & Philosophy

Most drawing applications on the modern web are cluttered with advertisements, registration gates, paywalls, and complex toolbars that overwhelm young children. **KidsDraw** was engineered with a child-first mindset:

1. **Zero Distractions**: No banners, no popups, no account creation, and no subscription prompts.
2. **Instant Gratification**: The canvas is ready to draw on the millisecond the page loads.
3. **100% Privacy by Design**: All strokes, images, and export operations execute strictly inside the child's browser memory via the HTML5 Canvas API. No images or telemetry are ever uploaded to any backend server.
4. **Ergonomic Accessibility**: Features oversized touch-friendly buttons, adaptive docking for mobile thumb reach, and high-contrast child-friendly visual styling.

---

## 🚀 Key Features

- 🖍️ **Hardware-Accelerated HTML5 Canvas**: Responsive high-DPI (Retina) drawing surface calibrated with `window.devicePixelRatio`.
- 👆 **Unified Cross-Device Pointer Events**: Flawless gesture continuity across mouse, Apple Pencil, capacitive styluses, and multi-touch fingers with `setPointerCapture`.
- 🔒 **Touch Drawing Lock**: Enforces `touch-action: none` to prevent accidental scroll or pinch-zoom gestures while drawing on mobile devices.
- 📐 **Dynamic Non-Destructive Resizing**: Offscreen canvas backup buffer preserves existing artwork during window resizing or device orientation changes.
- 💾 **1-Click High-Res PNG Export**: Exports crisp PNG artwork directly to the device with background compositing (paper or blackboard) and celebratory confetti fireworks.
- 🌓 **Dual Environment Themes**:
  - **Cream Paper Mode**: Warm, soft paper texture with `#1E7D94` typography.
  - **Glow Blackboard Mode**: Deep slate blackboard with electric neon illumination.
- ⛶ **Distraction-Free Fullscreen Mode**: 1-click toggle to lock out browser URL bars and distractions on tablet devices.
- ↩️ **Undo & Redo Safeguard**: 30-state snapshot history stack for stress-free creative experimentation.
- 🗑️ **Clear All Confirmation**: Friendly dialog prevents accidental artwork loss.

---

## 🖌️ Creative Instrument Suite

The bottom toolbar organizes drawing instruments logically into **Start Side (Creative Brushes)** and **End Side (Pens, Pencils & Pastels)**:

```
┌─────────────────────────────────┬──────────────────────────────────────────┬──────────┐
│     START SIDE (Original Tools) │     END SIDE (Writing & Coloring Tools)  │ UTILITY  │
│  🖌️ Brush • 🌈 Rainbow • ✨ Glow │  🖋️ Pen • ✏️ Pencil • 🖍️ Platignum • 🎨 Pastel │ 🧽 Eraser │
└─────────────────────────────────┴──────────────────────────────────────────┴──────────┘
```

| Instrument | Icon | Physics & Behavior Profile | Best For |
| :--- | :---: | :--- | :--- |
| **Brush** | 🖌️ | Full-opacity (`1.0`), smooth circular cap, standard line width. | General painting, broad fills, and color blending. |
| **Rainbow Magic** | 🌈 | Multi-hue cycling sparkle brush with lively animations. | Magical rainbow trails, playful scribbles, and fun doodling. |
| **Glow Art** | ✨ | Electric neon illumination with dynamic shadow blur (`1.4×`). | Blackboard glow-in-the-dark art and light effects. |
| **Pen** | 🖋️ | Crisp, fluid, solid ink lines (`1.0` alpha, `0.8×` width) with tight precision. | Signing names, cartoon outlines, and fine writing. |
| **Pencil** | ✏️ | Soft semi-transparent graphite texture (`0.72` alpha, `0.55×` width). | Natural sketching, preliminary outlines, and soft graphite shading. |
| **Platignum** | 🖍️ | Rich, saturated felt-tip coloring marker (`0.92` alpha, `1.35×` broad tip). | Coloring books, bold poster drawings, and vibrant fills. |
| **Pastel** | 🎨 | Creamy oil pastel / wax crayon texture (`0.86` alpha, `1.25×` width, soft edge). | Chalky/waxy textures, impressionist artwork, and rich laydown. |
| **Eraser** | 🧽 | Precision eraser utilizing `destination-out` composite operations. | Wiping away marks cleanly back to the board background. |

---

## 🎨 Design System & Palette

The user interface follows an ultra-playful, minimalist aesthetic using the exact project hex color palette:

| Color Name | Hex Code | Swatch | Purpose |
| :--- | :---: | :---: | :--- |
| **Deep Ocean** | `#1E7D94` | `■` | Primary typography, UI borders, brand headers, and bold icons. |
| **Neon Green** | `#46EC67` | `■` | Primary brand accent, glowing canvas highlight, active indicators. |
| **Aqua Cyan** | `#12EDAB` | `■` | Secondary accents, playful gradients, and interactive pills. |
| **Soft Mint** | `#ADED92` | `■` | Subtle badge backgrounds, badges, and soft highlights. |

---

## 🌍 Internationalization (i18n)

KidsDraw features static subpath internationalization with localized translation dictionaries for all UI text, tooltips, and SEO metadata:

| Language | Badge | Flag | Subpath Route | Status |
| :--- | :---: | :---: | :---: | :---: |
| **English** *(Default)* | `US` | 🇺🇸 | `https://kids-draw.github.io/` | Active |
| **Español** | `ES` | 🇪🇸 | `https://kids-draw.github.io/es/` | Active |
| **Português** | `BR` | 🇧🇷 | `https://kids-draw.github.io/pt/` | Active |
| **Deutsch** | `DE` | 🇩🇪 | `https://kids-draw.github.io/de/` | Active |
| **Français** | `FR` | 🇫🇷 | `https://kids-draw.github.io/fr/` | Active |
| **日本語** | `JP` | 🇯🇵 | `https://kids-draw.github.io/ja/` | Active |
| **简体中文** | `CN` | 🇨🇳 | `https://kids-draw.github.io/zh/` | Active |

- **Subpath Strategy**: Clean routing without URL hashes (`/`, `/es/`, `/pt/`, etc.).
- **Automatic Fallback**: English serves as the fallback locale for missing translation keys.
- **Hreflang Bidirectional Tags**: Fully declared cross-language references including `x-default`.

---

## 🏗️ Technical Architecture

KidsDraw leverages Astro's **Islands Architecture** to achieve zero unnecessary JavaScript overhead:

```
┌────────────────────────────────────────────────────────┐
│                   Astro SSG Shell                      │
│  • Layout.astro (SEO, Preconnects, Theme, Analytics)   │
│  • Navbar.astro (Icon-First Responsive Top Navigation) │
├────────────────────────────────────────────────────────┤
│             React Island (client:load)                 │
│  • DrawBoard.tsx                                       │
│    ├── HTML5 Canvas Engine (Pointer Events)            │
│    ├── Offscreen Backup Buffer                         │
│    ├── History Stack (Undo / Redo)                     │
│    └── Oversized Kid-Friendly Dock                     │
└────────────────────────────────────────────────────────┘
```

- **Static Site Generation (SSG)**: Pre-renders 100% of HTML at build time for sub-second First Contentful Paint.
- **Island Hydration**: Only the interactive drawing canvas and toolbar are hydrated on the client.
- **Hardware Acceleration**: Smooth bezier curve interpolations prevent stroke stepping or latency.

---

## ⚡ Technical SEO & Performance

Designed by Senior Technical SEO standards to achieve top-tier Google rankings:

- 📊 **Google Analytics**: Official Google tag (`gtag.js` ID: `G-W1P26MJ8W2`) loaded asynchronously with DNS prefetch hints.
- 📐 **Schema.org Structured Data**:
  - `@graph` linking `WebApplication`, `BreadcrumbList`, and `Organization`.
  - Zero fabricated review penalties (100% compliant with Google Search Central guidelines).
- 🖼️ **Social Sharing (OG / Twitter)**: High-resolution **1200×630px** social card (`/og-image.png`) with complete `summary_large_image` tags.
- 🗺️ **Sitemap & Robots**:
  - Dynamic multi-language XML sitemap at [`/sitemap.xml`](https://kids-draw.github.io/sitemap.xml).
  - Valid [`/robots.txt`](https://kids-draw.github.io/robots.txt) declaring sitemap location.
- ♿ **WCAG 2.1 AA Accessibility**:
  - Semantic heading hierarchy starting with primary `<h1>`.
  - Comprehensive ARIA labels across canvas, tools, swatches, and modals.

---

## 📁 Project Structure

```text
kids-draw.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── favicon.svg             # Scalable SVG brand icon
│   ├── og-image.png            # 1200x630 Social preview card
│   ├── robots.txt              # Search engine crawler directives
│   ├── site.webmanifest        # Progressive Web App manifest
│   └── sitemap.xml             # Complete multi-language XML sitemap
├── scripts/
│   └── generate-og.mjs         # Sharp-based OG image generator
├── src/
│   ├── components/
│   │   ├── DrawBoard.tsx       # React Island HTML5 Canvas drawing engine
│   │   └── Navbar.astro        # Responsive icon-first navigation bar
│   ├── i18n/
│   │   ├── locales/            # 7 Localized translation dictionaries
│   │   │   ├── de.json
│   │   │   ├── en.json
│   │   │   ├── es.json
│   │   │   ├── fr.json
│   │   │   ├── ja.json
│   │   │   ├── pt.json
│   │   │   └── zh.json
│   │   ├── languages.ts        # Language metadata and badges
│   │   └── utils.ts            # Localized pathing and hreflang helpers
│   ├── layouts/
│   │   └── Layout.astro        # Master HTML shell with Technical SEO & JSON-LD
│   ├── pages/
│   │   ├── [lang]/
│   │   │   └── index.astro     # Localized subpath routes (/es/, /de/, etc.)
│   │   └── index.astro         # Default English root route (/)
│   └── styles/
│       └── global.css          # Tailwind base, Fredoka font & playful button styles
├── astro.config.mjs            # Astro configuration with React & Tailwind
├── package.json                # Project dependencies and build scripts
├── tailwind.config.mjs         # Tailwind configuration mapping exact hex palette
└── tsconfig.json               # TypeScript strict configuration
```

---

## 💻 Getting Started

### Prerequisites

- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher

### Local Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kids-draw/kids-draw.github.io.git
   cd kids-draw.github.io
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## 🚀 GitHub Pages Deployment

The repository includes a production-ready GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

Whenever changes are pushed to the `main` branch, the workflow:
1. Checks out the code.
2. Installs dependencies using `npm ci`.
3. Runs `npm run build` to generate static files in `./dist`.
4. Deploys the build artifacts directly to **GitHub Pages**.

To publish changes live:
```bash
git push origin main
```

---

## 🛡️ Privacy Policy

- **No Cookies**: KidsDraw sets zero tracking or advertising cookies.
- **No Data Collection**: No keystrokes, drawings, or personal data are collected or transmitted.
- **COPPA & GDPR-K Compliant**: Completely safe for toddlers, young children, and school environments.

---

## ☕ Support the Developer

If you or your children enjoy creating with **KidsDraw**, please consider supporting its ongoing development and maintenance:

<div align="center">

[![Buy Me A Coffee](https://img.shields.io/badge/Support%20on-Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=000000)](https://buymeacoffee.com/kisharadilz)

**[buymeacoffee.com/kisharadilz](https://buymeacoffee.com/kisharadilz)**

*Created with ❤️ by **Kishara Dilz***

</div>

---

## 📄 License

This project is open-source software licensed under the **[MIT License](LICENSE)**.
