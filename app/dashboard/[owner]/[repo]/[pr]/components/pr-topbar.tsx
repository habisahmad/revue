import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";

type PrTopbarProps = {
  owner: string;
  repo: string;
  prNumber: string;
};

export function PrTopbar({ owner, repo, prNumber }: PrTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[rgba(8,9,10,0.85)] backdrop-blur-xl">
      <Container className="flex h-14 items-center justify-between px-6">
        <nav className="flex items-center gap-2 font-mono text-[12.5px] tracking-tight">
          <Link href="/" className="text-white/85 hover:text-white">
            <span className="accent-dot inline-block h-1.5 w-1.5 rounded-full align-middle mr-2" />
            Revue
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-white/25" />
          <Link
            href="/dashboard"
            className="text-white/55 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-white/25" />
          <span className="text-white/55">{owner}</span>
          <span className="text-white/25">/</span>
          <Link
            href={`https://github.com/${owner}/${repo}`}
            target="_blank"
            className="text-white/55 hover:text-white transition-colors"
          >
            {repo}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-white/25" />
          <span className="text-white/85">#{prNumber}</span>
        </nav>

        <Link
          href={`https://github.com/${owner}/${repo}/pull/${prNumber}`}
          target="_blank"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45 hover:text-white transition-colors"
        >
          Open on GitHub ↗
        </Link>
      </Container>
    </header>
  );
}
