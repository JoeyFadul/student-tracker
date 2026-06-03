import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { theme } from '../../theme';
import { AppHeader } from '../ui/AppHeader';
import { SearchBar } from './SearchBar';
import { SortControl, sortStudents } from './SortControl';
import { StudentList } from './StudentList';
import { AddStudentButton } from './AddStudentButton';
import { BulkGrantEntry } from './BulkGrantEntry';
import { BulkSelectFooter } from './BulkSelectFooter';
import { BulkGrantSheet } from './BulkGrantSheet';
import { NoYearEmptyState } from './NoYearEmptyState';
import { DashboardSkeleton } from './DashboardSkeleton';
import { ErrorBanner } from '../ui/ErrorBanner';
import { AddStudentModal } from '../modals/AddStudentModal';
import { usePressable } from '../../hooks/usePressable';

export function Dashboard({
  students,
  loading,
  yearLoading,
  error,
  activeYear,
  classroomName,
  onDismissError,
  onSelectStudent,
  onCreateStudent,
  onBulkGrant,
  onGoToSettings,
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('recent');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showGrantSheet, setShowGrantSheet] = useState(false);

  const filteredAndSorted = useMemo(() => {
    const filtered = search
      ? students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
      : students;
    return sortStudents(filtered, sortKey);
  }, [students, search, sortKey]);

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

  const bottomPadding = selectMode
    ? 140
    : `calc(${theme.tabBarHeight}px + 24px + ${theme.safeBottom})`;

  if (yearLoading) {
    return (
      <div style={pageStyle}>
        <AppHeader title={classroomName || 'Students'} />
        <div style={containerStyle}>
          <DashboardSkeleton />
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
          ? `${selectedIds.size} ${selectedIds.size === 1 ? 'selected' : 'selected'}`
          : `${activeYear.label} · ${students.length} ${students.length === 1 ? 'student' : 'students'}`
        }
        action={selectMode ? <CancelButton onClick={exitSelectMode} /> : null}
      />
      <div style={{ ...containerStyle, paddingBottom: bottomPadding }}>
        <ErrorBanner message={error} onDismiss={onDismissError} />

        <div style={controlsRowStyle}>
          <SearchBar value={search} onChange={setSearch} />
          <SortControl value={sortKey} onChange={setSortKey} />
        </div>

        {!selectMode && students.length > 0 && (
          <BulkGrantEntry onClick={() => setSelectMode(true)} />
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

      {!selectMode && <AddStudentButton onClick={() => setShowAddModal(true)} />}

      {selectMode && (
        <BulkSelectFooter
          count={selectedIds.size}
          onCancel={exitSelectMode}
          onContinue={() => setShowGrantSheet(true)}
        />
      )}

      <BulkGrantSheet
        open={showGrantSheet}
        selected={selectedStudents}
        onBack={() => setShowGrantSheet(false)}
        onGrant={handleGrant}
      />

      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onCreate={onCreateStudent}
        />
      )}
    </div>
  );
}

function CancelButton({ onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button
      onClick={onClick}
      {...handlers}
      style={{ ...cancelStyle, ...pressedStyle }}
      aria-label="Cancel selection"
    >
      <X size={18} color={theme.colors.text} />
    </button>
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

const controlsRowStyle = {
  display: 'flex',
  gap: 8,
  marginBottom: 14,
  alignItems: 'center',
};

const cancelStyle = {
  width: 36,
  height: 36,
  borderRadius: 18,
  background: theme.colors.surface,
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: theme.shadow.sm,
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.1s ease',
};
