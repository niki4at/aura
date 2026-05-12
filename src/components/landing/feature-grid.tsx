"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  CompassIcon,
  LeafIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TimerIcon,
  WindIcon,
} from "lucide-react";

const features = [
  {
    icon: SparklesIcon,
    title: "Aura Score",
    body: "A daily read on how skin-friendly your day is. Sleep, stress, hydration, cycle, climate — five honest dials.",
  },
  {
    icon: CompassIcon,
    title: "Climate-aware",
    body: "Live humidity, temperature, UV, and AQI for your city — so the routine knows when to switch from gel to balm.",
  },
  {
    icon: TimerIcon,
    title: "Cycle-synced",
    body: "Different actives for menstrual, follicular, ovulation, and luteal. No more wondering why retinol stings this week.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Barrier-first",
    body: "Aura pauses exfoliation when stress is high or sleep is short, then reintroduces when skin can take it.",
  },
  {
    icon: WindIcon,
    title: "Travel mode",
    body: "Land in a humid city and the routine recomposes itself before your luggage hits the carousel.",
  },
  {
    icon: LeafIcon,
    title: "What you already own",
    body: "Recommendations are made from your shelf first. Suggestions only fill the gaps, never push the cart.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Inside Aura
            </p>
            <h2 className="font-display mt-3 text-balance text-4xl md:text-5xl">
              Quiet intelligence in places that matter.
            </h2>
          </div>
          <p className="text-foreground/70 text-balance">
            Six small ideas, one calmer bathroom shelf. Each one is built to
            disappear into the daily rhythm.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-3xl border border-border bg-card p-6 ring-soft transition-all hover:-translate-y-1"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </div>
              <h3 className="font-display mt-5 text-2xl">{f.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{f.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative mt-20 overflow-hidden rounded-[2.5rem] border border-border ring-soft"
        >
          <div className="relative aspect-[16/7] w-full">
            <Image
              src="https://images.unsplash.com/photo-1556228852-80b6e5eeff06?auto=format&fit=crop&w=1900&q=80"
              alt="Soft beauty editorial"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/55 via-foreground/15 to-transparent" />
            <div className="absolute inset-0 flex items-end p-8 md:items-center md:p-14">
              <div className="max-w-xl text-background">
                <p className="text-xs uppercase tracking-[0.3em] text-background/70">
                  Editorial mode
                </p>
                <h3 className="font-display mt-2 text-3xl text-background md:text-5xl text-balance">
                  Beauty that responds, instead of demanding.
                </h3>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
