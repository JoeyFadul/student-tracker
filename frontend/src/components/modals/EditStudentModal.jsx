import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { ErrorBanner } from '../ui/ErrorBanner';
import { GRADE_OPTIONS, formatGrade } from '../../lib/grades';

export function EditStudentModal({ student, onClose, onSave }) {
  const [name, setName] = useState(student.name);
  const [grade, setGrade] = useState(student.grade || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Legacy students can carry an empty (or free-form) grade; surface it as
  // its own option so opening the editor never silently rewrites data.
  const options = GRADE_OPTIONS.some(o => o.value === grade)
    ? GRADE_OPTIONS
    : [{ value: grade, label: grade ? formatGrade(grade) : 'No grade' }, ...GRADE_OPTIONS];

  const dirty = name.trim() !== student.name || grade !== (student.grade || '');
  const canSubmit = !!name.trim() && dirty && !busy;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true); setError('');
    try {
      await onSave({ name: name.trim(), grade });
      onClose();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal title="Edit student" onClose={onClose}>
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
          options={options}
        />

        <ErrorBanner message={error} onDismiss={() => setError('')} />

        <Button type="submit" disabled={!canSubmit} fullWidth>
          {busy ? 'Saving…' : 'Save changes'}
        </Button>
      </form>
    </Modal>
  );
}
