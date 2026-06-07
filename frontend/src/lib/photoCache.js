// Stabilizes presigned photo URLs across API responses within a session.
//
// The API returns a fresh presigned URL on every call (different signature,
// different X-Amz-Date). The image bytes are identical, but to the browser
// each URL is a separate cache key — so dashboard → profile → dashboard would
// re-download the same photo three times. We key by the S3 object path (the
// bit before `?`) and reuse the first URL we saw for a window, so all those
// renders share one HTTP cache entry.

const cache = new Map(); // s3Path → { url, expires }
const WINDOW_MS = 60 * 60 * 1000; // 1 hour, well under the backend's 8h sign TTL

function pathFromUrl(url) {
  try { return new URL(url).pathname; } catch { return null; }
}

// Returns the canonical URL to display for a given (potentially fresh)
// presigned URL. Non-http values (emoji avatars, empty strings) pass through.
export function resolvePhotoUrl(maybePresignedUrl) {
  if (!maybePresignedUrl || typeof maybePresignedUrl !== 'string') return maybePresignedUrl;
  if (!maybePresignedUrl.startsWith('http')) return maybePresignedUrl;

  const path = pathFromUrl(maybePresignedUrl);
  if (!path) return maybePresignedUrl;

  const now = Date.now();
  const cached = cache.get(path);
  if (cached && cached.expires > now) return cached.url;

  cache.set(path, { url: maybePresignedUrl, expires: now + WINDOW_MS });
  return maybePresignedUrl;
}

// Drop a specific path from the cache — call after a photo upload so the next
// render picks up the new S3 key. (The new upload uses a random suffix in the
// key, so the path is naturally different and this is mostly defensive.)
export function invalidatePhotoUrl(presignedUrl) {
  const path = pathFromUrl(presignedUrl);
  if (path) cache.delete(path);
}
