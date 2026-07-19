import React from 'react';
import { Sheet } from './Sheet.jsx';
import { Button } from '../actions/Button.jsx';
import { Icon } from '../icons/Icon.jsx';

// The one confirmation dialog for consequential actions. destructive adds the
// "This cannot be undone" warning strip. (App version also supports typed-text
// confirmation and async busy/error state.)
export function ConfirmDialog({ title, children, confirmLabel = 'Confirm', destructive = false, onConfirm, onClose, inline = false }) {
  return (
    <Sheet open={true} onClose={onClose} title={title} inline={inline}>
      {destructive ? (
        <div style={{ display: 'flex', gap: 10, padding: 14, background: 'var(--wd-danger-soft)', borderRadius: 12, marginBottom: 18 }}>
          <Icon name="alert-triangle" size={18} color="var(--wd-danger)" style={{ marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--wd-danger)', marginBottom: 4 }}>This cannot be undone</div>
            <div style={{ fontSize: 13, color: 'var(--wd-text-muted)', lineHeight: 1.45 }}>{children}</div>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: 15, color: 'var(--wd-text-muted)', lineHeight: 1.5, marginBottom: 18 }}>{children}</div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" size="lg" fullWidth onClick={onClose}>Cancel</Button>
        <Button variant={destructive ? 'danger' : 'primary'} size="lg" fullWidth onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Sheet>
  );
}
