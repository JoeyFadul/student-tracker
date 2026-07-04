import { ConfirmDialog } from '../ui/ConfirmDialog';

export function DeleteClassroomModal({ classroom, onClose, onConfirm }) {
  if (!classroom) return null;
  return (
    <ConfirmDialog
      title="Delete this classroom?"
      destructive
      requireTypedText="delete"
      confirmLabel="Delete classroom"
      busyLabel="Deleting…"
      onConfirm={onConfirm}
      onClose={onClose}
    >
      Every student, point grant, school year, and teacher invitation
      for <strong>{classroom.classroomName}</strong> will be permanently removed.
    </ConfirmDialog>
  );
}
