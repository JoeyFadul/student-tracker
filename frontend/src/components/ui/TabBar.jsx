import { theme } from '../../theme';
import { usePressable } from '../../hooks/usePressable';

export function TabBar({ active, onChange, tabs }) {
  return (
    <nav style={wrapStyle}>
      <div style={innerStyle}>
        {tabs.map(tab => (
          <TabButton
            key={tab.key}
            tab={tab}
            active={tab.key === active}
            onClick={() => onChange(tab.key)}
          />
        ))}
      </div>
    </nav>
  );
}

function TabButton({ tab, active, onClick }) {
  const { handlers, pressedStyle } = usePressable();
  const Icon = tab.icon;
  const color = active ? theme.colors.accent : theme.colors.textMuted;
  return (
    <button
      onClick={onClick}
      {...handlers}
      style={{
        ...buttonStyle,
        ...pressedStyle,
        color,
      }}
    >
      <Icon size={24} strokeWidth={active ? 2.4 : 2} />
      <span style={{ fontSize: 11, fontWeight: active ? 600 : 500, marginTop: 2 }}>
        {tab.label}
      </span>
    </button>
  );
}

const wrapStyle = {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(255, 255, 255, 0.92)',
  backdropFilter: 'saturate(180%) blur(20px)',
  WebkitBackdropFilter: 'saturate(180%) blur(20px)',
  borderTop: `1px solid ${theme.colors.border}`,
  zIndex: 50,
  paddingBottom: theme.safeBottom,
};

const innerStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'stretch',
  maxWidth: 720,
  margin: '0 auto',
  height: theme.tabBarHeight,
};

const buttonStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontFamily: theme.font.family,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease, color 0.15s ease',
};
