'use server'

import { prisma } from "@/lib/prisma";
import { Octokit } from "@octokit/rest";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export type RequestReviewState = { success: boolean; error?: string; repoOwner?: string; repoName?: string; prNumber?: string } | null;

export async function requestReview(
  _prev: RequestReviewState,
  formData: FormData,
): Promise<RequestReviewState> {
  const session = await auth();
  if (!session) redirect("/");

  const account = await prisma.account.findFirst({
    where: {
      userId: session?.user?.id,
      provider: "github",
    },
  })

  if (!account) {
    return { success: false, error: "GitHub account not found" }
  }

  const octokit = new Octokit({
    auth: account?.access_token,
  })

  const prLink = formData.get('prLink') as string;
  const match = prLink.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/)
  if (!match) {
    return { success: false, error: "Invalid PR link" }
  }
  const [, repoOwner, repoName, prNumber] = match;

  try {
    await octokit.rest.pulls.get({
      owner: repoOwner,
      repo: repoName,
      pull_number: parseInt(prNumber),
    })
  } catch {
    return { success: false, error: "PR not found" }
  }
  return { success: true, repoOwner: repoOwner, repoName: repoName, prNumber: prNumber }
}
