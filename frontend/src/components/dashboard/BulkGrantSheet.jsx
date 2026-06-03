import { useState, useEffect } from 'react';
import { Plus, Minus, ChevronLeft } from 'lucide-react';
import { theme } from '../../theme';
import { Sheet } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { DEFAULT_AVATAR } from '../../lib/avatars';
import { getTier } from '../../lib/tiers';
import { PRESET_REASONS } from '../../lib/reasons';
import { usePressable } from '../../hooks/usePressable';

const PRESET_AMOUNTS = [1, 5, 10];

export function BulkGrantSheet({ open, selected, onBack, onGrant }) {
  const [amount, setAmount] = useState(5);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (open) { setAmount(5); setReason(''); } }, [open]);

  const submit = async (delta) => {
    if (busy || selected.length === 0) return;
    setBusy(true);
    try {
      await onGrant(delta, reason);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet open={open} onClose={onBack} title={`Reward ${selected.length} ${selected.length === 1 ? 'student' : 'students'}`}>
      <button onClick={onBack} style={backLinkStyle}>
        <ChevronLeft size={16} /> Change selection
      </button>

      <div style={previewWrapStyle}>
        {selected.slice(0, 8).map(s => (
          <StudentPill key={s.id} student={s} />
        ))}
        {selected.length > 8 && (
          <div style={overflowChipStyle}>+{selected.length - 8} more</div>
        )}
      </div>

      <div style={sectionLabelStyle}>Amount</div>
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

      <div style={sectionLabelStyle}>Reason</div>
      <input
        type="text"
        placeholder="Custom reason…"
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
          variant="dangerSoft"
          size="lg"
          disabled={busy}
          onClick={() => submit(-amount)}
          icon={<Minus size={18} strokeWidth={2.5} />}
        >
          Revoke
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={busy}
          onClick={() => submit(amount)}
          icon={<Plus size={18} strokeWidth={2.5} />}
        >
          Grant {amount} to {selected.length}
        </Button>
      </div>
    </Sheet>
  );
}

function StudentPill({ student }) {
  const tier = getTier(student.points);
  const isPhotoUrl = student.photo?.startsWith('http');
  return (
    <div style={pillStyle}>
      <div style={{ ...pillAvatarStyle, background: tier.bg }}>
        {isPhotoUrl
          ? <img src={student.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 14 }}>{student.photo || DEFAULT_AVATAR}</span>
        }
      </div>
      <span style={pillNameStyle}>{student.name.split(' ')[0]}</span>
    </div>
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

const backLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  background: 'transparent',
  border: 'none',
  color: theme.colors.accentDark,
  fontSize: theme.font.sizes.footnote,
  fontWeight: 500,
  cursor: 'pointer',
  padding: '0 0 12px',
  fontFamily: theme.font.family,
  WebkitTapHighlightColor: 'transparent',
};

const previewWrapStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  marginBottom: 16,
  padding: 12,
  background: theme.colors.surfaceAlt,
  borderRadius: theme.radius.md,
};

const pillStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 10px 4px 4px',
  background: theme.colors.surface,
  borderRadius: theme.radius.pill,
  boxShadow: theme.shadow.sm,
};

const pillAvatarStyle = {
  width: 24,
  height: 24,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  flexShrink: 0,
};

const pillNameStyle = {
  fontSize: theme.font.sizes.footnote,
  fontWeight: 500,
  color: theme.colors.text,
  maxWidth: 80,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const overflowChipStyle = {
  padding: '4px 10px',
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
  color: theme.colors.textMuted,
  background: theme.colors.surface,
  borderRadius: theme.radius.pill,
  display: 'flex',
  alignItems: 'center',
};

const sectionLabelStyle = {
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
  color: theme.colors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 8,
  marginTop: 4,
};

const amountRowStyle = {
  display: 'flex',
  gap: 8,
  marginBottom: 16,
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

const buttonRowStyle = {
  display: 'flex',
  gap: 8,
};
