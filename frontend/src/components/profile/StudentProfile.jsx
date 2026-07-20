import { useState } from 'react';
import { ChevronLeft, Pencil, Trash2 } from 'lucide-react';
import { theme } from '../../theme';
import { formatGrade } from '../../lib/grades';
import { AppHeader } from '../ui/AppHeader';
import { IconButton } from '../ui/IconButton';
import { ProfileHero } from './ProfileHero';
import { QuickGrantRow } from './QuickGrantRow';
import { NotesEditor } from './NotesEditor';
import { ActivityHistory } from './ActivityHistory';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';
import { EditStudentModal } from '../modals/EditStudentModal';

export function StudentProfile({
  student,
  onBack,
  onGrantPoints,
  onSaveNotes,
  onUpdateStudent,
  onDelete,
  onPhotoUpload,
  uploadingPhoto,
  onLoadMoreActivity,
  historyLoading = false,
  currentUserEmail,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
        action={
          <div style={headerActionsStyle}>
            <IconButton icon={<Pencil size={18} color={theme.colors.text} />} onClick={() => setShowEditModal(true)} ariaLabel="Edit student" />
            <IconButton icon={<Trash2 size={18} color={theme.colors.danger} />} onClick={() => setShowDeleteModal(true)} ariaLabel="Delete student" />
          </div>
        }
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
          currentUserEmail={currentUserEmail}
        />

        <NotesEditor
          initialValue={student.notes || ''}
          onSave={(notes) => onSaveNotes(student.id, notes)}
        />
      </div>

      {showEditModal && (
        <EditStudentModal
          student={student}
          onClose={() => setShowEditModal(false)}
          onSave={(patch) => onUpdateStudent(student.id, patch)}
        />
      )}

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

const headerActionsStyle = {
  display: 'flex',
  gap: 8,
};

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

