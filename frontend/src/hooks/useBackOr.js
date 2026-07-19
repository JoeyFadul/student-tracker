import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';

// Back that behaves like a chevron: pop history when there is somewhere to
// pop to; otherwise land on the fallback. Covers deep links and reloads
// where this screen is the first history entry ('default' key).
export function useBackOr(fallback) {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(() => {
    if (location.key !== 'default') navigate(-1);
    else navigate(fallback, { replace: true });
  }, [navigate, location.key, fallback]);
}
