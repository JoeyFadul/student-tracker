import { Search, X } from 'lucide-react';
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
        style={{ ...inputStyle, paddingRight: value ? 44 : 14 }}
      />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Clear search" style={clearStyle}>
          <X size={16} color={theme.colors.textMuted} />
        </button>
      )}
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

const clearStyle = {
  position: 'absolute',
  right: 0,
  top: 0,
  height: '100%',
  width: 42,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  borderRadius: theme.radius.pill,
  WebkitTapHighlightColor: 'transparent',
};
