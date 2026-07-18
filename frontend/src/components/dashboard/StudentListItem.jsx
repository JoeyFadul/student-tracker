import { Check, Flame, ChevronRight } from 'lucide-react';
import { theme } from '../../theme';
import { Avatar } from '../ui/Avatar';
import { usePressable } from '../../hooks/usePressable';

export function StudentListItem({ student, onClick, selectable, selected }) {
  const { handlers, pressedStyle } = usePressable();

  return (
    <button
      onClick={() => onClick(student.id)}
      {...handlers}
      style={{
        ...itemStyle,
        ...pressedStyle,
        boxShadow: selected ? `0 0 0 2px ${theme.colors.accent}, ${theme.shadow.sm}` : theme.shadow.sm,
      }}
    >
      {selectable && (
        <div style={getCheckboxStyle(selected)}>
          {selected && <Check size={14} color="#fff" strokeWidth={3} />}
        </div>
      )}
      <Avatar student={student} size={56} emojiSize={30} />
      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <div style={nameStyle}>{student.name}</div>
        <div style={subRowStyle}>
          {student.streak > 1 && (
            <span style={streakChipStyle}>
              <Flame size={12} color={theme.colors.danger} />
              <span style={{ fontSize: theme.font.sizes.caption, color: theme.colors.danger, fontWeight: 700 }}>{student.streak}</span>
            </span>
          )}
        </div>
      </div>
      <div style={pointsWrapStyle}>
        <div style={pointsStyle}>{student.points}</div>
        <div style={pointsLabelStyle}>points</div>
      </div>
      {!selectable && <ChevronRight size={18} color={theme.colors.textFaint} />}
    </button>
  );
}

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 14px 14px 16px',
  background: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.xl,
  cursor: 'pointer',
  width: '100%',
  fontFamily: theme.font.family,
  transition: 'transform 0.1s ease, box-shadow 0.15s ease',
  WebkitTapHighlightColor: 'transparent',
};

const nameStyle = {
  fontSize: theme.font.sizes.heading,
  fontWeight: 600,
  color: theme.colors.text,
  marginBottom: 4,
  letterSpacing: '-0.01em',
};

const subRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const streakChipStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 3,
};

const pointsWrapStyle = {
  textAlign: 'right',
  flexShrink: 0,
};

const pointsStyle = {
  fontSize: theme.font.sizes.title3,
  fontWeight: 800,
  color: theme.colors.text,
  lineHeight: 1,
  letterSpacing: '-0.025em',
  fontFamily: theme.font.display,
};

const pointsLabelStyle = {
  fontSize: theme.font.sizes.caption,
  color: theme.colors.textFaint,
  marginTop: 3,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
  fontWeight: 500,
};

const getCheckboxStyle = (selected) => ({
  width: 22,
  height: 22,
  borderRadius: 7,
  border: selected ? `2px solid ${theme.colors.accent}` : `2px solid ${theme.colors.border}`,
  background: selected ? theme.colors.accent : theme.colors.surface,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});
