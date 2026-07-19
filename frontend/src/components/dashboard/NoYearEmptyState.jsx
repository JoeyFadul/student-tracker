import { CalendarOff, ArrowRight } from 'lucide-react';
import { theme } from '../../theme';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export function NoYearEmptyState({ onGoToSettings }) {
  return (
    <EmptyState
      icon={<CalendarOff size={32} color={theme.colors.accentDark} />}
      title="No active school year"
      hint="Start a school year to begin tracking points. Past years stay viewable as archives."
      action={
        <Button
          variant="primary"
          size="lg"
          onClick={onGoToSettings}
          iconRight={<ArrowRight size={18} strokeWidth={2.5} />}
        >
          Go to Settings
        </Button>
      }
    />
  );
}
