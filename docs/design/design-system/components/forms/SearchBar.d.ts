/** Pill-shaped search field with leading search icon. */
export interface SearchBarProps {
  value?: string;
  /** called with the string value, not the event */
  onChange?: (value: string) => void;
  /** default "Search students…" */
  placeholder?: string;
  style?: React.CSSProperties;
}
