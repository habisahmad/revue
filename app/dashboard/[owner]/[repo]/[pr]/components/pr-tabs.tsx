import * as React from "react";
import { MessageSquare, GitCommit, CheckCircle2, FileDiff } from "lucide-react";
import { cn } from "@/lib/utils";

export type PrTab = "conversation" | "commits" | "checks" | "files";

type PrTabsProps = {
  active: PrTab;
  counts?: Partial<Record<PrTab, number>>;
};

const TABS: {
  key: PrTab;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "conversation", label: "Conversation", Icon: MessageSquare },
  { key: "commits", label: "Commits", Icon: GitCommit },
  { key: "checks", label: "Checks", Icon: CheckCircle2 },
  { key: "files", label: "Files changed", Icon: FileDiff },
];

export function PrTabs({ active, counts }: PrTabsProps) {
  return (
    <div className="border-b border-white/5">
      <div className="flex items-center gap-1 -mb-px">
        {TABS.map((t) => {
          const isActive = t.key === active;
          const count = counts?.[t.key];
          return (
            <span
              key={t.key}
              className={cn(
                "relative inline-flex items-center gap-2 px-4 py-3 cursor-default",
                "font-mono text-[12.5px] tracking-tight transition-colors",
                isActive ? "text-white" : "text-white/45 hover:text-white/75"
              )}
            >
              <t.Icon className="h-3.5 w-3.5" />
              {t.label}
              {count !== undefined && (
                <span
                  className={cn(
                    "ml-1 rounded-full px-1.5 py-0.5 text-[10.5px] tabular-nums",
                    isActive
                      ? "bg-white/10 text-white"
                      : "bg-white/[0.04] text-white/55"
                  )}
                >
                  {count}
                </span>
              )}
              {isActive && (
                <span
                  className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full"
                  style={{ background: "rgb(var(--ds-accent))" }}
                />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
