import React, { useRef, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Pencil,
  Pen,
  Highlighter,
  Brush as CrayonIcon,
  Paintbrush, 
  Sparkles, 
  Eraser, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Download, 
  Palette,
  Maximize2,
  Minimize2,
  SunMedium,
  Check
} from 'lucide-react';

interface ToolTranslations {
  draw: string;
  pencil: string;
  pen: string;
  platignum: string;
  pastel: string;
  brush: string;
  magicBrush: string;
  glowBrush: string;
  eraser: string;
  size: string;
  sizeSmall: string;
  sizeMedium: string;
  sizeLarge: string;
  sizeJumbo: string;
  colorPicker: string;
  undo: string;
  redo: string;
  clear: string;
  clearTitle: string;
  clearConfirm: string;
  clearCancel: string;
  save: string;
  saving: string;
  downloadSuccess: string;
  fullscreen: string;
  exitFullscreen: string;
}

interface DrawBoardProps {
  translations: ToolTranslations;
  currentLocale: string;
}

// Preset Color Palette including specified hex values
const PRESET_COLORS = [
  // Required Design System Palette
  { hex: '#ADED92', name: 'Soft Mint' },
  { hex: '#46EC67', name: 'Neon Green' },
  { hex: '#12EDAB', name: 'Aqua Cyan' },
  { hex: '#1E7D94', name: 'Deep Ocean' },
  // Extra vibrant kid-friendly favorites
  { hex: '#FF4365', name: 'Cherry Red' },
  { hex: '#FF9F1C', name: 'Sun Orange' },
  { hex: '#FFE74C', name: 'Lemon Yellow' },
  { hex: '#9B5DE5', name: 'Bubble Purple' },
  { hex: '#F15BB5', name: 'Candy Pink' },
  { hex: '#00BBF9', name: 'Sky Cyan' },
  { hex: '#111827', name: 'Ink Black' },
  { hex: '#FFFFFF', name: 'Chalk White' },
];

const BRUSH_SIZES = [
  { size: 6, dotSize: 8, labelKey: 'sizeSmall' as const },
  { size: 14, dotSize: 14, labelKey: 'sizeMedium' as const },
  { size: 28, dotSize: 22, labelKey: 'sizeLarge' as const },
  { size: 48, dotSize: 30, labelKey: 'sizeJumbo' as const },
];

type ToolType = 'brush' | 'magic' | 'glow' | 'pen' | 'pencil' | 'platignum' | 'pastel' | 'eraser';

