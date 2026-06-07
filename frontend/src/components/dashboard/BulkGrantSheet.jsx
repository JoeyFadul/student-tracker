import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { theme } from '../../theme';
import { Sheet } from '../ui/Sheet';
import { CustomAmountSheet } from '../ui/CustomAmountSheet';
import { ReasonPicker } from '../profile/ReasonPicker';
import { DEFAULT_AVATAR } from '../../lib/avatars';
import { getTier } from '../../lib/tiers';
import { usePressable } from '../../hooks/usePressable';

const PRESET_AMOUNTS = [1, 2, 5];

export function BulkGrantSheet({ open, selected, onBack, onGrant }) {
  const [amount, setAmount] = useState(2);
  const [busy, setBusy] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  const isPreset = PRESET_AMOUNTS.includes(amount);

  useEffect(() => { if (open) { setAmount(2); } }, [open]);

  const submit = async (delta, reason) => {
    if (busy || selected.length === 0) return;
    setBusy(true);
    try {
      await onGrant(delta, reason);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet
      open={open}
      onClose={onBack}
      title={`Reward ${selected.length} ${selected.length === 1 ? 'student' : 'students'}`}
    >
      <button onClick={onBack} style={backLinkStyle}>
        <ChevronLeft size={16} /> Change selection
      </button>

      <StudentStrip selected={selected} />

      <div style={sectionLabelStyle}>Amount</div>
      <div style={amountRowStyle}>
        {PRESET_AMOUNTS.map(n => (
          <AmountChip key={n} active={amount === n} onClick={() => setAmount(n)}>{n}</AmountChip>
        ))}
        <CustomChip active={!isPreset} onClick={() => setShowCustom(true)}>
          {isPreset ? 'Custom' : amount}
        </CustomChip>
      </div>

      <div style={sectionLabelStyle}>Why?</div>
      <ReasonPicker amount={amount} allowRevoke={true} onSubmit={submit} />

      <CustomAmountSheet
        open={showCustom}
        initial={isPreset ? '' : amount}
        onClose={() => setShowCustom(false)}
        onConfirm={(n) => { setAmount(n); setShowCustom(false); }}
      />
    </Sheet>
  );
}

// Single-line horizontal strip of selected students. Overlapping avatars
// + an overflow count is a much smaller surface than the wrapping pill
// block this replaced, which is the bulk of why the bulk sheet felt tall.
function StudentStrip({ selected }) {
  const MAX = 6;
  const overflow = Math.max(0, selected.length - MAX);
  const shown = selected.slice(0, MAX);
  return (
    <div style={stripStyle}>
      <div style={avatarStackStyle}>
        {shown.map((s, i) => (
          <Avatar key={s.id} student={s} index={i} />
        ))}
      </div>
      <span style={stripCountStyle}>
        {selected.length} {selected.length === 1 ? 'student' : 'students'}
        {overflow > 0 && ` · +${overflow}`}
      </span>
    </div>
  );
}

function Avatar({ student, index }) {
  const tier = getTier(student.points);
  const isPhotoUrl = student.photo?.startsWith('http');
  return (
    <div style={{
      ...avatarStyle,
      background: tier.bg,
      marginLeft: index === 0 ? 0 : -10,
      zIndex: 10 - index,
    }}>
      {isPhotoUrl
        ? <img src={student.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ fontSize: 16 }}>{student.photo || DEFAULT_AVATAR}</span>
      }
    </div>
  );
}

function CustomChip({ active, onClick, children }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button
      onClick={onClick}
      {...handlers}
      style={{
        ...amountChipStyle,
        ...pressedStyle,
        background: active ? theme.colors.text : theme.colors.surfaceAlt,
        color: active ? '#fff' : theme.colors.textMuted,
        flex: 1,
      }}
    >
      {children}
    </button>
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

const stripStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 16,
  padding: '10px 12px',
  background: theme.colors.surfaceAlt,
  borderRadius: theme.radius.md,
};

const avatarStackStyle = {
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
};

const avatarStyle = {
  width: 32,
  height: 32,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  border: `2px solid ${theme.colors.surfaceAlt}`,
  boxSizing: 'border-box',
};

const stripCountStyle = {
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
  color: theme.colors.text,
  flex: 1,
  textAlign: 'right',
};

const sectionLabelStyle = {
  fontSize: theme.font.sizes.caption,
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
