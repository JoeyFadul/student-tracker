import { useEffect, useState } from 'react';
import { Check, Plus, Minus } from 'lucide-react';
import { theme } from '../../theme';
import { Sheet } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { PRESET_REASONS } from '../../lib/reasons';
import { usePressable } from '../../hooks/usePressable';

// onConfirm is always invoked with (delta, reason). For the 1/2/5 path
// allowRevoke is false and the single Grant button calls onConfirm(+amount).
// The custom-amount path passes allowRevoke=true and shows both Grant and
// Revoke buttons (calling with +amount or -amount respectively).
export function ReasonPrompt({ amount, allowRevoke = false, open, onClose, onConfirm }) {
  const [reason, setReason] = useState('');

  useEffect(() => { if (open) setReason(''); }, [open]);

  const submit = (delta) => {
    onConfirm(delta, reason.trim());
    setReason('');
  };

  const unit = amount === 1 ? 'dollar' : 'dollars';
  const title = allowRevoke
    ? (amount ? `Adjust ${amount} ${unit}` : '')
    : (amount ? `Grant ${amount} ${unit}` : '');

  return (
    <Sheet open={open} onClose={onClose} title={title}>
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

      {allowRevoke ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            variant="success"
            size="lg"
            fullWidth
            onClick={() => submit(amount)}
            icon={<Plus size={18} strokeWidth={2.5} />}
          >
            Grant
          </Button>
          <Button
            variant="dangerSoft"
            size="lg"
            fullWidth
            onClick={() => submit(-amount)}
            icon={<Minus size={18} strokeWidth={2.5} />}
          >
            Revoke
          </Button>
        </div>
      ) : (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => submit(amount)}
          icon={<Check size={18} strokeWidth={2.5} />}
        >
          Grant {amount}
        </Button>
      )}
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
