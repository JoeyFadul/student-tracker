import { theme } from '../../theme';

export function FullPageMessage({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      color: theme.colors.textMuted,
      fontFamily: theme.font.family,
    }}>
      {children}
    </div>
  );
}
