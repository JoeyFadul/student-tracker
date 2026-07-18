import { LogOut } from 'lucide-react';
import { theme } from '../../theme';

export function DashboardHeader({ onSignOut }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
      <div>
        <div style={eyebrowStyle}>Well Done</div>
        <h1 style={titleStyle}>Class dashboard</h1>
      </div>
      <button onClick={onSignOut} title="Sign out" style={iconButtonStyle} aria-label="Sign out">
        <LogOut size={20} />
      </button>
    </div>
  );
}

const eyebrowStyle = {
  fontSize: 12,
  color: theme.colors.textFaint,
  textTransform: 'uppercase',
  letterSpacing: 1,
  marginBottom: 4,
  fontWeight: 500,
};

const titleStyle = {
  fontSize: 28,
  fontWeight: 700,
  color: theme.colors.text,
  margin: 0,
  lineHeight: 1.2,
};

const iconButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: theme.colors.textMuted,
  padding: 8,
};
