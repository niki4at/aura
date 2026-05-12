"use client";

import { motion } from "framer-motion";
import { useAura } from "@/lib/aura-context";

const friendly: Record<string, string> = {
  hydrating: "Hydrating",
  calming: "Calming",
  brightening: "Brightening",
  "barrier-repair": "Barrier",
  exfoliating: "Exfoliating",
  antioxidant: "Antioxidant",
  spf: "SPF",
  "anti-inflammatory": "Anti-inflam",
  depuffing: "Depuff",
  balancing: "Balancing",
  ceramides: "Ceramides",
  hyaluronic: "Hyaluronic",
  "vitamin-c": "Vit C",
  retinoid: "Retinoid",
  niacinamide: "Niacinamide",
  peptides: "Peptides",
  azelaic: "Azelaic",
  "fragrance-free": "Fragrance-free",
};

export function NeedsStrip() {
  const { snapshot } = useAura();
  if (snapshot.needs.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Today reads as
      </span>
      {snapshot.needs.slice(0, 8).map((n, i) => (
        <motion.span
          key={n}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground/80"
        >
          {friendly[n] ?? n}
        </motion.span>
      ))}
    </div>
  );
}
