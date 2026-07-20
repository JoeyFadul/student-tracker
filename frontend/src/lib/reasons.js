export const PRESET_REASONS = [
  'Kindness', 'Effort', 'Helping', 'Homework',
  'Participation', 'Listening', 'Cleanup', 'Teamwork',
];

export const REASON_MAX_LEN = 50; // mirror the per-grant reason cap
export const REASON_MAX_COUNT = 30;

// Mirror of the server's PUT /reasons normalization: trim to the cap, drop
// blanks, de-dupe case-insensitively, preserve order. Used by the manage
// screen so the client and server agree on what a saved list becomes.
export function cleanReasons(list) {
  const seen = new Set();
  const out = [];
  for (const r of list || []) {
    const trimmed = String(r ?? '').trim().slice(0, REASON_MAX_LEN);
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(trimmed);
  }
  return out;
}
