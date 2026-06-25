import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, RotateCcw } from "lucide-react";

// View label mapping
const VIEW_LABELS = {
  side: "1. SIDE VIEW",
  "45": "2. 45° ANGLE",
  top: "3. TOP VIEW",
  pair: "4. PAIR VIEW",
  sole: "5. SOLE VIEW",
};

// Auto-detect view type from filename
function detectViewType(src = "") {
  if (src.includes("side")) return "side";
  if (src.includes("45")) return "45";
  if (src.includes("top")) return "top";
  if (src.includes("pair")) return "pair";
  if (src.includes("sole")) return "sole";
  return null;
}

function has5Views(images = []) {
  return (
    images.length >= 5 &&
    images.some((img) => detectViewType(img) !== null)
  );
}

// ─── 3D Panoramic Viewer (for multi-view product shots) ──────────────────────
function MultiViewViewer({ images, productName }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const activeImg = images[activeIdx];
  const viewLabel = detectViewType(activeImg) || `View ${activeIdx + 1}`;
  const labelText = VIEW_LABELS[viewLabel] || `View ${activeIdx + 1}`;

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
    // Tilt effect — map cursor position to ±15 degrees
    const tiltX = -(((e.clientY - top) / height) * 2 - 1) * 12;
    const tiltY = (((e.clientX - left) / width) * 2 - 1) * 12;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsZoomed(false);
  };

  const prev = () =>
    setActiveIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setActiveIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-4">
      {/* ── Main 3D Perspective Card ── */}
      <motion.div
        ref={cardRef}
        style={{
          perspective: "1000px",
        }}
        className="relative w-full"
      >
        <motion.div
          animate={{
            rotateX: tilt.x,
            rotateY: tilt.y,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-dark-bg border border-white/5 shadow-2xl select-none cursor-crosshair"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIdx}
              src={activeImg}
              alt={`${productName} – ${labelText}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: isZoomed ? 1.35 : 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    }
                  : undefined
              }
              className="w-full h-full object-contain"
            />
          </AnimatePresence>

          {/* Reflective glare layer */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background: `radial-gradient(ellipse at ${zoomPos.x}% ${zoomPos.y}%, rgba(255,255,255,0.06) 0%, transparent 70%)`,
              transition: "background 0.1s",
            }}
          />

          {/* Orange corner glow */}
          <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-12 bg-primary/20 blur-2xl rounded-full" />

          {/* View label badge */}
          <div className="absolute top-4 left-4 bg-dark-bg/70 backdrop-blur-sm border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
            {labelText}
          </div>

          {/* Zoom hint */}
          <div className="absolute bottom-4 right-4 bg-dark-bg/60 backdrop-blur-sm border border-white/10 text-white/60 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">
            <Maximize2 className="w-2.5 h-2.5" />
            Hover to zoom
          </div>

          {/* Left / Right Arrows */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-dark-bg/50 backdrop-blur-sm border border-white/10 text-white hover:bg-primary/80 transition-all z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-dark-bg/50 backdrop-blur-sm border border-white/10 text-white hover:bg-primary/80 transition-all z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>

      {/* ── 5-Panel Split Thumbnails ── */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((img, idx) => {
          const vType = detectViewType(img);
          const vLabel = VIEW_LABELS[vType] || `View ${idx + 1}`;
          const isActive = idx === activeIdx;
          return (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative group flex flex-col rounded-xl overflow-hidden border-2 transition-all duration-300 bg-dark-bg ${
                isActive
                  ? "border-primary scale-[0.97] shadow-lg shadow-primary/20"
                  : "border-white/5 hover:border-white/20 hover:scale-[0.98]"
              }`}
            >
              <img
                src={img}
                alt={vLabel}
                className="w-full aspect-square object-contain"
              />
              <div
                className={`text-[8px] font-black uppercase tracking-wide py-1 text-center leading-tight ${
                  isActive ? "text-primary bg-primary/10" : "text-white/40 bg-dark-bg/50"
                }`}
              >
                {vLabel.split(" ").slice(1).join(" ")}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Dot step indicator ── */}
      <div className="flex justify-center gap-1.5">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`transition-all duration-300 rounded-full ${
              activeIdx === idx
                ? "w-5 h-1.5 bg-primary"
                : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Fallback: Standard image gallery (for regular products) ─────────────────
function StandardGallery({ images, productName, badge }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
    const tiltX = -(((e.clientY - top) / height) * 2 - 1) * 10;
    const tiltY = (((e.clientX - left) / width) * 2 - 1) * 10;
    setTilt({ x: tiltX, y: tiltY });
  };

  return (
    <div className="space-y-4">
      <motion.div style={{ perspective: "1000px" }} className="relative w-full">
        <motion.div
          animate={{ rotateX: tilt.x, rotateY: tilt.y }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 dark:bg-dark-bg border border-light-border dark:border-white/5 shadow-2xl cursor-crosshair select-none"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => {
            setIsZoomed(false);
            setTilt({ x: 0, y: 0 });
          }}
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIdx}
              src={images[activeIdx]}
              alt={productName}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: isZoomed ? 1.3 : 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              style={
                isZoomed
                  ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                  : undefined
              }
              className="w-full h-full object-cover object-center"
            />
          </AnimatePresence>

          {/* Glare */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background: `radial-gradient(ellipse at ${zoomPos.x}% ${zoomPos.y}%, rgba(255,255,255,0.08) 0%, transparent 65%)`,
            }}
          />
          {/* Orange glow */}
          <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-10 bg-primary/15 blur-2xl rounded-full" />

          {badge && (
            <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
              {badge}
            </div>
          )}

          <div className="absolute bottom-4 right-4 bg-dark-bg/50 dark:bg-dark-bg/70 backdrop-blur-sm border border-white/10 text-white/60 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">
            <Maximize2 className="w-2.5 h-2.5" />
            Hover to zoom
          </div>
        </motion.div>
      </motion.div>

      {images.length > 1 && (
        <div className="flex space-x-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 bg-gray-50 dark:bg-dark-bg transition-all duration-300 ${
                activeIdx === idx
                  ? "border-primary scale-95 shadow-md shadow-primary/20"
                  : "border-light-border dark:border-white/5 hover:border-primary/50"
              }`}
            >
              <img
                src={img}
                alt="thumbnail"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function ProductViewer({ images = [], productName = "", badge = null }) {
  if (has5Views(images)) {
    return <MultiViewViewer images={images} productName={productName} />;
  }
  return <StandardGallery images={images} productName={productName} badge={badge} />;
}
