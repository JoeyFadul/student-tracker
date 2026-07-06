import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { SchoolYearDetailScreen } from '../components/settings/SchoolYearDetailScreen';
import { useAppData } from './context';
import { useBackOr } from '../hooks/useBackOr';

export function SchoolYearDetailRoute() {
  const navigate = useNavigate();
  const { classrooms, studentsApi, schoolYear, showToast } = useAppData();
  const goBack = useBackOr('/settings');

  const handleStartYear = useCallback(async (label) => {
    await schoolYear.startYear(label);
    await studentsApi.refresh();
    showToast({ message: `Started school year: ${label}` });
  }, [schoolYear, studentsApi, showToast]);

  const handleEndYear = useCallback(async () => {
    await schoolYear.endYear();
    await studentsApi.refresh();
    showToast({ message: 'School year ended' });
  }, [schoolYear, studentsApi, showToast]);

  const handleDeleteYear = useCallback(async (yearId) => {
    await schoolYear.deleteYear(yearId);
    await studentsApi.refresh();
    showToast({ message: 'School year deleted' });
  }, [schoolYear, studentsApi, showToast]);

  return (
    <SchoolYearDetailScreen
      schoolYear={schoolYear}
      isOwner={classrooms.active?.role === 'owner'}
      onStartYear={handleStartYear}
      onEndYear={handleEndYear}
      onDeleteYear={handleDeleteYear}
      onOpenArchive={(y) => navigate(`/settings/school-year/archive/${y.yearId}`)}
      onBack={goBack}
    />
  );
}
