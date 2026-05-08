import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";

const LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Changelog", href: "/changelog" },
  { label: "Privacy", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="relative px-6 py-12 border-t border-white/5">
      <Container className="max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full accent-dot"
          />
          <span className="font-mono text-sm tracking-tight text-white/85">
            Revue
          </span>
          <span className="font-mono text-[11px] text-white/30 ml-3">
            © 2026
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-x-7 gap-y-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
