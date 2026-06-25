import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const HERO_IMAGES = [
  { src: "/products/sneaker_45.png", label: "45° ANGLE" },
  { src: "/products/sneaker_side.png", label: "SIDE VIEW" },
  { src: "/products/sneaker_pair.png", label: "PAIR VIEW" },
  { src: "/products/sneaker_top.png", label: "TOP VIEW" },
];

export default function ShoeViewer3D() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const goNext = () => setActiveIdx((prev) => (prev + 1) % HERO_IMAGES.length);
  const goPrev = () => setActiveIdx((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden glass-card border border-light-border dark:border-dark-border select-none glow-orange group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-primary/15 rounded-full blur-[80px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/8 rounded-full blur-[60px]" />
      </div>

      {/* Label badge */}
      <div className="absolute top-5 left-5 z-20 flex items-center gap-1.5 bg-dark-bg/70 dark:bg-dark-bg/70 backdrop-blur-sm border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
        <Sparkles className="w-3 h-3" />
        EXCLUSIVE DROP
      </div>

      {/* Image counter dots */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === activeIdx
                ? "bg-primary w-5 shadow-md shadow-primary/30"
                : "bg-white/25 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Main product image with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -10 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 flex items-center justify-center z-10 p-10 md:p-12"
        >
          <motion.img
            src={HERO_IMAGES[activeIdx].src}
            alt={HERO_IMAGES[activeIdx].label}
            className="max-w-full max-h-full object-contain drop-shadow-2xl"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              filter: "drop-shadow(0 20px 40px rgba(201, 168, 76, 0.15))",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows — visible on hover */}
      <button
        onClick={goPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-dark-bg/50 backdrop-blur-sm border border-white/10 text-white hover:bg-primary/80 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-dark-bg/50 backdrop-blur-sm border border-white/10 text-white hover:bg-primary/80 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Bottom info strip */}
      <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">
          Teens VIP Elite Runner
        </div>
        <div className="bg-dark-bg/50 backdrop-blur-sm border border-white/10 text-primary text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
          ₹12,499
        </div>
      </div>

      {/* Subtle gold bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-16 bg-primary/15 blur-2xl pointer-events-none" />
    </div>
  );
}
