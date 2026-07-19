import { ChevronRight } from 'lucide-react';
import { theme } from '../../theme';
import { usePressable } from '../../hooks/usePressable';

export function SettingsRow({ icon, label, value, onClick, isFirst, isLast }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button
      onClick={onClick}
      {...handlers}
      style={{
        ...rowStyle,
        ...pressedStyle,
        borderTopLeftRadius: isFirst ? theme.radius.xl : 0,
        borderTopRightRadius: isFirst ? theme.radius.xl : 0,
        borderBottomLeftRadius: isLast ? theme.radius.xl : 0,
        borderBottomRightRadius: isLast ? theme.radius.xl : 0,
        borderBottom: isLast ? 'none' : `1px solid ${theme.colors.border}`,
      }}
    >
      <div style={iconWrapStyle}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <div style={labelStyle}>{label}</div>
        {value && <div style={valueStyle}>{value}</div>}
      </div>
      <ChevronRight size={18} color={theme.colors.textFaint} />
    </button>
  );
}

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '14px 16px',
  background: theme.colors.surface,
  border: 'none',
  cursor: 'pointer',
  width: '100%',
  fontFamily: theme.font.family,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
};

const iconWrapStyle = {
  width: 36,
  height: 36,
  borderRadius: 12,
  background: theme.colors.slateSoft,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const labelStyle = {
  fontSize: theme.font.sizes.body,
  fontWeight: 600,
  color: theme.colors.text,
  letterSpacing: '-0.005em',
};

const valueStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textMuted,
  marginTop: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};
