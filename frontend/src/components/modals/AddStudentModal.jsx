import { useState, useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { ErrorBanner } from '../ui/ErrorBanner';
import { DEFAULT_AVATAR } from '../../lib/avatars';
import { theme } from '../../theme';

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
    <Modal title="New student" onClose={onClose}>
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
    </Modal>
  );
}

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
