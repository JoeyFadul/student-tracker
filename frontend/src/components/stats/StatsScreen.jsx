import { TopReasonsCard } from '../dashboard/TopReasonsCard';
import { ScreenHeader } from '../ui/ScreenHeader';
import { theme } from '../../theme';

export function StatsScreen({ students, api, classroomId, activeYear }) {
  const totalStudents = students.length;
  const totalDollars = students.reduce((sum, s) => sum + (s.points || 0), 0);
  const onFire = students.filter(s => (s.streak || 0) > 1).length;

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <ScreenHeader
          title="Stats"
          subtitle={activeYear ? `${activeYear.label} · last 30 days` : 'No active school year'}
        />

        <div style={statsRowStyle}>
          <StatTile value={totalStudents} label="Students" />
          <StatTile value={totalDollars} label="Total dollars" />
          <StatTile value={onFire} label="On streak" />
        </div>

        <TopReasonsCard api={api} classroomId={classroomId} refreshKey={0} yearId={activeYear?.yearId} />
      </div>
    </div>
  );
}

function StatTile({ value, label }) {
  return (
    <div style={tileStyle}>
      <div style={tileValueStyle}>{value}</div>
      <div style={tileLabelStyle}>{label}</div>
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: theme.colors.bg,
  fontFamily: theme.font.family,
};

const containerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: `20px 16px calc(${theme.tabBarHeight}px + 24px + ${theme.safeBottom})`,
};

const statsRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 10,
  marginBottom: 16,
};

const tileStyle = {
  background: theme.colors.surface,
  borderRadius: theme.radius.lg,
  padding: '16px 12px',
  boxShadow: theme.shadow.md,
  textAlign: 'center',
};

const tileValueStyle = {
  fontSize: theme.font.sizes.title2,
  fontWeight: 700,
  color: theme.colors.text,
  letterSpacing: '-0.02em',
};

const tileLabelStyle = {
  fontSize: theme.font.sizes.caption,
  color: theme.colors.textMuted,
  marginTop: 2,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  fontWeight: 500,
};
