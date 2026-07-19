import { useState } from 'react';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { theme } from '../../theme';
import { formatGrade } from '../../lib/grades';
import { AppHeader } from '../ui/AppHeader';
import { IconButton } from '../ui/IconButton';
import { ProfileHero } from './ProfileHero';
import { QuickGrantRow } from './QuickGrantRow';
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
  onLoadMoreActivity,
  historyLoading = false,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    await onDelete(student.id);
    setShowDeleteModal(false);
    onBack();
  };

  return (
    <div style={pageStyle}>
      <AppHeader
        title={student.name}
        subtitle={formatGrade(student.grade)}
        left={<IconButton icon={<ChevronLeft size={22} color={theme.colors.text} />} onClick={onBack} ariaLabel="Back" />}
        action={<IconButton icon={<Trash2 size={18} color={theme.colors.danger} />} onClick={() => setShowDeleteModal(true)} ariaLabel="Delete student" />}
      />

      <div style={containerStyle}>
        <ProfileHero
          student={student}
          onPhotoUpload={onPhotoUpload}
          uploading={uploadingPhoto}
        />

        <QuickGrantRow
          onQuickGrant={(delta, reason) => onGrantPoints(student.id, delta, reason)}
        />

        <ActivityHistory
          initialItems={student.history || []}
          initialCursor={student.historyCursor || null}
          onLoadMore={onLoadMoreActivity}
          loading={historyLoading}
        />

        <NotesEditor
          initialValue={student.notes || ''}
          onSave={(notes) => onSaveNotes(student.id, notes)}
        />
      </div>

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

