// Decode a JWT's payload without verifying it (client-side display only —
// the server verifies signatures). JWT segments are base64url, which atob
// does not accept directly: translate the alphabet and repad first.
export function decodeJwtPayload(token) {
  try {
    const seg = token.split('.')[1];
    const b64 = seg.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}
