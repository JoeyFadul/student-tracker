// AddStudentModal: form for creating a new student.

import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select, Label } from '../ui/Input';
import { ErrorBanner } from '../ui/ErrorBanner';
import { AVATAR_CHOICES } from '../../lib/avatars';

const GRADE_OPTIONS = [
  { value: 'K', label: 'Kindergarten' },
  { value: '1st', label: '1st grade' },
  { value: '2nd', label: '2nd grade' },
  { value: '3rd', label: '3rd grade' },
  { value: '4th', label: '4th grade' },
  { value: '5th', label: '5th grade' },
];

export function AddStudentModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('3rd');
  const [photo, setPhoto] = useState(AVATAR_CHOICES[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = !!name.trim() && !busy;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true); setError('');
    try {
      await onCreate({ name: name.trim(), grade, photo });
      onClose();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal title="New student" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="First and last name"
          required
          autoFocus
        />

        <Select
          label="Grade"
          value={grade}
          onChange={e => setGrade(e.target.value)}
          options={GRADE_OPTIONS}
        />

        <Label>Choose an avatar</Label>
        <AvatarPicker selected={photo} onSelect={setPhoto} />

        <ErrorBanner message={error} onDismiss={() => setError('')} />

        <Button type="submit" disabled={!canSubmit} fullWidth>
          {busy ? 'Adding…' : 'Add student'}
        </Button>
      </form>
    </Modal>
  );
}

function AvatarPicker({ selected, onSelect }) {
  return (
    <div style={gridStyle}>
      {AVATAR_CHOICES.map(emoji => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelect(emoji)}
          style={getAvatarButtonStyle(selected === emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 1fr)',
  gap: 8,
  marginBottom: 20,
};

const getAvatarButtonStyle = (selected) => ({
  aspectRatio: '1',
  fontSize: 24,
  padding: 0,
  background: selected ? '#1c1917' : '#faf7f2',
  border: selected ? '1.5px solid #1c1917' : '1px solid #e7e2d8',
  borderRadius: 10,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'inherit',
});
