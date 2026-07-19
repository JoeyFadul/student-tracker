import { ConfirmDialog } from '../ui/ConfirmDialog';

export function DeleteAccountModal({ email, onClose, onConfirm }) {
  return (
    <ConfirmDialog
      title="Delete your account?"
      destructive
      requireTypedText="delete"
      confirmLabel="Delete account"
      busyLabel="Deleting…"
      // On success the app unmounts the settings tree when auth state
      // clears; closing here would flash the settings screen first.
      closeOnSuccess={false}
      onConfirm={onConfirm}
      onClose={onClose}
    >
      Every classroom you own will be permanently removed — including its
      students, photos, and activity history. Classrooms you joined as a
      member will lose your access, but their owner's data stays intact.
      Your sign-in record ({email}) is then permanently removed.
    </ConfirmDialog>
  );
}
