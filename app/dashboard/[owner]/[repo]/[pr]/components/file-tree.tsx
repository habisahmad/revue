"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  File,
  FilePlus,
  FileMinus,
  FilePen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { slug } from "../lib/slug";

type FileTreeFile = {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
};

type TreeFile = {
  type: "file";
  name: string;
  path: string;
  meta: FileTreeFile;
};
type TreeDir = {
  type: "dir";
  name: string;
  path: string;
  children: TreeNode[];
};
type TreeNode = TreeFile | TreeDir;

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
};

function buildTree(files: FileTreeFile[]): TreeNode[] {
  const root: TreeDir = { type: "dir", name: "", path: "", children: [] };
  for (const f of files) {
    const parts = f.filename.split("/");
    let cur: TreeDir = root;
    parts.forEach((part, i) => {
      const isLast = i === parts.length - 1;
      const path = parts.slice(0, i + 1).join("/");
      let child = cur.children.find((c) => c.name === part);
      if (!child) {
        child = isLast
          ? { type: "file", name: part, path, meta: f }
          : { type: "dir", name: part, path, children: [] };
        cur.children.push(child);
      }
      if (child.type === "dir") cur = child;
    });
  }

  const sortDir = (d: TreeDir) => {
    d.children.sort((a, b) => {
      if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    for (const c of d.children) if (c.type === "dir") sortDir(c);
  };
  sortDir(root);
  return root.children;
}

export function FileTree({ files }: { files: FileTreeFile[] }) {
  const tree = React.useMemo(() => buildTree(files), [files]);

  return (
    <aside className="lg:sticky lg:top-20 self-start">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/35">
          Files
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/55">
          {files.length}
        </span>
      </div>
      <div className="rounded-lg border border-white/8 bg-[rgba(10,11,12,0.55)] backdrop-blur-xl py-1.5 max-h-[calc(100vh-9rem)] overflow-y-auto">
        <ul>
          {tree.map((n) => (
            <NodeRow key={n.path} node={n} depth={0} />
          ))}
        </ul>
      </div>
    </aside>
  );
}

function NodeRow({ node, depth }: { node: TreeNode; depth: number }) {
  if (node.type === "dir") return <DirRow dir={node} depth={depth} />;
  return <FileRow file={node} depth={depth} />;
}

function DirRow({ dir, depth }: { dir: TreeDir; depth: number }) {
  const [open, setOpen] = React.useState(true);
  const indent = depth * 14 + 8;
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "group w-full flex items-center gap-1.5 px-2 py-1 text-left",
          "hover:bg-white/[0.04] transition-colors"
        )}
        style={{ paddingLeft: indent }}
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-white/40 shrink-0" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-white/40 shrink-0" />
        )}
        {open ? (
          <FolderOpen
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: "rgb(var(--ds-accent))" }}
          />
        ) : (
          <Folder
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: "rgb(var(--ds-accent) / 0.7)" }}
          />
        )}
        <span
          className="font-mono text-[12.5px] text-white/75 group-hover:text-white truncate"
          title={dir.path}
        >
          {dir.name}
        </span>
      </button>
      {open && (
        <ul>
          {dir.children.map((c) => (
            <NodeRow key={c.path} node={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function FileRow({ file, depth }: { file: TreeFile; depth: number }) {
  const meta = STATUS_ICON[file.meta.status] ?? STATUS_ICON.modified;
  const Icon = meta.Icon;
  const indent = depth * 14 + 8 + 14; // align past chevron column
  return (
    <li>
      <a
        href={`#f-${slug(file.meta.filename)}`}
        className={cn(
          "group flex items-center gap-1.5 px-2 py-1",
          "hover:bg-white/[0.04] transition-colors"
        )}
        style={{ paddingLeft: indent }}
      >
        <Icon className={cn("h-3.5 w-3.5 shrink-0", meta.tone)} />
        <span
          className="font-mono text-[12.5px] text-white/70 group-hover:text-white truncate"
          title={file.meta.filename}
        >
          {file.name}
        </span>
        <span className="ml-auto font-mono text-[10.5px] tabular-nums whitespace-nowrap shrink-0">
          <span className="text-emerald-300/85">+{file.meta.additions}</span>
          <span className="text-white/15"> · </span>
          <span className="text-rose-300/80">−{file.meta.deletions}</span>
        </span>
      </a>
    </li>
  );
}
