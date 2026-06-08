import { useState } from 'react';
import { LogOut, School, Calendar, Trash2, FileText, ShieldCheck } from 'lucide-react';
import { theme } from '../../theme';
import { AppHeader } from '../ui/AppHeader';
import { SettingsRow } from './SettingsRow';
import { DeleteAccountModal } from './DeleteAccountModal';
import { usePressable } from '../../hooks/usePressable';

export function SettingsScreen({
  onSignOut,
  email,
  activeClassroom,
  activeYearLabel,
  onOpenClassroom,
  onOpenSchoolYear,
  onDeleteAccount,
}) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div style={pageStyle}>
      <AppHeader title="Settings" />
      <div style={containerStyle}>
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

        {/* Legal — opens in the same window as full pages */}
        <div style={groupStyle}>
          <SettingsRow
            icon={<ShieldCheck size={18} color={theme.colors.textMuted} />}
            label="Privacy Policy"
            onClick={() => window.open('/privacy', '_blank')}
            isFirst
          />
          <SettingsRow
            icon={<FileText size={18} color={theme.colors.textMuted} />}
            label="Terms of Service"
            onClick={() => window.open('/terms', '_blank')}
            isLast
          />
        </div>

        <SignOutRow onClick={onSignOut} />

        <DeleteAccountRow onClick={() => setShowDelete(true)} />
      </div>

      {showDelete && (
        <DeleteAccountModal
          email={email}
          onClose={() => setShowDelete(false)}
          onConfirm={onDeleteAccount}
        />
      )}
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

function DeleteAccountRow({ onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button onClick={onClick} {...handlers} style={{ ...deleteAccountStyle, ...pressedStyle }}>
      <Trash2 size={18} />
      <span>Delete account</span>
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
  marginBottom: 12,
};

const deleteAccountStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderRadius: theme.radius.xl,
  padding: '14px 18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  color: theme.colors.danger,
  fontSize: theme.font.sizes.footnote,
  fontWeight: 500,
  fontFamily: theme.font.family,
  cursor: 'pointer',
  transition: 'transform 0.1s ease, background 0.15s ease',
  WebkitTapHighlightColor: 'transparent',
  opacity: 0.85,
};
