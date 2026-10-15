# KidsDraw 🎨✨ | Free Online Magic Drawing Board

> An ultra-minimal, 100% client-side web application built with **Astro** and **React**. Designed specifically for kids, it provides a fun, distraction-free HTML5 Canvas drawing board with instant PNG downloads, zero server uploads, and total privacy.

🌐 **Live URL**: [https://kids-draw.github.io](https://kids-draw.github.io)  
☕ **Support the Developer**: [Buy Me a Coffee](https://buymeacoffee.com/kisharadilz)

---

## 🚀 Features

- 🖍️ **Magic Canvas**: Responsive HTML5 Canvas with pointer events supporting both mouse, stylus, and touch gestures. Automatically prevents screen scrolling while drawing.
- ✏️ **Diverse Drawing Instruments**:
  - **Start Side (Creative Brushes)**:
    - **Brush**: Smooth, rich paint strokes.
    - **Rainbow Magic**: Dynamic hue-cycling sparkle brush that kids love.
    - **Neon Glow Art**: Luminous electric glow effect for blackboard drawings.
  - **End Side (Pens, Pencils & Coloring Tools)**:
    - **Pen**: Crisp, fluid, solid ink lines for clean writing and precise drawing.
    - **Pencil**: Natural semi-transparent graphite texture for realistic sketching and soft shading.
    - **Platignum**: Saturated felt-tip coloring marker with bold fiber-tip ink (inspired by classic school coloring pens).
    - **Pastel**: Creamy oil pastel / crayon texture with soft wax edges and rich coverage.
  - **Correction**:
    - **Eraser**: Precision eraser to wipe away strokes.
- 🧽 **Kid-Friendly Tools**: Oversized brush size selectors (Small, Medium, Large, Jumbo), soft eraser, undo/redo, and accidental-clear protection.
- 🎨 **Design System Color Palette**: Preloaded with `#ADED92` (Soft Mint), `#46EC67` (Neon Green), `#12EDAB` (Aqua Cyan), `#1E7D94` (Deep Ocean), plus vibrant child-friendly colors and a native color wheel.
- 💾 **Instant Client-Side PNG Export**: Saves artwork directly to the device with a celebratory confetti blast—zero data sent to servers!
- 🌓 **Paper & Blackboard Themes**: Light paper texture mode and dark glowing slate blackboard mode.
- 🌍 **7-Language Internationalization (i18n)**: English, Español, Português, Deutsch, Français, 日本語, and 简体中文 with subpath routing and complete hreflang SEO metadata.
- 📱 **Adaptive UI**: Expansive toolbar on desktop; collapses to pure icons and docks to the bottom on mobile for easy thumb reach.

---

## 🛠️ Tech Stack

- **Framework**: [Astro 5](https://astro.build/) (Static Site Generation, Subpath i18n Routing)
- **UI Island**: [React 19](https://react.dev/) (HTML5 Canvas Drawing State, Pointer Events)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebration FX**: `canvas-confetti`
- **Hosting**: GitHub Pages

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/kids-draw/kids-draw.github.io.git
cd kids-draw.github.io

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
