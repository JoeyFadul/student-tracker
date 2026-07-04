import { ConfirmDialog } from '../ui/ConfirmDialog';

export function DeleteYearModal({ year, isActive, onClose, onConfirm }) {
  if (!year) return null;
  return (
    <ConfirmDialog
      title="Delete this school year?"
      destructive
      requireTypedText="delete"
      confirmLabel="Delete year"
      busyLabel="Deleting…"
      onConfirm={onConfirm}
      onClose={onClose}
    >
      All events, point grants, and history for <strong>{year.label}</strong> will
      be permanently removed.
      {isActive && (
        <> Current student totals will be reduced by the points earned this year.</>
      )}
    </ConfirmDialog>
  );
}
