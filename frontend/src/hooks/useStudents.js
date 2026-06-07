import { useState, useEffect, useCallback } from 'react';
import { compressImage } from '../lib/images';

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

  // Background photo upload — used both at create-time and from the profile
  // edit path. Compresses on the device first (phone photos are 3–10 MB
  // out of the camera; resized JPEG is usually 80–200 KB), then PUTs to
  // the presigned URL and PATCHes the student with the resulting S3 key.
  // Updates students-list state in place when the photo arrives.
  const uploadStudentPhoto = useCallback(async (studentId, photoFile) => {
    try {
      const compressed = await compressImage(photoFile);
      const { url, key } = await api.getPhotoUploadUrl(classroomId, studentId);
      const putRes = await fetch(url, {
        method: 'PUT', body: compressed,
        headers: { 'Content-Type': 'image/jpeg' },
      });
      if (!putRes.ok) throw new Error(`Photo upload failed (${putRes.status})`);
      const updated = await api.updateStudent(classroomId, studentId, { photo: key });
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, ...updated } : s));
      return updated;
    } catch (err) {
      setError(`Photo upload failed: ${err.message}`);
      throw err;
    }
  }, [api, classroomId]);

  const createStudent = useCallback(async (data, photoFile) => {
    // Create the student record first and return immediately — the modal
    // can close while the photo continues uploading in the background. The
    // new student renders in the list with the default emoji and the photo
    // pops in once the upload + PATCH chain finishes.
    const created = await api.createStudent(classroomId, data);
    setStudents(prev => [...prev, created]);
    if (photoFile) {
      // Fire-and-forget. uploadStudentPhoto handles its own error display.
      uploadStudentPhoto(created.id, photoFile).catch(() => {});
    }
    return created;
  }, [api, classroomId, uploadStudentPhoto]);

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
    uploadStudentPhoto,
  };
}
