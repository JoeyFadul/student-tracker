import { Navigate, useNavigate, useParams } from 'react-router';
import { YearArchive } from '../components/archive/YearArchive';
import { FullPageMessage } from '../components/ui/FullPageMessage';
import { useAppData } from './context';
import { useBackOr } from '../hooks/useBackOr';

export function YearArchiveRoute() {
  const { yearId } = useParams();
  const navigate = useNavigate();
  const { api, classrooms, schoolYear } = useAppData();
  const goBack = useBackOr('/settings/school-year');

  const year = schoolYear.years.find(y => y.yearId === yearId);
  if (!year) {
    // Years still loading (deep link) or a stale/bad id.
    return schoolYear.loading
      ? <FullPageMessage>Loading…</FullPageMessage>
      : <Navigate to="/settings/school-year" replace />;
  }

  return (
    <YearArchive
      classroomId={classrooms.activeId}
      year={year}
      api={api}
      onBack={goBack}
      onSelectStudent={(student) =>
        // Student rides along in navigation state so the detail header can
        // render instantly; the route falls back to fetching on deep links.
        navigate(`/settings/school-year/archive/${yearId}/students/${student.id}`, {
          state: { student },
        })
      }
    />
  );
}
