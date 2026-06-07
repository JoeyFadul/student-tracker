import { Sheet } from './Sheet';

export function Modal({ title, onClose, children }) {
  return (
    <Sheet open={true} onClose={onClose} title={title}>
      {children}
    </Sheet>
  );
}
