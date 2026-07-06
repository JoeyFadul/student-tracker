import { RouterProvider } from 'react-router/dom';
import { useAuth } from './hooks/useAuth';
import { AuthContext } from './routes/context';
import { router } from './router';

// Auth lives above the router so RootGate can guard on it; everything else
// (api client, classrooms, roster, school year) mounts inside the authed
// route subtree — see AuthedLayout for why.
export function App() {
  const auth = useAuth();
  return (
    <AuthContext.Provider value={auth}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}
