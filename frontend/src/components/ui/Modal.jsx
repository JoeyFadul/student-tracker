// Modal: a bottom-sheet style modal. Click backdrop or X to close.
// Used for forms and confirmations - any flow that needs to interrupt the main view.

import { X } from 'lucide-react';

export function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={backdropStyle}>
      <div onClick={e => e.stopPropagation()} style={sheetStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>{title}</h2>
          <button onClick={onClose} style={closeButtonStyle} aria-label="Close">
            <X size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const backdropStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(28, 25, 23, 0.5)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  zIndex: 100,
  padding: 0,
};

const sheetStyle = {
  background: '#fff',
  width: '100%',
  maxWidth: 540,
  borderRadius: '20px 20px 0 0',
  padding: 24,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
};

const titleStyle = {
  fontSize: 20,
  fontWeight: 700,
  color: '#1c1917',
  margin: 0,
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#78716c',
  padding: 4,
};
