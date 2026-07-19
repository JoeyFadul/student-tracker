import { CreateClassroomScreen } from '../components/onboarding/CreateClassroomScreen';
import { useAuthCtx, useClassroomsCtx } from './context';

export function OnboardingRoute() {
  const auth = useAuthCtx();
  const { classrooms } = useClassroomsCtx();
  return (
    <CreateClassroomScreen
      onCreate={classrooms.createClassroom}
      onSignOut={auth.signOut}
    />
  );
}
