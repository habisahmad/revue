export type DiffLineKind = "ctx" | "add" | "del";

export type DiffLine = {
  kind: DiffLineKind;
  oldNum: number | null;
  newNum: number | null;
  content: string;
};

export type DiffHunk = {
  header: string;
  lines: DiffLine[];
};

const HUNK_RE = /@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/;

/**
 * Parse a unified diff `patch` string into hunks with per-line numbering.
 * Lines starting with `\` (e.g. "\ No newline at end of file") are skipped.
 */
export function parsePatch(patch: string): DiffHunk[] {
  const hunks: DiffHunk[] = [];
  let current: DiffHunk | null = null;
  let oldLine = 0;
  let newLine = 0;

  for (const raw of patch.split("\n")) {
    if (raw.startsWith("@@")) {
      const m = raw.match(HUNK_RE);
      if (m) {
        oldLine = Number(m[1]);
        newLine = Number(m[2]);
      }
      current = { header: raw, lines: [] };
      hunks.push(current);
      continue;
    }
    if (!current) continue;
    if (raw.startsWith("\\")) continue;

    if (raw.startsWith("+")) {
      current.lines.push({
        kind: "add",
        oldNum: null,
        newNum: newLine++,
        content: raw.slice(1),
      });
    } else if (raw.startsWith("-")) {
      current.lines.push({
        kind: "del",
        oldNum: oldLine++,
        newNum: null,
        content: raw.slice(1),
      });
    } else {
      current.lines.push({
        kind: "ctx",
        oldNum: oldLine++,
        newNum: newLine++,
        content: raw.slice(1),
      });
    }
  }

  return hunks;
}
