import { useEffect, useState } from 'react';
import { theme } from '../../theme';
import { Card } from '../ui/Card';

export function TopReasonsCard({ api, classroomId, refreshKey, yearId }) {
  const [reasons, setReasons] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!api || !classroomId) return;
    let cancelled = false;
    api.getTopReasons(classroomId, 30, yearId)
      .then(data => { if (!cancelled) setReasons(data.reasons || []); })
      .catch(err => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [api, classroomId, refreshKey, yearId]);

  if (error || !reasons || reasons.length === 0) return null;
  const max = reasons[0].count;

  return (
    <Card title="Top reasons" subtitle="Last 30 days">
      <div style={listStyle}>
        {reasons.slice(0, 5).map(r => (
          <div key={r.reason} style={rowStyle}>
            <div style={{ ...barStyle, width: `${(r.count / max) * 100}%` }} />
            <span style={reasonLabelStyle}>{r.reason}</span>
            <span style={countLabelStyle}>{r.count}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const rowStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 14px',
  borderRadius: theme.radius.md,
  overflow: 'hidden',
  background: theme.colors.surfaceAlt,
  minHeight: 40,
};

const barStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  background: theme.colors.accentSoft,
  zIndex: 0,
};

const reasonLabelStyle = {
  position: 'relative',
  zIndex: 1,
  fontSize: theme.font.sizes.body,
  color: theme.colors.text,
  fontWeight: 600,
};

const countLabelStyle = {
  position: 'relative',
  zIndex: 1,
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.accentDark,
  fontWeight: 700,
};
