import { useState, useRef, useEffect } from 'react';
import { Camera, X, User, Users } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Input, Select, Textarea } from '../ui/Input';
import { ErrorBanner } from '../ui/ErrorBanner';
import { DEFAULT_AVATAR } from '../../lib/avatars';
import { GRADE_OPTIONS } from '../../lib/grades';
import { parseRoster } from '../../lib/roster';
import { usePressable } from '../../hooks/usePressable';
import { theme } from '../../theme';

export function AddStudentModal({ onClose, onCreate, onCreateMany }) {
  const [mode, setMode] = useState('single');
  return (
    <Modal title="Add students" onClose={onClose}>
      <ModeToggle mode={mode} setMode={setMode} />
      {mode === 'single'
        ? <SingleForm onCreate={onCreate} onClose={onClose} />
        : <PasteForm onCreateMany={onCreateMany} onClose={onClose} />}
    </Modal>
  );
}

// --- One-at-a-time (with photo + grade) -----------------------------------

function SingleForm({ onCreate, onClose }) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('3rd');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Revoke the local preview URL on unmount or replacement to avoid leaks.
  useEffect(() => {
    return () => { if (photoPreview) URL.revokeObjectURL(photoPreview); };
  }, [photoPreview]);

  const pickPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const clearPhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const canSubmit = !!name.trim() && !busy;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true); setError('');
    try {
      // useStudents.createStudent handles the upload chain when photoFile is
      // provided — we always seed photo with the default emoji so the new
      // student renders something even if the upload step fails.
      await onCreate({ name: name.trim(), grade, photo: DEFAULT_AVATAR }, photoFile);
      onClose();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Compact one-row photo affordance: the photo is optional garnish here
          (a default avatar is always seeded, and the profile hero handles
          photo changes later), so it doesn't get a hero block — keeping the
          whole form inside the keyboard-up band without scrolling. */}
      <div style={photoRowStyle}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={photoRowButtonStyle}
          aria-label={photoPreview ? 'Change photo' : 'Add photo'}
        >
          <span style={thumbStyle}>
            {photoPreview
              ? <img src={photoPreview} alt="" style={imgStyle} />
              : <span style={thumbEmojiStyle}>{DEFAULT_AVATAR}</span>}
          </span>
          <span style={photoRowLabelStyle}>
            <Camera size={15} strokeWidth={2.4} />
            {photoPreview ? 'Change photo' : 'Add photo'}
          </span>
        </button>
        {photoPreview && (
          <IconButton
            icon={<X size={18} color={theme.colors.textMuted} />}
            onClick={clearPhoto}
            ariaLabel="Remove photo"
          />
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={pickPhoto}
        />
      </div>

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

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <Button type="submit" disabled={!canSubmit} fullWidth>
        {busy ? 'Adding…' : 'Add student'}
      </Button>
    </form>
  );
}

// --- Paste a whole list ----------------------------------------------------

function PasteForm({ onCreateMany, onClose }) {
  const [text, setText] = useState('');
  const [grade, setGrade] = useState('3rd');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const names = parseRoster(text);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!names.length || busy) return;
    setBusy(true); setError('');
    try {
      await onCreateMany(names.map(name => ({ name, grade, photo: DEFAULT_AVATAR })));
      onClose();
    } catch (err) {
      // onCreateMany adds students sequentially; on a mid-list failure it
      // reports how many landed so we can drop those names and let a retry add
      // only the rest — re-submitting the whole list would duplicate them.
      const created = err.createdCount || 0;
      if (created > 0) setText(names.slice(created).join('\n'));
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        label="Names — one per line"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={'Student 1\nStudent 2\nStudent 3'}
        rows={6}
        autoFocus
      />
      <Select
        label="Grade for everyone"
        value={grade}
        onChange={e => setGrade(e.target.value)}
        options={GRADE_OPTIONS}
      />

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <Button type="submit" disabled={!names.length || busy} fullWidth>
        {busy
          ? 'Adding…'
          : names.length
            ? `Add ${names.length} ${names.length === 1 ? 'student' : 'students'}`
            : 'Add students'}
      </Button>
    </form>
  );
}

// --- Mode toggle -----------------------------------------------------------

function ModeToggle({ mode, setMode }) {
  return (
    <div style={toggleWrapStyle}>
      <ToggleButton active={mode === 'single'} onClick={() => setMode('single')} icon={<User size={15} strokeWidth={2.5} />}>
        One
      </ToggleButton>
      <ToggleButton active={mode === 'paste'} onClick={() => setMode('paste')} icon={<Users size={15} strokeWidth={2.5} />}>
        Many
      </ToggleButton>
    </div>
  );
}

function ToggleButton({ active, onClick, icon, children }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button
      type="button"
      onClick={onClick}
      {...handlers}
      style={{
        ...toggleButtonStyle,
        ...pressedStyle,
        background: active ? theme.colors.surface : 'transparent',
        color: active ? theme.colors.text : theme.colors.textMuted,
        boxShadow: active ? theme.shadow.sm : 'none',
      }}
    >
      {icon}
      {children}
    </button>
  );
}

const toggleWrapStyle = {
  display: 'flex',
  gap: 4,
  padding: 4,
  background: theme.colors.surfaceAlt,
  borderRadius: theme.radius.lg,
  marginBottom: 18,
};

const toggleButtonStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  padding: '10px 14px',
  border: 'none',
  borderRadius: theme.radius.md,
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: theme.font.family,
  WebkitTapHighlightColor: 'transparent',
  transition: 'background 0.18s ease, box-shadow 0.18s ease, color 0.18s ease',
};

const photoRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  marginBottom: 16,
};

const photoRowButtonStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  minHeight: 44,
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  fontFamily: theme.font.family,
};

const thumbStyle = {
  width: 44,
  height: 44,
  borderRadius: 22,
  background: theme.colors.avatarBg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  flexShrink: 0,
};

const thumbEmojiStyle = {
  fontSize: 24,
  lineHeight: 1,
};

const imgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

// Mirrors the "Add reason" text-affordance treatment in ReasonsScreen.
const photoRowLabelStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  color: theme.colors.accentDark,
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
};
