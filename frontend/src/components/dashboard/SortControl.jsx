export const SORT_OPTIONS = [
  { key: 'recent',    label: 'Recently added' },
  { key: 'name',      label: 'Name (A-Z)' },
  { key: 'pointsDesc', label: 'Dollars (high)' },
  { key: 'pointsAsc',  label: 'Dollars (low)' },
];

export function SortControl({ value, onChange }) {
  return (
    <div style={rowStyle}>
      <span style={labelStyle}>Sort:</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={selectStyle}>
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

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 12,
};

const labelStyle = {
  fontSize: 13,
  color: '#78716c',
  fontWeight: 500,
};

const selectStyle = {
  padding: '6px 10px',
  fontSize: 14,
  border: '1px solid #e7e2d8',
  borderRadius: 8,
  background: '#fff',
  cursor: 'pointer',
  fontFamily: 'inherit',
  color: '#1c1917',
};
