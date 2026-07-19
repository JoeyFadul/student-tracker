/** 56px terracotta floating action button with orange glow — the only colored shadow in the system. */
export interface FabProps {
  /** defaults to a 26px plus icon */
  icon?: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  /** fixed above the tab bar (default) or inline */
  fixed?: boolean;
  style?: React.CSSProperties;
}
