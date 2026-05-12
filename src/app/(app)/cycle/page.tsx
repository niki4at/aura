"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAura } from "@/lib/aura-context";
import { computeCyclePhase, getPhaseLabel, getPhaseCopy } from "@/lib/engine";
import { cn, firstSliderValue } from "@/lib/utils";
import type { CyclePhase } from "@/lib/types";

const phaseColours: Record<CyclePhase, string> = {
  menstrual: "from-rose-200/60 to-rose-300/30",
  follicular: "from-amber-200/60 to-amber-300/30",
  ovulation: "from-emerald-200/60 to-emerald-300/30",
  luteal: "from-violet-200/60 to-violet-300/30",
  none: "from-muted to-muted/30",
};

const tips: Record<CyclePhase, string[]> = {
  menstrual: [
    "Lower acid load. Hyaluronic + ceramide cream is the friendliest pair.",
    "Iron-rich snacks help dullness more than any serum will.",
    "Warm compresses on the jaw before cleansing soothe hormonal tenderness.",
  ],
  follicular: [
    "Estrogen is rising — skin tolerates more. Vitamin C in the AM glows fast.",
    "Gentle exfoliation 1–2 evenings this week is well-timed.",
    "Layer SPF generously; collagen response is at its highest.",
  ],
  ovulation: [
    "Sebum peaks. Niacinamide and PHA polish keep texture smooth.",
    "Switch to a lighter moisturizer for 3–4 days.",
    "Hydrating mist for the 4 PM mid-day reset.",
  ],
  luteal: [
    "Skin defends harder. Pause retinoids if breakouts begin.",
    "Azelaic 10% calms inflammation without drying.",
    "Magnesium glycinate at night can soften the days before.",
  ],
  none: [
    "Cycle tracking is off. Recommendations stay climate-led.",
  ],
};

export default function CyclePage() {
  const { profile, updateProfile, snapshot } = useAura();
  const [tracking, setTracking] = useState(profile.cycle.tracking);
  const [last, setLast] = useState(profile.cycle.lastPeriodStart ?? "");
  const [len, setLen] = useState(profile.cycle.averageCycleLength);
  const [pLen, setPLen] = useState(profile.cycle.averagePeriodLength);

  function save() {
    updateProfile({
      cycle: {
        tracking,
        lastPeriodStart: tracking ? last || null : null,
        averageCycleLength: len,
        averagePeriodLength: pLen,
      },
    });
  }

  const previewPhase = computeCyclePhase({
    ...profile,
    cycle: {
      tracking,
      lastPeriodStart: last || null,
      averageCycleLength: len,
      averagePeriodLength: pLen,
    },
  });

  const phases: CyclePhase[] = ["menstrual", "follicular", "ovulation", "luteal"];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Cycle sync
        </p>
        <h1 className="font-display mt-2 text-4xl md:text-5xl">
          Your skin keeps a calendar too.
        </h1>
        <p className="mt-2 max-w-2xl text-foreground/70">
          Aura softly shifts actives across the four phases.           You stay in
          control — toggle, edit, or turn off entirely.
        </p>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="ring-soft overflow-hidden">
          <div className={cn(
            "relative h-48 w-full bg-gradient-to-r",
            phaseColours[snapshot.cyclePhase],
          )}>
            <div className="absolute inset-0 bg-card/40 backdrop-blur-[1px]" />
            <div className="relative flex h-full flex-col justify-end gap-1 p-6">
              <div className="text-[11px] uppercase tracking-[0.3em] text-foreground/70">
                Today's phase
              </div>
              <div className="font-display text-4xl">
                {getPhaseLabel(snapshot.cyclePhase)}
              </div>
              {snapshot.cycleDay != null && (
                <div className="text-sm text-foreground/70">
                  Day {snapshot.cycleDay} of {profile.cycle.averageCycleLength}
                </div>
              )}
            </div>
          </div>
          <CardContent className="flex flex-col gap-5">
            <p className="text-sm text-foreground/80">
              {getPhaseCopy(snapshot.cyclePhase)}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {phases.map((p) => (
                <div
                  key={p}
                  className={cn(
                    "rounded-2xl border border-border bg-background p-4",
                    snapshot.cyclePhase === p && "border-primary/40",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-display text-lg">{getPhaseLabel(p)}</div>
                    {snapshot.cyclePhase === p && (
                      <Badge className="rounded-full">Today</Badge>
                    )}
                  </div>
                  <ul className="mt-2 flex flex-col gap-1.5 text-sm text-foreground/70">
                    {tips[p].map((t) => (
                      <li key={t}>· {t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="ring-soft">
          <CardHeader>
            <CardTitle className="font-display text-2xl">
              Edit cycle settings
            </CardTitle>
            <CardDescription>
              Changes apply immediately. Stored only on this device.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
              <div>
                <div className="font-medium">Track my cycle</div>
                <div className="text-xs text-muted-foreground">
                  Off makes the routine purely climate-led.
                </div>
              </div>
              <Switch checked={tracking} onCheckedChange={setTracking} />
            </div>
            {tracking && (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="last-cycle">First day of last period</Label>
                  <Input
                    id="last-cycle"
                    type="date"
                    value={last}
                    onChange={(e) => setLast(e.target.value)}
                  />
                </div>
                <SliderRow
                  label="Cycle length"
                  value={len}
                  min={21}
                  max={40}
                  onChange={setLen}
                  unit=" days"
                />
                <SliderRow
                  label="Period length"
                  value={pLen}
                  min={2}
                  max={9}
                  onChange={setPLen}
                  unit=" days"
                />
                <div className="rounded-2xl bg-secondary/60 p-3 text-sm">
                  Preview:{" "}
                  <span className="font-medium">
                    {getPhaseLabel(previewPhase.phase)}
                  </span>{" "}
                  {previewPhase.day != null && (
                    <span className="text-muted-foreground">
                      (day {previewPhase.day})
                    </span>
                  )}
                </div>
              </>
            )}
            <Button onClick={save} className="rounded-full">
              Save changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  unit: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Badge variant="secondary">
          {value}
          {unit}
        </Badge>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={(v) => onChange(firstSliderValue(v, value))}
      />
    </div>
  );
}
