import { useState, useEffect, useCallback } from 'react';

export function useSchoolYear(api) {
  const [active, setActive] = useState(null);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!api) return;
    setLoading(true);
    try {
      const data = await api.listSchoolYears();
      setActive(data.active || null);
      setYears(data.years || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { refresh(); }, [refresh]);

  const startYear = useCallback(async (label) => {
    await api.startSchoolYear(label);
    await refresh();
  }, [api, refresh]);

  const endYear = useCallback(async () => {
    await api.endSchoolYear();
    await refresh();
  }, [api, refresh]);

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
  // Academic year start: if we're in July or later, this year; else last year.
  const academicStart = month >= 6 ? year : year - 1;
  const options = [];
  for (let i = -1; i <= 2; i++) {
    const start = academicStart + i;
    options.push(`${start}–${start + 1}`);
  }
  return options;
}
