import { OnboardingWizard } from '../components/onboarding/OnboardingWizard';
import { useAuthCtx, useClassroomsCtx } from './context';

export function OnboardingRoute() {
  const auth = useAuthCtx();
  const { api, classrooms } = useClassroomsCtx();
  return (
    <OnboardingWizard
      api={api}
      classrooms={classrooms}
      onSignOut={auth.signOut}
    />
  );
}
