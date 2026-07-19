import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthCtx } from './context';
import { FullPageMessage } from '../components/ui/FullPageMessage';

// Top-level guard: splash while restoring the session, /login when signed
// out, the app otherwise. Everything authed hangs off the Outlet, so a
// sign-out redirect unmounts the entire authed subtree (see AuthedLayout).
export function RootGate() {
  const auth = useAuthCtx();
  const location = useLocation();
  const atLogin = location.pathname === '/login';

  if (auth.initializing) {
    return <FullPageMessage>Loading…</FullPageMessage>;
  }
  if (!auth.isAuthenticated) {
    return atLogin ? <Outlet /> : <Navigate to="/login" replace />;
  }
  if (atLogin) {
    return <Navigate to="/students" replace />;
  }
  return <Outlet />;
}
