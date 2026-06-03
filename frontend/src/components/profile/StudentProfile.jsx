import { useState } from 'react';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { theme } from '../../theme';
import { usePressable } from '../../hooks/usePressable';
import { ProfileHero } from './ProfileHero';
import { QuickGrantRow } from './QuickGrantRow';
import { PointsAdjuster } from './PointsAdjuster';
import { NotesEditor } from './NotesEditor';
import { ActivityHistory } from './ActivityHistory';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';

export function StudentProfile({
  student,
  onBack,
  onGrantPoints,
  onSaveNotes,
  onDelete,
  onPhotoUpload,
  uploadingPhoto,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdjuster, setShowAdjuster] = useState(false);

  const handleDelete = async () => {
    await onDelete(student.id);
    setShowDeleteModal(false);
    onBack();
  };

  return (
    <div style={pageStyle}>
      <NavBar onBack={onBack} onDelete={() => setShowDeleteModal(true)} />

      <div style={containerStyle}>
        <ProfileHero
          student={student}
          onPhotoUpload={onPhotoUpload}
          uploading={uploadingPhoto}
        />

        <QuickGrantRow
          onQuickGrant={(delta, reason) => onGrantPoints(student.id, delta, reason)}
          onMore={() => setShowAdjuster(true)}
        />

        <NotesEditor
          initialValue={student.notes || ''}
          onSave={(notes) => onSaveNotes(student.id, notes)}
        />

        <ActivityHistory history={student.history || []} />
      </div>

      <PointsAdjuster
        open={showAdjuster}
        onClose={() => setShowAdjuster(false)}
        onAdjust={(delta, reason) => {
          onGrantPoints(student.id, delta, reason);
          setShowAdjuster(false);
        }}
      />

      {showDeleteModal && (
        <DeleteConfirmModal
          studentName={student.name}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function NavBar({ onBack, onDelete }) {
  const backPress = usePressable();
  const deletePress = usePressable();
  return (
    <div style={navBarStyle}>
      <button
        onClick={onBack}
        {...backPress.handlers}
        style={{ ...iconBtnStyle, ...backPress.pressedStyle }}
        aria-label="Back"
      >
        <ChevronLeft size={22} color={theme.colors.text} />
      </button>
      <button
        onClick={onDelete}
        {...deletePress.handlers}
        style={{ ...iconBtnStyle, ...deletePress.pressedStyle, color: theme.colors.danger }}
        aria-label="Delete student"
      >
        <Trash2 size={20} color={theme.colors.danger} />
      </button>
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: 'transparent',
  fontFamily: theme.font.family,
};

const containerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: `8px 16px calc(40px + ${theme.safeBottom})`,
};

const navBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: 720,
  margin: '0 auto',
  padding: '12px 12px 0',
};

const iconBtnStyle = {
  background: theme.colors.surface,
  border: 'none',
  width: 40,
  height: 40,
  borderRadius: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: theme.shadow.sm,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
};
