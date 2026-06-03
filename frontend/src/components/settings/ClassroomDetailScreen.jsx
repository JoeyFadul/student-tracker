import { DetailScreen } from './DetailScreen';
import { ClassroomSection } from './ClassroomSection';

export function ClassroomDetailScreen({
  api,
  classroomsState,
  onBack,
}) {
  const isOwner = classroomsState.active?.role === 'owner';

  return (
    <DetailScreen title="Classroom" onBack={onBack}>
      <ClassroomSection
        api={api}
        classrooms={classroomsState.classrooms}
        active={classroomsState.active}
        onSwitch={classroomsState.setActiveId}
        onCreate={classroomsState.createClassroom}
        onRename={classroomsState.renameClassroom}
        onDelete={classroomsState.deleteClassroom}
        isOwner={isOwner}
      />
    </DetailScreen>
  );
}
