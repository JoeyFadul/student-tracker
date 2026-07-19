import { useState, useRef, useEffect } from 'react';
import { Pencil, Check } from 'lucide-react';
import { theme } from '../../theme';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

// Three states:
//   empty + reading → faint pencil + 'Add a note' prompt
//   filled + reading → clean prose, pencil next to the title
//   editing → textarea + Save / Cancel buttons; nothing saves until Save
//
// Explicit Save (rather than blur autosave) avoids two problems with the
// previous approach: an in-flight save landing while the user is still
// typing could clobber the draft, and on iOS WKWebView a single tap-away
// can fire blur multiple times, queuing redundant PATCH calls.
export function NotesEditor({ initialValue = '', onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialValue);
  const textareaRef = useRef(null);

  // Only sync from props when not actively editing — protects an in-progress
  // draft from being overwritten by a background re-fetch.
  useEffect(() => {
    if (!editing) setDraft(initialValue);
  }, [initialValue, editing]);

  useEffect(() => {
    if (!editing) return;
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    const end = ta.value.length;
    ta.setSelectionRange(end, end);
  }, [editing]);

  const save = () => {
    if (draft !== initialValue) onSave(draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(initialValue);
    setEditing(false);
  };

  const titleNode = (
    <span style={titleRowStyle}>
      Notes
      {initialValue && !editing && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          style={pencilButtonStyle}
          aria-label="Edit note"
        >
          <Pencil size={14} color={theme.colors.textFaint} />
        </button>
      )}
    </span>
  );

  if (editing) {
    return (
      <Card title={titleNode} subtitle="Only you can see these">
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Add a note"
          style={textareaStyle}
        />
        <div style={buttonRowStyle}>
          <Button variant="outline" size="md" fullWidth onClick={cancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={save}
            icon={<Check size={16} strokeWidth={2.5} />}
          >
            Save
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card title={titleNode} subtitle="Only you can see these">
      {initialValue ? (
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
  gap: 6,
};

const pencilButtonStyle = {
  background: 'transparent',
  border: 'none',
  padding: 6,
  margin: -6,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  WebkitTapHighlightColor: 'transparent',
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

const buttonRowStyle = {
  display: 'flex',
  gap: 8,
  marginTop: 12,
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
