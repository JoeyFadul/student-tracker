import { ChevronLeft } from 'lucide-react';
import { theme } from '../../theme';
import { AppHeader } from '../ui/AppHeader';
import { usePressable } from '../../hooks/usePressable';

export function DetailScreen({ title, onBack, children }) {
  return (
    <div style={pageStyle}>
      <AppHeader
        title={title}
        left={<BackButton onClick={onBack} />}
      />
      <div style={containerStyle}>
        {children}
      </div>
    </div>
  );
}

function BackButton({ onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button
      onClick={onClick}
      {...handlers}
      style={{ ...iconBtnStyle, ...pressedStyle }}
      aria-label="Back"
    >
      <ChevronLeft size={22} color={theme.colors.headerDarkText} />
    </button>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: 'transparent',
  fontFamily: theme.font.family,
};

const iconBtnStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: 'none',
  width: 36,
  height: 36,
  borderRadius: 18,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
};

const containerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: `20px 16px calc(${theme.tabBarHeight}px + 24px + ${theme.safeBottom})`,
};
