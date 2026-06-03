// Dashboard: composes the dashboard view. Owns local UI state (search, modal open,
// select mode), but delegates data operations to props from the parent App.

import { useState, useMemo } from 'react';
import { CheckSquare } from 'lucide-react';
import { DashboardHeader } from './DashboardHeader';
import { SearchBar } from './SearchBar';
import { SortControl, sortStudents } from './SortControl';
import { StudentList } from './StudentList';
import { AddStudentButton } from './AddStudentButton';
import { BulkActionBar } from './BulkActionBar';
import { TopReasonsCard } from './TopReasonsCard';
import { ErrorBanner } from '../ui/ErrorBanner';
import { AddStudentModal } from '../modals/AddStudentModal';

export function Dashboard({
  students,
  loading,
  error,
  api,
  onDismissError,
  onSelectStudent,
  onCreateStudent,
  onSignOut,
  onBulkGrant,
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('recent');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [topReasonsRefresh, setTopReasonsRefresh] = useState(0);

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
    setTopReasonsRefresh(n => n + 1);
    exitSelectMode();
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <DashboardHeader onSignOut={onSignOut} />
        <ErrorBanner message={error} onDismiss={onDismissError} />
        <TopReasonsCard api={api} refreshKey={topReasonsRefresh} />
        <SearchBar value={search} onChange={setSearch} />
        <SortControl value={sortKey} onChange={setSortKey} />
        <div style={selectRowStyle}>
          <button
            onClick={() => selectMode ? exitSelectMode() : setSelectMode(true)}
            style={selectToggleStyle(selectMode)}
          >
            <CheckSquare size={14} /> {selectMode ? 'Cancel' : 'Select students'}
          </button>
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

const pageStyle = {
  minHeight: '100vh',
  background: '#faf7f2',
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
};

const containerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '20px 16px 100px',
};

const selectRowStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: 10,
};

const selectToggleStyle = (active) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  fontSize: 13,
  border: active ? '1.5px solid #1c1917' : '1px solid #e7e2d8',
  background: active ? '#1c1917' : '#fff',
  color: active ? '#fff' : '#57534e',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 500,
  fontFamily: 'inherit',
});
