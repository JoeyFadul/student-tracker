import { TrendingUp, Flame } from 'lucide-react';
import { theme } from '../../theme';
import { useEffect, useState } from 'react';
import { AppHeader } from '../ui/AppHeader';

// Light bento layout (wireframe frame 4): honey hero with the class
// total, avg + on-streak tiles, top-reasons bars. Replaced the v1
// dark-navy analytics screen in the Warm Craft pass.
export function StatsScreen({ students, api, classroomId, activeYear }) {
  const totalStudents = students.length;
  const totalPoints = students.reduce((sum, s) => sum + (s.points || 0), 0);
  const onFire = students.filter(s => (s.streak || 0) > 1).length;
  const avg = totalStudents > 0 ? Math.round(totalPoints / totalStudents) : 0;

  return (
    <div style={pageStyle}>
      <AppHeader title="Statistics" subtitle={activeYear?.label || 'No active school year'} />
      <div style={containerStyle}>
        <div style={gridStyle}>
          <div style={heroCardStyle}>
            <div style={heroLabelStyle}>Total points</div>
            <div style={heroNumberStyle}>{totalPoints.toLocaleString()}</div>
            <div style={heroSubStyle}>
              across {totalStudents} {totalStudents === 1 ? 'student' : 'students'}
            </div>
          </div>

          <div style={tileStyle}>
            <div style={tileLabelStyle}>Avg / student</div>
            <div style={tileValueStyle}>{avg}</div>
          </div>

          <div style={{ ...tileStyle, background: theme.colors.successSoft }}>
            <div style={{ ...tileLabelStyle, color: theme.colors.success }}>On streak</div>
            <div style={{ ...tileValueStyle, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Flame size={22} color={theme.colors.accent} />
              <span>{onFire}</span>
            </div>
          </div>

          <TopReasonsCard api={api} classroomId={classroomId} yearId={activeYear?.yearId} />
        </div>
      </div>
    </div>
  );
}

function TopReasonsCard({ api, classroomId, yearId }) {
  const [reasons, setReasons] = useState(null);

  useEffect(() => {
    if (!api || !classroomId) return;
    let cancelled = false;
    api.getTopReasons(classroomId, 30, yearId)
      .then(data => { if (!cancelled) setReasons(data.reasons || []); })
      .catch(() => { if (!cancelled) setReasons([]); });
    return () => { cancelled = true; };
  }, [api, classroomId, yearId]);

  if (!reasons || reasons.length === 0) return null;
  const max = reasons[0].count;

  return (
    <div style={reasonsCardStyle}>
      <div style={reasonsHeaderStyle}>
        <TrendingUp size={14} color={theme.colors.textMuted} />
        <span>Top reasons · last 30 days</span>
      </div>
      <div style={reasonsListStyle}>
        {reasons.slice(0, 5).map(r => (
          <div key={r.reason} style={reasonRowStyle}>
            <div style={{ ...reasonBarStyle, width: `${(r.count / max) * 100}%` }} />
            <span style={reasonNameStyle}>{r.reason}</span>
            <span style={reasonCountStyle}>{r.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: 'transparent',
  fontFamily: theme.font.family,
};

const containerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: `8px 16px calc(${theme.tabBarHeight}px + 24px + ${theme.safeBottom})`,
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 10,
};

const heroCardStyle = {
  gridColumn: '1 / 3',
  background: theme.colors.honeySoft,
  borderRadius: 24,
  padding: '24px 22px 22px',
  boxShadow: theme.shadow.md,
};

const heroLabelStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.honeyInk,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.8,
  marginBottom: 6,
};

const heroNumberStyle = {
  fontSize: 60,
  fontWeight: 800,
  color: theme.colors.text,
  letterSpacing: '-0.04em',
  lineHeight: 1,
  fontFamily: theme.font.display,
};

const heroSubStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.honeyInk,
  marginTop: 8,
};

const tileStyle = {
  background: theme.colors.surface,
  borderRadius: 20,
  padding: '16px 18px',
  boxShadow: theme.shadow.md,
};

const tileLabelStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textMuted,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  marginBottom: 8,
};

const tileValueStyle = {
  fontSize: 34,
  fontWeight: 800,
  color: theme.colors.text,
  letterSpacing: '-0.02em',
  lineHeight: 1,
  fontFamily: theme.font.display,
};

const reasonsCardStyle = {
  gridColumn: '1 / 3',
  background: theme.colors.surface,
  borderRadius: 20,
  padding: 20,
  boxShadow: theme.shadow.md,
};

const reasonsHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textMuted,
  fontWeight: 600,
  marginBottom: 14,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
};

const reasonsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const reasonRowStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 14px',
  borderRadius: 12,
  overflow: 'hidden',
  background: theme.colors.surfaceAlt,
  minHeight: 40,
};

const reasonBarStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  background: theme.colors.accentSoft,
  zIndex: 0,
};

const reasonNameStyle = {
  position: 'relative',
  zIndex: 1,
  fontSize: theme.font.sizes.body,
  color: theme.colors.text,
  fontWeight: 600,
};

const reasonCountStyle = {
  position: 'relative',
  zIndex: 1,
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.accentDark,
  fontWeight: 700,
};
