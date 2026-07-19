import { useMemo } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { createApiClient } from '../api';
import { useClassrooms } from '../hooks/useClassrooms';
import { useAuthCtx, ClassroomsContext } from './context';
import { FullPageMessage } from '../components/ui/FullPageMessage';

// Mounted only while signed in (RootGate redirects away otherwise), so
// sign-out unmounts this subtree and torches every cached classroom /
// student / school-year state — the next account can't inherit the
// previous user's data through stale React state.
export function AuthedLayout() {
  const auth = useAuthCtx();
  const api = useMemo(() => createApiClient(auth.idToken), [auth.idToken]);
  const classrooms = useClassrooms(api);
  const location = useLocation();
  const atOnboarding = location.pathname === '/onboarding';

  if (classrooms.loading) {
    return <FullPageMessage>Loading…</FullPageMessage>;
  }

  const hasClassroom = classrooms.classrooms.length > 0;
  if (!hasClassroom && !atOnboarding) return <Navigate to="/onboarding" replace />;
  if (hasClassroom && atOnboarding) return <Navigate to="/students" replace />;

  return (
    <ClassroomsContext.Provider value={{ api, classrooms }}>
      <Outlet />
    </ClassroomsContext.Provider>
  );
}
