import * as React from "react";
import { GitPullRequest, GitMerge, CircleSlash, FilePen } from "lucide-react";
import { cn } from "@/lib/utils";

export type PrStatus = "open" | "closed" | "merged" | "draft";

const STATES: Record<
  PrStatus,
  { label: string; className: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  open: {
    label: "Open",
    className: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
    Icon: GitPullRequest,
  },
  merged: {
    label: "Merged",
    className: "bg-violet-500/15 text-violet-300 ring-violet-400/30",
    Icon: GitMerge,
  },
  closed: {
    label: "Closed",
    className: "bg-rose-500/15 text-rose-300 ring-rose-400/30",
    Icon: CircleSlash,
  },
  draft: {
    label: "Draft",
    className: "bg-white/8 text-white/70 ring-white/15",
    Icon: FilePen,
  },
};

export function StatusPill({
  status,
  className,
}: {
  status: PrStatus;
  className?: string;
}) {
  const s = STATES[status];
  const Icon = s.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 ring-1",
        "font-mono text-[11px] uppercase tracking-[0.18em]",
        s.className,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {s.label}
    </span>
  );
}
