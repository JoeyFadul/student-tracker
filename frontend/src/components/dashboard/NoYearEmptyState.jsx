import { CalendarOff, ArrowRight } from 'lucide-react';
import { theme } from '../../theme';
import { Button } from '../ui/Button';

export function NoYearEmptyState({ onGoToSettings }) {
  return (
    <div style={wrapStyle}>
      <div style={iconCircleStyle}>
        <CalendarOff size={32} color={theme.colors.accentDark} />
      </div>
      <h2 style={titleStyle}>No active school year</h2>
      <p style={bodyStyle}>
        Start a school year to begin tracking dollars. Past years stay viewable as archives.
      </p>
      <Button
        variant="primary"
        size="lg"
        onClick={onGoToSettings}
        iconRight={<ArrowRight size={18} strokeWidth={2.5} />}
      >
        Go to Settings
      </Button>
    </div>
  );
}

const wrapStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '40px 24px',
  background: theme.colors.surface,
  borderRadius: theme.radius.xl,
  boxShadow: theme.shadow.md,
};

const iconCircleStyle = {
  width: 72,
  height: 72,
  borderRadius: 36,
  background: theme.colors.accentSoft,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 18,
};

const titleStyle = {
  fontSize: theme.font.sizes.title3,
  fontWeight: 700,
  color: theme.colors.text,
  margin: 0,
  letterSpacing: '-0.01em',
};

const bodyStyle = {
  fontSize: theme.font.sizes.body,
  color: theme.colors.textMuted,
  margin: '8px 0 22px',
  lineHeight: 1.5,
  maxWidth: 320,
};
