import { ArrowRight } from 'lucide-react';
import { theme } from '../../theme';
import { Button } from '../ui/Button';

export function BulkSelectFooter({ count, onCancel, onContinue }) {
  return (
    <div style={wrapStyle}>
      <div style={innerStyle}>
        <Button variant="outline" size="lg" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={count === 0}
          onClick={onContinue}
          iconRight={<ArrowRight size={18} strokeWidth={2.5} />}
        >
          Continue · {count}
        </Button>
      </div>
    </div>
  );
}

const wrapStyle = {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  background: theme.colors.surfaceTranslucent,
  backdropFilter: 'saturate(180%) blur(20px)',
  WebkitBackdropFilter: 'saturate(180%) blur(20px)',
  borderTop: `1px solid ${theme.colors.onDarkBorder}`,
  borderTopLeftRadius: theme.radius.sheet,
  borderTopRightRadius: theme.radius.sheet,
  zIndex: 60,
  paddingBottom: theme.safeBottom,
};

const innerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: 14,
  display: 'flex',
  gap: 10,
  alignItems: 'center',
};
