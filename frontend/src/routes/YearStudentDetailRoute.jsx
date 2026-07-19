import { Navigate, useLocation, useParams } from 'react-router';
import { YearStudentDetail } from '../components/archive/YearStudentDetail';
import { FullPageMessage } from '../components/ui/FullPageMessage';
import { useAppData } from './context';
import { useBackOr } from '../hooks/useBackOr';

export function YearStudentDetailRoute() {
  const { yearId, studentId } = useParams();
  const location = useLocation();
  const { api, classrooms, schoolYear } = useAppData();
  const goBack = useBackOr(`/settings/school-year/archive/${yearId}`);

  const year = schoolYear.years.find(y => y.yearId === yearId);
  if (!year) {
    return schoolYear.loading
      ? <FullPageMessage>Loading…</FullPageMessage>
      : <Navigate to="/settings/school-year" replace />;
  }

  // Normally handed over by the archive list; on a deep link we only have
  // the id and YearStudentDetail fills the rest in from its own fetch.
  const student = location.state?.student ?? { id: studentId, name: '', photo: '', grade: '' };

  return (
    <YearStudentDetail
      classroomId={classrooms.activeId}
      year={year}
      student={student}
      api={api}
      onBack={goBack}
    />
  );
}
