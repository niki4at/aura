import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuraProvider } from "@/lib/aura-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aura — Adaptive beauty, made for your day",
  description:
    "Aura learns your sleep, stress, cycle, and climate, then composes a daily beauty ritual from the products you already own.",
  metadataBase: new URL("https://aura.example.com"),
  openGraph: {
    title: "Aura — Adaptive beauty",
    description:
      "A daily ritual that adapts to your sleep, stress, cycle, and climate.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${jetbrains.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuraProvider>
          <TooltipProvider delay={150}>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                className:
                  "border border-border bg-card text-foreground shadow-lg",
              }}
            />
          </TooltipProvider>
        </AuraProvider>
      </body>
    </html>
  );
}
