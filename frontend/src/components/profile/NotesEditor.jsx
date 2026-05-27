// NotesEditor: editable notes field that saves on blur or button click.

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function NotesEditor({ initialValue = '', onSave }) {
  const [draft, setDraft] = useState(initialValue);

  // Reset draft if the student changes
  useEffect(() => {
    setDraft(initialValue);
  }, [initialValue]);

  const handleSave = () => {
    if (draft === initialValue) return;
    onSave(draft);
  };

  return (
    <Card title="Notes">
      <textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={handleSave}
        placeholder="Add observations, strengths, areas to support…"
        style={textareaStyle}
      />
      <Button size="sm" onClick={handleSave} icon={<Save size={14} />} style={{ marginTop: 8 }}>
        Save notes
      </Button>
    </Card>
  );
}

const textareaStyle = {
  width: '100%',
  minHeight: 80,
  padding: '10px 12px',
  fontSize: 15,
  border: '1px solid #e7e2d8',
  borderRadius: 10,
  fontFamily: 'inherit',
  resize: 'vertical',
  boxSizing: 'border-box',
  lineHeight: 1.5,
};
