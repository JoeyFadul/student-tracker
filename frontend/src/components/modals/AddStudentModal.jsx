import { useState, useRef, useEffect } from 'react';
import { Camera, X, User, Users } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
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

  const clearPhoto = (e) => {
    e.stopPropagation();
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
      <div style={photoSectionStyle}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={avatarCircleStyle}
          aria-label={photoPreview ? 'Change photo' : 'Add photo'}
        >
          {photoPreview ? (
            <>
              <img src={photoPreview} alt="" style={imgStyle} />
              <div style={removeBadgeStyle} onClick={clearPhoto} role="button" aria-label="Remove photo">
                <X size={14} color="#fff" strokeWidth={2.5} />
              </div>
            </>
          ) : (
            <>
              <span style={emojiStyle}>{DEFAULT_AVATAR}</span>
              <div style={cameraBadgeStyle}>
                <Camera size={14} color="#fff" strokeWidth={2.5} />
              </div>
            </>
          )}
        </button>
        <div style={photoHintStyle}>
          {photoPreview ? 'Tap to change' : 'Tap to add a photo'}
        </div>
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
        rows={8}
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

const photoSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: 22,
};

const avatarCircleStyle = {
  width: 92,
  height: 92,
  borderRadius: 46,
  background: theme.colors.surfaceAlt,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  padding: 0,
  WebkitTapHighlightColor: 'transparent',
  fontFamily: theme.font.family,
};

const imgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const emojiStyle = {
  fontSize: 44,
  lineHeight: 1,
};

const cameraBadgeStyle = {
  position: 'absolute',
  bottom: 4,
  right: 4,
  width: 28,
  height: 28,
  borderRadius: 14,
  background: theme.colors.accent,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: theme.shadow.sm,
  border: `2px solid ${theme.colors.surface}`,
  boxSizing: 'border-box',
};

const removeBadgeStyle = {
  position: 'absolute',
  top: 4,
  right: 4,
  width: 26,
  height: 26,
  borderRadius: 13,
  background: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const photoHintStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textMuted,
  marginTop: 10,
  fontFamily: theme.font.family,
};
