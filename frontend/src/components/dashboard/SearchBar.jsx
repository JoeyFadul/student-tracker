import { Search } from 'lucide-react';

export function SearchBar({ value, onChange, placeholder = 'Search students…' }) {
  return (
    <div style={{ position: 'relative', marginBottom: 16 }}>
      <Search size={18} color="#a8a29e" style={iconStyle} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

const iconStyle = {
  position: 'absolute',
  left: 14,
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
};

const inputStyle = {
  width: '100%',
  padding: '12px 12px 12px 42px',
  fontSize: 15,
  border: '1px solid #e7e2d8',
  borderRadius: 12,
  background: '#fff',
  boxSizing: 'border-box',
  outline: 'none',
  fontFamily: 'inherit',
};
