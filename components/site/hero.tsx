import * as React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroProps = {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  cta?: { label: string; href: string };
  className?: string;
};

export function Hero({
  eyebrow,
  title,
  description,
  cta,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-40",
        className
      )}
    >
      {eyebrow && (
        <div className="animate-fade-rise mb-6 text-xs uppercase tracking-[0.2em] text-white/60">
          {eyebrow}
        </div>
      )}

      <h1
        className="animate-fade-rise font-mono text-[44px] sm:text-7xl md:text-[104px] leading-[0.95] max-w-5xl text-white text-balance"
        style={{ letterSpacing: "-0.045em" }}
      >
        {title}
      </h1>

      {description && (
        <p className="animate-fade-rise-delay font-sans text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-white/60">
          {description}
        </p>
      )}

      {cta && (
        <Link
          href={cta.href}
          className={cn(
            buttonVariants({ variant: "liquid-glass", size: "lg" }),
            "mt-12 animate-fade-rise-delay-2"
          )}
        >
          {cta.label}
        </Link>
      )}
    </section>
  );
}
