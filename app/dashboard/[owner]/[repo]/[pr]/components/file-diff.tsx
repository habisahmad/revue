"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, FileDiff } from "lucide-react";
import { parsePatch, type DiffHunk, type DiffLine } from "../lib/parse-patch";
import { cn } from "@/lib/utils";

type FileDiffProps = {
  id: string;
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
};

const STATUS_TONE: Record<string, string> = {
  added: "text-emerald-300/90",
  removed: "text-rose-300/90",
  modified: "text-amber-300/85",
  renamed: "text-violet-300/85",
  changed: "text-amber-300/85",
};

export function FileDiffCard({
  id,
  filename,
  status,
  additions,
  deletions,
  patch,
}: FileDiffProps) {
  const [open, setOpen] = React.useState(true);
  const hunks = React.useMemo<DiffHunk[]>(
    () => (patch ? parsePatch(patch) : []),
    [patch]
  );

  return (
    <article
      id={id}
      className={cn(
        "scroll-mt-24",
        "rounded-xl overflow-hidden",
        "border border-white/8 bg-[rgba(11,12,14,0.78)] backdrop-blur-xl",
        "shadow-[0_30px_80px_-50px_rgba(0,0,0,0.6)]"
      )}
    >
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-white/6 bg-white/[0.015]">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Collapse file" : "Expand file"}
          className="text-white/45 hover:text-white transition-colors"
        >
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        <FileDiff
          className={cn(
            "h-3.5 w-3.5",
            STATUS_TONE[status] ?? "text-white/55"
          )}
        />
        <span className="font-mono text-[12.5px] tracking-tight text-white/85 truncate">
          {filename}
        </span>
        <span
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.18em] px-1.5 py-0.5 rounded",
            "bg-white/[0.03] text-white/55"
          )}
        >
          {status}
        </span>
        <span className="ml-auto font-mono text-[11.5px] tabular-nums">
          <span className="text-emerald-300/90">+{additions}</span>
          <span className="text-white/15"> · </span>
          <span className="text-rose-300/85">−{deletions}</span>
        </span>
      </header>

      {/* Body */}
      {open && (
        <div className="overflow-x-auto">
          {hunks.length > 0 ? (
            hunks.map((h, i) => <Hunk key={i} hunk={h} />)
          ) : (
            <div className="px-4 py-8 text-center font-mono text-[12px] text-white/30">
              No patch available — binary file or too large
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function Hunk({ hunk }: { hunk: DiffHunk }) {
  return (
    <div className="font-mono text-[12.5px] leading-[1.65]">
      {/* Hunk header */}
      <div className="grid grid-cols-[3rem_3rem_1fr] bg-white/[0.018] border-y border-white/[0.04] py-1.5 text-white/35">
        <span className="text-right pr-2 select-none">·</span>
        <span className="text-right pr-2 select-none">·</span>
        <span className="px-2">{hunk.header}</span>
      </div>

      {hunk.lines.map((l, i) => (
        <Line key={i} line={l} />
      ))}
    </div>
  );
}

const KIND_BG: Record<DiffLine["kind"], string> = {
  ctx: "",
  add: "bg-emerald-400/[0.07]",
  del: "bg-rose-400/[0.06]",
};

const KIND_TEXT: Record<DiffLine["kind"], string> = {
  ctx: "text-white/65",
  add: "text-emerald-200/95",
  del: "text-rose-200/90",
};

const SIGIL: Record<DiffLine["kind"], string> = {
  ctx: " ",
  add: "+",
  del: "-",
};

function Line({ line }: { line: DiffLine }) {
  return (
    <div
      className={cn(
        "grid grid-cols-[3rem_3rem_1.25rem_1fr] items-start",
        KIND_BG[line.kind],
        KIND_TEXT[line.kind]
      )}
    >
      <span className="text-right pr-2 text-white/25 select-none tabular-nums">
        {line.oldNum ?? ""}
      </span>
      <span className="text-right pr-2 text-white/25 select-none tabular-nums">
        {line.newNum ?? ""}
      </span>
      <span className="text-white/35 select-none">{SIGIL[line.kind]}</span>
      <span className="whitespace-pre pr-4">{line.content}</span>
    </div>
  );
}
