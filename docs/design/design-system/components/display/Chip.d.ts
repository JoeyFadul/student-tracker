/** Small soft-fill pill for status and metadata (streaks, deltas, badges). */
export interface ChipProps {
  children?: React.ReactNode;
  /** optional leading icon, e.g. <Icon name="flame" size={14} color="var(--wd-danger)" /> */
  icon?: React.ReactNode;
  tone?: 'neutral' | 'danger' | 'accent' | 'slate' | 'gunmetal' | 'success' | 'honey';
  style?: React.CSSProperties;
}
