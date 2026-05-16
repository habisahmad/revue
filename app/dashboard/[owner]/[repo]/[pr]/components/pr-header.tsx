"use client";

import * as React from "react";
import Image from "next/image";
import { Check, GitBranch, Loader2, Sparkles } from "lucide-react";
import { StatusPill, type PrStatus } from "./status-pill";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AnalyzePrState } from "../actions";

type PrHeaderProps = {
  title: string;
  number: number;
  status: PrStatus;
  author: { login: string; avatarUrl: string | null };
  base: string;
  head: string;
  commits: number;
  openedAt: string;
  owner: string;
  repo: string;
  prNumber: string;
  formAction: (formData: FormData) => void;
  pending: boolean;
  state: AnalyzePrState;
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
  owner,
  repo,
  prNumber,
  formAction,
  pending,
  state,
  className,
}: PrHeaderProps) {
  return (
    <div className={cn("py-10", className)}>
      <div className="flex items-start justify-between gap-6">
        <h1 className="font-mono text-3xl sm:text-4xl leading-[1.05] tracking-[-0.02em] text-white">
          {title}{" "}
          <span className="text-white/35 font-normal">#{number}</span>
        </h1>

        <form action={formAction}>
          <input type="hidden" name="owner" value={owner} />
          <input type="hidden" name="repo" value={repo} />
          <input type="hidden" name="pr" value={prNumber} />
          <Button
            type="submit"
            variant="yellow"
            size="md"
            className="shrink-0"
            disabled={pending}
          >
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {pending ? "Analyzing…" : "Analyze"}
          </Button>
        </form>
      </div>

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

      {state.status === "error" && (
        <div className="mt-6 rounded-lg bg-red-500/10 ring-1 ring-red-400/30 px-4 py-3 text-sm text-red-200">
          {state.error}
        </div>
      )}

      {state.status === "success" && state.review.verdict === "lgtm" && (
        <div className="mt-6 flex items-start gap-3 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-400/30 px-5 py-4">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 ring-1 ring-emerald-400/40">
            <Check className="h-4 w-4 text-emerald-300" />
          </div>
          <div>
            <div className="font-mono text-sm font-semibold text-emerald-200">
              LGTM
            </div>
            <p className="mt-1 text-[13px] text-white/70">
              {state.review.summary}
            </p>
          </div>
        </div>
      )}

      {state.status === "success" &&
        state.review.verdict === "changes_requested" && (
          <div className="mt-6 flex items-center gap-3 rounded-lg bg-white/[0.03] ring-1 ring-white/10 px-5 py-3">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300/80" />
            <span className="text-[13px] text-white/85">
              {state.review.summary}
            </span>
            <span className="ml-auto font-mono text-[11px] text-white/45">
              {state.review.comments.length}{" "}
              {state.review.comments.length === 1 ? "comment" : "comments"}{" "}
              inline
            </span>
          </div>
        )}
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
