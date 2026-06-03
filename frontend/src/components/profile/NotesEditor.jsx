import { useState, useEffect } from 'react';
import { theme } from '../../theme';
import { Card } from '../ui/Card';

export function NotesEditor({ initialValue = '', onSave }) {
  const [draft, setDraft] = useState(initialValue);

  useEffect(() => { setDraft(initialValue); }, [initialValue]);

  const handleBlur = () => {
    if (draft !== initialValue) onSave(draft);
  };

  return (
    <Card title="Notes" subtitle="Saved when you tap away">
      <textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={handleBlur}
        placeholder="Observations, strengths, areas to support…"
        style={textareaStyle}
      />
    </Card>
  );
}

const textareaStyle = {
  width: '100%',
  minHeight: 96,
  padding: '14px 16px',
  fontSize: theme.font.sizes.body,
  border: 'none',
  borderRadius: theme.radius.md,
  fontFamily: theme.font.family,
  resize: 'vertical',
  boxSizing: 'border-box',
  lineHeight: 1.5,
  background: theme.colors.surfaceAlt,
  color: theme.colors.text,
  outline: 'none',
  WebkitAppearance: 'none',
};
