import { useState, useEffect } from 'react';
import { Plus, Minus, Check, ChevronLeft } from 'lucide-react';
import { theme } from '../../theme';
import { PRESET_REASONS } from '../../lib/reasons';
import { usePressable } from '../../hooks/usePressable';
import { Button } from '../ui/Button';

// Tap-to-submit reason grid. Picking a preset reason commits the grant
// immediately — there is no separate confirm step. allowRevoke=true adds
// a Grant/Revoke segmented control above the grid; tapping a reason then
// applies +amount or -amount depending on the active mode.
//
// The "Other reason…" affordance expands an inline input so the default
// view stays compact when one of the 8 presets is enough.
export function ReasonPicker({ amount, allowRevoke = false, onSubmit }) {
  const [mode, setMode] = useState('grant');
  const [customMode, setCustomMode] = useState(false);
  const [customText, setCustomText] = useState('');

  // Reset state every time the amount changes (new grant flow)
  useEffect(() => {
    setMode('grant');
    setCustomMode(false);
    setCustomText('');
  }, [amount]);

  const submit = (reason) => {
    const delta = mode === 'revoke' ? -amount : amount;
    onSubmit(delta, reason);
  };

  if (customMode) {
    return (
      <div>
        {allowRevoke && <ModeToggle mode={mode} setMode={setMode} amount={amount} />}
        <input
          type="text"
          placeholder="Type a reason…"
          value={customText}
          onChange={e => setCustomText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit(customText.trim()); }}
          autoFocus
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Button
            variant="outline"
            size="lg"
            onClick={() => { setCustomMode(false); setCustomText(''); }}
            icon={<ChevronLeft size={16} />}
          >
            Back
          </Button>
          <Button
            variant={mode === 'revoke' ? 'dangerSoft' : 'success'}
            size="lg"
            fullWidth
            onClick={() => submit(customText.trim())}
            icon={mode === 'revoke' ? <Minus size={18} strokeWidth={2.5} /> : <Check size={18} strokeWidth={2.5} />}
          >
            {mode === 'revoke' ? 'Revoke' : 'Award'} {amount}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {allowRevoke && <ModeToggle mode={mode} setMode={setMode} amount={amount} />}
      <div style={gridStyle}>
        {PRESET_REASONS.map(r => (
          <ReasonCard key={r} reason={r} onClick={() => submit(r)} />
        ))}
      </div>
      <button
        type="button"
        onClick={() => setCustomMode(true)}
        style={otherButtonStyle}
      >
        + Other reason…
      </button>
    </div>
  );
}

function ModeToggle({ mode, setMode, amount }) {
  return (
    <div style={toggleWrapStyle}>
      <ModeButton active={mode === 'grant'} onClick={() => setMode('grant')}>
        <Plus size={14} strokeWidth={2.5} /> Award {amount}
      </ModeButton>
      <ModeButton active={mode === 'revoke'} onClick={() => setMode('revoke')}>
        <Minus size={14} strokeWidth={2.5} /> Revoke {amount}
      </ModeButton>
    </div>
  );
}

function ModeButton({ active, onClick, children }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button
      onClick={onClick}
      {...handlers}
      style={{
        ...modeButtonStyle,
        ...pressedStyle,
        background: active ? theme.colors.surface : 'transparent',
        color: active ? theme.colors.text : theme.colors.textMuted,
        boxShadow: active ? theme.shadow.sm : 'none',
      }}
    >
      {children}
    </button>
  );
}

function ReasonCard({ reason, onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button
      type="button"
      onClick={onClick}
      {...handlers}
      style={{ ...reasonCardStyle, ...pressedStyle }}
    >
      {reason}
    </button>
  );
}

const toggleWrapStyle = {
  display: 'flex',
  gap: 4,
  padding: 4,
  background: theme.colors.surfaceAlt,
  borderRadius: theme.radius.lg,
  marginBottom: 14,
};

const modeButtonStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  padding: '10px 14px',
  border: 'none',
  borderRadius: theme.radius.md,
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: theme.font.family,
  WebkitTapHighlightColor: 'transparent',
  transition: 'background 0.18s ease, box-shadow 0.18s ease, color 0.18s ease',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 8,
  marginBottom: 10,
};

const reasonCardStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.colors.surfaceAlt,
  border: 'none',
  borderRadius: theme.radius.lg,
  padding: '20px 12px',
  fontSize: theme.font.sizes.body,
  fontWeight: 600,
  color: theme.colors.text,
  fontFamily: theme.font.family,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  textAlign: 'center',
  minHeight: 58,
  transition: 'transform 0.1s ease, background 0.15s ease',
};

const otherButtonStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  color: theme.colors.textMuted,
  fontSize: theme.font.sizes.footnote,
  fontWeight: 500,
  padding: '12px 0 4px',
  cursor: 'pointer',
  fontFamily: theme.font.family,
  WebkitTapHighlightColor: 'transparent',
};

const inputStyle = {
  width: '100%',
  padding: '16px 18px',
  fontSize: theme.font.sizes.body,
  border: 'none',
  borderRadius: theme.radius.md,
  boxSizing: 'border-box',
  fontFamily: theme.font.family,
  background: theme.colors.surfaceAlt,
  color: theme.colors.text,
  outline: 'none',
  WebkitAppearance: 'none',
};
