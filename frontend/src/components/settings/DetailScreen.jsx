import { ChevronLeft } from 'lucide-react';
import { theme } from '../../theme';
import { usePressable } from '../../hooks/usePressable';

export function DetailScreen({ title, onBack, children }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <div style={pageStyle}>
      <div style={navBarStyle}>
        <button
          onClick={onBack}
          {...handlers}
          style={{ ...iconBtnStyle, ...pressedStyle }}
          aria-label="Back"
        >
          <ChevronLeft size={22} color={theme.colors.text} />
        </button>
        <div style={navTitleStyle}>{title}</div>
        <div style={{ width: 40 }} />
      </div>
      <div style={containerStyle}>
        {children}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: theme.colors.bg,
  fontFamily: theme.font.family,
};

const navBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: 720,
  margin: '0 auto',
  padding: '12px 12px 0',
};

const navTitleStyle = {
  fontSize: theme.font.sizes.heading,
  fontWeight: 600,
  color: theme.colors.text,
  letterSpacing: '-0.01em',
};

const iconBtnStyle = {
  background: theme.colors.surface,
  border: 'none',
  width: 40,
  height: 40,
  borderRadius: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: theme.shadow.sm,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
};

const containerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: `8px 16px calc(${theme.tabBarHeight}px + 24px + ${theme.safeBottom})`,
};
