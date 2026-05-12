"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/client-only";
import { Skeleton } from "@/components/ui/skeleton";
import { useAura } from "@/lib/aura-context";
import {
  computeAuraScore,
  computeClimateFlags,
  computeCyclePhase,
  DEFAULT_CLIMATE,
} from "@/lib/engine";

export default function InsightsPage() {
  const { history, profile, climate, snapshot, resetAll } = useAura();

  const series = useMemo(() => {
    const days = 14;
    const out: { date: string; aura: number; sleep: number; stress: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const c = history[key];
      const checkIn = c ?? syntheticCheckIn(key, i);
      const flagged = computeClimateFlags(climate ?? DEFAULT_CLIMATE);
      const { phase } = computeCyclePhase(profile, d);
      const score = computeAuraScore(checkIn, flagged, phase);
      out.push({
        date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        aura: score.total,
        sleep: checkIn.sleepHours,
        stress: checkIn.stress,
      });
    }
    return out;
  }, [history, profile, climate]);

  const avg = Math.round(series.reduce((s, p) => s + p.aura, 0) / series.length);
  const recent = snapshot.auraScore;
  const delta = recent - avg;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Insights
        </p>
        <h1 className="font-display mt-2 text-4xl md:text-5xl">
          Two weeks of how skin felt.
        </h1>
        <p className="mt-2 max-w-2xl text-foreground/70">
          Days you didn't check in are filled with a soft seasonal trend so the
          arc reads continuously. Reset anytime to start fresh.
        </p>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-3">
        <SummaryCard title="14-day Aura avg" value={String(avg)} hint="out of 100" />
        <SummaryCard
          title="Today vs avg"
          value={(delta >= 0 ? "+" : "") + String(delta)}
          hint={delta >= 0 ? "above average" : "below average"}
          tone={delta >= 0 ? "good" : "bad"}
        />
        <SummaryCard
          title="Tracked days"
          value={String(Object.keys(history).length)}
          hint="check-ins logged"
        />
      </div>

      <Card className="ring-soft">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Aura score over time</CardTitle>
          <CardDescription>
            How daily context translates into a skin-friendliness score.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ClientOnly fallback={<Skeleton className="aspect-16/7 w-full" />}>
            <ChartContainer
              config={{
                aura: { label: "Aura", color: "var(--chart-1)" },
              }}
              className="aspect-16/7 w-full"
            >
              <AreaChart data={series} margin={{ left: -10, right: 8, top: 16 }}>
                <defs>
                  <linearGradient id="auraFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis domain={[40, 100]} tickLine={false} axisLine={false} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <Area
                  type="monotone"
                  dataKey="aura"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#auraFill)"
                />
              </AreaChart>
            </ChartContainer>
          </ClientOnly>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="ring-soft">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Sleep & stress</CardTitle>
            <CardDescription>
              The two dials with the loudest impact on your shelf this week.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ClientOnly fallback={<Skeleton className="aspect-video w-full" />}>
              <ChartContainer
                config={{
                  sleep: { label: "Sleep", color: "var(--chart-2)" },
                  stress: { label: "Stress", color: "var(--chart-3)" },
                }}
                className="aspect-video w-full"
              >
                <AreaChart data={series} margin={{ left: -10, right: 8, top: 16 }}>
                  <defs>
                    <linearGradient id="sleepFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="stressFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} />
                  <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                  <Area
                    type="monotone"
                    dataKey="sleep"
                    stroke="var(--chart-2)"
                    fill="url(#sleepFill)"
                  />
                  <Area
                    type="monotone"
                    dataKey="stress"
                    stroke="var(--chart-3)"
                    fill="url(#stressFill)"
                  />
                </AreaChart>
              </ChartContainer>
            </ClientOnly>
          </CardContent>
        </Card>

        <Card className="ring-soft">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Reset Aura</CardTitle>
            <CardDescription>
              Wipes everything on this device — products, history, profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-foreground/70">
              Useful for demoing again, or if you'd like to start over with a
              clean slate.
            </p>
            <Button
              variant="outline"
              className="w-fit rounded-full"
              onClick={() => {
                resetAll();
                if (typeof window !== "undefined") {
                  window.location.href = "/";
                }
              }}
            >
              Reset all data
            </Button>
            <Badge variant="secondary" className="w-fit">
              No servers · everything stays in this browser
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  hint,
  tone,
}: {
  title: string;
  value: string;
  hint: string;
  tone?: "good" | "bad";
}) {
  return (
    <Card className="ring-soft">
      <CardContent className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {title}
        </span>
        <span
          className={
            tone === "good"
              ? "font-display text-4xl text-primary"
              : tone === "bad"
              ? "font-display text-4xl text-destructive"
              : "font-display text-4xl"
          }
        >
          {value}
        </span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </CardContent>
    </Card>
  );
}

function syntheticCheckIn(date: string, daysAgo: number) {
  const noise = Math.sin(daysAgo * 0.9) * 1.2;
  return {
    date,
    sleepHours: clamp(7 + noise, 5, 9),
    stress: clamp(4 - noise, 2, 8),
    hydrationGlasses: 6,
    mood: "okay" as const,
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

