"use client";

import { motion } from "framer-motion";
import {
  CloudSunIcon,
  HeartPulseIcon,
  MoonStarIcon,
  WandSparklesIcon,
} from "lucide-react";

const steps = [
  {
    icon: HeartPulseIcon,
    title: "You check in",
    body: "30 seconds: how you slept, how stressed you feel, where you are in your cycle.",
  },
  {
    icon: CloudSunIcon,
    title: "Aura reads the room",
    body: "Live weather, humidity, UV, and air quality from your location feed the engine.",
  },
  {
    icon: MoonStarIcon,
    title: "Cycle phase recognised",
    body: "Menstrual, follicular, ovulation, luteal — each gets a different posture.",
  },
  {
    icon: WandSparklesIcon,
    title: "Today's ritual composed",
    body: "Owned products first. Gaps filled with thoughtful suggestions, not pushy ads.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            How it works
          </p>
          <h2 className="font-display mt-3 text-balance text-4xl md:text-5xl">
            Four signals, one quiet ritual.
          </h2>
          <p className="mt-4 text-foreground/70 text-balance">
            Aura doesn't ship you a 12-step routine. It reshapes the steps you
            already trust around the day you're actually having.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 ring-soft transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute -top-12 -right-12 size-32 rounded-full bg-accent/30 blur-2xl transition-opacity group-hover:opacity-80" />
              <div className="relative">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <s.icon className="size-5" />
                </div>
                <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Step 0{i + 1}
                </div>
                <h3 className="font-display mt-1 text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
