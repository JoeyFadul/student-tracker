import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { theme } from '../../theme';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

// Typed-confirmation pattern matching DeleteClassroomModal — the friction
// is intentional. onConfirm should do the actual deletion and resolve when
// done; this modal handles the busy/error UI around it.
export function DeleteAccountModal({ email, onClose, onConfirm }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { setText(''); setError(''); }, []);

  const canDelete = text.trim().toLowerCase() === 'delete' && !busy;

  const submit = async () => {
    if (!canDelete) return;
    setBusy(true); setError('');
    try {
      await onConfirm();
      // Don't reset busy — on success the app unmounts the settings tree
      // anyway when auth state clears.
    } catch (err) {
      setError(err.message || 'Deletion failed');
      setBusy(false);
    }
  };

  return (
    <Modal title="Delete your account?" onClose={onClose}>
      <div style={warnStyle}>
        <AlertTriangle size={18} color={theme.colors.danger} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={warnTitleStyle}>This cannot be undone</div>
          <div style={warnBodyStyle}>
            Every classroom you own will be permanently removed — including
            its students, photos, and activity history. Classrooms you joined
            as a member will lose your access, but their owner's data stays
            intact. Your sign-in record ({email}) is then permanently removed.
          </div>
        </div>
      </div>

      <label style={labelStyle}>
        Type <strong>delete</strong> to confirm
      </label>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="delete"
        autoFocus
        autoCapitalize="off"
        autoCorrect="off"
        style={inputStyle}
      />

      {error && <div style={errorStyle}>{error}</div>}

      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" size="lg" fullWidth onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button variant="danger" size="lg" fullWidth onClick={submit} disabled={!canDelete}>
          {busy ? 'Deleting…' : 'Delete account'}
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

const labelStyle = {
  display: 'block',
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
  color: theme.colors.textMuted,
  marginBottom: 8,
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  fontSize: theme.font.sizes.body,
  border: 'none',
  borderRadius: theme.radius.md,
  marginBottom: 14,
  boxSizing: 'border-box',
  fontFamily: theme.font.family,
  background: theme.colors.surfaceAlt,
  color: theme.colors.text,
  outline: 'none',
  WebkitAppearance: 'none',
};

const errorStyle = {
  color: theme.colors.danger,
  fontSize: theme.font.sizes.footnote,
  marginBottom: 10,
};
