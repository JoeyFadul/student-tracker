/** Text input on a soft gray fill — no border, no focus ring (touch-first). */
export interface InputProps {
  /** optional label rendered above (13px muted) */
  label?: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  type?: string;
  style?: React.CSSProperties;
}
