import { useState, useCallback } from 'react';

// Per-classroom roster view preferences, keyed by classroom under the wd:
// prefix. The Dashboard unmounts on every profile visit (the router swaps it
// out of the Outlet), so both survive that round-trip. They differ in scope:
//   - sort  -> localStorage: a sticky preference that persists across launches.
//   - search-> sessionStorage: survives in-app navigation but is cleared on a
//     cold launch, so a teacher never reopens the app to a mysteriously
//     filtered roster (the search text + a clear button keep it recoverable
//     within a session).
export const DEFAULT_SORT = 'name'; // A–Z; the old "recent" default aged badly

const sortStorageKey = (cid) => `wd:sort:${cid}`;
const searchStorageKey = (cid) => `wd:search:${cid}`;

function read(store, key) {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

function write(store, key, value) {
  try {
    if (value) store.setItem(key, value);
    else store.removeItem(key);
  } catch {
    /* storage unavailable (private mode, quota) — preference just won't stick */
  }
}

export function useDashboardPrefs(classroomId) {
  const [sortKey, setSortKeyState] = useState(
    () => (classroomId && read(localStorage, sortStorageKey(classroomId))) || DEFAULT_SORT
  );
  const [search, setSearchState] = useState(
    () => (classroomId && read(sessionStorage, searchStorageKey(classroomId))) || ''
  );

  const setSortKey = useCallback((value) => {
    setSortKeyState(value);
    if (classroomId) write(localStorage, sortStorageKey(classroomId), value);
  }, [classroomId]);

  const setSearch = useCallback((value) => {
    setSearchState(value);
    if (classroomId) write(sessionStorage, searchStorageKey(classroomId), value);
  }, [classroomId]);

  return { sortKey, setSortKey, search, setSearch };
}
