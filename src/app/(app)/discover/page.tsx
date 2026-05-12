"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAura } from "@/lib/aura-context";
import { discoverSuggestions } from "@/lib/engine";

export default function DiscoverPage() {
  const { snapshot, vanity, importProduct } = useAura();
  const picks = useMemo(
    () => discoverSuggestions(snapshot, vanity, 9),
    [snapshot, vanity],
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Discover
        </p>
        <h1 className="font-display mt-2 text-4xl md:text-5xl">
          Curated for the day you're having.
        </h1>
        <p className="mt-2 max-w-2xl text-foreground/70">
          Picks below match today's needs. Tap to bring one into your Vanity —
          no checkout, no nudges. This is editorial, not retail.
        </p>
      </motion.section>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map(({ product, reason, matched }, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="ring-soft overflow-hidden">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                  {matched.slice(0, 3).map((m) => (
                    <Badge
                      key={m}
                      className="rounded-full bg-background/90 text-foreground"
                    >
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {product.brand} · {product.category}
                    </div>
                    <div className="font-display text-2xl">{product.name}</div>
                  </div>
                  {product.price != null && (
                    <span className="font-mono text-xs text-muted-foreground">
                      {product.priceCurrency} {product.price}
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground/70">{product.notes}</p>
                <div className="rounded-xl bg-secondary/60 p-3 text-xs text-foreground/80">
                  <span className="font-medium text-primary">Why today: </span>
                  {reason}
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={() => {
                    importProduct(product);
                    toast.success(`${product.name} added to your vanity.`);
                  }}
                >
                  <PlusIcon data-icon="inline-start" />
                  Add to Vanity
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
