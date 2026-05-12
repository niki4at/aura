"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRightIcon, MoonIcon, SunIcon, DropletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const orbBadges = [
  { icon: MoonIcon, label: "Cycle-aware" },
  { icon: SunIcon, label: "Climate-led" },
  { icon: DropletIcon, label: "Barrier-first" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="aura-gradient absolute inset-0 -z-10" />
      <div className="grain absolute inset-0 -z-10" aria-hidden />

      <div className="absolute inset-x-0 -top-32 -z-10 flex justify-center">
        <div
          className="aura-pulse size-[42rem] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "conic-gradient(from 220deg at 50% 50%, oklch(0.85 0.085 28 / .9), oklch(0.92 0.07 75 / .8), oklch(0.78 0.12 320 / .7), oklch(0.85 0.085 28 / .9))",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="rounded-full border-foreground/10 bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-foreground/70 backdrop-blur">
                A daily ritual that listens
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="font-display mt-6 text-balance text-5xl leading-[1.02] tracking-tight md:text-7xl"
            >
              Your skincare,{" "}
              <span className="italic text-primary">composed</span> for the
              skin you're wearing today.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-6 max-w-xl text-balance text-lg text-foreground/70"
            >
              Aura reads your sleep, stress, cycle, and the climate outside,
              then arranges the products you already own into a ritual that
              actually fits the day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Button
                render={<Link href="/start" />}
                nativeButton={false}
                size="lg"
                className="rounded-full px-7 text-base"
              >
                Start your ritual
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <Button
                render={<Link href="#how" />}
                nativeButton={false}
                variant="ghost"
                size="lg"
                className="rounded-full px-5 text-base"
              >
                See how it adapts
              </Button>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-4 text-sm text-foreground/60"
            >
              {orbBadges.map((b) => (
                <li key={b.label} className="flex items-center gap-2">
                  <b.icon className="size-4 text-primary" />
                  {b.label}
                </li>
              ))}
              <li className="hidden text-foreground/40 md:inline">·</li>
              <li className="text-foreground/60">
                No login. Your data stays on this device.
              </li>
            </motion.ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative"
          >
            <HeroComposite />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroComposite() {
  return (
    <div className="relative mx-auto w-full max-w-md pb-20 md:ml-auto md:mr-0 lg:pb-24">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl ring-soft">
        <Image
          src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80"
          alt="Soft portrait — natural skin"
          fill
          priority
          sizes="(max-width: 768px) 90vw, 480px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="floaty absolute -left-2 -top-6 z-10 w-52 rounded-2xl border border-border bg-card/95 p-4 shadow-xl ring-soft backdrop-blur sm:-left-10 sm:w-56 lg:-left-24 lg:-top-4 lg:w-60"
      >
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Today's context
        </div>
        <div className="mt-2 text-sm font-medium text-foreground">
          Lisbon · 11°C · 38% humidity
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-foreground/70">
          <span className="size-2 rounded-full bg-primary" />
          Dry + cold — barrier mode on.
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.75, duration: 0.7 }}
        className="floaty absolute -right-2 top-[42%] z-10 w-52 rounded-2xl border border-border bg-card/95 p-4 shadow-xl ring-soft backdrop-blur sm:-right-10 sm:w-56 lg:-right-20 lg:w-60"
        style={{ animationDelay: "1.5s" }}
      >
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Tonight's ritual
          </div>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
            6 steps
          </span>
        </div>
        <ol className="mt-3 flex flex-col gap-1.5 text-xs text-foreground/80">
          {[
            "Cetaphil cream cleanse",
            "HA + B5 (you own)",
            "Cashmere barrier cream",
            "Sleep mask, thin layer",
          ].map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground">
                0{i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7 }}
        className="floaty absolute bottom-0 left-1/2 z-10 w-72 -translate-x-1/2 rounded-2xl border border-border bg-card/95 p-4 shadow-xl ring-soft backdrop-blur"
        style={{ animationDelay: "3s" }}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="font-display text-2xl text-primary">82</span>
          <span className="text-muted-foreground">Aura score</span>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-1">
          {[80, 65, 75, 90, 70].map((v, i) => (
            <div
              key={i}
              className="h-2 rounded-full bg-secondary"
              style={{
                background: `linear-gradient(90deg, oklch(0.65 0.105 22) ${v}%, var(--secondary) ${v}%)`,
              }}
            />
          ))}
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">
          Sleep · Stress · Hydration · Cycle · Climate
        </div>
      </motion.div>
    </div>
  );
}
