import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { theme } from '../../theme';

export const SORT_OPTIONS = [
  { key: 'recent',     label: 'Recent' },
  { key: 'name',       label: 'A–Z' },
  { key: 'pointsDesc', label: 'High' },
  { key: 'pointsAsc',  label: 'Low' },
];

export function SortControl({ value, onChange }) {
  const current = SORT_OPTIONS.find(o => o.key === value) || SORT_OPTIONS[0];

  return (
    <div style={wrapStyle}>
      <ArrowUpDown size={14} color={theme.colors.text} style={{ pointerEvents: 'none' }} />
      <span style={labelStyle}>{current.label}</span>
      <ChevronDown size={14} color={theme.colors.textMuted} style={{ pointerEvents: 'none' }} />
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={selectOverlayStyle}
        aria-label="Sort students"
      >
        {SORT_OPTIONS.map(o => (
          <option key={o.key} value={o.key}>{o.label}</option>
        ))}
      </select>
    </div>
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

const wrapStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '0 12px',
  borderRadius: theme.radius.pill,
  background: theme.colors.surfaceAlt,
  minHeight: 44,
  flexShrink: 0,
};

const labelStyle = {
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
  color: theme.colors.text,
  fontFamily: theme.font.family,
};

const selectOverlayStyle = {
  position: 'absolute',
  inset: 0,
  opacity: 0,
  cursor: 'pointer',
  fontFamily: theme.font.family,
  fontSize: theme.font.sizes.body,
  WebkitAppearance: 'none',
  appearance: 'none',
  border: 'none',
  background: 'transparent',
};
