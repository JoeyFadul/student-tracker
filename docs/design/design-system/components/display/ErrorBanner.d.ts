/** Inline dismissible error strip — soft danger fill, renders nothing when message is empty. */
export interface ErrorBannerProps {
  message?: string;
  onDismiss?: () => void;
  style?: React.CSSProperties;
}
