export function computeStreak(history) {
  const positive = (history || []).filter(e => e.delta > 0);
  if (positive.length === 0) return 0;
  const days = [...new Set(positive.map(e => e.timestamp.slice(0, 10)))].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let cursor;
  if (days[0] === today) cursor = today;
  else if (days[0] === yesterday) cursor = yesterday;
  else return 0;
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(new Date(cursor + 'T00:00:00Z').getTime() - 86400000).toISOString().slice(0, 10);
    if (days[i] !== prev) break;
    streak++; cursor = days[i];
  }
  return streak;
}
