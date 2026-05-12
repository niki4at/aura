"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAura } from "@/lib/aura-context";
import type { Product, ProductCategory, ProductTag } from "@/lib/types";

const categories: ProductCategory[] = [
  "cleanser",
  "toner",
  "serum",
  "moisturizer",
  "eye",
  "spf",
  "mask",
  "exfoliant",
  "oil",
  "mist",
  "lip",
  "supplement",
  "bodycare",
  "haircare",
  "fragrance",
];

const tagPalette: ProductTag[] = [
  "hydrating",
  "calming",
  "brightening",
  "barrier-repair",
  "exfoliating",
  "antioxidant",
  "spf",
  "anti-inflammatory",
  "depuffing",
  "balancing",
  "ceramides",
  "hyaluronic",
  "vitamin-c",
  "retinoid",
  "niacinamide",
  "peptides",
  "azelaic",
  "fragrance-free",
];

export function AddProductDialog() {
  const { addProduct } = useAura();
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory>("serum");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<ProductTag[]>([]);

  function reset() {
    setBrand("");
    setName("");
    setCategory("serum");
    setNotes("");
    setTags([]);
  }

  function submit() {
    if (!brand.trim() || !name.trim()) {
      toast.error("A brand and product name help Aura recognise it.");
      return;
    }
    const product: Product = {
      id: `own-${Date.now()}`,
      brand: brand.trim(),
      name: name.trim(),
      category,
      tags,
      notes: notes.trim() || undefined,
      source: "owned",
      addedAt: Date.now(),
    };
    addProduct(product);
    toast.success(`${product.name} added to your vanity.`);
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="rounded-full">
            <PlusIcon data-icon="inline-start" />
            Add a product
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Log a product
          </DialogTitle>
          <DialogDescription>
            The more Aura knows your shelf, the smarter the daily ritual gets.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="The Ordinary"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="prod-name">Product</Label>
              <Input
                id="prod-name"
                placeholder="Niacinamide 10% + Zinc"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ProductCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">
                      {c}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>What does it do? (tap to tag)</Label>
            <div className="flex flex-wrap gap-2">
              {tagPalette.map((t) => {
                const active = tags.includes(t);
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() =>
                      setTags((prev) =>
                        active ? prev.filter((x) => x !== t) : [...prev, t],
                      )
                    }
                    className={`rounded-full border border-border px-3 py-1 text-xs transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-background text-foreground/80"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Travel size, almost out, alternates with X…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Save to Vanity</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
