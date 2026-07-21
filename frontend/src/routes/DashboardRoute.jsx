import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Dashboard } from '../components/dashboard/Dashboard';
import { useAppData } from './context';

export function DashboardRoute() {
  const navigate = useNavigate();
  const { classrooms, studentsApi, schoolYear, showToast } = useAppData();

  // Paste-import: create each pasted student in turn (sequential so a partial
  // failure still lands the ones before it and surfaces the error). The Add
  // modal already shaped each entry with name/grade/default photo.
  const handleCreateMany = useCallback(async (students) => {
    // Tag the error with how many were created so the modal can drop those
    // names and let a retry add only the remainder (no duplicates).
    let created = 0;
    try {
      for (const data of students) {
        await studentsApi.createStudent(data);
        created += 1;
      }
    } catch (err) {
      err.createdCount = created;
      throw err;
    }
  }, [studentsApi]);

  const handleBulkGrant = useCallback(async (ids, delta, reason) => {
    try {
      const { timestamp, yearId } = await studentsApi.bulkGrantPoints(ids, delta, reason);
      showToast({
        delta,
        message: `${ids.length} ${ids.length === 1 ? 'student' : 'students'}`,
        actionLabel: 'Undo',
        onAction: async () => {
          try {
            await studentsApi.bulkRevertPoints(ids, delta, timestamp, yearId);
          } catch (err) {
            studentsApi.setError(err.message);
          }
        },
      });
    } catch (err) {
      studentsApi.setError(err.message);
    }
  }, [studentsApi, showToast]);

  return (
    <Dashboard
      // Remount on classroom switch so useDashboardPrefs reloads that
      // classroom's saved sort/search.
      key={classrooms.activeId}
      students={studentsApi.students}
      loading={studentsApi.loading}
      yearLoading={schoolYear.loading}
      error={studentsApi.error}
      activeYear={schoolYear.active}
      classroomId={classrooms.activeId}
      classroomName={classrooms.active?.classroomName}
      onDismissError={() => studentsApi.setError('')}
      onSelectStudent={(id) => navigate(`/students/${id}`)}
      onCreateStudent={studentsApi.createStudent}
      onCreateMany={handleCreateMany}
      onBulkGrant={handleBulkGrant}
      onGoToSettings={() => navigate('/settings')}
      onRefresh={studentsApi.refresh}
    />
  );
}
