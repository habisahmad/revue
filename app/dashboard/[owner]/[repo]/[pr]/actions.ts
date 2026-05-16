'use server'

import { Octokit } from "@octokit/rest";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzePr, type Review } from "@/lib/claude";

export type AnalyzePrState =
  | { status: "idle" }
  | { status: "success"; review: Review }
  | { status: "error"; error: string };

export async function analyzePrAction(
  _prev: AnalyzePrState,
  formData: FormData,
): Promise<AnalyzePrState> {
  const session = await auth();
  if (!session?.user?.id) return { status: "error", error: "Not authenticated" };

  const owner = formData.get("owner") as string;
  const repo = formData.get("repo") as string;
  const prNumber = Number(formData.get("pr"));
  if (!owner || !repo || !prNumber) {
    return { status: "error", error: "Missing PR identifiers" };
  }

  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, provider: "github" },
  });
  if (!account) return { status: "error", error: "GitHub account not linked" };

  const octokit = new Octokit({ auth: account.access_token });

  try {
    const [{ data: prData }, files] = await Promise.all([
      octokit.rest.pulls.get({ owner, repo, pull_number: prNumber }),
      octokit.paginate(octokit.rest.pulls.listFiles, {
        owner,
        repo,
        pull_number: prNumber,
        per_page: 100,
      }),
    ]);

    const review = await analyzePr({
      title: prData.title,
      body: prData.body,
      files: files.map((f) => ({
        filename: f.filename,
        status: f.status,
        additions: f.additions,
        deletions: f.deletions,
        patch: f.patch,
      })),
    });

    return { status: "success", review };
  } catch (e) {
    return {
      status: "error",
      error: e instanceof Error ? e.message : "Failed to analyze PR",
    };
  }
}
