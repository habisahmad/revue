import * as React from "react";
import Image from "next/image";
import { GitBranch } from "lucide-react";
import { StatusPill, type PrStatus } from "./status-pill";
import { cn } from "@/lib/utils";

type PrHeaderProps = {
  title: string;
  number: number;
  status: PrStatus;
  author: { login: string; avatarUrl: string | null };
  base: string;
  head: string;
  commits: number;
  openedAt: string;
  className?: string;
};

export function PrHeader({
  title,
  number,
  status,
  author,
  base,
  head,
  commits,
  openedAt,
  className,
}: PrHeaderProps) {
  return (
    <div className={cn("py-10", className)}>
      <h1 className="font-mono text-3xl sm:text-4xl leading-[1.05] tracking-[-0.02em] text-white">
        {title}{" "}
        <span className="text-white/35 font-normal">#{number}</span>
      </h1>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2.5 text-sm">
        <StatusPill status={status} />

        <div className="flex items-center gap-2 text-white/60">
          {author.avatarUrl ? (
            <Image
              src={author.avatarUrl}
              alt={author.login}
              width={20}
              height={20}
              className="h-5 w-5 rounded-full ring-1 ring-white/15"
            />
          ) : (
            <span className="h-5 w-5 rounded-full bg-white/8 ring-1 ring-white/15" />
          )}
          <span className="font-mono text-[13px] text-white/85">
            {author.login}
          </span>
          <span className="text-white/40">
            wants to merge {commits}{" "}
            {commits === 1 ? "commit" : "commits"} into
          </span>
          <BranchTag>{base}</BranchTag>
          <span className="text-white/40">from</span>
          <BranchTag>{head}</BranchTag>
        </div>

        <span className="text-white/30 font-mono text-[12px]">
          opened {formatRelative(openedAt)}
        </span>
      </div>
    </div>
  );
}

function BranchTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.04] px-2 py-0.5 ring-1 ring-white/8 font-mono text-[12px] text-white/85">
      <GitBranch className="h-3 w-3 text-white/45" />
      {children}
    </span>
  );
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}
