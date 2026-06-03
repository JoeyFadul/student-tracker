import { useState, useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { theme } from '../../theme';
import { ScreenHeader } from '../ui/ScreenHeader';
import { SearchBar } from './SearchBar';
import { SortControl, sortStudents } from './SortControl';
import { StudentList } from './StudentList';
import { AddStudentButton } from './AddStudentButton';
import { BulkActionBar } from './BulkActionBar';
import { ErrorBanner } from '../ui/ErrorBanner';
import { AddStudentModal } from '../modals/AddStudentModal';
import { usePressable } from '../../hooks/usePressable';

export function Dashboard({
  students,
  loading,
  error,
  onDismissError,
  onSelectStudent,
  onCreateStudent,
  onBulkGrant,
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('recent');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const filteredAndSorted = useMemo(() => {
    const filtered = search
      ? students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
      : students;
    return sortStudents(filtered, sortKey);
  }, [students, search, sortKey]);

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
  };

  const handleBulkGrant = async (delta, reason) => {
    await onBulkGrant([...selectedIds], delta, reason);
    exitSelectMode();
  };

  return (
    <div style={pageStyle}>
      <div style={{ ...containerStyle, paddingBottom: selectMode ? 380 : `calc(${theme.tabBarHeight}px + 24px + ${theme.safeBottom})` }}>
        <ScreenHeader
          title="Students"
          subtitle={`${students.length} ${students.length === 1 ? 'student' : 'students'}`}
          action={
            <SelectToggle
              active={selectMode}
              onClick={() => selectMode ? exitSelectMode() : setSelectMode(true)}
            />
          }
        />

        <ErrorBanner message={error} onDismiss={onDismissError} />

        <div style={controlsRowStyle}>
          <SearchBar value={search} onChange={setSearch} />
          <SortControl value={sortKey} onChange={setSortKey} />
        </div>

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
        <BulkActionBar
          selectedCount={selectedIds.size}
          onCancel={exitSelectMode}
          onGrant={handleBulkGrant}
        />
      )}

      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onCreate={onCreateStudent}
        />
      )}
    </div>
  );
}

function SelectToggle({ active, onClick }) {
  const { handlers, pressedStyle } = usePressable();
  return (
    <button
      onClick={onClick}
      {...handlers}
      style={{
        ...selectToggleStyle,
        ...pressedStyle,
        background: active ? theme.colors.accentSoft : 'transparent',
        color: active ? theme.colors.accentDark : theme.colors.textMuted,
      }}
    >
      <CheckCircle2 size={16} />
      <span>{active ? 'Done' : 'Select'}</span>
    </button>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: theme.colors.bg,
  fontFamily: theme.font.family,
};

const containerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '20px 16px 100px',
};

const controlsRowStyle = {
  display: 'flex',
  gap: 8,
  marginBottom: 14,
  alignItems: 'center',
};

const selectToggleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 14px',
  borderRadius: theme.radius.pill,
  border: 'none',
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: theme.font.family,
  transition: 'transform 0.1s ease, background 0.15s ease',
  WebkitTapHighlightColor: 'transparent',
  minHeight: 36,
};
