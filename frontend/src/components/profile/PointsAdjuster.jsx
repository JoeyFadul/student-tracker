// PointsAdjuster: lets the teacher grant or revoke a configurable number of talents.

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const PRESET_AMOUNTS = [1, 5, 10];

export function PointsAdjuster({ onAdjust }) {
  const [amount, setAmount] = useState(5);
  const [reason, setReason] = useState('');

  const handleAdjust = async (delta) => {
    await onAdjust(delta, reason);
    setReason('');
  };

  return (
    <Card title="Adjust talents">
      <input
        type="text"
        placeholder="Reason (optional)"
        value={reason}
        onChange={e => setReason(e.target.value)}
        style={reasonInputStyle}
      />

      <div style={amountRowStyle}>
        <span style={{ fontSize: 14, color: '#78716c' }}>Amount:</span>
        {PRESET_AMOUNTS.map(n => (
          <button
            key={n}
            onClick={() => setAmount(n)}
            style={getPresetStyle(amount === n)}
          >
            {n}
          </button>
        ))}
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
          style={numberInputStyle}
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="success" size="lg" fullWidth onClick={() => handleAdjust(amount)} icon={<Plus size={20} />}>
          Grant
        </Button>
        <Button
          variant="dangerOutline"
          size="lg"
          fullWidth
          onClick={() => handleAdjust(-amount)}
          icon={<Minus size={20} />}
        >
          Revoke
        </Button>
      </div>
    </Card>
  );
}

const reasonInputStyle = {
  width: '100%',
  padding: '10px 12px',
  fontSize: 15,
  border: '1px solid #e7e2d8',
  borderRadius: 10,
  marginBottom: 10,
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const amountRowStyle = {
  display: 'flex',
  gap: 8,
  marginBottom: 10,
  alignItems: 'center',
};

const getPresetStyle = (selected) => ({
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

const numberInputStyle = {
  width: 70,
  padding: '6px 10px',
  fontSize: 14,
  border: '1px solid #e7e2d8',
  borderRadius: 8,
  fontFamily: 'inherit',
};
