import { ChevronLeft } from 'lucide-react';
import { theme } from '../../theme';
import { AppHeader } from '../ui/AppHeader';
import { IconButton } from '../ui/IconButton';

export function DetailScreen({ title, onBack, children }) {
  return (
    <div style={pageStyle}>
      <AppHeader
        title={title}
        left={
          <IconButton
            onClick={onBack}
            ariaLabel="Back"
            icon={<ChevronLeft size={22} color={theme.colors.text} />}
          />
        }
      />
      <div style={containerStyle}>
        {children}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: 'transparent',
  fontFamily: theme.font.family,
};

const containerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: `20px 16px calc(${theme.tabBarHeight}px + 24px + ${theme.safeBottom})`,
};
