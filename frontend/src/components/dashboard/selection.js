// Pure helpers for the dashboard select-all ("Select all") control.
// `visibleIds` are the ids currently shown (after search/sort); `selectedIds`
// is the Set of currently-selected ids. Kept side-effect free so the toggle
// logic is unit-tested directly (selection.test.js).

export function allVisibleSelected(visibleIds, selectedIds) {
  return visibleIds.length > 0 && visibleIds.every(id => selectedIds.has(id));
}

// Toggle only the visible ids: selecting all adds them, deselecting removes
// them. Selections outside the visible set (e.g. a student filtered out by an
// active search) are preserved either way.
export function toggleSelectAll(visibleIds, selectedIds) {
  const next = new Set(selectedIds);
  if (allVisibleSelected(visibleIds, selectedIds)) {
    visibleIds.forEach(id => next.delete(id));
  } else {
    visibleIds.forEach(id => next.add(id));
  }
  return next;
}
