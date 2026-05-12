"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAura } from "@/lib/aura-context";
import { ContextStrip } from "@/components/dashboard/context-strip";
import { NeedsStrip } from "@/components/dashboard/needs-strip";
import { CheckInCard } from "@/components/dashboard/check-in-card";
import { RitualList } from "@/components/dashboard/ritual-list";
import { ScoreBreakdown } from "@/components/dashboard/score-breakdown";
import { AuraOrb } from "@/components/dashboard/aura-orb";
import { getPhaseCopy, getPhaseLabel } from "@/lib/engine";

export default function TodayPage() {
  const { profile, snapshot, isHydrated } = useAura();
  if (!isHydrated) return <Skeleton />;
  const greeting = greet(profile.name);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid items-center gap-6 md:grid-cols-[1fr_auto] md:gap-10"
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="font-display mt-2 text-4xl text-balance md:text-5xl">
            {greeting}.{" "}
            <span className="italic text-primary">
              Today wants to be {moodLabel(snapshot.auraScore).toLowerCase()}.
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-foreground/70 text-balance">
            {composeIntro(snapshot)}
          </p>
        </div>
        <AuraOrb score={snapshot.auraScore} />
      </motion.section>

      <ContextStrip />
      <NeedsStrip />

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <RitualList />
        <div className="flex flex-col gap-6">
          <ScoreBreakdown />
          {profile.cycle.tracking && (
            <Card className="ring-soft">
              <CardContent className="flex flex-col gap-3">
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Cycle phase
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display text-2xl">
                      {getPhaseLabel(snapshot.cyclePhase)}
                    </div>
                    {snapshot.cycleDay != null && (
                      <div className="text-xs text-muted-foreground">
                        Day {snapshot.cycleDay} of {profile.cycle.averageCycleLength}
                      </div>
                    )}
                  </div>
                  <Button
                    render={<Link href="/cycle" />}
                    nativeButton={false}
                    variant="ghost"
                    size="sm"
                  >
                    Sync
                    <ArrowRightIcon data-icon="inline-end" />
                  </Button>
                </div>
                <p className="text-sm text-foreground/70">
                  {getPhaseCopy(snapshot.cyclePhase)}
                </p>
              </CardContent>
            </Card>
          )}
          <CheckInCard />
        </div>
      </section>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="h-10 w-72 animate-pulse rounded-md bg-muted" />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

function greet(name?: string) {
  const hour = new Date().getHours();
  const greetingWord =
    hour < 5 ? "Still up" : hour < 12 ? "Good morning" : hour < 18 ? "Hello" : "Soft evening";
  return name ? `${greetingWord}, ${name}` : greetingWord;
}

function moodLabel(score: number) {
  if (score >= 85) return "Radiant";
  if (score >= 70) return "Bright";
  if (score >= 55) return "Steady";
  if (score >= 40) return "Quiet";
  return "Tender";
}

function composeIntro(snapshot: ReturnType<typeof useAura>["snapshot"]) {
  const lines: string[] = [];
  if (snapshot.checkIn.sleepHours < 6) lines.push("Sleep was thin.");
  if (snapshot.checkIn.stress >= 7) lines.push("Stress is loud.");
  if (snapshot.climate.isDry) lines.push("Air is dry.");
  if (snapshot.climate.isCold) lines.push("It's cold out.");
  if (snapshot.climate.isHot) lines.push("It's warm out.");
  if (snapshot.climate.isHighUv) lines.push("UV is high.");
  if (snapshot.cyclePhase === "luteal") lines.push("Luteal phase calls for calm.");
  if (snapshot.cyclePhase === "menstrual") lines.push("Bleed week — gentle layers only.");
  if (lines.length === 0) {
    return "Skin gets quiet hydration, antioxidants, and nothing it doesn't need.";
  }
  return `${lines.slice(0, 3).join(" ")} Aura adjusted.`;
}
