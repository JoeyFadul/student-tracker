import { ArrowUpDown } from 'lucide-react';
import { theme } from '../../theme';
import { usePressable } from '../../hooks/usePressable';

export const SORT_OPTIONS = [
  { key: 'recent',     label: 'Recent' },
  { key: 'name',       label: 'A–Z' },
  { key: 'pointsDesc', label: 'High' },
  { key: 'pointsAsc',  label: 'Low' },
];

export function SortControl({ value, onChange }) {
  const current = SORT_OPTIONS.find(o => o.key === value) || SORT_OPTIONS[0];
  const { handlers, pressedStyle } = usePressable();

  const next = () => {
    const idx = SORT_OPTIONS.findIndex(o => o.key === value);
    onChange(SORT_OPTIONS[(idx + 1) % SORT_OPTIONS.length].key);
  };

  return (
    <button
      onClick={next}
      {...handlers}
      style={{
        ...buttonStyle,
        ...pressedStyle,
      }}
      title="Tap to cycle sort order"
    >
      <ArrowUpDown size={14} />
      <span>{current.label}</span>
    </button>
  );
}

export function sortStudents(students, key) {
  const copy = [...students];
  switch (key) {
    case 'name':       return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'pointsDesc': return copy.sort((a, b) => b.points - a.points);
    case 'pointsAsc':  return copy.sort((a, b) => a.points - b.points);
    case 'recent':
    default:           return copy.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }
}

const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '0 14px',
  borderRadius: theme.radius.pill,
  border: 'none',
  background: theme.colors.surfaceAlt,
  color: theme.colors.text,
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: theme.font.family,
  minHeight: 44,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
  flexShrink: 0,
};
