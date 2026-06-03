import { useState, useCallback, useMemo } from 'react';
import { Users, BarChart3, Settings } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useStudents } from './hooks/useStudents';
import { createApiClient } from './api';
import { theme } from './theme';
import { LoginScreen } from './components/login/LoginScreen';
import { Dashboard } from './components/dashboard/Dashboard';
import { StudentProfile } from './components/profile/StudentProfile';
import { StatsScreen } from './components/stats/StatsScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { TabBar } from './components/ui/TabBar';
import { Toast } from './components/ui/Toast';

const TABS = [
  { key: 'students', label: 'Students', icon: Users },
  { key: 'stats',    label: 'Stats',    icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export function App() {
  const auth = useAuth();
  const studentsApi = useStudents(auth.idToken);
  const api = useMemo(() => auth.idToken ? createApiClient(auth.idToken) : null, [auth.idToken]);
  const [activeTab, setActiveTab] = useState('students');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [toast, setToast] = useState(null);

  const openStudent = useCallback(async (id) => {
    try {
      const full = await studentsApi.getStudent(id);
      setSelectedStudent(full);
    } catch (err) {
      studentsApi.setError(err.message);
    }
  }, [studentsApi]);

  const closeStudent = useCallback(() => setSelectedStudent(null), []);

  const handleGrantPoints = useCallback(async (id, delta, reason) => {
    try {
      const fresh = await studentsApi.grantPoints(id, delta, reason);
      setSelectedStudent(fresh);
      const verb = delta > 0 ? 'Granted' : 'Revoked';
      const eventTimestamp = fresh.eventTimestamp;
      setToast({
        message: `${verb} ${Math.abs(delta)} ${Math.abs(delta) === 1 ? 'dollar' : 'dollars'} for ${fresh.name}`,
        actionLabel: 'Undo',
        onAction: async () => {
          setToast(null);
          try {
            const undone = await studentsApi.deleteEvent(id, eventTimestamp);
            setSelectedStudent(undone);
          } catch (err) {
            studentsApi.setError(err.message);
          }
        },
      });
    } catch (err) {
      studentsApi.setError(err.message);
    }
  }, [studentsApi]);

  const handleSaveNotes = useCallback(async (id, notes) => {
    try {
      const updated = await studentsApi.updateStudent(id, { notes });
      setSelectedStudent(prev => prev ? { ...prev, notes: updated.notes } : prev);
    } catch (err) {
      studentsApi.setError(err.message);
    }
  }, [studentsApi]);

  const handleDeleteStudent = useCallback(async (id) => {
    await studentsApi.deleteStudent(id);
  }, [studentsApi]);

  const handlePhotoUpload = useCallback(async (file) => {
    if (!selectedStudent || !api) return;
    setUploadingPhoto(true);
    try {
      const { url, publicUrl } = await api.getPhotoUploadUrl(selectedStudent.id);
      await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': 'image/jpeg' } });
      const updated = await studentsApi.updateStudent(selectedStudent.id, { photo: publicUrl });
      setSelectedStudent(prev => prev ? { ...prev, photo: updated.photo } : prev);
    } catch (err) {
      studentsApi.setError(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  }, [selectedStudent, api, studentsApi]);

  const handleBulkGrant = useCallback(async (ids, delta, reason) => {
    try {
      await studentsApi.bulkGrantPoints(ids, delta, reason);
      const verb = delta > 0 ? 'Granted' : 'Revoked';
      const noun = Math.abs(delta) === 1 ? 'dollar' : 'dollars';
      setToast({
        message: `${verb} ${Math.abs(delta)} ${noun} to ${ids.length} ${ids.length === 1 ? 'student' : 'students'}`,
      });
    } catch (err) {
      studentsApi.setError(err.message);
    }
  }, [studentsApi]);

  if (auth.initializing) {
    return <FullPageMessage>Loading…</FullPageMessage>;
  }

  if (!auth.isAuthenticated) {
    return (
      <LoginScreen
        onSignIn={auth.signIn}
        onSubmitNewPassword={auth.submitNewPassword}
      />
    );
  }

  const toastEl = toast && (
    <Toast
      message={toast.message}
      actionLabel={toast.actionLabel}
      onAction={toast.onAction}
      onDismiss={() => setToast(null)}
    />
  );

  if (selectedStudent) {
    return (
      <>
        <StudentProfile
          student={selectedStudent}
          onBack={closeStudent}
          onGrantPoints={handleGrantPoints}
          onSaveNotes={handleSaveNotes}
          onDelete={handleDeleteStudent}
          onPhotoUpload={handlePhotoUpload}
          uploadingPhoto={uploadingPhoto}
        />
        {toastEl}
      </>
    );
  }

  return (
    <>
      {activeTab === 'students' && (
        <Dashboard
          students={studentsApi.students}
          loading={studentsApi.loading}
          error={studentsApi.error}
          onDismissError={() => studentsApi.setError('')}
          onSelectStudent={openStudent}
          onCreateStudent={studentsApi.createStudent}
          onBulkGrant={handleBulkGrant}
        />
      )}
      {activeTab === 'stats' && (
        <StatsScreen students={studentsApi.students} api={api} />
      )}
      {activeTab === 'settings' && (
        <SettingsScreen email={auth.email} onSignOut={auth.signOut} />
      )}
      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
      {toastEl}
    </>
  );
}

function FullPageMessage({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.colors.bg,
      color: theme.colors.textMuted,
      fontFamily: theme.font.family,
    }}>
      {children}
    </div>
  );
}
