import * as React from "react";
import { GitBranch, FileDiff, Plus, Minus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type PrSidebarProps = {
  base: string;
  head: string;
  files: number;
  additions: number;
  deletions: number;
};

export function PrSidebar({
  base,
  head,
  files,
  additions,
  deletions,
}: PrSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-20 self-start space-y-4">
      <Card label="Branches">
        <div className="space-y-2">
          <Row icon={<GitBranch className="h-3.5 w-3.5 text-white/40" />} label="base">
            <span className="font-mono text-[12px] text-white/85">{base}</span>
          </Row>
          <Row icon={<GitBranch className="h-3.5 w-3.5 text-white/40" />} label="head">
            <span className="font-mono text-[12px] text-white/85">{head}</span>
          </Row>
        </div>
      </Card>

      <Card label="Stats">
        <div className="space-y-2">
          <Row icon={<FileDiff className="h-3.5 w-3.5 text-white/40" />} label="files">
            <span className="font-mono text-[12px] tabular-nums text-white/85">
              {files}
            </span>
          </Row>
          <Row icon={<Plus className="h-3.5 w-3.5 text-emerald-300/85" />} label="additions">
            <span className="font-mono text-[12px] tabular-nums text-emerald-300/95">
              +{additions}
            </span>
          </Row>
          <Row icon={<Minus className="h-3.5 w-3.5 text-rose-300/85" />} label="deletions">
            <span className="font-mono text-[12px] tabular-nums text-rose-300/90">
              −{deletions}
            </span>
          </Row>
        </div>
      </Card>

      <Card label="Revue review">
        <div className="flex items-start gap-3">
          <span
            className="grid h-7 w-7 place-items-center rounded-md shrink-0"
            style={{
              background: "rgb(var(--ds-accent-soft))",
              border: "1px solid rgb(var(--ds-accent-border))",
            }}
          >
            <Sparkles
              className="h-3.5 w-3.5"
              style={{ color: "rgb(var(--ds-accent))" }}
            />
          </span>
          <div className="text-[12px] leading-relaxed text-white/65">
            <p>
              <span
                className="font-mono text-[11px] uppercase tracking-[0.18em]"
                style={{ color: "rgb(var(--ds-accent))" }}
              >
                Pending
              </span>
            </p>
            <p className="mt-1.5 text-white/55">
              Connect Revue to this repo to get an AI review on every PR.
            </p>
          </div>
        </div>
      </Card>
    </aside>
  );
}

function Card({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/8 bg-[rgba(11,12,14,0.6)] backdrop-blur-xl p-4",
        className
      )}
    >
      <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/35 mb-3">
        {label}
      </div>
      {children}
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {icon}
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45 w-20">
        {label}
      </span>
      <span className="ml-auto">{children}</span>
    </div>
  );
}
