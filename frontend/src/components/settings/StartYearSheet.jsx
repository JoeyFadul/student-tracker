import { useEffect, useState } from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';
import { theme } from '../../theme';
import { Sheet } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { suggestYearLabel } from '../../hooks/useSchoolYear';

export function StartYearSheet({ open, onClose, onStart, replacingYear }) {
  const [label, setLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setLabel(suggestYearLabel());
      setError('');
    }
  }, [open]);

  const submit = async () => {
    const trimmed = label.trim();
    if (!trimmed) { setError('Please enter a label'); return; }
    setBusy(true); setError('');
    try {
      await onStart(trimmed);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Start school year">
      {replacingYear && (
        <div style={warnStyle}>
          <AlertTriangle size={16} color={theme.colors.warning} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            Starting a new year will <strong>end {replacingYear.label}</strong> and reset every student's dollars to 0. Past dollars will stay viewable as an archive.
          </div>
        </div>
      )}

      <label style={labelStyle}>Year label</label>
      <div style={inputWrapStyle}>
        <Calendar size={16} color={theme.colors.textMuted} style={iconStyle} />
        <input
          type="text"
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="2025–2026"
          autoFocus
          style={inputStyle}
        />
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
        <Button variant="outline" size="lg" fullWidth onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button variant="primary" size="lg" fullWidth onClick={submit} disabled={busy}>
          {busy ? 'Starting…' : 'Start year'}
        </Button>
      </div>
    </Sheet>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
  color: theme.colors.textMuted,
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const inputWrapStyle = {
  position: 'relative',
  marginBottom: 14,
};

const iconStyle = {
  position: 'absolute',
  left: 14,
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px 14px 40px',
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

const warnStyle = {
  display: 'flex',
  gap: 8,
  padding: 12,
  background: '#FEF3C7',
  color: '#78350F',
  borderRadius: theme.radius.md,
  fontSize: theme.font.sizes.footnote,
  lineHeight: 1.4,
  marginBottom: 16,
};

const errorStyle = {
  color: theme.colors.danger,
  fontSize: theme.font.sizes.footnote,
  marginBottom: 10,
};
