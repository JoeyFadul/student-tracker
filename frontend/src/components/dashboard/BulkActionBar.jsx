import { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import { theme } from '../../theme';
import { Button } from '../ui/Button';
import { usePressable } from '../../hooks/usePressable';

const PRESET_AMOUNTS = [1, 5, 10];
const PRESET_REASONS = [
  'Kindness', 'Effort', 'Helping', 'Homework',
  'Participation', 'Listening', 'Cleanup', 'Teamwork',
];

export function BulkActionBar({ selectedCount, onCancel, onGrant }) {
  const [amount, setAmount] = useState(5);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (delta) => {
    if (busy || selectedCount === 0) return;
    setBusy(true);
    try {
      await onGrant(delta, reason);
      setReason('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={wrapStyle}>
      <div style={innerStyle}>
        <div style={topRowStyle}>
          <div>
            <div style={countStyle}>{selectedCount} selected</div>
            <div style={hintStyle}>Choose an amount and reason</div>
          </div>
          <CloseButton onClick={onCancel} />
        </div>

        <div style={amountRowStyle}>
          {PRESET_AMOUNTS.map(n => (
            <Chip key={n} active={amount === n} onClick={() => setAmount(n)}>{n}</Chip>
          ))}
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
            style={numberInputStyle}
          />
        </div>

        <input
          type="text"
          placeholder="Reason (optional)"
          value={reason}
          onChange={e => setReason(e.target.value)}
          style={reasonInputStyle}
        />

        <div style={reasonRowStyle}>
          {PRESET_REASONS.map(r => (
            <ReasonChip key={r} active={reason === r} onClick={() => setReason(r)}>{r}</ReasonChip>
          ))}
        </div>

        <div style={buttonRowStyle}>
          <Button
            variant="success"
            size="lg"
            fullWidth
            disabled={busy || selectedCount === 0}
            onClick={() => submit(amount)}
            icon={<Plus size={18} strokeWidth={2.5} />}
          >
            Grant {amount} to {selectedCount}
          </Button>
          <Button
            variant="dangerSoft"
            size="lg"
            disabled={busy || selectedCount === 0}
            onClick={() => submit(-amount)}
            icon={<Minus size={18} strokeWidth={2.5} />}
          >
            Revoke
          </Button>
        </div>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button
      onClick={onClick}
      {...handlers}
      style={{
        ...amountChipStyle,
        ...pressedStyle,
        background: active ? theme.colors.text : theme.colors.surfaceAlt,
        color: active ? '#fff' : theme.colors.text,
      }}
    >
      {children}
    </button>
  );
}

function ReasonChip({ active, onClick, children }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button
      onClick={onClick}
      {...handlers}
      style={{
        ...reasonChipStyle,
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

function CloseButton({ onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button onClick={onClick} {...handlers} style={{ ...closeBtnStyle, ...pressedStyle }} aria-label="Cancel">
      <X size={18} />
    </button>
  );
}

const wrapStyle = {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  background: theme.colors.surface,
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  boxShadow: theme.shadow.sheet,
  zIndex: 100,
  paddingBottom: theme.safeBottom,
};

const innerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: 20,
};

const topRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 16,
};

const countStyle = {
  fontSize: theme.font.sizes.title3,
  fontWeight: 700,
  color: theme.colors.text,
  letterSpacing: '-0.02em',
};

const hintStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textMuted,
  marginTop: 2,
};

const amountRowStyle = {
  display: 'flex',
  gap: 8,
  marginBottom: 12,
  alignItems: 'center',
};

const reasonInputStyle = {
  width: '100%',
  padding: '14px 16px',
  fontSize: theme.font.sizes.body,
  border: 'none',
  borderRadius: theme.radius.md,
  marginBottom: 10,
  boxSizing: 'border-box',
  fontFamily: theme.font.family,
  background: theme.colors.surfaceAlt,
  color: theme.colors.text,
  outline: 'none',
  WebkitAppearance: 'none',
};

const reasonRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  marginBottom: 16,
};

const amountChipStyle = {
  padding: '8px 18px',
  borderRadius: theme.radius.pill,
  border: 'none',
  fontSize: theme.font.sizes.body,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: theme.font.family,
  minHeight: 40,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease, background 0.15s ease',
};

const reasonChipStyle = {
  padding: '6px 12px',
  borderRadius: theme.radius.pill,
  border: 'none',
  fontSize: theme.font.sizes.footnote,
  cursor: 'pointer',
  fontFamily: theme.font.family,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease, background 0.15s ease',
};

const numberInputStyle = {
  width: 64,
  padding: '8px 12px',
  fontSize: theme.font.sizes.body,
  border: 'none',
  borderRadius: theme.radius.md,
  fontFamily: theme.font.family,
  background: theme.colors.surfaceAlt,
  outline: 'none',
  minHeight: 40,
  WebkitAppearance: 'none',
};

const closeBtnStyle = {
  background: theme.colors.surfaceAlt,
  border: 'none',
  cursor: 'pointer',
  color: theme.colors.textMuted,
  width: 36,
  height: 36,
  borderRadius: theme.radius.pill,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
  flexShrink: 0,
};

const buttonRowStyle = {
  display: 'flex',
  gap: 8,
};
