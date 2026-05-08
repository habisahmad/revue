import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Atmospheric, asset-free background.
 * Layers (back to front):
 *   1. Black base
 *   2. Three slow auroras (amber + cool)
 *   3. Top spotlight
 *   4. Dot grid (masked to fade at edges)
 *   5. Grain noise (low opacity)
 *   6. Bottom vignette
 */
export function BackgroundCanvas({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 z-0 overflow-hidden bg-[#070808]",
        className
      )}
    >
      {/* Auroras */}
      <div
        className="absolute -top-48 -left-48 h-[640px] w-[640px] rounded-full blur-3xl opacity-60 animate-aurora-1"
        style={{
          background:
            "radial-gradient(circle, rgba(196,153,74,0.42), transparent 65%)",
        }}
      />
      <div
        className="absolute top-[20%] -right-48 h-[720px] w-[720px] rounded-full blur-3xl opacity-50 animate-aurora-2"
        style={{
          background:
            "radial-gradient(circle, rgba(96,118,210,0.28), transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-56 left-1/4 h-[560px] w-[560px] rounded-full blur-3xl opacity-40 animate-aurora-3"
        style={{
          background:
            "radial-gradient(circle, rgba(196,153,74,0.20), transparent 70%)",
        }}
      />

      {/* Top spotlight under nav */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[1180px] rounded-full blur-3xl opacity-70"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.07), transparent 60%)",
        }}
      />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid" />

      {/* Grain */}
      <div className="absolute inset-0 grain opacity-[0.05] mix-blend-overlay pointer-events-none" />

      {/* Bottom vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Bottom fade-into-page */}
      <div
        className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(7,8,8,0.95))",
        }}
      />
    </div>
  );
}
