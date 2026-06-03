import { LogOut, School, Calendar } from 'lucide-react';
import { theme } from '../../theme';
import { ScreenHeader } from '../ui/ScreenHeader';
import { SettingsRow } from './SettingsRow';
import { usePressable } from '../../hooks/usePressable';

export function SettingsScreen({
  onSignOut,
  activeClassroom,
  activeYearLabel,
  onOpenClassroom,
  onOpenSchoolYear,
}) {
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <ScreenHeader title="Settings" />

        <div style={groupStyle}>
          <SettingsRow
            icon={<School size={18} color={theme.colors.accentDark} />}
            label="Classroom"
            value={activeClassroom?.classroomName || '—'}
            onClick={onOpenClassroom}
            isFirst
            isLast={!activeClassroom}
          />
          {activeClassroom && (
            <SettingsRow
              icon={<Calendar size={18} color={theme.colors.accentDark} />}
              label="School year"
              value={activeYearLabel || 'No active year'}
              onClick={onOpenSchoolYear}
              isLast
            />
          )}
        </div>

        <SignOutRow onClick={onSignOut} />
      </div>
    </div>
  );
}

function SignOutRow({ onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button onClick={onClick} {...handlers} style={{ ...signOutStyle, ...pressedStyle }}>
      <LogOut size={18} />
      <span>Sign out</span>
    </button>
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

const groupStyle = {
  background: theme.colors.surface,
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadow.md,
  marginBottom: 18,
  overflow: 'hidden',
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
