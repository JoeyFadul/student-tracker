import { Search } from 'lucide-react';
import { theme } from '../../theme';

export function SearchBar({ value, onChange, placeholder = 'Search students…' }) {
  return (
    <div style={wrapStyle}>
      <Search size={18} color={theme.colors.textFaint} style={iconStyle} />
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

const wrapStyle = {
  position: 'relative',
  flex: 1,
};

const iconStyle = {
  position: 'absolute',
  left: 14,
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px 12px 42px',
  fontSize: theme.font.sizes.body,
  border: 'none',
  borderRadius: theme.radius.pill,
  background: theme.colors.surfaceAlt,
  color: theme.colors.text,
  boxSizing: 'border-box',
  outline: 'none',
  fontFamily: theme.font.family,
  minHeight: 44,
  WebkitAppearance: 'none',
};
