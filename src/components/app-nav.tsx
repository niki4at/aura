"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  HomeIcon,
  SparklesIcon,
  HeartIcon,
  CompassIcon,
  MoonIcon,
  MenuIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BrandLockup } from "@/components/brand";
import { cn } from "@/lib/utils";

const links = [
  { href: "/today", label: "Today", icon: HomeIcon },
  { href: "/vanity", label: "Vanity", icon: SparklesIcon },
  { href: "/discover", label: "Discover", icon: CompassIcon },
  { href: "/cycle", label: "Cycle", icon: MoonIcon },
  { href: "/insights", label: "Insights", icon: HeartIcon },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          <BrandLockup />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                    active && "text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-secondary"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <Button
              render={<Link href="/" />}
              nativeButton={false}
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex"
            >
              Exit
            </Button>
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="outline" size="icon" className="md:hidden">
                    <MenuIcon data-icon="inline-start" />
                  </Button>
                }
              />

              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="font-display text-2xl">Aura</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1 px-4">
                  {links.map((l) => {
                    const Icon = l.icon;
                    const active = pathname.startsWith(l.href);
                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                          active && "bg-secondary text-foreground",
                        )}
                      >
                        <Icon className="size-4" />
                        {l.label}
                      </Link>
                    );
                  })}
                  <Link
                    href="/"
                    className="mt-4 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Exit to landing
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <nav className="sticky bottom-0 z-30 mt-auto block border-t border-border bg-background/95 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {links.map((l) => {
            const Icon = l.icon;
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-muted-foreground transition-colors",
                  active && "text-primary",
                )}
              >
                <Icon className="size-5" />
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
