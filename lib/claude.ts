import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a senior code reviewer analyzing a GitHub pull request.

Review the diff and respond with ONLY a JSON object matching this exact shape:

{
  "verdict": "lgtm" | "changes_requested",
  "summary": string (one short sentence describing what the PR does),
  "comments": [
    {
      "file": string (must exactly match one of the file paths in the diff),
      "line": number (line number in the file the comment refers to),
      "side": "new" | "old" (use "new" for added or context lines, "old" for removed lines),
      "severity": "nit" | "suggestion" | "issue" | "blocker",
      "body": string (the review comment, 1-3 sentences)
    }
  ]
}

Rules:
- If the PR looks fine with nothing meaningful to flag, set "verdict" to "lgtm" and return an empty "comments" array.
- Only include comments for actual issues: bugs, security concerns, broken logic, real improvements. Do NOT nitpick style or add comments just to seem thorough.
- Line numbers must come from the diff's hunk headers (e.g. @@ -10,7 +12,8 @@) — count carefully.
- Respond with ONLY the JSON object. No markdown code fence, no preamble, no trailing text.`;

export type ReviewComment = {
  file: string;
  line: number;
  side: "new" | "old";
  severity: "nit" | "suggestion" | "issue" | "blocker";
  body: string;
};

export type Review = {
  verdict: "lgtm" | "changes_requested";
  summary: string;
  comments: ReviewComment[];
};

export type PrFileInput = {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
};

export type AnalyzePrInput = {
  title: string;
  body: string | null;
  files: PrFileInput[];
};

export async function analyzePr(input: AnalyzePrInput): Promise<Review> {
  const filesText = input.files
    .map((f) => {
      const header = `## ${f.filename} (${f.status}, +${f.additions} -${f.deletions})`;
      const body = f.patch
        ? "```diff\n" + f.patch + "\n```"
        : "_(no patch — binary or too large)_";
      return `${header}\n\n${body}`;
    })
    .join("\n\n");

  const userMessage = `# ${input.title}\n\n${input.body ?? "_(no description)_"}\n\n# Changed files\n\n${filesText}`;

  const stream = client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 64000,
    thinking: { type: "adaptive" },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const message = await stream.finalMessage();

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  const json = stripCodeFence(text);
  const parsed = JSON.parse(json);
  return validateReview(parsed);
}

function stripCodeFence(text: string): string {
  const fence = /^```(?:json)?\s*([\s\S]*?)\s*```$/;
  const match = text.match(fence);
  return match ? match[1].trim() : text;
}

function validateReview(value: unknown): Review {
  if (typeof value !== "object" || value === null) {
    throw new Error("Review response was not an object");
  }
  const v = value as Record<string, unknown>;
  if (v.verdict !== "lgtm" && v.verdict !== "changes_requested") {
    throw new Error(`Invalid verdict: ${String(v.verdict)}`);
  }
  if (typeof v.summary !== "string") {
    throw new Error("Missing summary");
  }
  if (!Array.isArray(v.comments)) {
    throw new Error("Missing comments array");
  }
  return {
    verdict: v.verdict,
    summary: v.summary,
    comments: v.comments as ReviewComment[],
  };
}
