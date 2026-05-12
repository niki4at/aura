"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const scenarios = [
  {
    place: "Lisbon · winter morning",
    weather: "11°C · 38% RH · UV 2",
    state: "5h sleep · luteal phase",
    move: "Skip the BHA. Layer hyaluronic + ceramide cream. Caffeine eye, then SPF.",
    accent: "from-rose-200/40 via-amber-100/30 to-transparent",
  },
  {
    place: "Singapore · afternoon",
    weather: "31°C · 84% RH · UV 9",
    state: "7h sleep · ovulation",
    move: "Foam wash, niacinamide, gel moisturiser. SPF reapply at 1 PM.",
    accent: "from-emerald-200/40 via-cyan-100/30 to-transparent",
  },
  {
    place: "Berlin · stress week",
    weather: "6°C · 55% RH · AQI 92",
    state: "Stress 8 · day 23 luteal",
    move: "Azelaic over retinoid. Barrier cream. Magnesium with dinner.",
    accent: "from-violet-200/40 via-rose-100/30 to-transparent",
  },
];

export function Scenarios() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Adaptive in practice
            </p>
            <h2 className="font-display mt-3 text-balance text-4xl md:text-5xl">
              Same person, three different days.
            </h2>
            <p className="mt-4 text-foreground/70">
              The thirteen products in your bathroom don't change. The order,
              the layers, and the actives do — because the day did.
            </p>
          </div>

          <div className="grid gap-4">
            {scenarios.map((s, i) => (
              <motion.div
                key={s.place}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="relative overflow-hidden ring-soft">
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${s.accent}`}
                  />
                  <CardContent className="relative grid gap-4 md:grid-cols-[1fr_2fr] md:items-center">
                    <div className="flex flex-col gap-2">
                      <div className="font-display text-xl">{s.place}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.weather}
                      </div>
                      <Badge variant="secondary" className="w-fit rounded-full">
                        {s.state}
                      </Badge>
                    </div>
                    <p className="text-foreground/80 text-balance">{s.move}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
