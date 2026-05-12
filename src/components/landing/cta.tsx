"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBlock() {
  return (
    <section className="relative pb-32 pt-12">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="aura-gradient relative overflow-hidden rounded-[2.5rem] border border-border p-10 md:p-16 ring-soft text-center"
        >
          <div className="grain absolute inset-0 -z-10" aria-hidden />
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Free to try · no account
          </p>
          <h2 className="font-display mt-4 text-balance text-4xl md:text-6xl">
            The mirror that listens before it speaks.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-foreground/70 text-balance">
            Set up takes 90 seconds. Aura will compose your first ritual before
            your tea is steeped.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              render={<Link href="/start" />}
              nativeButton={false}
              size="lg"
              className="rounded-full px-7 text-base"
            >
              Begin
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button
              render={<Link href="/today" />}
              nativeButton={false}
              variant="ghost"
              size="lg"
              className="rounded-full px-5 text-base"
            >
              See a sample day
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
