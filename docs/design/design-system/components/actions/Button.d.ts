/** The Well Done button. Seven variants; sentence-case labels; press scales to 0.97. */
export interface ButtonProps {
  children?: React.ReactNode;
  /** primary (coral) | secondary (solid slate) | tertiary (bare) | outline (silver hairline) | gunmetal | success (= coral) | danger (destructive red) | dangerSoft */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'gunmetal' | 'success' | 'danger' | 'dangerSoft';
  /** sm 36px | md 44px | lg 52px min-height */
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  /** leading icon node, e.g. <Icon name="check" size={18} strokeWidth={2.5} /> */
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  style?: React.CSSProperties;
}
