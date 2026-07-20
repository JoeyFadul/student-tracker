// Activity rows credit a co-teacher only when someone OTHER than the current
// viewer granted the points. Single-teacher rooms and your own grants show
// nothing, so no member-count lookup is needed. Returns the email's local-part
// (before "@") as a compact, recognizable name, or null to show nothing.
// Legacy events with no grantedBy return null.
export function attributionLabel(grantedBy, currentUserEmail) {
  if (!grantedBy) return null;
  const by = String(grantedBy).toLowerCase();
  const me = String(currentUserEmail || '').toLowerCase();
  if (by === me) return null;
  const at = grantedBy.indexOf('@');
  return at > 0 ? grantedBy.slice(0, at) : grantedBy;
}
