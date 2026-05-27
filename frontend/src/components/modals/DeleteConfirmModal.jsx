// DeleteConfirmModal: two-step delete confirmation requiring the user to type "delete".
// The friction is intentional - prevents accidental deletion on mobile.

import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ErrorBanner } from '../ui/ErrorBanner';

const CONFIRM_WORD = 'delete';

export function DeleteConfirmModal({ studentName, onClose, onConfirm }) {
  const [confirmText, setConfirmText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const canDelete = confirmText.trim().toLowerCase() === CONFIRM_WORD && !busy;

  const handleDelete = async () => {
    if (!canDelete) return;
    setBusy(true); setError('');
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal title="Delete student?" onClose={onClose}>
      <div style={warningStyle}>
        <div style={warningTitleStyle}>This cannot be undone</div>
        <div style={warningBodyStyle}>
          <strong>{studentName}</strong>'s profile, point total, notes, and complete activity history will be permanently removed.
        </div>
      </div>

      <Input
        label={<>Type <strong>{CONFIRM_WORD}</strong> to confirm</>}
        type="text"
        value={confirmText}
        onChange={e => setConfirmText(e.target.value)}
        placeholder={CONFIRM_WORD}
        autoFocus
      />

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="secondary" fullWidth onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button variant="danger" fullWidth onClick={handleDelete} disabled={!canDelete}>
          {busy ? 'Deleting…' : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
}

const warningStyle = {
  padding: 14,
  background: '#fef2f2',
  borderRadius: 12,
  marginBottom: 16,
  border: '1px solid #fecaca',
};

const warningTitleStyle = {
  fontSize: 14,
  color: '#991b1b',
  fontWeight: 500,
  marginBottom: 4,
};

const warningBodyStyle = {
  fontSize: 13,
  color: '#7f1d1d',
  lineHeight: 1.5,
};
