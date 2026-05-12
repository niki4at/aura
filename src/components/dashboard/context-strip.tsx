"use client";

import { motion } from "framer-motion";
import {
  CloudSunIcon,
  DropletsIcon,
  RefreshCwIcon,
  SunMediumIcon,
  WindIcon,
  Loader2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TravelModeDialog } from "@/components/dashboard/travel-mode-dialog";
import { useAura } from "@/lib/aura-context";

export function ContextStrip() {
  const { climate, profile, refreshClimate, isClimateLoading } = useAura();

  return (
    <Card className="ring-soft overflow-hidden">
      <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Today's context
          </div>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3">
            <span className="font-display text-2xl">
              {profile.city ?? "Set a city"}
            </span>
            {profile.country && (
              <span className="text-sm text-muted-foreground">
                · {profile.country}
              </span>
            )}
            <Badge
              variant={climate.source === "live" ? "secondary" : "outline"}
              className="rounded-full text-[10px] uppercase tracking-[0.2em]"
            >
              {climate.source === "live" ? "Live" : "Demo"}
            </Badge>
          </div>
          <div className="mt-1 text-sm text-foreground/70">
            {climate.condition}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat icon={<CloudSunIcon />} label="Temp" value={fmt(climate.temperatureC, "°C")} />
          <Stat icon={<DropletsIcon />} label="Humidity" value={fmt(climate.humidity, "%")} />
          <Stat icon={<SunMediumIcon />} label="UV" value={fmt(climate.uvIndex, "")} accent={climate.isHighUv} />
          <Stat icon={<WindIcon />} label="AQI" value={fmt(climate.airQuality, "")} accent={climate.isPolluted} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <TravelModeDialog />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void refreshClimate()}
            disabled={isClimateLoading}
          >
            {isClimateLoading ? (
              <Loader2Icon data-icon="inline-start" className="animate-spin" />
            ) : (
              <RefreshCwIcon data-icon="inline-start" />
            )}
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="flex items-center gap-3 rounded-2xl border border-border bg-background px-3 py-2"
    >
      <span
        className={`flex size-8 items-center justify-center rounded-xl ${
          accent ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
        }`}
      >
        {icon}
      </span>
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </div>
        <div className="font-mono text-sm tabular-nums">{value}</div>
      </div>
    </motion.div>
  );
}

function fmt(n: number | null, suffix: string) {
  if (n == null) return "—";
  return `${Math.round(n)}${suffix}`;
}
