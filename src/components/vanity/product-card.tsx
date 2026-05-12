"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { TrashIcon, SparklesIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Product, ProductTag } from "@/lib/types";

export function ProductCard({
  product,
  onRemove,
  matched = [],
}: {
  product: Product;
  onRemove?: () => void;
  matched?: ProductTag[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
    >
      <Card className="ring-soft overflow-hidden">
        <div className="relative aspect-[5/4] w-full overflow-hidden bg-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="grid size-full place-items-center text-muted-foreground">
              <SparklesIcon className="size-8" />
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge variant="secondary" className="rounded-full capitalize">
              {product.category}
            </Badge>
          </div>
        </div>
        <CardContent className="flex flex-col gap-2.5">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {product.brand}
            </div>
            <div className="font-display text-xl leading-tight">
              {product.name}
            </div>
          </div>
          {product.notes && (
            <p className="text-sm text-foreground/70">{product.notes}</p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {product.tags.slice(0, 4).map((t) => {
              const isMatch = matched.includes(t);
              return (
                <Badge
                  key={t}
                  variant={isMatch ? "default" : "outline"}
                  className="rounded-full text-[10px]"
                >
                  {t}
                </Badge>
              );
            })}
          </div>
          <div className="mt-2 flex items-center justify-between">
            {product.price != null ? (
              <span className="font-mono text-xs text-muted-foreground">
                {product.priceCurrency ?? "USD"} {product.price}
              </span>
            ) : (
              <span className="font-mono text-xs text-muted-foreground">
                Owned
              </span>
            )}
            {onRemove && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={onRemove}
                    >
                      <TrashIcon data-icon="inline-start" />
                    </Button>
                  }
                />
                <TooltipContent>Remove from vanity</TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
