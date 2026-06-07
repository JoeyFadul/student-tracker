import { useState, useEffect, useCallback } from 'react';

export function useStudents(api, classroomId) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!api || !classroomId) { setStudents([]); return; }
    setLoading(true);
    try {
      const data = await api.listStudents(classroomId);
      setStudents(data.students || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api, classroomId]);

  useEffect(() => { refresh(); }, [refresh]);

  const getStudent = useCallback(async (id) => {
    return api.getStudent(classroomId, id);
  }, [api, classroomId]);

  const createStudent = useCallback(async (data, photoFile) => {
    const created = await api.createStudent(classroomId, data);

    // If the caller passed a File, fetch a presigned upload URL keyed to the
    // newly-created student's id, PUT the file, and PATCH the student with
    // the resulting S3 key. The backend requires the student to exist before
    // it'll sign an upload URL, so this has to happen post-create.
    let final = created;
    if (photoFile) {
      try {
        const { url, key } = await api.getPhotoUploadUrl(classroomId, created.id);
        const putRes = await fetch(url, {
          method: 'PUT', body: photoFile,
          headers: { 'Content-Type': 'image/jpeg' },
        });
        if (!putRes.ok) throw new Error(`Photo upload failed (${putRes.status})`);
        final = await api.updateStudent(classroomId, created.id, { photo: key });
      } catch (err) {
        // Student was created OK; only the photo failed. Surface the error
        // but keep the student so the user doesn't have to re-enter name/grade.
        setError(`Photo upload for ${created.name} failed: ${err.message}`);
      }
    }

    setStudents(prev => [...prev, final]);
    return final;
  }, [api, classroomId]);

  const updateStudent = useCallback(async (id, patch) => {
    const updated = await api.updateStudent(classroomId, id, patch);
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    return updated;
  }, [api, classroomId]);

  const deleteStudent = useCallback(async (id) => {
    await api.deleteStudent(classroomId, id);
    setStudents(prev => prev.filter(s => s.id !== id));
  }, [api, classroomId]);

  const grantPoints = useCallback(async (id, delta, reason) => {
    // Optimistic update — bump points locally and return the event metadata
    // the caller needs to append to history + offer Undo. Skips the
    // previous trailing GET /students/{id} that doubled the round-trip on
    // every grant. Streak might be a tick stale until the next dashboard
    // load — that's fine, the points/history that the user sees update
    // immediately.
    const result = await api.grantPoints(classroomId, id, delta, reason);
    setStudents(prev => prev.map(s => s.id === id ? { ...s, points: s.points + delta } : s));
    return result;
  }, [api, classroomId]);

  const deleteEvent = useCallback(async (id, timestamp, delta) => {
    // delta is what was originally granted; subtract it back from points.
    // Caller (App.jsx handleGrantPoints undo) hands it in from the toast.
    await api.deleteEvent(classroomId, id, timestamp);
    if (typeof delta === 'number') {
      setStudents(prev => prev.map(s => s.id === id ? { ...s, points: s.points - delta } : s));
    }
  }, [api, classroomId]);

  const bulkGrantPoints = useCallback(async (ids, delta, reason) => {
    const result = await api.bulkGrantPoints(classroomId, ids, delta, reason);
    setStudents(prev => prev.map(s => ids.includes(s.id) ? { ...s, points: s.points + delta } : s));
    return result;
  }, [api, classroomId]);

  const bulkRevertPoints = useCallback(async (ids, delta, timestamp, yearId) => {
    await api.bulkRevertPoints(classroomId, ids, delta, timestamp, yearId);
    setStudents(prev => prev.map(s => ids.includes(s.id) ? { ...s, points: s.points - delta } : s));
  }, [api, classroomId]);

  return {
    students, loading, error, setError, refresh,
    getStudent, createStudent, updateStudent, deleteStudent,
    grantPoints, deleteEvent, bulkGrantPoints, bulkRevertPoints,
  };
}
