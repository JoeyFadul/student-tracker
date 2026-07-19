/** Round icon-only button on a white circle with a soft shadow. */
export interface IconButtonProps {
  /** icon node, e.g. <Icon name="x" size={18} color="var(--wd-text)" /> */
  icon: React.ReactNode;
  onClick?: () => void;
  /** required for a11y — icon buttons have no text */
  ariaLabel: string;
  /** px, default 36 */
  size?: number;
  style?: React.CSSProperties;
}
