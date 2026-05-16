import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Octokit } from "@octokit/rest";

import { PrTopbar } from "./components/pr-topbar";
import { PrShell } from "./components/pr-shell";
import type { PrStatus } from "./components/status-pill";

type Params = { owner: string; repo: string; pr: string };

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { owner, repo, pr } = await params;

  const session = await auth();
  if (!session) redirect("/");

  const account = await prisma.account.findFirst({
    where: { userId: session.user?.id, provider: "github" },
  });
  if (!account) redirect("/");

  const octokit = new Octokit({ auth: account.access_token });

  const [{ data: prData }, files] = await Promise.all([
    octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: Number(pr),
    }),
    octokit.paginate(octokit.rest.pulls.listFiles, {
      owner,
      repo,
      pull_number: Number(pr),
      per_page: 100,
    }),
  ]);

  const status: PrStatus = prData.draft
    ? "draft"
    : prData.merged_at
      ? "merged"
      : prData.state === "closed"
        ? "closed"
        : "open";

  const totals = files.reduce(
    (acc, f) => {
      acc.add += f.additions;
      acc.del += f.deletions;
      return acc;
    },
    { add: 0, del: 0 }
  );

  const filesProp = files.map((f) => ({
    filename: f.filename,
    status: f.status,
    additions: f.additions,
    deletions: f.deletions,
    patch: f.patch,
  }));

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-white">
      <PrTopbar owner={owner} repo={repo} prNumber={pr} />

      <PrShell
        owner={owner}
        repo={repo}
        prNumber={pr}
        title={prData.title}
        number={prData.number}
        status={status}
        author={{
          login: prData.user?.login ?? "unknown",
          avatarUrl: prData.user?.avatar_url ?? null,
        }}
        base={prData.base.ref}
        head={prData.head.ref}
        commits={prData.commits}
        openedAt={prData.created_at}
        conversationCount={prData.comments + prData.review_comments}
        files={filesProp}
        totals={totals}
      />
    </div>
  );
}
