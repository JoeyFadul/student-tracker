// useStudents: encapsulates all student CRUD and the loading/error state around it.
// Components call these methods and only see the resulting list/error - no fetch logic in components.

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createApiClient } from '../api';

export function useStudents(idToken) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const api = useMemo(() => idToken ? createApiClient(idToken) : null, [idToken]);

  // Load on mount / when token changes
  useEffect(() => {
    if (!api) return;
    setLoading(true);
    api.listStudents()
      .then(data => setStudents(data.students || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [api]);

  const getStudent = useCallback(async (id) => {
    return api.getStudent(id);
  }, [api]);

  const createStudent = useCallback(async (data) => {
    const created = await api.createStudent(data);
    setStudents(prev => [...prev, created]);
    return created;
  }, [api]);

  const updateStudent = useCallback(async (id, patch) => {
    const updated = await api.updateStudent(id, patch);
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    return updated;
  }, [api]);

  const deleteStudent = useCallback(async (id) => {
    await api.deleteStudent(id);
    setStudents(prev => prev.filter(s => s.id !== id));
  }, [api]);

  const grantPoints = useCallback(async (id, delta, reason) => {
    const result = await api.grantPoints(id, delta, reason);
    // Re-fetch the full record to get updated points + new history entry
    const fresh = await api.getStudent(id);
    setStudents(prev => prev.map(s => s.id === id ? { ...s, points: fresh.points } : s));
    return { ...fresh, eventTimestamp: result.eventTimestamp };
  }, [api]);

  const deleteEvent = useCallback(async (id, timestamp) => {
    await api.deleteEvent(id, timestamp);
    const fresh = await api.getStudent(id);
    setStudents(prev => prev.map(s => s.id === id ? { ...s, points: fresh.points } : s));
    return fresh;
  }, [api]);

  const bulkGrantPoints = useCallback(async (ids, delta, reason) => {
    await api.bulkGrantPoints(ids, delta, reason);
    setStudents(prev => prev.map(s => ids.includes(s.id) ? { ...s, points: s.points + delta } : s));
  }, [api]);

  return {
    students,
    loading,
    error,
    setError,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    grantPoints,
    deleteEvent,
    bulkGrantPoints,
  };
}
