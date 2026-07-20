import { useEffect, useRef, useState, useCallback } from 'react';
import { Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router';
import { Users, BarChart3, Settings } from 'lucide-react';
import { useStudents } from '../hooks/useStudents';
import { useSchoolYear } from '../hooks/useSchoolYear';
import { useReasons } from '../hooks/useReasons';
import { useClassroomsCtx, AppDataContext } from './context';
import { TabBar } from '../components/ui/TabBar';
import { Toast } from '../components/ui/Toast';

const TABS = [
  { key: 'students', label: 'Students', icon: Users },
  { key: 'stats',    label: 'Stats',    icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const TAB_ROOTS = { students: '/students', stats: '/stats', settings: '/settings' };

const tabOf = (pathname) =>
  pathname.startsWith('/stats') ? 'stats'
    : pathname.startsWith('/settings') ? 'settings'
    : 'students';

export function AppLayout() {
  const { api, classrooms } = useClassroomsCtx();
  const cid = classrooms.activeId;
  const studentsApi = useStudents(api, cid);
  const schoolYear = useSchoolYear(api, cid);
  const reasonsApi = useReasons(api, cid);
  const [toast, setToast] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = tabOf(location.pathname);

  // Per-tab route memory: tapping an inactive tab restores the last route
  // you were on within it; tapping the already-active tab pops to the tab
  // root. (The one deliberate navigation change from v1 — scope item 0.1.)
  const lastPathByTab = useRef({});
  useEffect(() => {
    lastPathByTab.current[tabOf(location.pathname)] = location.pathname;
  }, [location.pathname]);

  const changeTab = useCallback((tab) => {
    navigate(tab === tabOf(location.pathname)
      ? TAB_ROOTS[tab]
      : lastPathByTab.current[tab] || TAB_ROOTS[tab]);
  }, [navigate, location.pathname]);

  const showToast = useCallback((t) => setToast(t), []);

  return (
    <AppDataContext.Provider value={{ api, classrooms, studentsApi, schoolYear, reasonsApi, showToast }}>
      <Outlet />
      <TabBar tabs={TABS} active={activeTab} onChange={changeTab} />
      {toast && (
        <Toast
          delta={toast.delta}
          message={toast.message}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          onDismiss={() => setToast(null)}
        />
      )}
      <ScrollRestoration />
    </AppDataContext.Provider>
  );
}
