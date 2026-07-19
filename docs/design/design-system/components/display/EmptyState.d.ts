/** Card empty state: icon in soft-accent circle, title, hint, optional action button. */
export interface EmptyStateProps {
  /** e.g. <Icon name="users" size={32} color="var(--wd-accent)" /> */
  icon?: React.ReactNode;
  title: React.ReactNode;
  hint?: React.ReactNode;
  /** usually a <Button> */
  action?: React.ReactNode;
  style?: React.CSSProperties;
}
