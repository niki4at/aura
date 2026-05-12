"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const voices = [
  {
    name: "Maya, 29",
    role: "Stockholm — winter dweller",
    quote:
      "I stopped buying. Aura just kept telling me I already had what I needed and reordered the steps.",
    image:
      "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?auto=format&fit=crop&w=200&q=80",
    fallback: "MA",
  },
  {
    name: "Priya, 34",
    role: "Mumbai — humid + UV 9",
    quote:
      "First app that didn't try to sell me Korean glass skin. It told me to stop the retinoid for two days. My face thanked me.",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80",
    fallback: "PR",
  },
  {
    name: "Sofia, 41",
    role: "Lisbon — frequent flier",
    quote:
      "I land in three countries a week. The routine recomposes the moment my phone gets a new GPS lock. It's quiet magic.",
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
    fallback: "SO",
  },
];

export function Voices() {
  return (
    <section id="voices" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Early voices
          </p>
          <h2 className="font-display mt-3 text-balance text-4xl md:text-5xl">
            Quietly noticed by women who already had a routine.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {voices.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="h-full ring-soft">
                <CardContent className="flex h-full flex-col gap-5">
                  <p className="font-display text-xl leading-snug text-foreground/90 text-balance">
                    “{v.quote}”
                  </p>
                  <div className="mt-auto flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={v.image} alt="" />
                      <AvatarFallback>{v.fallback}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{v.name}</div>
                      <div className="text-xs text-muted-foreground">{v.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
