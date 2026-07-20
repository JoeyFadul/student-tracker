import { useNavigate } from 'react-router';
import { SettingsScreen } from '../components/settings/SettingsScreen';
import { useAuthCtx, useAppData } from './context';

export function SettingsRoute() {
  const navigate = useNavigate();
  const auth = useAuthCtx();
  const { api, classrooms, schoolYear } = useAppData();

  return (
    <SettingsScreen
      onSignOut={auth.signOut}
      email={auth.email}
      activeClassroom={classrooms.active}
      activeYearLabel={schoolYear.active?.label}
      onOpenClassroom={() => navigate('/settings/classroom')}
      onOpenSchoolYear={() => navigate('/settings/school-year')}
      onOpenReasons={() => navigate('/settings/reasons')}
      canManageReasons={classrooms.active?.role === 'owner'}
      onDeleteAccount={() => auth.deleteAccount(api)}
    />
  );
}
