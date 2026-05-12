"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlaneIcon, SearchIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAura } from "@/lib/aura-context";

const presets = [
  { city: "Lisbon", note: "Cool + dry" },
  { city: "Singapore", note: "Hot + humid" },
  { city: "Reykjavik", note: "Wind + cold" },
  { city: "Marrakech", note: "Hot + UV" },
  { city: "Mumbai", note: "Humid + AQI" },
  { city: "Tokyo", note: "Mild + clean" },
];

export function TravelModeDialog() {
  const { updateProfile } = useAura();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);

  async function go(city: string) {
    if (!city.trim()) return;
    try {
      setBusy(true);
      const params = new URLSearchParams({ city: city.trim() });
      const res = await fetch(`/api/climate?${params}`);
      if (!res.ok) throw new Error("not found");
      const data = await res.json();
      updateProfile({
        city: data.city ?? city,
        country: data.country,
        countryCode: data.countryCode,
        latitude: undefined,
        longitude: undefined,
      });
      toast.success(`Composing for ${data.city ?? city} — ${data.condition}.`);
      setOpen(false);
    } catch {
      toast.error("Couldn't reach that city. Try another spelling.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            <PlaneIcon data-icon="inline-start" />
            Travel mode
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Just landed somewhere new?
          </DialogTitle>
          <DialogDescription>
            Type a city. Aura pulls the weather, humidity, UV, and AQI in
            seconds, then recomposes today's ritual.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void go(q);
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="e.g. Tokyo"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
          <Button type="submit" disabled={busy}>
            {busy ? (
              <Loader2Icon data-icon="inline-start" className="animate-spin" />
            ) : (
              <SearchIcon data-icon="inline-start" />
            )}
            Sync
          </Button>
        </form>

        <div className="grid gap-2 sm:grid-cols-3">
          {presets.map((p, i) => (
            <motion.button
              key={p.city}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => void go(p.city)}
              className="rounded-2xl border border-border bg-background p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
            >
              <div className="text-sm font-medium">{p.city}</div>
              <div className="text-xs text-muted-foreground">{p.note}</div>
            </motion.button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Stay where I am
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
