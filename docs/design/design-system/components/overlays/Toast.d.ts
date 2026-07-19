/** Card-styled toast with delta pill and Undo — the only way to correct a grant. */
export interface ToastProps {
  message: React.ReactNode;
  /** shows a +N/−N pill (sage/danger) */
  delta?: number;
  /** usually "Undo" */
  actionLabel?: string;
  onAction?: () => void;
  /** render in-flow instead of fixed bottom-center */
  inline?: boolean;
  style?: React.CSSProperties;
}
