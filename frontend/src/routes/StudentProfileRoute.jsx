import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router';
import { StudentProfile } from '../components/profile/StudentProfile';
import { SkeletonList } from '../components/ui/Skeleton';
import { useAppData, useAuthCtx } from './context';
import { useBackOr } from '../hooks/useBackOr';

export function StudentProfileRoute() {
  const { studentId } = useParams();
  const { api, classrooms, studentsApi, showToast } = useAppData();
  const auth = useAuthCtx();
  const cid = classrooms.activeId;
  const goBack = useBackOr('/students');
  const [student, setStudent] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Roster rows already carry everything but activity history (name,
  // photo, points, streak, notes), so seed from there for an instant
  // render and let the full fetch revalidate silently underneath — the
  // skeleton only appears on deep links, where there's no seed. Read the
  // roster through a ref so optimistic roster updates (grants) don't
  // retrigger this effect and cause the refetch loop this seeding exists
  // to avoid.
  // Synced in an effect (not during render) per react-hooks/refs; this
  // effect has no deps so it runs every commit, always before the fetch
  // effect below reads it.
  const studentsRef = useRef(studentsApi.students);
  useEffect(() => {
    studentsRef.current = studentsApi.students;
  });

  const { getStudent, setError } = studentsApi;
  useEffect(() => {
    let cancelled = false;
    setStudent(studentsRef.current.find(s => s.id === studentId) || null);
    setHistoryLoading(true);
    getStudent(studentId)
      .then(full => {
        if (cancelled) return;
        setStudent(full);
        setHistoryLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message);
        setHistoryLoading(false);
      });
    return () => { cancelled = true; };
  }, [getStudent, setError, studentId]);

  // Activity pagination — ActivityHistory calls this with the previous
  // page's nextCursor; we just hand the request to the api client.
  const loadMoreActivity = useCallback(
    (cursor) => api && cid
      ? api.getStudentActivity(cid, studentId, cursor)
      : Promise.resolve({ items: [], nextCursor: null }),
    [api, cid, studentId]
  );

  const handleGrantPoints = useCallback(async (id, delta, reason) => {
    try {
      const result = await studentsApi.grantPoints(id, delta, reason);
      const { eventTimestamp, yearId, reason: storedReason } = result;
      // Optimistically extend the local student so the activity row and the
      // points number both update immediately — no follow-up GET.
      let snapshotName = '';
      setStudent(prev => {
        if (!prev || prev.id !== id) return prev;
        snapshotName = prev.name;
        const newEvent = { studentId: id, delta, reason: storedReason, timestamp: eventTimestamp, yearId };
        return {
          ...prev,
          points: prev.points + delta,
          history: [newEvent, ...(prev.history || [])],
        };
      });
      showToast({
        delta,
        message: snapshotName,
        actionLabel: 'Undo',
        onAction: async () => {
          try {
            await studentsApi.deleteEvent(id, eventTimestamp, delta);
            setStudent(prev => {
              if (!prev || prev.id !== id) return prev;
              return {
                ...prev,
                points: prev.points - delta,
                history: (prev.history || []).filter(e => e.timestamp !== eventTimestamp),
              };
            });
          } catch (err) {
            studentsApi.setError(err.message);
          }
        },
      });
    } catch (err) {
      studentsApi.setError(err.message);
    }
  }, [studentsApi, showToast]);

  const handleSaveNotes = useCallback(async (id, notes) => {
    try {
      const updated = await studentsApi.updateStudent(id, { notes });
      setStudent(prev => prev ? { ...prev, notes: updated.notes } : prev);
    } catch (err) {
      studentsApi.setError(err.message);
    }
  }, [studentsApi]);

  // No catch — rejections propagate so EditStudentModal stays open and
  // shows the failure inline. The hook has already synced the roster row.
  const handleUpdateStudent = useCallback(async (id, patch) => {
    const updated = await studentsApi.updateStudent(id, patch);
    setStudent(prev => (prev && prev.id === id)
      ? { ...prev, name: updated.name, grade: updated.grade }
      : prev);
  }, [studentsApi]);

  const handleDeleteStudent = useCallback(async (id) => {
    await studentsApi.deleteStudent(id);
  }, [studentsApi]);

  // Per-event delete (activity history). Reverses points in the roster +
  // server, then updates the open profile's total. Errors propagate so the
  // ConfirmDialog surfaces them and keeps the row.
  const handleDeleteEvent = useCallback(async (timestamp, delta) => {
    await studentsApi.deleteEvent(studentId, timestamp, delta);
    setStudent(prev => (prev && prev.id === studentId)
      ? { ...prev, points: prev.points - delta }
      : prev);
  }, [studentsApi, studentId]);

  const handlePhotoUpload = useCallback(async (file) => {
    if (!student || !api || !cid) return;
    setUploadingPhoto(true);
    try {
      const updated = await studentsApi.uploadStudentPhoto(student.id, file);
      setStudent(prev => prev ? { ...prev, photo: updated.photo } : prev);
    } catch {
      // Error is already surfaced via studentsApi.setError inside the hook.
    } finally {
      setUploadingPhoto(false);
    }
  }, [student, api, cid, studentsApi]);

  if (!student) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 16px' }}>
        <SkeletonList count={4} />
      </div>
    );
  }

  return (
    <StudentProfile
      student={student}
      onBack={goBack}
      onGrantPoints={handleGrantPoints}
      onSaveNotes={handleSaveNotes}
      onUpdateStudent={handleUpdateStudent}
      onDelete={handleDeleteStudent}
      onPhotoUpload={handlePhotoUpload}
      uploadingPhoto={uploadingPhoto}
      onLoadMoreActivity={loadMoreActivity}
      onDeleteEvent={handleDeleteEvent}
      historyLoading={historyLoading}
      currentUserEmail={auth?.email}
    />
  );
}
