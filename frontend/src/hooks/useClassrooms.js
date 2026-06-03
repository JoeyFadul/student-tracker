import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'wd:activeClassroomId';

export function useClassrooms(api) {
  const [classrooms, setClassrooms] = useState([]);
  const [activeId, setActiveIdState] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || null; } catch { return null; }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!api) return;
    setLoading(true);
    try {
      const data = await api.listClassrooms();
      const list = data.classrooms || [];
      setClassrooms(list);
      setError('');
      // If our remembered active classroom no longer exists (or never set), pick the first
      setActiveIdState(prev => {
        const stillThere = prev && list.some(c => c.classroomId === prev);
        if (stillThere) return prev;
        const fallback = list[0]?.classroomId || null;
        try { fallback ? localStorage.setItem(STORAGE_KEY, fallback) : localStorage.removeItem(STORAGE_KEY); } catch {}
        return fallback;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { refresh(); }, [refresh]);

  const setActiveId = useCallback((id) => {
    setActiveIdState(id);
    try { id ? localStorage.setItem(STORAGE_KEY, id) : localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const createClassroom = useCallback(async (name) => {
    const created = await api.createClassroom(name);
    await refresh();
    setActiveId(created.classroomId);
    return created;
  }, [api, refresh, setActiveId]);

  const renameClassroom = useCallback(async (cid, name) => {
    await api.renameClassroom(cid, name);
    await refresh();
  }, [api, refresh]);

  const deleteClassroom = useCallback(async (cid) => {
    await api.deleteClassroom(cid);
    setActiveId(null);
    await refresh();
  }, [api, refresh, setActiveId]);

  const active = useMemo(
    () => classrooms.find(c => c.classroomId === activeId) || null,
    [classrooms, activeId]
  );

  return { classrooms, active, activeId, setActiveId, loading, error, refresh, createClassroom, renameClassroom, deleteClassroom };
}
