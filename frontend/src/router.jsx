import { createHashRouter, Navigate } from 'react-router';
import { RootGate } from './routes/RootGate';
import { AuthedLayout } from './routes/AuthedLayout';
import { AppLayout } from './routes/AppLayout';
import { LoginRoute } from './routes/LoginRoute';
import { OnboardingRoute } from './routes/OnboardingRoute';
import { DashboardRoute } from './routes/DashboardRoute';
import { StudentProfileRoute } from './routes/StudentProfileRoute';
import { StatsRoute } from './routes/StatsRoute';
import { SettingsRoute } from './routes/SettingsRoute';
import { ClassroomDetailRoute } from './routes/ClassroomDetailRoute';
import { SchoolYearDetailRoute } from './routes/SchoolYearDetailRoute';
import { YearArchiveRoute } from './routes/YearArchiveRoute';
import { YearStudentDetailRoute } from './routes/YearStudentDetailRoute';

// Hash-based (createHashRouter) because WKWebView serves the SPA from a
// custom scheme: hash URLs need no server/scheme fallback config and
// survive reload at any depth. Swapping to browser history on web later is
// contained to this one call. Route map per docs/requirements/13.
export const router = createHashRouter([
  {
    element: <RootGate />,
    children: [
      { path: 'login', element: <LoginRoute /> },
      {
        element: <AuthedLayout />,
        children: [
          { path: 'onboarding', element: <OnboardingRoute /> },
          {
            element: <AppLayout />,
            children: [
              { index: true, element: <Navigate to="/students" replace /> },
              { path: 'students', element: <DashboardRoute /> },
              { path: 'students/:studentId', element: <StudentProfileRoute /> },
              { path: 'stats', element: <StatsRoute /> },
              { path: 'settings', element: <SettingsRoute /> },
              { path: 'settings/classroom', element: <ClassroomDetailRoute /> },
              { path: 'settings/school-year', element: <SchoolYearDetailRoute /> },
              { path: 'settings/school-year/archive/:yearId', element: <YearArchiveRoute /> },
              { path: 'settings/school-year/archive/:yearId/students/:studentId', element: <YearStudentDetailRoute /> },
              { path: '*', element: <Navigate to="/students" replace /> },
            ],
          },
        ],
      },
    ],
  },
]);
