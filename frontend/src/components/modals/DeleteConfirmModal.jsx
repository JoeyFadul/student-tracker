import { ConfirmDialog } from '../ui/ConfirmDialog';

export function DeleteConfirmModal({ studentName, onClose, onConfirm }) {
  return (
    <ConfirmDialog
      title="Delete student?"
      destructive
      requireTypedText="delete"
      confirmLabel="Delete"
      busyLabel="Deleting…"
      onConfirm={onConfirm}
      onClose={onClose}
    >
      <strong>{studentName}</strong>'s profile, point total, notes, and complete
      activity history will be permanently removed.
    </ConfirmDialog>
  );
}
