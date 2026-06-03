import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { theme } from '../../theme';
import { Sheet } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { PRESET_REASONS } from '../../lib/reasons';
import { usePressable } from '../../hooks/usePressable';

export function ReasonPrompt({ amount, open, onClose, onConfirm }) {
  const [reason, setReason] = useState('');

  useEffect(() => { if (open) setReason(''); }, [open]);

  const confirm = () => {
    onConfirm(reason.trim());
    setReason('');
  };

  return (
    <Sheet open={open} onClose={onClose} title={amount ? `Grant ${amount} ${amount === 1 ? 'dollar' : 'dollars'}` : ''}>
      <div style={hintStyle}>What's it for? (optional)</div>

      <input
        type="text"
        placeholder="Custom reason…"
        value={reason}
        onChange={e => setReason(e.target.value)}
        autoFocus
        style={inputStyle}
      />

      <div style={chipsStyle}>
        {PRESET_REASONS.map(r => (
          <ReasonChip key={r} active={reason === r} onClick={() => setReason(r)}>{r}</ReasonChip>
        ))}
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={confirm}
        icon={<Check size={18} strokeWidth={2.5} />}
      >
        Grant {amount}
      </Button>
    </Sheet>
  );
}

function ReasonChip({ active, onClick, children }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button
      onClick={onClick}
      {...handlers}
      style={{
        ...chipStyle,
        ...pressedStyle,
        background: active ? theme.colors.accentSoft : theme.colors.surfaceAlt,
        color: active ? theme.colors.accentDark : theme.colors.text,
        fontWeight: active ? 600 : 500,
      }}
    >
      {children}
    </button>
  );
}

const hintStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textMuted,
  marginBottom: 10,
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  fontSize: theme.font.sizes.body,
  border: 'none',
  borderRadius: theme.radius.md,
  marginBottom: 12,
  boxSizing: 'border-box',
  fontFamily: theme.font.family,
  background: theme.colors.surfaceAlt,
  color: theme.colors.text,
  outline: 'none',
  WebkitAppearance: 'none',
};

const chipsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  marginBottom: 18,
};

const chipStyle = {
  padding: '8px 14px',
  borderRadius: theme.radius.pill,
  border: 'none',
  fontSize: theme.font.sizes.footnote,
  cursor: 'pointer',
  fontFamily: theme.font.family,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease, background 0.15s ease',
  minHeight: 36,
};
