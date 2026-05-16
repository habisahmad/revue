"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, FileDiff, Sparkles } from "lucide-react";
import { parsePatch, type DiffHunk, type DiffLine } from "../lib/parse-patch";
import { cn } from "@/lib/utils";
import type { ReviewComment } from "@/lib/claude";

type FileDiffProps = {
  id: string;
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
  comments?: ReviewComment[];
};

const SEVERITY_TONE: Record<ReviewComment["severity"], string> = {
  nit: "text-white/65 ring-white/10 bg-white/[0.04]",
  suggestion: "text-sky-200/95 ring-sky-400/25 bg-sky-400/[0.06]",
  issue: "text-amber-200/95 ring-amber-400/30 bg-amber-400/[0.07]",
  blocker: "text-rose-200/95 ring-rose-400/35 bg-rose-400/[0.08]",
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
  comments = [],
}: FileDiffProps) {
  const [open, setOpen] = React.useState(true);
  const hunks = React.useMemo<DiffHunk[]>(
    () => (patch ? parsePatch(patch) : []),
    [patch]
  );

  const commentsByLine = React.useMemo(() => {
    const map = new Map<string, ReviewComment[]>();
    for (const c of comments) {
      const key = `${c.side}:${c.line}`;
      const arr = map.get(key) ?? [];
      arr.push(c);
      map.set(key, arr);
    }
    return map;
  }, [comments]);

  // Comments whose line didn't land on a real diff line — render at the top of the body
  const orphanComments = React.useMemo(() => {
    if (comments.length === 0) return [];
    const seenLines = new Set<string>();
    for (const h of hunks) {
      for (const l of h.lines) {
        if (l.newNum != null) seenLines.add(`new:${l.newNum}`);
        if (l.oldNum != null) seenLines.add(`old:${l.oldNum}`);
      }
    }
    return comments.filter((c) => !seenLines.has(`${c.side}:${c.line}`));
  }, [comments, hunks]);

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
        {comments.length > 0 && (
          <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-yellow-400/10 ring-1 ring-yellow-400/30 text-yellow-200/90 inline-flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5" />
            {comments.length}
          </span>
        )}
        <span className="ml-auto font-mono text-[11.5px] tabular-nums">
          <span className="text-emerald-300/90">+{additions}</span>
          <span className="text-white/15"> · </span>
          <span className="text-rose-300/85">−{deletions}</span>
        </span>
      </header>

      {/* Body */}
      {open && (
        <div className="overflow-x-auto">
          {orphanComments.length > 0 && (
            <div className="border-b border-white/[0.04] bg-yellow-400/[0.025] px-4 py-3 space-y-2">
              {orphanComments.map((c, i) => (
                <InlineComment key={`orphan-${i}`} comment={c} />
              ))}
            </div>
          )}
          {hunks.length > 0 ? (
            <div className="min-w-max">
              {hunks.map((h, i) => (
                <Hunk key={i} hunk={h} commentsByLine={commentsByLine} />
              ))}
            </div>
          ) : (
            <div className="px-4 py-10 text-center font-mono text-[13px] text-white/30">
              No patch available — binary file or too large
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function Hunk({
  hunk,
  commentsByLine,
}: {
  hunk: DiffHunk;
  commentsByLine: Map<string, ReviewComment[]>;
}) {
  return (
    <div className="font-mono text-[13.5px] leading-[1.7]">
      {/* Hunk header */}
      <div className="grid grid-cols-[3.5rem_3.5rem_1fr] bg-white/[0.025] border-y border-white/[0.04] py-2 text-white/40">
        <span className="text-right pr-2 select-none">·</span>
        <span className="text-right pr-2 select-none">·</span>
        <span className="px-3">{hunk.header}</span>
      </div>

      {hunk.lines.map((l, i) => {
        const key =
          l.kind === "del"
            ? `old:${l.oldNum}`
            : `new:${l.newNum}`;
        const lineComments = commentsByLine.get(key);
        return (
          <React.Fragment key={i}>
            <Line line={l} />
            {lineComments && lineComments.length > 0 && (
              <div className="px-4 py-2.5 bg-[#0d0f12] border-y border-white/[0.05] space-y-2">
                {lineComments.map((c, j) => (
                  <InlineComment key={j} comment={c} />
                ))}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function InlineComment({ comment }: { comment: ReviewComment }) {
  return (
    <div className="rounded-md ring-1 ring-white/8 bg-white/[0.02] px-3 py-2.5">
      <div className="flex items-center gap-2 mb-1">
        <span
          className={cn(
            "font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ring-1",
            SEVERITY_TONE[comment.severity],
          )}
        >
          {comment.severity}
        </span>
        <span className="font-mono text-[11px] text-white/45">
          line {comment.line}
        </span>
      </div>
      <p className="font-sans text-[13px] leading-relaxed text-white/85 whitespace-pre-wrap">
        {comment.body}
      </p>
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
        "grid grid-cols-[3.5rem_3.5rem_1.5rem_1fr] items-start",
        "hover:bg-white/[0.025] transition-colors",
        KIND_BG[line.kind],
        KIND_TEXT[line.kind]
      )}
    >
      <span className="text-right pr-2 py-0.5 text-white/30 select-none tabular-nums">
        {line.oldNum ?? ""}
      </span>
      <span className="text-right pr-2 py-0.5 text-white/30 select-none tabular-nums">
        {line.newNum ?? ""}
      </span>
      <span className="py-0.5 text-white/40 select-none">
        {SIGIL[line.kind]}
      </span>
      <span className="whitespace-pre pr-6 py-0.5">{line.content}</span>
    </div>
  );
}
