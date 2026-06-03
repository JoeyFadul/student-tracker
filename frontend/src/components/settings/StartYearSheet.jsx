import { useEffect, useState } from 'react';
import { Calendar, ChevronDown, AlertTriangle } from 'lucide-react';
import { theme } from '../../theme';
import { Sheet } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { suggestYearLabel, deriveYearOptions } from '../../hooks/useSchoolYear';

export function StartYearSheet({ open, onClose, onStart, replacingYear }) {
  const [label, setLabel] = useState('');
  const [options, setOptions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      const opts = deriveYearOptions();
      setOptions(opts);
      setLabel(suggestYearLabel());
      setError('');
    }
  }, [open]);

  const submit = async () => {
    if (!label) { setError('Pick a school year'); return; }
    setBusy(true); setError('');
    try {
      await onStart(label);
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

      <label style={labelStyle}>School year</label>
      <div style={selectWrapStyle}>
        <Calendar size={16} color={theme.colors.textMuted} style={leftIconStyle} />
        <span style={selectValueStyle}>{label}</span>
        <ChevronDown size={16} color={theme.colors.textMuted} style={rightIconStyle} />
        <select
          value={label}
          onChange={e => setLabel(e.target.value)}
          style={selectOverlayStyle}
          aria-label="Select school year"
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
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

const selectWrapStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  background: theme.colors.surfaceAlt,
  borderRadius: theme.radius.md,
  marginBottom: 14,
  minHeight: 50,
  padding: '0 16px 0 40px',
};

const leftIconStyle = {
  position: 'absolute',
  left: 14,
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
};

const rightIconStyle = {
  position: 'absolute',
  right: 14,
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
};

const selectValueStyle = {
  fontSize: theme.font.sizes.body,
  fontWeight: 600,
  color: theme.colors.text,
  fontFamily: theme.font.family,
};

const selectOverlayStyle = {
  position: 'absolute',
  inset: 0,
  opacity: 0,
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  fontFamily: theme.font.family,
  fontSize: theme.font.sizes.body,
  WebkitAppearance: 'none',
  appearance: 'none',
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
