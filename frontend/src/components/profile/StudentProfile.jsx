import { useState } from 'react';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { theme } from '../../theme';
import { usePressable } from '../../hooks/usePressable';
import { AppHeader } from '../ui/AppHeader';
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
      <AppHeader
        title={student.name}
        left={<HeaderIconButton icon={<ChevronLeft size={22} color={theme.colors.headerDarkText} />} onClick={onBack} ariaLabel="Back" />}
        action={<HeaderIconButton icon={<Trash2 size={18} color="#FCA5A5" />} onClick={() => setShowDeleteModal(true)} ariaLabel="Delete student" />}
      />

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

function HeaderIconButton({ icon, onClick, ariaLabel }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button
      onClick={onClick}
      {...handlers}
      style={{ ...headerIconBtnStyle, ...pressedStyle }}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
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
  padding: `8px 16px calc(${theme.tabBarHeight}px + 24px + ${theme.safeBottom})`,
};

const headerIconBtnStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: 'none',
  width: 36,
  height: 36,
  borderRadius: 18,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
};
