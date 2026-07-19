import { ClassroomDetailScreen } from '../components/settings/ClassroomDetailScreen';
import { useAppData } from './context';
import { useBackOr } from '../hooks/useBackOr';

export function ClassroomDetailRoute() {
  const { api, classrooms } = useAppData();
  const goBack = useBackOr('/settings');
  return (
    <ClassroomDetailScreen
      api={api}
      classroomsState={classrooms}
      onBack={goBack}
    />
  );
}
