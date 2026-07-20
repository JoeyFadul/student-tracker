import { useState, useEffect, useCallback } from 'react';
import { PRESET_REASONS } from '../lib/reasons';

// Per-classroom custom reason list for the grant pickers (2.0 item 1.5).
// Loads from GET /classrooms/{cid} (the server defaults reasons to the presets
// until a teacher customizes them); save() PUTs the full replacement list.
// Falls back to the presets on a load error so the pickers always have
// something. An intentionally emptied list (a real array) is respected.
export function useReasons(api, classroomId) {
  const [reasons, setReasons] = useState(PRESET_REASONS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!api || !classroomId) { setReasons(PRESET_REASONS); return; }
    let cancelled = false;
    setLoading(true);
    api.getClassroom(classroomId)
      .then(c => { if (!cancelled) setReasons(Array.isArray(c.reasons) ? c.reasons : PRESET_REASONS); })
      .catch(() => { if (!cancelled) setReasons(PRESET_REASONS); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [api, classroomId]);

  const save = useCallback(async (next) => {
    const { reasons: saved } = await api.updateReasons(classroomId, next);
    setReasons(saved);
    return saved;
  }, [api, classroomId]);

  return { reasons, loading, save };
}
