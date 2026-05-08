import * as React from "react";
import { cn } from "@/lib/utils";

type SectionLabelProps = {
  index: string;
  label: string;
  className?: string;
};

export function SectionLabel({ index, label, className }: SectionLabelProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em]",
        className
      )}
    >
      <span className="text-white/40">{index}</span>
      <span className="h-px w-8 bg-white/15" />
      <span className="text-white/70">{label}</span>
    </div>
  );
}
