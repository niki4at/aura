"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, Loader2Icon, MapPinIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { BrandLockup } from "@/components/brand";
import { useAura } from "@/lib/aura-context";
import type { Concern, SkinType } from "@/lib/types";
import { cn, firstSliderValue } from "@/lib/utils";

const skinTypes: { id: SkinType; label: string; hint: string }[] = [
  { id: "dry", label: "Dry", hint: "Tight after cleansing" },
  { id: "normal", label: "Normal", hint: "Mostly behaves" },
  { id: "combination", label: "Combination", hint: "Oily T-zone, dry cheeks" },
  { id: "oily", label: "Oily", hint: "Shine by midday" },
  { id: "sensitive", label: "Sensitive", hint: "Reacts easily" },
];

const concernOptions: { id: Concern; label: string }[] = [
  { id: "hydration", label: "Hydration" },
  { id: "dullness", label: "Dullness" },
  { id: "redness", label: "Redness" },
  { id: "breakouts", label: "Breakouts" },
  { id: "fine-lines", label: "Fine lines" },
  { id: "dark-circles", label: "Dark circles" },
  { id: "uneven-tone", label: "Uneven tone" },
  { id: "puffiness", label: "Puffiness" },
];

const totalSteps = 4;

export function OnboardingFlow() {
  const router = useRouter();
  const { profile, updateProfile, isHydrated } = useAura();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile.name ?? "");
  const [city, setCity] = useState(profile.city ?? "");
  const [skin, setSkin] = useState<SkinType>(profile.skinType);
  const [concerns, setConcerns] = useState<Concern[]>(profile.concerns);
  const [trackingCycle, setTrackingCycle] = useState(profile.cycle.tracking);
  const [lastPeriod, setLastPeriod] = useState(
    profile.cycle.lastPeriodStart ?? oneWeekAgoISO(),
  );
  const [cycleLength, setCycleLength] = useState(
    profile.cycle.averageCycleLength,
  );
  const [periodLength, setPeriodLength] = useState(
    profile.cycle.averagePeriodLength,
  );
  const [locating, setLocating] = useState(false);

  if (!isHydrated) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  function next() {
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function detectLocation() {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation isn't available in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const params = new URLSearchParams({
            lat: String(pos.coords.latitude),
            lon: String(pos.coords.longitude),
          });
          const res = await fetch(`/api/climate?${params}`);
          const data = await res.json();
          updateProfile({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            city: data.city,
            country: data.country,
            countryCode: data.countryCode,
          });
          if (data.city) setCity(data.city);
          toast.success(`Located ${data.city ?? "you"} — climate synced.`);
        } catch {
          toast.error("Couldn't pull weather. Try a city name instead.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        toast.error("Location permission denied. Type a city instead.");
        setLocating(false);
      },
      { timeout: 10000 },
    );
  }

  function complete() {
    updateProfile({
      name: name.trim() || undefined,
      city: city.trim() || undefined,
      skinType: skin,
      concerns,
      cycle: {
        tracking: trackingCycle,
        lastPeriodStart: trackingCycle ? lastPeriod : null,
        averageCycleLength: cycleLength,
        averagePeriodLength: periodLength,
      },
      onboarded: true,
    });
    toast.success("Aura is composing your first ritual.");
    router.push("/today");
  }

  return (
    <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-stretch px-6 py-10">
      <div className="mb-10 flex items-center justify-between">
        <BrandLockup />
        <Button
          render={<Link href="/" />}
          nativeButton={false}
          variant="ghost"
          size="sm"
        >
          Skip
        </Button>
      </div>

      <div className="mb-6">
        <Progress value={((step + 1) / totalSteps) * 100} className="h-1" />
        <div className="mt-2 flex justify-between text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>Step {String(step + 1).padStart(2, "0")} / 0{totalSteps}</span>
          <span>~ 90 seconds</span>
        </div>
      </div>

      <Card className="ring-soft">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            {step === 0 && (
              <>
                <CardHeader>
                  <CardTitle className="font-display text-3xl md:text-4xl">
                    What should we call you?
                  </CardTitle>
                  <CardDescription>
                    Stays on this device. Aura uses no servers for personal
                    data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Name (or initial)</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Lina"
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="city">Where are you today?</Label>
                    <div className="flex gap-2">
                      <Input
                        id="city"
                        placeholder="e.g. Lisbon"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        type="button"
                        onClick={detectLocation}
                        disabled={locating}
                      >
                        {locating ? (
                          <Loader2Icon data-icon="inline-start" className="animate-spin" />
                        ) : (
                          <MapPinIcon data-icon="inline-start" />
                        )}
                        Use GPS
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      We use Open-Meteo (no API key, no tracking) to read the
                      weather, humidity, UV, and air quality where you are.
                    </p>
                  </div>
                </CardContent>
              </>
            )}

            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle className="font-display text-3xl md:text-4xl">
                    How does your skin behave?
                  </CardTitle>
                  <CardDescription>
                    Pick the option that's true on a typical day.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="grid gap-3 md:grid-cols-2">
                    {skinTypes.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setSkin(s.id)}
                        className={cn(
                          "rounded-2xl border border-border bg-background p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
                          skin === s.id &&
                            "border-primary bg-primary/5 ring-2 ring-primary/30",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-display text-xl">{s.label}</div>
                          {skin === s.id && (
                            <CheckIcon className="size-4 text-primary" />
                          )}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {s.hint}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>What's on your mind for skin? (pick a few)</Label>
                    <div className="flex flex-wrap gap-2">
                      {concernOptions.map((c) => {
                        const active = concerns.includes(c.id);
                        return (
                          <button
                            type="button"
                            key={c.id}
                            onClick={() =>
                              setConcerns((prev) =>
                                active
                                  ? prev.filter((p) => p !== c.id)
                                  : [...prev, c.id],
                              )
                            }
                            className={cn(
                              "rounded-full border border-border bg-background px-3 py-1.5 text-sm transition-colors",
                              active &&
                                "border-primary bg-primary text-primary-foreground",
                            )}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle className="font-display text-3xl md:text-4xl">
                    Cycle awareness, gently.
                  </CardTitle>
                  <CardDescription>
                    Skip this entirely if you don't menstruate or prefer not
                    to. The routine stays climate-led.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
                    <div>
                      <div className="font-medium">Track my cycle</div>
                      <div className="text-xs text-muted-foreground">
                        Aura uses it for active selection only.
                      </div>
                    </div>
                    <Switch
                      checked={trackingCycle}
                      onCheckedChange={setTrackingCycle}
                    />
                  </div>

                  {trackingCycle && (
                    <div className="grid gap-5">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="last">First day of last period</Label>
                        <Input
                          id="last"
                          type="date"
                          value={lastPeriod}
                          onChange={(e) => setLastPeriod(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <Label>Average cycle length</Label>
                          <Badge variant="secondary">{cycleLength} days</Badge>
                        </div>
                        <Slider
                          value={[cycleLength]}
                          min={21}
                          max={40}
                          step={1}
                          onValueChange={(v) => setCycleLength(firstSliderValue(v, 28))}
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <Label>Period length</Label>
                          <Badge variant="secondary">{periodLength} days</Badge>
                        </div>
                        <Slider
                          value={[periodLength]}
                          min={2}
                          max={9}
                          step={1}
                          onValueChange={(v) => setPeriodLength(firstSliderValue(v, 5))}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </>
            )}

            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle className="font-display text-3xl md:text-4xl">
                    You're set, {name || "lovely"}.
                  </CardTitle>
                  <CardDescription>
                    Aura will read the climate around you and arrange the
                    products you already own. You can edit anything later.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="grid gap-3 rounded-2xl border border-border bg-background p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Where</span>
                      <span className="font-medium">{city || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Skin</span>
                      <span className="font-medium capitalize">{skin}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Concerns</span>
                      <span className="font-medium">
                        {concerns.length ? concerns.join(", ") : "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Cycle</span>
                      <span className="font-medium">
                        {trackingCycle ? `${cycleLength}-day` : "Not tracked"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your starter vanity already contains 8 popular products so
                    today's ritual feels real. Swap them out anytime.
                  </p>
                </CardContent>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-4">
          <Button
            variant="ghost"
            onClick={back}
            disabled={step === 0}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            Back
          </Button>
          {step < totalSteps - 1 ? (
            <Button onClick={next} className="rounded-full px-6">
              Continue
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          ) : (
            <Button onClick={complete} className="rounded-full px-6">
              Compose my ritual
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function oneWeekAgoISO() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
}
