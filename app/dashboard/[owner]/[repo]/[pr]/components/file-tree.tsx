import * as React from "react";
import { File, FilePlus, FileMinus, FilePen } from "lucide-react";
import { cn } from "@/lib/utils";

type FileTreeFile = {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
};

const STATUS_ICON: Record<
  string,
  { Icon: React.ComponentType<{ className?: string }>; tone: string }
> = {
  added: { Icon: FilePlus, tone: "text-emerald-300/85" },
  removed: { Icon: FileMinus, tone: "text-rose-300/85" },
  modified: { Icon: FilePen, tone: "text-amber-300/80" },
  renamed: { Icon: FilePen, tone: "text-violet-300/85" },
  changed: { Icon: FilePen, tone: "text-amber-300/80" },
  copied: { Icon: File, tone: "text-white/60" },
  unchanged: { Icon: File, tone: "text-white/40" },
};

export function FileTree({ files }: { files: FileTreeFile[] }) {
  return (
    <aside className="lg:sticky lg:top-20 self-start">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/35">
          Files
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/55">
          {files.length}
        </span>
      </div>
      <ul className="space-y-0.5 max-h-[calc(100vh-9rem)] overflow-y-auto pr-2">
        {files.map((f) => {
          const meta = STATUS_ICON[f.status] ?? STATUS_ICON.unchanged;
          const Icon = meta.Icon;
          const id = `f-${slug(f.filename)}`;
          return (
            <li key={f.filename}>
              <a
                href={`#${id}`}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-2 py-1.5",
                  "hover:bg-white/[0.04] transition-colors"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5 shrink-0", meta.tone)} />
                <span
                  className="font-mono text-[12px] text-white/70 group-hover:text-white truncate"
                  title={f.filename}
                >
                  {basename(f.filename)}
                </span>
                <span className="ml-auto font-mono text-[10.5px] tabular-nums whitespace-nowrap">
                  <span className="text-emerald-300/85">+{f.additions}</span>
                  <span className="text-white/15"> · </span>
                  <span className="text-rose-300/80">−{f.deletions}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function basename(p: string): string {
  const i = p.lastIndexOf("/");
  return i === -1 ? p : p.slice(i + 1);
}

export function slug(s: string): string {
  return s.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
}
