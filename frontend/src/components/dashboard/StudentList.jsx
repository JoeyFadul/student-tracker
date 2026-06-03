import { StudentListItem } from './StudentListItem';

export function StudentList({ students, loading, onSelectStudent, searchTerm, selectable, selectedIds }) {
  if (loading && students.length === 0) {
    return <div style={messageStyle}>Loading…</div>;
  }

  if (students.length === 0) {
    return (
      <div style={messageStyle}>
        {searchTerm ? 'No students match your search.' : 'No students yet. Tap the + button to add one.'}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {students.map(student => (
        <StudentListItem
          key={student.id}
          student={student}
          onClick={onSelectStudent}
          selectable={selectable}
          selected={selectedIds?.has(student.id)}
        />
      ))}
    </div>
  );
}

const messageStyle = {
  padding: 40,
  textAlign: 'center',
  color: '#a8a29e',
  fontSize: 14,
};
