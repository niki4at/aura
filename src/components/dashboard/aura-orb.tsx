"use client";

import { motion } from "framer-motion";

export function AuraOrb({ score }: { score: number }) {
  const hue = scoreToHue(score);
  return (
    <div className="relative grid size-32 place-items-center md:size-44">
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, oklch(0.78 0.12 ${hue} / 0.7), transparent 65%)`,
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-3 rounded-full"
        style={{
          background: `conic-gradient(from 220deg, oklch(0.86 0.06 75), oklch(0.7 0.12 ${hue}), oklch(0.32 0.06 350), oklch(0.86 0.06 75))`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-7 rounded-full bg-background/85 backdrop-blur" />
      <div className="relative flex flex-col items-center">
        <span className="font-display text-4xl tabular-nums md:text-5xl">
          {score}
        </span>
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Aura
        </span>
      </div>
    </div>
  );
}

function scoreToHue(score: number) {
  const clamped = Math.max(0, Math.min(100, score));
  return 22 + (clamped / 100) * 100;
}
