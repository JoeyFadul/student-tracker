// Activity rows always credit the granter: co-teachers by the email's
// local-part (compact, recognizable), the viewer's own grants as "you" so a
// fresh grant reads the same as everyone else's (history is a ledger of who
// did what). Legacy events written before grantedBy existed return null and
// render without attribution. Comparison is case-insensitive; an unknown
// viewer email falls back to naming the granter.
export function attributionLabel(grantedBy, currentUserEmail) {
  if (!grantedBy) return null;
  const by = String(grantedBy).toLowerCase();
  const me = String(currentUserEmail || '').toLowerCase();
  if (me && by === me) return 'you';
  const at = grantedBy.indexOf('@');
  return at > 0 ? grantedBy.slice(0, at) : grantedBy;
}
