import { StatsScreen } from '../components/stats/StatsScreen';
import { useAppData } from './context';

export function StatsRoute() {
  const { api, classrooms, studentsApi, schoolYear } = useAppData();
  return (
    <StatsScreen
      students={studentsApi.students}
      api={api}
      classroomId={classrooms.activeId}
      activeYear={schoolYear.active}
    />
  );
}
