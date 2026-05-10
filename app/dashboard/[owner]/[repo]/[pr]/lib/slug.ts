export function slug(s: string): string {
  return s.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
}
