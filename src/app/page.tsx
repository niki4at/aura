import { MarketingNav } from "@/components/landing/marketing-nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Scenarios } from "@/components/landing/scenarios";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { Voices } from "@/components/landing/voices";
import { CtaBlock } from "@/components/landing/cta";
import { MarketingFooter } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="relative isolate min-h-screen bg-background">
      <MarketingNav />
      <Hero />
      <section
        id="science"
        className="border-y border-border bg-secondary/40 py-10"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span>Climate · Open-Meteo</span>
          <span>Cycle · 4-phase model</span>
          <span>Skin · barrier-first</span>
          <span>Privacy · on-device</span>
        </div>
      </section>
      <HowItWorks />
      <Scenarios />
      <FeatureGrid />
      <Voices />
      <CtaBlock />
      <MarketingFooter />
    </main>
  );
}
