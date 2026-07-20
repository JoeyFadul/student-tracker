// "K" → "Kindergarten" (already a complete label).
// Anything else → "<value> grade", e.g. "3rd" → "3rd grade".
export function formatGrade(grade) {
  if (!grade) return '';
  if (grade === 'K') return 'Kindergarten';
  return `${grade} grade`;
}

// Shared by the Add and Edit student forms — grades the app can assign.
export const GRADE_OPTIONS = [
  { value: 'K', label: 'Kindergarten' },
  { value: '1st', label: '1st grade' },
  { value: '2nd', label: '2nd grade' },
  { value: '3rd', label: '3rd grade' },
  { value: '4th', label: '4th grade' },
  { value: '5th', label: '5th grade' },
];
