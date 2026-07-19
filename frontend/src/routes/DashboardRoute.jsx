import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Dashboard } from '../components/dashboard/Dashboard';
import { useAppData } from './context';

export function DashboardRoute() {
  const navigate = useNavigate();
  const { classrooms, studentsApi, schoolYear, showToast } = useAppData();

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
      students={studentsApi.students}
      loading={studentsApi.loading}
      yearLoading={schoolYear.loading}
      error={studentsApi.error}
      activeYear={schoolYear.active}
      classroomName={classrooms.active?.classroomName}
      onDismissError={() => studentsApi.setError('')}
      onSelectStudent={(id) => navigate(`/students/${id}`)}
      onCreateStudent={studentsApi.createStudent}
      onBulkGrant={handleBulkGrant}
      onGoToSettings={() => navigate('/settings')}
      onRefresh={studentsApi.refresh}
    />
  );
}
