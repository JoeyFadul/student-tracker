import { Sheet } from './Sheet';

export function Modal({ title, onClose, children, position }) {
  return (
    <Sheet open={true} onClose={onClose} title={title} position={position}>
      {children}
    </Sheet>
  );
}
