// App: the top-level component. Owns the high-level routing state (login vs dashboard
// vs profile) and wires the hooks to the feature components. Most logic lives in hooks;
// most rendering lives in components. This file is mostly just glue.

import { useState, useCallback } from 'react';
import { useAuth } from './hooks/useAuth';
import { useStudents } from './hooks/useStudents';
import { createApiClient } from './api';
import { LoginScreen } from './components/login/LoginScreen';
import { Dashboard } from './components/dashboard/Dashboard';
import { StudentProfile } from './components/profile/StudentProfile';

export function App() {
  const auth = useAuth();
  const studentsApi = useStudents(auth.idToken);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // ---- Navigation ----
  const openStudent = useCallback(async (id) => {
    try {
      const full = await studentsApi.getStudent(id);
      setSelectedStudent(full);
    } catch (err) {
      studentsApi.setError(err.message);
    }
  }, [studentsApi]);

  const closeStudent = useCallback(() => setSelectedStudent(null), []);

  // ---- Mutations on the selected student. After each, refresh the local copy. ----
  const handleGrantPoints = useCallback(async (id, delta, reason) => {
    try {
      const fresh = await studentsApi.grantPoints(id, delta, reason);
      setSelectedStudent(fresh);
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
    if (!selectedStudent) return;
    setUploadingPhoto(true);
    try {
      const api = createApiClient(auth.idToken);
      const { url, publicUrl } = await api.getPhotoUploadUrl(selectedStudent.id);
      await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': 'image/jpeg' } });
      const updated = await studentsApi.updateStudent(selectedStudent.id, { photo: publicUrl });
      setSelectedStudent(prev => prev ? { ...prev, photo: updated.photo } : prev);
    } catch (err) {
      studentsApi.setError(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  }, [selectedStudent, auth.idToken, studentsApi]);

  // ---- Render ----
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

  if (selectedStudent) {
    return (
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
  }

  return (
    <Dashboard
      students={studentsApi.students}
      loading={studentsApi.loading}
      error={studentsApi.error}
      onDismissError={() => studentsApi.setError('')}
      onSelectStudent={openStudent}
      onCreateStudent={studentsApi.createStudent}
      onSignOut={auth.signOut}
    />
  );
}

function FullPageMessage({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#faf7f2',
      color: '#78716c',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    }}>
      {children}
    </div>
  );
}
