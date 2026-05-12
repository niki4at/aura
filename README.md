# Aura

> Adaptive beauty that responds to your sleep, stress, cycle, and the climate around you.

Aura is a proof-of-concept beauty platform that composes a daily ritual from products you already own. It reads your context — short sleep, dry air, luteal phase, high UV — and reorders the layers, swaps actives, and pauses the things skin can't take today.

Built as a no-auth MVP. All personal data lives in your browser, never on a server.

![Aura preview](./public/preview.png)

## What's inside

- **Aura Score** — five dials (sleep, stress, hydration, cycle, climate) that translate into a single skin-friendliness score.
- **Today's Ritual** — morning, midday, and evening flows assembled from your Vanity, with thoughtful suggestions where there's a gap.
- **Cycle sync** — four-phase model (menstrual, follicular, ovulation, luteal) shifts which actives are encouraged or paused.
- **Climate-aware** — live temperature, humidity, UV, and AQI from [Open-Meteo](https://open-meteo.com) (no API key required).
- **Travel mode** — type a city, the routine recomposes the moment new weather arrives.
- **My Vanity** — log products you own. Tag what they do. Aura builds around them.
- **Discover** — editorial picks ranked against today's needs, never the cart.
- **Insights** — 14-day Aura score arc plus sleep + stress trends.

## Stack

- [Next.js 16](https://nextjs.org) App Router with Turbopack
- [Tailwind CSS v4](https://tailwindcss.com) + custom warm editorial palette
- [shadcn/ui](https://ui.shadcn.com) (base preset)
- [Framer Motion](https://www.framer.com/motion/) for soft micro-animations
- [Recharts](https://recharts.org) for the insights view
- [Open-Meteo](https://open-meteo.com) for weather + air quality

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click **Try Aura** to walk through onboarding, then land on the Today dashboard.

## Project structure

```
src/
├── app/
│   ├── (app)/            # in-app pages (today, vanity, discover, cycle, insights)
│   ├── api/climate/      # edge route to Open-Meteo
│   ├── start/            # onboarding flow
│   ├── icon.svg          # favicon
│   ├── opengraph-image.tsx
│   ├── layout.tsx
│   └── page.tsx          # marketing landing
├── components/
│   ├── dashboard/        # context strip, ritual list, score breakdown, travel mode
│   ├── landing/          # hero, how-it-works, scenarios, voices, cta
│   ├── onboarding/
│   ├── vanity/
│   └── ui/               # shadcn primitives
└── lib/
    ├── catalog.ts        # starter vanity + suggested catalog
    ├── engine.ts         # the recommendation brain
    ├── aura-context.tsx  # state, persistence, climate fetch
    ├── storage.ts        # localStorage helpers
    └── types.ts
```

## The recommendation engine

The brain lives in `src/lib/engine.ts`. It does four things:

1. **Climate flags** — turns raw numbers (humidity, temp, UV, AQI) into intent-bearing booleans (`isDry`, `isHumid`, `isHighUv`, …).
2. **Cycle phase** — derives the current menstrual / follicular / ovulation / luteal day from the last period start.
3. **Needs derivation** — combines check-in (sleep, stress, water, mood), climate flags, and cycle phase into a set of `ProductTag`s the day calls for, plus warnings (e.g. "skip retinoids tonight").
4. **Routine composition** — walks morning / midday / evening flows, picking the highest-scoring owned product for each step. Falls back to the suggested catalog when a category gap exists.

## Privacy

No backend. No accounts. Climate is fetched edge-side from Open-Meteo with no user identifiers. Everything else (profile, vanity, daily check-ins) lives in `localStorage` under the `aura.state.v1` key.

Open `Insights → Reset all data` (or clear site storage) to wipe.

## Deployment

```bash
vercel deploy --prod
```

The repo deploys cleanly to Vercel with no environment variables required.
