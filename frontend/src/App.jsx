import { useState, useCallback, useMemo, useEffect } from 'react';
import { Users, BarChart3, Settings } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useStudents } from './hooks/useStudents';
import { useSchoolYear } from './hooks/useSchoolYear';
import { useClassrooms } from './hooks/useClassrooms';
import { createApiClient } from './api';
import { theme } from './theme';
import { LoginScreen } from './components/login/LoginScreen';
import { CreateClassroomScreen } from './components/onboarding/CreateClassroomScreen';
import { Dashboard } from './components/dashboard/Dashboard';
import { StudentProfile } from './components/profile/StudentProfile';
import { StatsScreen } from './components/stats/StatsScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { ClassroomDetailScreen } from './components/settings/ClassroomDetailScreen';
import { SchoolYearDetailScreen } from './components/settings/SchoolYearDetailScreen';
import { YearArchive } from './components/archive/YearArchive';
import { TabBar } from './components/ui/TabBar';
import { Toast } from './components/ui/Toast';

const TABS = [
  { key: 'students', label: 'Students', icon: Users },
  { key: 'stats',    label: 'Stats',    icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export function App() {
  const auth = useAuth();
  const api = useMemo(() => auth.idToken ? createApiClient(auth.idToken) : null, [auth.idToken]);
  const classrooms = useClassrooms(api);
  const cid = classrooms.activeId;
  const studentsApi = useStudents(api, cid);
  const schoolYear = useSchoolYear(api, cid);
  const [activeTab, setActiveTab] = useState('students');
  const [settingsScreen, setSettingsScreen] = useState(null); // null | 'classroom' | 'schoolyear'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [toast, setToast] = useState(null);
  const [archiveYear, setArchiveYear] = useState(null);

  // Reset scroll position when navigating between top-level screens so each
  // view starts at the top instead of inheriting the previous one's position.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab, settingsScreen, selectedStudent?.id, archiveYear?.yearId]);

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
      const eventTimestamp = fresh.eventTimestamp;
      setToast({
        delta,
        message: fresh.name,
        actionLabel: 'Undo',
        onAction: async () => {
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
    if (!selectedStudent || !api || !cid) return;
    setUploadingPhoto(true);
    try {
      const { url, key } = await api.getPhotoUploadUrl(cid, selectedStudent.id);
      const putRes = await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': 'image/jpeg' } });
      if (!putRes.ok) throw new Error(`Photo upload failed (${putRes.status})`);
      // Persist the S3 key; backend converts it to a short-lived presigned GET
      // URL on every read so the bucket can stay private.
      const updated = await studentsApi.updateStudent(selectedStudent.id, { photo: key });
      setSelectedStudent(prev => prev ? { ...prev, photo: updated.photo } : prev);
    } catch (err) {
      studentsApi.setError(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  }, [selectedStudent, api, cid, studentsApi]);

  const handleBulkGrant = useCallback(async (ids, delta, reason) => {
    try {
      await studentsApi.bulkGrantPoints(ids, delta, reason);
      setToast({
        delta,
        message: `${ids.length} ${ids.length === 1 ? 'student' : 'students'}`,
      });
    } catch (err) {
      studentsApi.setError(err.message);
    }
  }, [studentsApi]);

  const handleStartYear = useCallback(async (label) => {
    await schoolYear.startYear(label);
    await studentsApi.refresh();
    setToast({ message: `Started school year: ${label}` });
  }, [schoolYear, studentsApi]);

  const handleEndYear = useCallback(async () => {
    await schoolYear.endYear();
    await studentsApi.refresh();
    setToast({ message: 'School year ended' });
  }, [schoolYear, studentsApi]);

  const handleDeleteYear = useCallback(async (yearId) => {
    await schoolYear.deleteYear(yearId);
    await studentsApi.refresh();
    setToast({ message: 'School year deleted' });
  }, [schoolYear, studentsApi]);

  if (auth.initializing) {
    return <FullPageMessage>Loading…</FullPageMessage>;
  }

  if (!auth.isAuthenticated) {
    return (
      <LoginScreen
        onSignIn={auth.signIn}
        onSubmitNewPassword={auth.submitNewPassword}
        onSignUp={auth.signUp}
        onConfirmSignUp={auth.confirmSignUp}
        onResendCode={auth.resendCode}
      />
    );
  }

  if (classrooms.loading) {
    return <FullPageMessage>Loading…</FullPageMessage>;
  }

  if (classrooms.classrooms.length === 0) {
    return (
      <CreateClassroomScreen
        onCreate={classrooms.createClassroom}
        onSignOut={auth.signOut}
      />
    );
  }

  const toastEl = toast && (
    <Toast
      delta={toast.delta}
      message={toast.message}
      actionLabel={toast.actionLabel}
      onAction={toast.onAction}
      onDismiss={() => setToast(null)}
    />
  );

  // Pick the screen to render. Student profile and year archive overlay on
  // top of whichever tab is active so the tab bar stays visible everywhere.
  let screen = null;
  if (selectedStudent) {
    screen = (
      <StudentProfile
        student={selectedStudent}
        onBack={closeStudent}
        onGrantPoints={handleGrantPoints}
        onSaveNotes={handleSaveNotes}
        onDelete={handleDeleteStudent}
        onPhotoUpload={handlePhotoUpload}
        uploadingPhoto={uploadingPhoto}
      />
    );
  } else if (archiveYear) {
    screen = (
      <YearArchive
        classroomId={cid}
        year={archiveYear}
        api={api}
        onBack={() => setArchiveYear(null)}
      />
    );
  } else if (activeTab === 'students') {
    screen = (
      <Dashboard
        students={studentsApi.students}
        loading={studentsApi.loading}
        yearLoading={schoolYear.loading}
        error={studentsApi.error}
        activeYear={schoolYear.active}
        classroomName={classrooms.active?.classroomName}
        onDismissError={() => studentsApi.setError('')}
        onSelectStudent={openStudent}
        onCreateStudent={studentsApi.createStudent}
        onBulkGrant={handleBulkGrant}
        onGoToSettings={() => setActiveTab('settings')}
      />
    );
  } else if (activeTab === 'stats') {
    screen = (
      <StatsScreen students={studentsApi.students} api={api} classroomId={cid} activeYear={schoolYear.active} />
    );
  } else if (activeTab === 'settings' && settingsScreen === 'classroom') {
    screen = (
      <ClassroomDetailScreen
        api={api}
        classroomsState={classrooms}
        onBack={() => setSettingsScreen(null)}
      />
    );
  } else if (activeTab === 'settings' && settingsScreen === 'schoolyear') {
    screen = (
      <SchoolYearDetailScreen
        schoolYear={schoolYear}
        isOwner={classrooms.active?.role === 'owner'}
        onStartYear={handleStartYear}
        onEndYear={handleEndYear}
        onDeleteYear={handleDeleteYear}
        onOpenArchive={(y) => { setSettingsScreen(null); setArchiveYear(y); }}
        onBack={() => setSettingsScreen(null)}
      />
    );
  } else if (activeTab === 'settings') {
    screen = (
      <SettingsScreen
        onSignOut={auth.signOut}
        activeClassroom={classrooms.active}
        activeYearLabel={schoolYear.active?.label}
        onOpenClassroom={() => setSettingsScreen('classroom')}
        onOpenSchoolYear={() => setSettingsScreen('schoolyear')}
      />
    );
  }

  return (
    <>
      {screen}
      <TabBar
        tabs={TABS}
        active={activeTab}
        onChange={(t) => {
          setActiveTab(t);
          setSettingsScreen(null);
          setSelectedStudent(null);
          setArchiveYear(null);
        }}
      />
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
      background: 'transparent',
      color: theme.colors.textMuted,
      fontFamily: theme.font.family,
    }}>
      {children}
    </div>
  );
}
