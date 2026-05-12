"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BrandLockup } from "@/components/brand";
import { cn } from "@/lib/utils";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full border border-transparent px-5 transition-all duration-500",
          scrolled
            ? "h-14 border-border/60 bg-background/70 backdrop-blur-xl ring-soft"
            : "h-16",
        )}
      >
        <BrandLockup />
        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          <Link href="#how" className="text-foreground/70 hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link href="#science" className="text-foreground/70 hover:text-foreground transition-colors">
            Science
          </Link>
          <Link href="#features" className="text-foreground/70 hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#voices" className="text-foreground/70 hover:text-foreground transition-colors">
            Voices
          </Link>
        </nav>
        <Button
          render={<Link href="/start" />}
          nativeButton={false}
          size="sm"
          className="rounded-full px-5"
        >
          Try Aura
        </Button>
      </div>
    </motion.header>
  );
}
