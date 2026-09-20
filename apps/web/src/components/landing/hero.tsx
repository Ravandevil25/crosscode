"use client"

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlyphMatrix } from "@/components/ui/glyph-matrix";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { PhoneMockup } from "@/components/landing/phone-mockup";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Hero() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const glyphColor = mounted && theme === "dark" ? "#9CA3AF" : "#6B7280";
  const gridColor = mounted && theme === "dark" ? "#4B5563" : "#6B7280";

  return (
    <section className="relative flex items-center overflow-hidden py-16 md:h-[calc(100vh-4rem)] md:min-h-[740px] md:py-0">
      <div className="absolute top-0 left-0 w-1/2 h-1/2 z-0 opacity-50" style={{maskImage: 'linear-gradient(to bottom right, black 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom right, black 0%, transparent 100%)'}}>
        <GlyphMatrix
          glyphs="01·•+*/\\<>="
          cellSize={14}
          mutationRate={0.04}
          interval={90}
          fadeBottom={0.6}
          color={glyphColor}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 z-0 opacity-50" style={{maskImage: 'linear-gradient(to top left, black 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top left, black 0%, transparent 100%)'}}>
        <FlickeringGrid
          squareSize={4}
          gridGap={6}
          color={gridColor}
          maxOpacity={0.5}
          flickerChance={0.3}
          className="h-full w-full"
        />
      </div>
      <div className="container relative z-10 grid h-full w-full items-center gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-6 overflow-visible">
        <div className="flex flex-col items-start justify-center text-left h-full py-10">
          <Badge variant="secondary" className="mb-4">
            Free & Open Source
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-2xl lg:whitespace-nowrap">
            Your OpenCode agent,
            <br />
            in your pocket
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl text-pretty">
            CrossCode connects your phone to your PC&apos;s OpenCode instance. Approve tool calls, review diffs, and manage sessions.
          </p>
          <div className="mt-8 flex flex-row gap-3">
            <Button size="lg" asChild>
              <Link href="/download">Download</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
        <div className="relative flex h-full items-center justify-center md:justify-start lg:pl-16">
          {/* glow behind phone */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.07] blur-[100px]" />
          <div className="relative w-fit origin-top scale-[0.88] min-[400px]:scale-100 [mask-image:linear-gradient(to_bottom,black_88%,transparent_100%)]">
            <PhoneMockup />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
