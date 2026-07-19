/** Confirmation dialog. destructive=true shows the "This cannot be undone" warning strip and a danger confirm. */
export interface ConfirmDialogProps {
  title: React.ReactNode;
  /** explanation body */
  children?: React.ReactNode;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
  /** render without fixed positioning (previews) */
  inline?: boolean;
}
