// Split a pasted roster into clean student names: one per line, trimmed,
// blank lines dropped. Duplicates are kept — a teacher's list may legitimately
// repeat a first name, and we don't second-guess it. Newline-only (never split
// on commas) so a "Last, First" line stays a single name.
export function parseRoster(text) {
  return String(text || '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}
