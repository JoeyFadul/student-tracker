import { useState, useEffect, useCallback } from 'react';

export function useSchoolYear(api, classroomId) {
  const [active, setActive] = useState(null);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!api || !classroomId) {
      setActive(null); setYears([]); setLoading(false); return;
    }
    setLoading(true);
    try {
      const data = await api.listSchoolYears(classroomId);
      setActive(data.active || null);
      setYears(data.years || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api, classroomId]);

  useEffect(() => { refresh(); }, [refresh]);

  const startYear = useCallback(async (label) => {
    await api.startSchoolYear(classroomId, label);
    await refresh();
  }, [api, classroomId, refresh]);

  const endYear = useCallback(async () => {
    await api.endSchoolYear(classroomId);
    await refresh();
  }, [api, classroomId, refresh]);

  return { active, years, loading, error, refresh, startYear, endYear };
}

export function suggestYearLabel(now = new Date()) {
  const month = now.getMonth();
  const year = now.getFullYear();
  return month >= 6 ? `${year}–${year + 1}` : `${year - 1}–${year}`;
}

export function deriveYearOptions(now = new Date()) {
  const month = now.getMonth();
  const year = now.getFullYear();
  const academicStart = month >= 6 ? year : year - 1;
  const options = [];
  for (let i = -1; i <= 2; i++) {
    const start = academicStart + i;
    options.push(`${start}–${start + 1}`);
  }
  return options;
}
