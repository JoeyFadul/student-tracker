import { ArrowRight } from 'lucide-react';
import { theme } from '../../theme';
import { Button } from '../ui/Button';

// Select-mode action bar (design-system kit): one full-width award button
// on a gunmetal frosted band; leaving select mode is the header's X.
export function BulkSelectFooter({ count, onContinue }) {
  return (
    <div style={wrapStyle}>
      <div style={innerStyle}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={count === 0}
          onClick={onContinue}
          iconRight={<ArrowRight size={18} strokeWidth={2.5} />}
        >
          Award to {count || '…'} {count === 1 ? 'student' : 'students'}
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
  zIndex: 60,
  paddingBottom: theme.safeBottomBar,
};

const innerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: 14,
};
