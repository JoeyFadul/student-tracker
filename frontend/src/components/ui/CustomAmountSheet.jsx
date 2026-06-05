import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { theme } from '../../theme';
import { Sheet } from './Sheet';
import { Button } from './Button';

export function CustomAmountSheet({ open, initial = 1, onClose, onConfirm }) {
  const [value, setValue] = useState(String(initial));

  useEffect(() => { if (open) setValue(String(initial || '')); }, [open, initial]);

  const parsed = parseInt(value, 10);
  const valid = Number.isInteger(parsed) && parsed > 0;

  const submit = () => {
    if (!valid) return;
    onConfirm(parsed);
  };

  return (
    <Sheet open={open} onClose={onClose} title="Custom amount" position="top">
      <input
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && valid) submit(); }}
        placeholder="Enter an amount"
        style={inputStyle}
      />

      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" size="lg" fullWidth onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!valid}
          onClick={submit}
          icon={<Check size={18} strokeWidth={2.5} />}
        >
          Use {valid ? parsed : ''}
        </Button>
      </div>
    </Sheet>
  );
}

const inputStyle = {
  width: '100%',
  padding: '16px 20px',
  fontSize: 24,
  fontWeight: 700,
  textAlign: 'center',
  border: 'none',
  borderRadius: theme.radius.md,
  marginBottom: 16,
  boxSizing: 'border-box',
  fontFamily: theme.font.display,
  background: theme.colors.surfaceAlt,
  color: theme.colors.text,
  outline: 'none',
  WebkitAppearance: 'none',
  letterSpacing: '-0.02em',
};