export default function DrawBoard({ translations: t }: DrawBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Tool & Stroke States
  const [activeTool, setActiveTool] = useState<ToolType>('brush');
  const [currentColor, setCurrentColor] = useState<string>('#1E7D94');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [customColor, setCustomColor] = useState<string>('#FF5722');

  // History Stacks for Undo / Redo
  const undoStackRef = useRef<ImageData[]>([]);
  const redoStackRef = useRef<ImageData[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Drawing tracking refs
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const rainbowHueRef = useRef<number>(0);
  const isInteractingRef = useRef<boolean>(false);

  // Update dark mode detection
  useEffect(() => {
    const checkDark = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
      // Default initial color to neon green or aqua in dark mode, deep ocean in light mode
      if (isDark && (currentColor === '#1E7D94' || currentColor === '#111827')) {
        setCurrentColor('#12EDAB');
      } else if (!isDark && currentColor === '#FFFFFF') {
        setCurrentColor('#1E7D94');
      }
    };

    checkDark();

    const handleThemeChange = (e: Event) => {
      const customEvt = e as CustomEvent<{ theme: 'light' | 'dark' }>;
      const isDark = customEvt.detail?.theme === 'dark';
      setIsDarkMode(isDark);
    };

    window.addEventListener('theme-changed', handleThemeChange);
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('theme-changed', handleThemeChange);
      observer.disconnect();
    };
  }, []);

  // Save current canvas state to Undo stack
  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      undoStackRef.current.push(snapshot);
      if (undoStackRef.current.length > 30) {
        undoStackRef.current.shift();
      }
      redoStackRef.current = [];
      setCanUndo(true);
      setCanRedo(false);
    } catch {
      // Ignore if canvas tainted or context missing
    }
  }, []);

  // Initialize and resize canvas without clearing artwork
  const setupCanvasSize = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5); // high-DPI retina display
    const newWidth = Math.floor(rect.width * dpr);
    const newHeight = Math.floor(rect.height * dpr);

    if (newWidth <= 0 || newHeight <= 0) return;

    // Check if canvas already matches dimensions
    if (canvas.width === newWidth && canvas.height === newHeight) return;

    // Offscreen backup before resizing
    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext('2d');
    
    let hasArtwork = false;
    if (offCtx && canvas.width > 0 && canvas.height > 0) {
      offCtx.drawImage(canvas, 0, 0);
      hasArtwork = true;
    }

    // Resize main canvas
    canvas.width = newWidth;
    canvas.height = newHeight;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Restore previous artwork
    if (hasArtwork && offCtx) {
      ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Mount setup and window resize listener
  useEffect(() => {
    setupCanvasSize();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupCanvasSize();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [setupCanvasSize]);

  // Convert client pointer coordinates to canvas resolution coordinates
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Setup drawing context properties based on active tool and settings
  const configureStroke = (ctx: CanvasRenderingContext2D) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const scaledSize = brushSize * dpr;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = scaledSize * 1.6;
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      return;
    }

    ctx.globalCompositeOperation = 'source-over';

    if (activeTool === 'pencil') {
      // Soft graphite sketch pencil (fine, natural semi-transparent graphite texture)
      ctx.strokeStyle = currentColor;
      ctx.globalAlpha = 0.72;
      ctx.lineWidth = Math.max(2, scaledSize * 0.55);
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    } else if (activeTool === 'pen') {
      // Crisp ink ballpoint / gel pen (solid, precise, fluid line)
      ctx.strokeStyle = currentColor;
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = Math.max(3, scaledSize * 0.8);
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    } else if (activeTool === 'platignum') {
      // Platignum / Felt-tip coloring marker (bold, saturated fiber-tip ink)
      ctx.strokeStyle = currentColor;
      ctx.globalAlpha = 0.92;
      ctx.lineWidth = Math.max(6, scaledSize * 1.35);
      ctx.shadowBlur = isDarkMode ? scaledSize * 0.25 : 0;
      ctx.shadowColor = isDarkMode ? currentColor : 'transparent';
    } else if (activeTool === 'magic') {
      // Rainbow magic brush
      rainbowHueRef.current = (rainbowHueRef.current + 7) % 360;
      ctx.strokeStyle = `hsl(${rainbowHueRef.current}, 95%, 55%)`;
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = scaledSize;
      ctx.shadowBlur = isDarkMode ? scaledSize * 0.8 : 0;
      ctx.shadowColor = `hsl(${rainbowHueRef.current}, 95%, 55%)`;
    } else if (activeTool === 'glow') {
      // Neon Glow Pen
      ctx.strokeStyle = currentColor;
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = scaledSize;
    } else if (activeTool === 'pastel') {
      // Oil Pastel / Crayon (creamy, waxy texture with soft edges)
      ctx.strokeStyle = currentColor;
      ctx.globalAlpha = 0.86;
      ctx.lineWidth = Math.max(5, scaledSize * 1.25);
      ctx.shadowBlur = Math.max(1, scaledSize * 0.15);
      ctx.shadowColor = currentColor;
    } else {
      // Standard Vibrant Brush
      ctx.strokeStyle = currentColor;
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = scaledSize;
      ctx.shadowBlur = isDarkMode ? scaledSize * 0.4 : 0;
      ctx.shadowColor = isDarkMode ? currentColor : 'transparent';
    }
  };

  // Pointer Down: Start Stroke
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return; // Left click only

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Capture pointer to guarantee mouse/touch continuity even when leaving bounds
    canvas.setPointerCapture(e.pointerId);

    // Save history snapshot before new stroke begins
    saveSnapshot();

    isDrawingRef.current = true;
    isInteractingRef.current = true;
    const coords = getCoordinates(e);
    lastPointRef.current = coords;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    configureStroke(ctx);

    // Draw immediate dot for tap/click
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, (ctx.lineWidth || 10) / 2, 0, Math.PI * 2);
    if (activeTool === 'eraser') {
      ctx.fill();
    } else if (activeTool === 'magic') {
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
    } else {
      ctx.fillStyle = currentColor;
      ctx.fill();
    }
  };

  // Pointer Move: Continue Smooth Stroke
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentCoords = getCoordinates(e);
    const prev = lastPointRef.current;

    // Smooth bezier midpoint interpolation
    const midX = (prev.x + currentCoords.x) / 2;
    const midY = (prev.y + currentCoords.y) / 2;

    configureStroke(ctx);

    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
    ctx.stroke();

    lastPointRef.current = currentCoords;
  };

  // Pointer Up & Cancel: End Stroke
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    isInteractingRef.current = false;

    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
  };

  // Undo Functionality
  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || undoStackRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save current to redo stack
    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    redoStackRef.current.push(currentImg);

    // Pop previous from undo stack
    const prevImg = undoStackRef.current.pop()!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(prevImg, 0, 0);

    setCanUndo(undoStackRef.current.length > 0);
    setCanRedo(true);
  };

  // Redo Functionality
  const handleRedo = () => {
    const canvas = canvasRef.current;
    if (!canvas || redoStackRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStackRef.current.push(currentImg);

    const nextImg = redoStackRef.current.pop()!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(nextImg, 0, 0);

    setCanUndo(true);
    setCanRedo(redoStackRef.current.length > 0);
  };

  // Clear Canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveSnapshot();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setShowClearConfirm(false);
  };

  // Save / PNG Export Functionality
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Create a background composite canvas so PNG is never transparent or invisible
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const expCtx = exportCanvas.getContext('2d');
      if (!expCtx) return;

      // Fill background: Paper off-white for light theme, deep blackboard for dark theme
      if (isDarkMode) {
        expCtx.fillStyle = '#111827'; // Dark Blackboard
      } else {
        expCtx.fillStyle = '#FDFBF7'; // Soft Cream Paper
      }
      expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

      // Draw child's artwork over paper background
      expCtx.drawImage(canvas, 0, 0);

      // Optional playful subtle watermark in corner
      expCtx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(30, 125, 148, 0.25)';
      expCtx.font = `bold ${Math.max(16, Math.floor(exportCanvas.width * 0.016))}px Fredoka, sans-serif`;
      expCtx.textAlign = 'right';
      expCtx.fillText('Made with KidsDraw ✨', exportCanvas.width - 24, exportCanvas.height - 24);

      // Export PNG directly to device
      const dataUrl = exportCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      link.download = `my-drawing-${dateStr}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Celebration Confetti Explosion!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ADED92', '#46EC67', '#12EDAB', '#1E7D94', '#FF4365', '#FFE74C'],
      });

      // Show temporary celebratory toast
      setToastMessage(t.downloadSuccess);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative flex flex-col w-full h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-hidden select-none bg-paper-warm/40 dark:bg-slate-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-neon_green to-aqua_cyan text-deep_ocean font-extrabold px-5 py-2.5 rounded-full shadow-lg border-2 border-deep_ocean/30 flex items-center gap-2 animate-bounce-slight">
          <Check className="w-5 h-5 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Canvas Drawing Area */}
      <div 
        ref={containerRef} 
        className="relative flex-1 w-full h-full p-2 sm:p-4 touch-none cursor-crosshair overflow-hidden flex items-center justify-center"
      >
        <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-inner border-2 border-deep_ocean/15 dark:border-slate-800 bg-paper-light dark:bg-slate-900 transition-colors duration-300">
          
          {/* Subtle grid or texture for paper/board */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-15 bg-[radial-gradient(#1E7D94_1px,transparent_1px)] dark:bg-[radial-gradient(#12EDAB_1px,transparent_1px)] [background-size:24px_24px]"
            aria-hidden="true"
          />

          {/* HTML5 Canvas Element with Accessible Role */}
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Kids magic drawing board interactive canvas"
            tabIndex={0}
            className="absolute inset-0 w-full h-full touch-none block"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />

          {/* Floating Canvas Quick Utilities: Fullscreen & Undo/Redo */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              title={t.undo}
              aria-label={t.undo}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
                canUndo 
                  ? 'bg-white/90 dark:bg-slate-800/90 text-deep_ocean dark:text-soft_mint border-deep_ocean/20 shadow-sm active:scale-95 cursor-pointer hover:border-deep_ocean/50' 
                  : 'bg-white/40 dark:bg-slate-800/40 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-slate-800 cursor-not-allowed opacity-60'
              }`}
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              title={t.redo}
              aria-label={t.redo}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
                canRedo 
                  ? 'bg-white/90 dark:bg-slate-800/90 text-deep_ocean dark:text-soft_mint border-deep_ocean/20 shadow-sm active:scale-95 cursor-pointer hover:border-deep_ocean/50' 
                  : 'bg-white/40 dark:bg-slate-800/40 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-slate-800 cursor-not-allowed opacity-60'
              }`}
            >
              <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? t.exitFullscreen : t.fullscreen}
              aria-label={isFullscreen ? t.exitFullscreen : t.fullscreen}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/90 dark:bg-slate-800/90 text-deep_ocean dark:text-soft_mint border-2 border-deep_ocean/20 dark:border-slate-700 shadow-sm flex items-center justify-center active:scale-95 cursor-pointer hover:border-deep_ocean/50"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              ) : (
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* KID-FRIENDLY OVERSIGHT BOTTOM TOOLBAR */}
      <div className="w-full z-30 select-none pb-2 sm:pb-3 px-2 sm:px-4">
        <div className="max-w-4xl mx-auto rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-deep_ocean/20 dark:border-slate-800 shadow-lg p-2 sm:p-3 flex flex-col gap-2">
          
          {/* Top Row: Primary Tools, Brush Sizes, Clear, and Prominent Save CTA */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-3 flex-wrap">
            
            {/* Tool Selector: Previous Tools (Start) -> Pen, Pencil, Platignum, Pastel (End) -> Eraser */}
            <div role="toolbar" aria-label="Drawing Instruments" class="flex items-center gap-1 sm:gap-1.5 bg-paper-warm/60 dark:bg-slate-800/80 p-1 rounded-xl sm:rounded-2xl border border-deep_ocean/10 dark:border-slate-700 overflow-x-auto scrollbar-none max-w-full">
              
              {/* START SIDE: PREVIOUS ORIGINAL TOOLS */}
              {/* Regular Brush */}
              <button
                type="button"
                onClick={() => setActiveTool('brush')}
                title={t.brush}
                aria-label={t.brush}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex-shrink-0 ${
                  activeTool === 'brush'
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'text-deep_ocean dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700'
                }`}
              >
                <Paintbrush className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                <span className="hidden lg:inline">{t.brush}</span>
              </button>

              {/* Rainbow Magic Brush */}
              <button
                type="button"
                onClick={() => setActiveTool('magic')}
                title={t.magicBrush}
                aria-label={t.magicBrush}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex-shrink-0 ${
                  activeTool === 'magic'
                    ? 'bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-400 text-white shadow-md scale-105'
                    : 'text-deep_ocean dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5] text-amber-300 animate-wiggle" />
                <span className="hidden lg:inline">{t.magicBrush}</span>
              </button>

              {/* Glow Art Brush */}
              <button
                type="button"
                onClick={() => setActiveTool('glow')}
                title={t.glowBrush}
                aria-label={t.glowBrush}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex-shrink-0 ${
                  activeTool === 'glow'
                    ? 'bg-gradient-to-r from-neon_green to-aqua_cyan text-deep_ocean font-extrabold shadow-md scale-105'
                    : 'text-deep_ocean dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700'
                }`}
              >
                <SunMedium className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                <span className="hidden lg:inline">{t.glowBrush}</span>
              </button>

              {/* Subtle Group Divider */}
              <div className="w-[1.5px] h-5 bg-deep_ocean/20 dark:bg-slate-700 mx-0.5 rounded-full flex-shrink-0" aria-hidden="true" />

              {/* END SIDE: PEN, PENCIL, PLATIGNUM, PASTEL */}
              {/* Pen */}
              <button
                type="button"
                onClick={() => setActiveTool('pen')}
                title={t.pen}
                aria-label={t.pen}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex-shrink-0 ${
                  activeTool === 'pen'
                    ? 'bg-deep_ocean text-white shadow-md scale-105'
                    : 'text-deep_ocean dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700'
                }`}
              >
                <Pen className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                <span className="hidden lg:inline">{t.pen}</span>
              </button>

              {/* Pencil */}
              <button
                type="button"
                onClick={() => setActiveTool('pencil')}
                title={t.pencil}
                aria-label={t.pencil}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex-shrink-0 ${
                  activeTool === 'pencil'
                    ? 'bg-slate-700 text-white shadow-md scale-105'
                    : 'text-deep_ocean dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700'
                }`}
              >
                <Pencil className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                <span className="hidden lg:inline">{t.pencil}</span>
              </button>

              {/* Platignum (Felt-tip Marker) */}
              <button
                type="button"
                onClick={() => setActiveTool('platignum')}
                title={t.platignum}
                aria-label={t.platignum}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex-shrink-0 ${
                  activeTool === 'platignum'
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'text-deep_ocean dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700'
                }`}
              >
                <Highlighter className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                <span className="hidden lg:inline">{t.platignum}</span>
              </button>

              {/* Pastel (Oil Pastel / Crayon) */}
              <button
                type="button"
                onClick={() => setActiveTool('pastel')}
                title={t.pastel}
                aria-label={t.pastel}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex-shrink-0 ${
                  activeTool === 'pastel'
                    ? 'bg-amber-500 text-white shadow-md scale-105'
                    : 'text-deep_ocean dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700'
                }`}
              >
                <CrayonIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                <span className="hidden lg:inline">{t.pastel}</span>
              </button>

              {/* Subtle Group Divider */}
              <div className="w-[1.5px] h-5 bg-deep_ocean/20 dark:bg-slate-700 mx-0.5 rounded-full flex-shrink-0" aria-hidden="true" />

              {/* Eraser */}
              <button
                type="button"
                onClick={() => setActiveTool('eraser')}
                title={t.eraser}
                aria-label={t.eraser}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex-shrink-0 ${
                  activeTool === 'eraser'
                    ? 'bg-pink-500 text-white shadow-md scale-105'
                    : 'text-deep_ocean dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700'
                }`}
              >
                <Eraser className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                <span className="hidden lg:inline">{t.eraser}</span>
              </button>
            </div>

            {/* Brush Size Selector Dots */}
            <div role="radiogroup" aria-label={t.size} className="flex items-center gap-1 sm:gap-2 bg-paper-warm/60 dark:bg-slate-800/80 px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl border border-deep_ocean/10 dark:border-slate-700">
              {BRUSH_SIZES.map((item) => {
                const isSelected = brushSize === item.size;
                return (
                  <button
                    key={item.size}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setBrushSize(item.size)}
                    title={t[item.labelKey]}
                    aria-label={t[item.labelKey]}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-deep_ocean text-white dark:bg-soft_mint dark:text-slate-900 ring-2 ring-deep_ocean/50 scale-110'
                        : 'hover:bg-deep_ocean/10 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span 
                      className="rounded-full bg-current transition-all"
                      style={{ width: `${item.dotSize}px`, height: `${item.dotSize}px` }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Clear All Trash Button */}
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              title={t.clear}
              aria-label={t.clear}
              className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl sm:rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-bold text-xs sm:text-sm flex items-center gap-1 border border-red-200 dark:border-red-800/50 transition-all cursor-pointer active:scale-95"
            >
              <Trash2 className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">{t.clear}</span>
            </button>

            {/* PROMINENT SAVE DRAWING CTA BUTTON */}
            <button
              type="button"
              onClick={handleExportPNG}
              title={t.save}
              aria-label={t.save}
              className="h-9 sm:h-10 px-3 sm:px-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-neon_green via-aqua_cyan to-soft_mint text-deep_ocean font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all border-2 border-deep_ocean/30 dark:border-neon_green/50 cursor-pointer ml-auto"
            >
              <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[3]" />
              <span className="font-kids tracking-wide">{t.save}</span>
            </button>
          </div>

          {/* Bottom Row: Color Swatches Palette */}
          <div role="radiogroup" aria-label="Color Palette" className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
            {PRESET_COLORS.map((c) => {
              const isSelected = currentColor.toLowerCase() === c.hex.toLowerCase() && activeTool !== 'eraser' && activeTool !== 'magic';
              return (
                <button
                  key={c.hex}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => {
                    setCurrentColor(c.hex);
                    if (activeTool === 'eraser' || activeTool === 'magic') {
                      setActiveTool('brush');
                    }
                  }}
                  title={c.name}
                  aria-label={c.name}
                  className={`relative flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform cursor-pointer border-2 ${
                    c.hex === '#FFFFFF' ? 'border-gray-300 dark:border-gray-600' : 'border-black/10 dark:border-white/20'
                  } ${
                    isSelected ? 'scale-125 ring-2 ring-deep_ocean dark:ring-soft_mint z-10' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className={`w-2 h-2 rounded-full ${c.hex === '#FFFFFF' || c.hex === '#FFE74C' || c.hex === '#ADED92' ? 'bg-deep_ocean' : 'bg-white'}`} />
                    </span>
                  )}
                </button>
              );
            })}

            {/* Custom Color Native Picker */}
            <label
              className="relative flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-deep_ocean/30 dark:border-slate-600 flex items-center justify-center cursor-pointer bg-gradient-to-tr from-rose-400 via-amber-300 to-indigo-400 hover:scale-110 transition-transform"
              title={t.colorPicker}
              aria-label={t.colorPicker}
            >
              <input
                type="color"
                value={customColor}
                aria-label={t.colorPicker}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setCurrentColor(e.target.value);
                  if (activeTool === 'eraser' || activeTool === 'magic') {
                    setActiveTool('brush');
                  }
                }}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
              <Palette className="w-3.5 h-3.5 text-white drop-shadow stroke-[2.5]" />
            </label>
          </div>

        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border-2 border-deep_ocean/30 dark:border-slate-700 shadow-2xl p-5 sm:p-6 text-center animate-bounce-slight">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-500 flex items-center justify-center">
              <Trash2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            
            <h3 className="text-xl font-extrabold text-deep_ocean dark:text-white mb-2 font-kids">
              {t.clearTitle}
            </h3>
            
            <div className="flex items-center gap-3 mt-5">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                {t.clearCancel}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white shadow-md transition-all cursor-pointer"
              >
                {t.clearConfirm}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
