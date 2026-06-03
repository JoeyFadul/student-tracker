// Dashboard: composes the dashboard view. Owns local UI state (search, modal open),
// but delegates data operations to props from the parent App.

import { useState, useMemo } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { SearchBar } from './SearchBar';
import { SortControl, sortStudents } from './SortControl';
import { StudentList } from './StudentList';
import { AddStudentButton } from './AddStudentButton';
import { ErrorBanner } from '../ui/ErrorBanner';
import { AddStudentModal } from '../modals/AddStudentModal';

export function Dashboard({
  students,
  loading,
  error,
  onDismissError,
  onSelectStudent,
  onCreateStudent,
  onSignOut,
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('recent');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredAndSorted = useMemo(() => {
    const filtered = search
      ? students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
      : students;
    return sortStudents(filtered, sortKey);
  }, [students, search, sortKey]);

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <DashboardHeader onSignOut={onSignOut} />
        <ErrorBanner message={error} onDismiss={onDismissError} />
        <SearchBar value={search} onChange={setSearch} />
        <SortControl value={sortKey} onChange={setSortKey} />
        <StudentList
          students={filteredAndSorted}
          loading={loading}
          onSelectStudent={onSelectStudent}
          searchTerm={search}
        />
      </div>

      <AddStudentButton onClick={() => setShowAddModal(true)} />

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
