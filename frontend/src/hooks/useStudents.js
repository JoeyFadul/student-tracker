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

  const createStudent = useCallback(async (data) => {
    const created = await api.createStudent(classroomId, data);
    setStudents(prev => [...prev, created]);
    return created;
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
    const result = await api.grantPoints(classroomId, id, delta, reason);
    const fresh = await api.getStudent(classroomId, id);
    setStudents(prev => prev.map(s => s.id === id ? { ...s, points: fresh.points } : s));
    return { ...fresh, eventTimestamp: result.eventTimestamp };
  }, [api, classroomId]);

  const deleteEvent = useCallback(async (id, timestamp) => {
    await api.deleteEvent(classroomId, id, timestamp);
    const fresh = await api.getStudent(classroomId, id);
    setStudents(prev => prev.map(s => s.id === id ? { ...s, points: fresh.points } : s));
    return fresh;
  }, [api, classroomId]);

  const bulkGrantPoints = useCallback(async (ids, delta, reason) => {
    await api.bulkGrantPoints(classroomId, ids, delta, reason);
    setStudents(prev => prev.map(s => ids.includes(s.id) ? { ...s, points: s.points + delta } : s));
  }, [api, classroomId]);

  return {
    students, loading, error, setError, refresh,
    getStudent, createStudent, updateStudent, deleteStudent,
    grantPoints, deleteEvent, bulkGrantPoints,
  };
}
