import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { theme } from '../../theme';
import { AppHeader } from '../ui/AppHeader';
import { SearchBar } from './SearchBar';
import { SortControl, sortStudents } from './SortControl';
import { StudentList } from './StudentList';
import { AddStudentButton } from './AddStudentButton';
import { DashboardActions } from './DashboardActions';
import { allVisibleSelected, toggleSelectAll } from './selection';
import { BulkSelectFooter } from './BulkSelectFooter';
import { BulkGrantSheet } from './BulkGrantSheet';
import { ReasonPrompt } from '../profile/ReasonPrompt';
import { NoYearEmptyState } from './NoYearEmptyState';
import { SkeletonList } from '../ui/Skeleton';
import { ErrorBanner } from '../ui/ErrorBanner';
import { AddStudentModal } from '../modals/AddStudentModal';
import { PullIndicator } from '../ui/PullIndicator';
import { IconButton } from '../ui/IconButton';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { useDashboardPrefs } from '../../hooks/useDashboardPrefs';

// A class point is always +1; picking the amount is the select-all path's job.
const CLASS_POINT_DELTA = 1;

export function Dashboard({
  students,
  loading,
  yearLoading,
  error,
  activeYear,
  classroomId,
  classroomName,
  onDismissError,
  onSelectStudent,
  onCreateStudent,
  onCreateMany,
  onBulkGrant,
  onGoToSettings,
  onRefresh,
}) {
  // Pull-to-refresh — the hook drives transform on contentRef and opacity
  // on spinnerRef directly via the DOM, no React state per touchmove. Only
  // `refreshing` is re-rendered (start/end of the actual refresh).
  const { contentRef, spinnerRef, refreshing } = usePullToRefresh(onRefresh);
  // Sort + search persist per classroom (survives the Dashboard unmounting on
  // every profile visit, and app restarts). Default sort is A–Z.
  const { sortKey, setSortKey, search, setSearch } = useDashboardPrefs(classroomId);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showGrantSheet, setShowGrantSheet] = useState(false);
  const [classPointOpen, setClassPointOpen] = useState(false);

  const filteredAndSorted = useMemo(() => {
    const filtered = search
      ? students.filter(s => (s.name || '').toLowerCase().includes(search.toLowerCase()))
      : students;
    return sortStudents(filtered, sortKey);
  }, [students, search, sortKey]);

  const visibleIds = useMemo(() => filteredAndSorted.map(s => s.id), [filteredAndSorted]);
  const allSelected = allVisibleSelected(visibleIds, selectedIds);

  const selectedStudents = useMemo(
    () => students.filter(s => selectedIds.has(s.id)),
    [students, selectedIds]
  );

  const handleStudentClick = (id) => {
    if (selectMode) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
      });
    } else {
      onSelectStudent(id);
    }
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
    setShowGrantSheet(false);
  };

  const handleGrant = async (delta, reason) => {
    await onBulkGrant([...selectedIds], delta, reason);
    exitSelectMode();
  };

  const handleToggleAll = () => setSelectedIds(prev => toggleSelectAll(visibleIds, prev));

  // Class point rewards the whole class (not just the filtered view). Tapping
  // the chip opens the same reason menu as any other grant; picking a reason
  // awards +1 to everyone via the bulk-grant path, with its optimistic update
  // + Undo toast.
  const handleClassPointConfirm = async (delta, reason) => {
    setClassPointOpen(false);
    await onBulkGrant(students.map(s => s.id), delta, reason);
  };

  const bottomPadding = selectMode
    ? 140
    : `calc(${theme.tabBarHeight}px + 24px + ${theme.safeBottom})`;

  if (yearLoading) {
    return (
      <div style={pageStyle}>
        <AppHeader title={classroomName || 'Students'} />
        <div style={containerStyle}>
          <SkeletonList count={5} style={{ marginTop: 14 }} />
        </div>
      </div>
    );
  }

  if (!activeYear) {
    return (
      <div style={pageStyle}>
        <AppHeader title={classroomName || 'Students'} subtitle="No active school year" />
        <div style={containerStyle}>
          <ErrorBanner message={error} onDismiss={onDismissError} />
          <NoYearEmptyState onGoToSettings={onGoToSettings} />
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <AppHeader
        title={selectMode ? 'Select students' : (classroomName || 'Students')}
        subtitle={selectMode
          ? `${selectedIds.size} selected`
          : search
            ? `${filteredAndSorted.length} of ${students.length} ${students.length === 1 ? 'student' : 'students'}`
            : `${activeYear.label} · ${students.length} ${students.length === 1 ? 'student' : 'students'}`
        }
        action={selectMode ? <CancelButton onClick={exitSelectMode} /> : null}
      />
      <div ref={contentRef} style={pullWrapStyle}>
        <PullIndicator ref={spinnerRef} refreshing={refreshing} />
        <div style={{ ...containerStyle, paddingBottom: bottomPadding }}>
        <ErrorBanner message={error} onDismiss={onDismissError} />

        <div style={controlsRowStyle}>
          <SearchBar value={search} onChange={setSearch} />
          <SortControl value={sortKey} onChange={setSortKey} />
        </div>

        {students.length > 0 && (
          <DashboardActions
            selectMode={selectMode}
            allSelected={allSelected}
            onClassPoint={() => setClassPointOpen(true)}
            onEnterSelect={() => setSelectMode(true)}
            onToggleAll={handleToggleAll}
          />
        )}

        <StudentList
          students={filteredAndSorted}
          loading={loading}
          onSelectStudent={handleStudentClick}
          searchTerm={search}
          selectable={selectMode}
          selectedIds={selectedIds}
        />
        </div>
      </div>

      {!selectMode && <AddStudentButton onClick={() => setShowAddModal(true)} />}

      {selectMode && (
        <BulkSelectFooter
          count={selectedIds.size}
          onContinue={() => setShowGrantSheet(true)}
        />
      )}

      <BulkGrantSheet
        open={showGrantSheet}
        selected={selectedStudents}
        onBack={() => setShowGrantSheet(false)}
        onGrant={handleGrant}
      />

      <ReasonPrompt
        open={classPointOpen}
        amount={CLASS_POINT_DELTA}
        title={`Class point · ${students.length} ${students.length === 1 ? 'student' : 'students'}`}
        onClose={() => setClassPointOpen(false)}
        onConfirm={handleClassPointConfirm}
      />

      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onCreate={onCreateStudent}
          onCreateMany={onCreateMany}
        />
      )}
    </div>
  );
}

function CancelButton({ onClick }) {
  return (
    <IconButton
      onClick={onClick}
      ariaLabel="Cancel selection"
      icon={<X size={18} color={theme.colors.text} />}
    />
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: 'transparent',
  fontFamily: theme.font.family,
};

const containerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '16px 16px 100px',
};

const pullWrapStyle = {
  // Establishes a positioning context for the absolute-positioned spinner
  // above the content. translateZ(0) parks it on its own GPU layer so the
  // transform updates from usePullToRefresh don't trigger paint/layout on
  // anything outside this wrapper.
  position: 'relative',
  transform: 'translateZ(0)',
  willChange: 'transform',
};

const controlsRowStyle = {
  display: 'flex',
  gap: 8,
  marginBottom: 14,
  alignItems: 'center',
};
