/** Multiline input matching Input's soft-fill treatment. */
export interface TextareaProps {
  label?: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  rows?: number;
  maxLength?: number;
  style?: React.CSSProperties;
}
