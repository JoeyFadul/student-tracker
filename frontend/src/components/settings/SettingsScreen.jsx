import { LogOut, Mail } from 'lucide-react';
import { theme } from '../../theme';
import { ScreenHeader } from '../ui/ScreenHeader';
import { usePressable } from '../../hooks/usePressable';

export function SettingsScreen({ email, onSignOut }) {
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <ScreenHeader title="Settings" />

        <div style={groupStyle}>
          {email && (
            <Row icon={<Mail size={18} color={theme.colors.textMuted} />} label="Signed in as" value={email} />
          )}
        </div>

        <SignOutRow onClick={onSignOut} />
      </div>
    </div>
  );
}

function Row({ icon, label, value }) {
  return (
    <div style={rowStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {icon}
        <div>
          <div style={{ fontSize: theme.font.sizes.footnote, color: theme.colors.textMuted }}>{label}</div>
          <div style={{ fontSize: theme.font.sizes.body, color: theme.colors.text, fontWeight: 500 }}>{value}</div>
        </div>
      </div>
    </div>
  );
}

function SignOutRow({ onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button
      onClick={onClick}
      {...handlers}
      style={{
        ...signOutStyle,
        ...pressedStyle,
      }}
    >
      <LogOut size={18} />
      <span>Sign out</span>
    </button>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: theme.colors.bg,
  fontFamily: theme.font.family,
};

const containerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: `20px 16px calc(${theme.tabBarHeight}px + 24px + ${theme.safeBottom})`,
};

const groupStyle = {
  background: theme.colors.surface,
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadow.md,
  marginBottom: 14,
  overflow: 'hidden',
};

const rowStyle = {
  padding: '16px 18px',
};

const signOutStyle = {
  width: '100%',
  background: theme.colors.surface,
  border: 'none',
  borderRadius: theme.radius.xl,
  padding: '16px 18px',
  boxShadow: theme.shadow.md,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  color: theme.colors.danger,
  fontSize: theme.font.sizes.body,
  fontWeight: 600,
  fontFamily: theme.font.family,
  cursor: 'pointer',
  transition: 'transform 0.1s ease',
  WebkitTapHighlightColor: 'transparent',
};
