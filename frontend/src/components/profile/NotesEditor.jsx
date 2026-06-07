import { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { theme } from '../../theme';
import { Card } from '../ui/Card';

// Two display states + an edit state:
//   - empty + read: subtle pencil + "Add a note" prompt
//   - filled + read: just the note rendered as clean prose
//   - editing: textarea focused at the end of the content
// Saves on blur so there's no explicit save button.
export function NotesEditor({ initialValue = '', onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialValue);
  const textareaRef = useRef(null);

  useEffect(() => { setDraft(initialValue); }, [initialValue]);

  useEffect(() => {
    if (!editing) return;
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    const end = ta.value.length;
    ta.setSelectionRange(end, end);
  }, [editing]);

  const finishEditing = () => {
    if (draft !== initialValue) onSave(draft);
    setEditing(false);
  };

  const titleNode = (
    <span style={titleRowStyle}>
      Notes
      {initialValue && !editing && (
        <Pencil size={14} color={theme.colors.textFaint} aria-hidden />
      )}
    </span>
  );

  return (
    <Card title={titleNode}>
      {editing ? (
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={finishEditing}
          placeholder="Add a note"
          style={textareaStyle}
        />
      ) : initialValue ? (
        <button type="button" onClick={() => setEditing(true)} style={readButtonStyle}>
          <div style={proseStyle}>{initialValue}</div>
        </button>
      ) : (
        <button type="button" onClick={() => setEditing(true)} style={emptyButtonStyle}>
          <Pencil size={16} color={theme.colors.textFaint} />
          <span style={emptyTextStyle}>Add a note</span>
        </button>
      )}
    </Card>
  );
}

const titleRowStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
};

const textareaStyle = {
  width: '100%',
  minHeight: 110,
  padding: '14px 16px',
  fontSize: theme.font.sizes.body,
  border: 'none',
  borderRadius: theme.radius.md,
  fontFamily: theme.font.family,
  resize: 'none',
  boxSizing: 'border-box',
  lineHeight: 1.55,
  background: theme.colors.surfaceAlt,
  color: theme.colors.text,
  outline: 'none',
  WebkitAppearance: 'none',
};

const readButtonStyle = {
  display: 'block',
  width: '100%',
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: theme.font.family,
  WebkitTapHighlightColor: 'transparent',
};

const proseStyle = {
  fontSize: theme.font.sizes.body,
  color: theme.colors.text,
  lineHeight: 1.55,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};

const emptyButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  width: '100%',
  background: 'transparent',
  border: 'none',
  padding: '4px 0',
  cursor: 'pointer',
  fontFamily: theme.font.family,
  WebkitTapHighlightColor: 'transparent',
};

const emptyTextStyle = {
  fontSize: theme.font.sizes.body,
  color: theme.colors.textFaint,
  fontWeight: 500,
};
