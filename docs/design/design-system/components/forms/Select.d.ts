/** Native select styled as a soft-fill input; keeps the real system picker. */
export interface SelectProps {
  label?: React.ReactNode;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: any) => void;
  style?: React.CSSProperties;
}
