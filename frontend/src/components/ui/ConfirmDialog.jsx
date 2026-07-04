import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { theme } from '../../theme';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';

// The one confirmation dialog for every consequential action. Handles
// busy + error state around an async onConfirm. When `requireTypedText`
// is set, the confirm button stays disabled until the user types that
// word — intentional friction for irreversible deletes on mobile.
export function ConfirmDialog({
  title,
  children,
  confirmLabel,
  busyLabel = 'Working…',
  destructive = false,
  requireTypedText,
  closeOnSuccess = true,
  onConfirm,
  onClose,
}) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const typedOk = !requireTypedText || text.trim().toLowerCase() === requireTypedText;
  const canConfirm = typedOk && !busy;

  const submit = async () => {
    if (!canConfirm) return;
    setBusy(true); setError('');
    try {
      await onConfirm();
      if (closeOnSuccess) onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setBusy(false);
    }
  };

  return (
    <Modal title={title} onClose={onClose}>
      {destructive ? (
        <div style={warnStyle}>
          <AlertTriangle size={18} color={theme.colors.danger} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={warnTitleStyle}>This cannot be undone</div>
            <div style={warnBodyStyle}>{children}</div>
          </div>
        </div>
      ) : (
        <div style={bodyStyle}>{children}</div>
      )}

      {requireTypedText && (
        <Input
          label={<>Type <strong>{requireTypedText}</strong> to confirm</>}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={requireTypedText}
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
        />
      )}

      {error && <div style={errorStyle}>{error}</div>}

      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" size="lg" fullWidth onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button
          variant={destructive ? 'danger' : 'primary'}
          size="lg"
          fullWidth
          onClick={submit}
          disabled={!canConfirm}
        >
          {busy ? busyLabel : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

const warnStyle = {
  display: 'flex',
  gap: 10,
  padding: 14,
  background: theme.colors.dangerSoft,
  borderRadius: theme.radius.md,
  marginBottom: 18,
};

const warnTitleStyle = {
  fontSize: theme.font.sizes.body,
  fontWeight: 700,
  color: '#991b1b',
  marginBottom: 4,
};

const warnBodyStyle = {
  fontSize: theme.font.sizes.footnote,
  color: '#7f1d1d',
  lineHeight: 1.45,
};

const bodyStyle = {
  fontSize: theme.font.sizes.body,
  color: theme.colors.textMuted,
  lineHeight: 1.5,
  marginBottom: 18,
};

const errorStyle = {
  color: theme.colors.danger,
  fontSize: theme.font.sizes.footnote,
  marginBottom: 10,
};
