// StudentProfile: composes the profile view. Owns local UI state (which modal is open),
// delegates data mutations to props from the parent App.

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ProfileHeader } from './ProfileHeader';
import { PointsAdjuster } from './PointsAdjuster';
import { NotesEditor } from './NotesEditor';
import { ActivityHistory } from './ActivityHistory';
import { DangerZone } from './DangerZone';
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

  const handleDelete = async () => {
    await onDelete(student.id);
    setShowDeleteModal(false);
    onBack();
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <button onClick={onBack} style={backButtonStyle}>
          <ArrowLeft size={18} /> Back to class
        </button>

        <ProfileHeader student={student} onPhotoUpload={onPhotoUpload} uploading={uploadingPhoto} />

        <PointsAdjuster
          onAdjust={(delta, reason) => onGrantPoints(student.id, delta, reason)}
        />

        <NotesEditor
          initialValue={student.notes || ''}
          onSave={(notes) => onSaveNotes(student.id, notes)}
        />

        <ActivityHistory history={student.history || []} />

        <DangerZone
          studentName={student.name}
          onDelete={() => setShowDeleteModal(true)}
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
  background: '#faf7f2',
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
};

const containerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '20px 16px 60px',
};

const backButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  background: 'none',
  border: 'none',
  color: '#78716c',
  fontSize: 15,
  cursor: 'pointer',
  padding: 0,
  marginBottom: 20,
  fontFamily: 'inherit',
};
