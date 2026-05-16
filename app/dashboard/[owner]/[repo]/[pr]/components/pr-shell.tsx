"use client";

import * as React from "react";
import { useActionState, useMemo } from "react";
import { Container } from "@/components/ui/container";
import { PrHeader } from "./pr-header";
import { PrTabs } from "./pr-tabs";
import { FileTree } from "./file-tree";
import { FileDiffCard } from "./file-diff";
import { PrSidebar } from "./pr-sidebar";
import { slug } from "../lib/slug";
import { analyzePrAction, type AnalyzePrState } from "../actions";
import type { PrStatus } from "./status-pill";
import type { ReviewComment } from "@/lib/claude";

type ShellFile = {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
};

type PrShellProps = {
  owner: string;
  repo: string;
  prNumber: string;
  title: string;
  number: number;
  status: PrStatus;
  author: { login: string; avatarUrl: string | null };
  base: string;
  head: string;
  commits: number;
  openedAt: string;
  conversationCount: number;
  files: ShellFile[];
  totals: { add: number; del: number };
};

export function PrShell({
  owner,
  repo,
  prNumber,
  title,
  number,
  status,
  author,
  base,
  head,
  commits,
  openedAt,
  conversationCount,
  files,
  totals,
}: PrShellProps) {
  const [state, formAction, pending] = useActionState<AnalyzePrState, FormData>(
    analyzePrAction,
    { status: "idle" },
  );

  const commentsByFile = useMemo(() => {
    const map = new Map<string, ReviewComment[]>();
    if (state.status !== "success") return map;
    for (const c of state.review.comments) {
      const arr = map.get(c.file) ?? [];
      arr.push(c);
      map.set(c.file, arr);
    }
    return map;
  }, [state]);

  return (
    <Container className="max-w-[96rem] px-6">
      <PrHeader
        title={title}
        number={number}
        status={status}
        author={author}
        base={base}
        head={head}
        commits={commits}
        openedAt={openedAt}
        owner={owner}
        repo={repo}
        prNumber={prNumber}
        formAction={formAction}
        pending={pending}
        state={state}
      />

      <PrTabs
        active="files"
        counts={{
          conversation: conversationCount,
          commits,
          files: files.length,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[12rem_minmax(0,1fr)_16rem] gap-6 py-8">
        <FileTree files={files} />

        <div className="space-y-5 min-w-0">
          {files.map((f) => (
            <FileDiffCard
              key={f.filename}
              id={`f-${slug(f.filename)}`}
              filename={f.filename}
              status={f.status}
              additions={f.additions}
              deletions={f.deletions}
              patch={f.patch}
              comments={commentsByFile.get(f.filename) ?? []}
            />
          ))}
        </div>

        <PrSidebar
          base={base}
          head={head}
          files={files.length}
          additions={totals.add}
          deletions={totals.del}
        />
      </div>
    </Container>
  );
}
