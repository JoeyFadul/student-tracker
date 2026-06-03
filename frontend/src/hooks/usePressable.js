import { useState } from 'react';

export function usePressable() {
  const [pressed, setPressed] = useState(false);
  const handlers = {
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    onTouchStart: () => setPressed(true),
    onTouchEnd: () => setPressed(false),
    onTouchCancel: () => setPressed(false),
  };
  return { pressed, handlers, pressedStyle: pressed ? { transform: 'scale(0.97)' } : {} };
}
