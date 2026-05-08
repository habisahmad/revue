import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NavLink = { label: string; href: string };

type NavbarProps = {
  brand?: string;
  brandHref?: string;
  links?: NavLink[];
  cta?: { label: string; href: string };
  className?: string;
};

const DEFAULT_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Navbar({
  brand = "Revue",
  brandHref = "/",
  links = DEFAULT_LINKS,
  cta = { label: "Get Started", href: "/api/auth/signin" },
  className,
}: NavbarProps) {
  return (
    <nav className={cn("relative z-10", className)}>
      <Container className="flex items-center justify-between px-8 py-6">
        <Link
          href={brandHref}
          className="font-mono text-2xl tracking-tight text-white"
        >
          {brand}
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href={cta.href}
          className={buttonVariants({ variant: "liquid-glass", size: "md" })}
        >
          {cta.label}
        </Link>
      </Container>
    </nav>
  );
}
