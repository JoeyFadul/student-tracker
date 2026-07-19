/** Lucide line icon by name. Well Done uses lucide exclusively for UI iconography. */
export interface IconProps {
  /** Lucide glyph name, e.g. "flame", "users", "bar-chart-3", "check" */
  name: string;
  /** px, default 20. App uses 12–26. */
  size?: number;
  /** default currentColor */
  color?: string;
  /** default 2; 2.4 for active tab, 2.5 for emphasis */
  strokeWidth?: number;
  style?: React.CSSProperties;
  className?: string;
}
