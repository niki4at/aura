"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2Icon,
  CircleIcon,
  PlusIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
  CoffeeIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAura } from "@/lib/aura-context";
import { buildRoutine } from "@/lib/engine";
import { cn } from "@/lib/utils";
import type { RoutineStep } from "@/lib/types";

const slotMeta = {
  morning: { label: "Morning", icon: SunIcon },
  midday: { label: "Midday", icon: CoffeeIcon },
  evening: { label: "Evening", icon: MoonIcon },
} as const;

export function RitualList() {
  const { snapshot, vanity, importProduct } = useAura();
  const steps = useMemo(() => buildRoutine(snapshot, vanity), [snapshot, vanity]);
  const [done, setDone] = useState<Record<string, boolean>>({});

  const grouped = {
    morning: steps.filter((s) => s.slot === "morning"),
    midday: steps.filter((s) => s.slot === "midday"),
    evening: steps.filter((s) => s.slot === "evening"),
  };

  return (
    <Card className="ring-soft">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="font-display text-3xl">Today's ritual</CardTitle>
            <CardDescription>
              Composed from your shelf for {snapshot.climate.temperatureC ?? "—"}
              °C · {snapshot.climate.humidity ?? "—"}% RH ·{" "}
              {snapshot.cyclePhase === "none" ? "no cycle" : `${snapshot.cyclePhase} phase`}.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="rounded-full">
            {steps.length} steps
          </Badge>
        </div>

        {snapshot.warnings.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {snapshot.warnings.map((w) => (
              <Badge
                key={w}
                variant="outline"
                className="rounded-full border-primary/30 bg-primary/5 text-primary"
              >
                {w}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="morning">
          <TabsList className="w-full">
            {(Object.keys(grouped) as Array<keyof typeof grouped>).map((slot) => {
              const Icon = slotMeta[slot].icon;
              return (
                <TabsTrigger key={slot} value={slot} className="flex-1">
                  <Icon data-icon="inline-start" />
                  {slotMeta[slot].label}
                  <Badge variant="outline" className="ml-2">
                    {grouped[slot].length}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {(Object.keys(grouped) as Array<keyof typeof grouped>).map((slot) => (
            <TabsContent key={slot} value={slot} className="mt-6">
              <ol className="flex flex-col gap-3">
                <AnimatePresence initial={false}>
                  {grouped[slot].map((s, i) => {
                    const key = `${s.slot}-${i}`;
                    return (
                      <motion.li
                        key={key}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <RitualRow
                          step={s}
                          done={!!done[key]}
                          onToggle={() =>
                            setDone((d) => ({ ...d, [key]: !d[key] }))
                          }
                          onImport={() => {
                            if (s.suggestion) {
                              importProduct(s.suggestion);
                              toast.success(`${s.suggestion.name} added to your vanity.`);
                            }
                          }}
                        />
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ol>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

function RitualRow({
  step,
  done,
  onToggle,
  onImport,
}: {
  step: RoutineStep;
  done: boolean;
  onToggle: () => void;
  onImport: () => void;
}) {
  const item = step.product ?? step.suggestion;
  const isSuggestion = !step.product && !!step.suggestion;

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 rounded-2xl border border-border bg-background p-3 transition-all",
        done && "opacity-60",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        aria-label={done ? "Mark step undone" : "Mark step done"}
      >
        {done ? (
          <CheckCircle2Icon className="size-5 text-primary" />
        ) : (
          <CircleIcon className="size-5" />
        )}
      </button>
      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
        {item?.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center text-muted-foreground">
            <SparklesIcon className="size-5" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          0{step.order} · {step.category}
          {isSuggestion && (
            <Badge variant="outline" className="text-[9px]">
              Suggested
            </Badge>
          )}
        </div>
        <div className="truncate text-sm font-medium">
          {item ? `${item.brand} — ${item.name}` : "Add a product"}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {step.rationale}
        </div>
      </div>
      {isSuggestion && step.suggestion && (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button size="sm" variant="ghost" onClick={onImport}>
                <PlusIcon data-icon="inline-start" />
                Add
              </Button>
            }
          />
          <TooltipContent>Move to your Vanity</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
