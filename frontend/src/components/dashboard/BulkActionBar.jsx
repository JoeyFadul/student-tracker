import { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';

const PRESET_AMOUNTS = [1, 5, 10];
const PRESET_REASONS = [
  'Kindness', 'Effort', 'Helping', 'Homework',
  'Participation', 'Listening', 'Cleanup', 'Teamwork',
];

export function BulkActionBar({ selectedCount, onCancel, onGrant }) {
  const [amount, setAmount] = useState(5);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (delta) => {
    if (busy || selectedCount === 0) return;
    setBusy(true);
    try {
      await onGrant(delta, reason);
      setReason('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={wrapStyle}>
      <div style={topRowStyle}>
        <span style={countStyle}>{selectedCount} selected</span>
        <button onClick={onCancel} style={closeBtnStyle} aria-label="Cancel"><X size={18} /></button>
      </div>

      <div style={amountRowStyle}>
        <span style={labelStyle}>Amount:</span>
        {PRESET_AMOUNTS.map(n => (
          <button key={n} onClick={() => setAmount(n)} style={getChipStyle(amount === n)} type="button">{n}</button>
        ))}
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
          style={numberInputStyle}
        />
      </div>

      <input
        type="text"
        placeholder="Reason (optional)"
        value={reason}
        onChange={e => setReason(e.target.value)}
        style={reasonInputStyle}
      />

      <div style={reasonRowStyle}>
        {PRESET_REASONS.map(r => (
          <button key={r} onClick={() => setReason(r)} style={getReasonChipStyle(reason === r)} type="button">{r}</button>
        ))}
      </div>

      <div style={buttonRowStyle}>
        <button
          onClick={() => submit(amount)}
          disabled={busy || selectedCount === 0}
          style={{ ...actionBtnStyle, background: '#16a34a' }}
        >
          <Plus size={18} /> Grant {amount} to {selectedCount}
        </button>
        <button
          onClick={() => submit(-amount)}
          disabled={busy || selectedCount === 0}
          style={{ ...actionBtnStyle, background: '#fff', color: '#dc2626', border: '1.5px solid #dc2626' }}
        >
          <Minus size={18} /> Revoke
        </button>
      </div>
    </div>
  );
}

const wrapStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  background: '#fff',
  borderTop: '1px solid #e7e2d8',
  padding: 16,
  boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
  zIndex: 100,
  maxWidth: 720,
  margin: '0 auto',
};

const topRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
};

const countStyle = {
  fontSize: 16,
  fontWeight: 600,
  color: '#1c1917',
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#78716c',
  padding: 4,
};

const labelStyle = {
  fontSize: 13,
  color: '#78716c',
};

const amountRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 10,
};

const reasonInputStyle = {
  width: '100%',
  padding: '10px 12px',
  fontSize: 14,
  border: '1px solid #e7e2d8',
  borderRadius: 10,
  marginBottom: 8,
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const reasonRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  marginBottom: 12,
};

const getChipStyle = (selected) => ({
  padding: '6px 12px',
  borderRadius: 8,
  border: selected ? '1.5px solid #1c1917' : '1px solid #e7e2d8',
  background: selected ? '#1c1917' : '#fff',
  color: selected ? '#fff' : '#1c1917',
  fontSize: 14,
  cursor: 'pointer',
  fontWeight: 500,
  fontFamily: 'inherit',
});

const getReasonChipStyle = (selected) => ({
  padding: '4px 10px',
  borderRadius: 14,
  border: selected ? '1.5px solid #1c1917' : '1px solid #e7e2d8',
  background: selected ? '#1c1917' : '#fff',
  color: selected ? '#fff' : '#57534e',
  fontSize: 12,
  cursor: 'pointer',
  fontFamily: 'inherit',
});

const numberInputStyle = {
  width: 70,
  padding: '6px 10px',
  fontSize: 14,
  border: '1px solid #e7e2d8',
  borderRadius: 8,
  fontFamily: 'inherit',
};

const buttonRowStyle = {
  display: 'flex',
  gap: 8,
};

const actionBtnStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '12px 16px',
  borderRadius: 12,
  border: 'none',
  color: '#fff',
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};
