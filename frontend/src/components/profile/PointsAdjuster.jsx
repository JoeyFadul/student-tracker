import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { theme } from '../../theme';
import { Sheet } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { usePressable } from '../../hooks/usePressable';

const PRESET_AMOUNTS = [1, 5, 10];
const PRESET_REASONS = [
  'Kindness', 'Effort', 'Helping', 'Homework',
  'Participation', 'Listening', 'Cleanup', 'Teamwork',
];

export function PointsAdjuster({ open, onClose, onAdjust }) {
  const [amount, setAmount] = useState(5);
  const [reason, setReason] = useState('');

  const handleAdjust = (delta) => {
    onAdjust(delta, reason);
    setReason('');
  };

  return (
    <Sheet open={open} onClose={onClose} title="Adjust dollars">
      <div style={amountRowStyle}>
        {PRESET_AMOUNTS.map(n => (
          <AmountChip key={n} active={amount === n} onClick={() => setAmount(n)}>{n}</AmountChip>
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

      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="success" size="lg" fullWidth onClick={() => handleAdjust(amount)} icon={<Plus size={18} strokeWidth={2.5} />}>
          Grant
        </Button>
        <Button variant="dangerSoft" size="lg" fullWidth onClick={() => handleAdjust(-amount)} icon={<Minus size={18} strokeWidth={2.5} />}>
          Revoke
        </Button>
      </div>
    </Sheet>
  );
}

function AmountChip({ active, onClick, children }) {
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
  marginBottom: 18,
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
