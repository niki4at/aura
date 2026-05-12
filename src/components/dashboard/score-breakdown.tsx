"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAura } from "@/lib/aura-context";

const labels: Record<keyof ReturnType<typeof useAura>["snapshot"]["scoreBreakdown"], string> = {
  sleep: "Sleep",
  stress: "Stress",
  hydration: "Hydration",
  cycle: "Cycle",
  climate: "Climate",
};

const max: Record<keyof ReturnType<typeof useAura>["snapshot"]["scoreBreakdown"], number> = {
  sleep: 25,
  stress: 20,
  hydration: 20,
  cycle: 18,
  climate: 17,
};

export function ScoreBreakdown() {
  const { snapshot } = useAura();
  const entries = Object.entries(snapshot.scoreBreakdown) as [
    keyof typeof labels,
    number,
  ][];

  return (
    <Card className="ring-soft">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Aura today</CardTitle>
        <CardDescription>
          Five honest dials. Sleep weighs the heaviest.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {entries.map(([k, v], i) => (
          <div key={k} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground/80">{labels[k]}</span>
              <span className="font-mono tabular-nums text-muted-foreground">
                {v} / {max[k]}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(v / max[k]) * 100}%` }}
                transition={{ delay: 0.05 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-accent"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
