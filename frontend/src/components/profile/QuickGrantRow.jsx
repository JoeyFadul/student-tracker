import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { theme } from '../../theme';
import { usePressable } from '../../hooks/usePressable';
import { ReasonPrompt } from './ReasonPrompt';
import { CustomAmountSheet } from '../ui/CustomAmountSheet';

const QUICK_AMOUNTS = [1, 2, 5];

export function QuickGrantRow({ onQuickGrant }) {
  // pendingAmount drives the ReasonPrompt; the prompt always offers the
  // Award/Revoke toggle regardless of which entry path set the amount.
  const [pendingAmount, setPendingAmount] = useState(null);
  const [customOpen, setCustomOpen] = useState(false);

  const confirm = (delta, reason) => {
    onQuickGrant(delta, reason);
    setPendingAmount(null);
  };

  const handleCustomAmount = (n) => {
    setCustomOpen(false);
    setPendingAmount(n);
  };

  return (
    <>
      <div style={wrapStyle}>
        {QUICK_AMOUNTS.map(n => (
          <QuickButton
            key={n}
            amount={n}
            onClick={() => setPendingAmount(n)}
          />
        ))}
        <MoreButton onClick={() => setCustomOpen(true)} />
      </div>

      <CustomAmountSheet
        open={customOpen}
        onClose={() => setCustomOpen(false)}
        onConfirm={handleCustomAmount}
      />

      <ReasonPrompt
        amount={pendingAmount}
        allowRevoke
        open={pendingAmount !== null}
        onClose={() => setPendingAmount(null)}
        onConfirm={confirm}
      />
    </>
  );
}

function QuickButton({ amount, onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button onClick={onClick} {...handlers} style={{ ...buttonStyle, ...pressedStyle }}>
      {amount}
    </button>
  );
}

function MoreButton({ onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button
      onClick={onClick}
      {...handlers}
      style={{ ...moreButtonStyle, ...pressedStyle }}
      aria-label="Custom amount"
    >
      <MoreHorizontal size={20} color={theme.colors.text} />
    </button>
  );
}

const wrapStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 8,
  marginBottom: 18,
};

const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.colors.accent,
  color: '#fff',
  border: 'none',
  borderRadius: theme.radius.lg,
  padding: '14px 0',
  fontSize: theme.font.sizes.heading,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: theme.font.family,
  minHeight: 56,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease, background 0.15s ease',
  boxShadow: '0 2px 6px rgba(228, 87, 46, 0.24)',
};

const moreButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.colors.surface,
  border: 'none',
  borderRadius: theme.radius.lg,
  padding: '14px 0',
  cursor: 'pointer',
  fontFamily: theme.font.family,
  minHeight: 56,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
  boxShadow: theme.shadow.md,
};
