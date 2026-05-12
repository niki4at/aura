"use client";

import { useMemo, useState } from "react";
import { SparklesIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { useAura } from "@/lib/aura-context";
import { ProductCard } from "@/components/vanity/product-card";
import { AddProductDialog } from "@/components/vanity/add-product-dialog";
import type { ProductCategory } from "@/lib/types";

const groups: { id: "all" | ProductCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "cleanser", label: "Cleansers" },
  { id: "serum", label: "Serums" },
  { id: "moisturizer", label: "Moisturizers" },
  { id: "spf", label: "SPF" },
  { id: "eye", label: "Eye" },
  { id: "mask", label: "Masks" },
  { id: "lip", label: "Lip" },
];

export default function VanityPage() {
  const { vanity, removeProduct, snapshot } = useAura();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return vanity;
    return vanity.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s) ||
        p.tags.some((t) => t.includes(s)),
    );
  }, [vanity, q]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Your Vanity
          </p>
          <h1 className="font-display mt-2 text-4xl md:text-5xl">
            {vanity.length} products on the shelf.
          </h1>
          <p className="mt-2 max-w-xl text-foreground/70">
            Aura draws from this list first. The closer it is to reality, the
            better the day's ritual fits.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search brand or active…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-64"
          />
          <AddProductDialog />
        </div>
      </motion.section>

      <Tabs defaultValue="all">
        <TabsList className="flex w-full overflow-x-auto">
          {groups.map((g) => (
            <TabsTrigger key={g.id} value={g.id} className="capitalize">
              {g.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {groups.map((g) => {
          const items =
            g.id === "all"
              ? filtered
              : filtered.filter((p) => p.category === g.id);
          return (
            <TabsContent key={g.id} value={g.id} className="mt-6">
              {items.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <SparklesIcon />
                    </EmptyMedia>
                    <EmptyTitle>Nothing here yet</EmptyTitle>
                    <EmptyDescription>
                      Add a product to fill this category and let Aura compose
                      smarter rituals.
                    </EmptyDescription>
                  </EmptyHeader>
                  <AddProductDialog />
                </Empty>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onRemove={() => removeProduct(p.id)}
                      matched={p.tags.filter((t) =>
                        snapshot.needs.includes(t),
                      )}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
