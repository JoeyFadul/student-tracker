// "K" → "Kindergarten" (already a complete label).
// Anything else → "<value> grade", e.g. "3rd" → "3rd grade".
export function formatGrade(grade) {
  if (!grade) return '';
  if (grade === 'K') return 'Kindergarten';
  return `${grade} grade`;
}
