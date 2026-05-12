"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckIcon, MoonIcon, DropletIcon, ZapIcon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAura } from "@/lib/aura-context";
import type { CheckIn } from "@/lib/types";
import { cn, firstSliderValue } from "@/lib/utils";

const moods: { id: CheckIn["mood"]; label: string }[] = [
  { id: "low", label: "Low" },
  { id: "okay", label: "Okay" },
  { id: "bright", label: "Bright" },
  { id: "radiant", label: "Radiant" },
];

export function CheckInCard() {
  const { todayCheckIn, setCheckIn } = useAura();
  const [draft, setDraft] = useState<CheckIn>(todayCheckIn);

  useEffect(() => {
    setDraft(todayCheckIn);
  }, [todayCheckIn]);

  function commit(next: Partial<CheckIn>) {
    const merged = { ...draft, ...next };
    setDraft(merged);
    setCheckIn(merged);
  }

  function logComplete() {
    setCheckIn(draft);
    toast.success("Check-in saved. Recomposing today's ritual.");
  }

  return (
    <Card className="ring-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display text-2xl">Daily check-in</CardTitle>
            <CardDescription>30 seconds. Aura adapts the rest.</CardDescription>
          </div>
          <Badge variant="outline" className="rounded-full">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-7">
        <CheckSlider
          icon={<MoonIcon className="size-4" />}
          label="Sleep last night"
          value={draft.sleepHours}
          min={3}
          max={11}
          step={0.5}
          unit="h"
          onChange={(v) => commit({ sleepHours: v })}
        />
        <CheckSlider
          icon={<ZapIcon className="size-4" />}
          label="Stress today"
          value={draft.stress}
          min={1}
          max={10}
          step={1}
          unit="/10"
          onChange={(v) => commit({ stress: v })}
        />
        <CheckSlider
          icon={<DropletIcon className="size-4" />}
          label="Water"
          value={draft.hydrationGlasses}
          min={0}
          max={12}
          step={1}
          unit=" glasses"
          onChange={(v) => commit({ hydrationGlasses: v })}
        />

        <div className="flex flex-col gap-2">
          <Label className="text-sm">Mood</Label>
          <div className="grid grid-cols-4 gap-2">
            {moods.map((m) => {
              const active = draft.mood === m.id;
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => commit({ mood: m.id })}
                  className={cn(
                    "rounded-xl border border-border bg-background py-2 text-sm transition-all",
                    active &&
                      "border-primary bg-primary text-primary-foreground",
                  )}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <Button onClick={logComplete} className="rounded-full">
          <CheckIcon data-icon="inline-start" />
          Save check-in
        </Button>
      </CardContent>
    </Card>
  );
}

function CheckSlider({
  icon,
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
          <span className="text-primary">{icon}</span>
          {label}
        </div>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-sm tabular-nums text-foreground"
        >
          {value}
          {unit}
        </motion.span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(firstSliderValue(v, value))}
      />
    </div>
  );
}
