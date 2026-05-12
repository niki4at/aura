import Link from "next/link";
import { cn } from "@/lib/utils";

export function AuraMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-6", className)}
      fill="none"
      aria-hidden
    >
      <defs>
        <radialGradient id="auraGrad" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="oklch(0.92 0.07 75)" />
          <stop offset="55%" stopColor="oklch(0.7 0.12 28)" />
          <stop offset="100%" stopColor="oklch(0.32 0.06 350)" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="13" stroke="url(#auraGrad)" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="7.5" fill="url(#auraGrad)" />
      <circle cx="13.4" cy="13.4" r="2.2" fill="oklch(0.985 0.01 80 / 0.6)" />
    </svg>
  );
}

export function BrandLockup({
  className,
  href = "/",
  hideName = false,
}: {
  className?: string;
  href?: string;
  hideName?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 group select-none",
        className,
      )}
    >
      <AuraMark className="size-7 transition-transform duration-700 group-hover:rotate-12" />
      {!hideName && (
        <span className="font-display text-2xl tracking-tight">Aura</span>
      )}
    </Link>
  );
}
