import { TrendingUp, Flame } from 'lucide-react';
import { theme } from '../../theme';
import { useEffect, useState } from 'react';

export function StatsScreen({ students, api, classroomId, activeYear }) {
  const totalStudents = students.length;
  const totalDollars = students.reduce((sum, s) => sum + (s.points || 0), 0);
  const onFire = students.filter(s => (s.streak || 0) > 1).length;
  const avg = totalStudents > 0 ? Math.round(totalDollars / totalStudents) : 0;

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <div>
            <div style={kickerStyle}>{activeYear?.label || 'No active year'}</div>
            <h1 style={titleStyle}>Statistics</h1>
          </div>
        </header>

        <div style={heroCardStyle}>
          <div style={heroLabelStyle}>Total dollars</div>
          <div style={heroNumberStyle}>{totalDollars.toLocaleString()}</div>
          <div style={heroSubStyle}>
            across {totalStudents} {totalStudents === 1 ? 'student' : 'students'}
          </div>

          <div style={dividerStyle} />

          <div style={breakdownRowStyle}>
            <BreakdownItem
              dotColor="#FF6B3D"
              label="Avg per student"
              value={avg}
            />
            <BreakdownItem
              dotColor="#5B8DEF"
              label="On streak"
              value={onFire}
              icon={<Flame size={12} color="#FF6B3D" />}
            />
          </div>
        </div>

        <DarkTopReasonsCard api={api} classroomId={classroomId} yearId={activeYear?.yearId} />
      </div>
    </div>
  );
}

function BreakdownItem({ dotColor, label, value, icon }) {
  return (
    <div style={breakdownItemStyle}>
      <div style={breakdownLabelRow}>
        <span style={{ ...dotStyle, background: dotColor }} />
        <span style={breakdownLabelStyle}>{label}</span>
      </div>
      <div style={breakdownValueStyle}>
        {icon}
        <span>{value}</span>
      </div>
    </div>
  );
}

function DarkTopReasonsCard({ api, classroomId, yearId }) {
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
        <TrendingUp size={14} color={theme.dark.textMuted} />
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
  background: theme.dark.bg,
  fontFamily: theme.font.family,
  color: theme.dark.text,
};

const containerStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: `24px 16px calc(${theme.tabBarHeight}px + 24px + ${theme.safeBottom})`,
};

const headerStyle = {
  marginBottom: 22,
};

const kickerStyle = {
  fontSize: theme.font.sizes.caption,
  color: theme.dark.textMuted,
  textTransform: 'uppercase',
  letterSpacing: 1.2,
  fontWeight: 600,
  marginBottom: 4,
};

const titleStyle = {
  fontSize: theme.font.sizes.largeTitle,
  fontWeight: 700,
  color: theme.dark.text,
  margin: 0,
  letterSpacing: '-0.025em',
  lineHeight: 1.1,
  fontFamily: theme.font.display,
};

const heroCardStyle = {
  background: theme.dark.surface,
  borderRadius: 24,
  padding: '28px 24px 24px',
  marginBottom: 16,
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
};

const heroLabelStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.dark.textMuted,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: 0.8,
  marginBottom: 6,
};

const heroNumberStyle = {
  fontSize: 64,
  fontWeight: 800,
  color: theme.dark.text,
  letterSpacing: '-0.04em',
  lineHeight: 1,
  fontFamily: theme.font.display,
};

const heroSubStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.dark.textMuted,
  marginTop: 8,
};

const dividerStyle = {
  height: 1,
  background: theme.dark.border,
  margin: '20px -24px',
};

const breakdownRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
};

const breakdownItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const breakdownLabelRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

const dotStyle = {
  width: 8,
  height: 8,
  borderRadius: 4,
  flexShrink: 0,
};

const breakdownLabelStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.dark.textMuted,
  fontWeight: 500,
};

const breakdownValueStyle = {
  fontSize: theme.font.sizes.title2,
  fontWeight: 700,
  color: theme.dark.text,
  letterSpacing: '-0.02em',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: theme.font.display,
};

const reasonsCardStyle = {
  background: theme.dark.surface,
  borderRadius: 20,
  padding: 20,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
};

const reasonsHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: theme.font.sizes.footnote,
  color: theme.dark.textMuted,
  fontWeight: 500,
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
  borderRadius: 10,
  overflow: 'hidden',
  background: theme.dark.surfaceAlt,
  minHeight: 40,
};

const reasonBarStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  background: theme.dark.accentSoft,
  zIndex: 0,
};

const reasonNameStyle = {
  position: 'relative',
  zIndex: 1,
  fontSize: theme.font.sizes.body,
  color: theme.dark.text,
  fontWeight: 600,
};

const reasonCountStyle = {
  position: 'relative',
  zIndex: 1,
  fontSize: theme.font.sizes.footnote,
  color: theme.dark.accent,
  fontWeight: 700,
};
