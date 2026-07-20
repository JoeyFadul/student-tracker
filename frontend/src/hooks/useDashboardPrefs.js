import { useState, useCallback } from 'react';

// Per-classroom roster view preferences (sort + search), persisted under the
// wd: localStorage prefix. The Dashboard unmounts on every profile visit
// (the router swaps it out of the Outlet), so without this the sort and
// search reset constantly; persisting also survives app restarts. Keys live
// under wd: so useAuth clears them on sign-out with the rest.
//
// Read once per mount from the classroom's keys — callers pass a per-classroom
// `key` on the Dashboard so switching the active classroom loads the right
// prefs. Storage failures (private mode, quota) fall back to defaults.
export const DEFAULT_SORT = 'name'; // A–Z; the old "recent" default aged badly

const sortStorageKey = (cid) => `wd:sort:${cid}`;
const searchStorageKey = (cid) => `wd:search:${cid}`;

function readPref(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writePref(key, value) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    /* storage unavailable (private mode, quota) — preference just won't stick */
  }
}

export function useDashboardPrefs(classroomId) {
  const [sortKey, setSortKeyState] = useState(
    () => (classroomId && readPref(sortStorageKey(classroomId))) || DEFAULT_SORT
  );
  const [search, setSearchState] = useState(
    () => (classroomId && readPref(searchStorageKey(classroomId))) || ''
  );

  const setSortKey = useCallback((value) => {
    setSortKeyState(value);
    if (classroomId) writePref(sortStorageKey(classroomId), value);
  }, [classroomId]);

  const setSearch = useCallback((value) => {
    setSearchState(value);
    if (classroomId) writePref(searchStorageKey(classroomId), value);
  }, [classroomId]);

  return { sortKey, setSortKey, search, setSearch };
}
