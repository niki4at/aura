import Link from "next/link";
import { BrandLockup } from "@/components/brand";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <BrandLockup />
          <p className="max-w-sm text-sm text-muted-foreground">
            A daily ritual that listens before it speaks. Built as an open
            proof of concept.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-6 text-sm text-foreground/70">
          <Link href="#how" className="hover:text-foreground">
            How
          </Link>
          <Link href="#features" className="hover:text-foreground">
            Features
          </Link>
          <Link href="#voices" className="hover:text-foreground">
            Voices
          </Link>
          <Link href="/today" className="hover:text-foreground">
            Open Aura
          </Link>
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Aura. A demo built with Next.js, shadcn/ui,
        and a lot of moisturiser.
      </p>
    </footer>
  );
}
