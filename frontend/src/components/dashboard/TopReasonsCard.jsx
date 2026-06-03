import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

export function TopReasonsCard({ api, refreshKey }) {
  const [reasons, setReasons] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!api) return;
    let cancelled = false;
    api.getTopReasons(30)
      .then(data => { if (!cancelled) setReasons(data.reasons || []); })
      .catch(err => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [api, refreshKey]);

  if (error || !reasons) return null;
  if (reasons.length === 0) return null;

  const max = reasons[0].count;

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <TrendingUp size={16} color="#78716c" />
        <span>Top reasons this month</span>
      </div>
      <div style={listStyle}>
        {reasons.slice(0, 5).map(r => (
          <div key={r.reason} style={rowStyle}>
            <div style={{ ...barStyle, width: `${(r.count / max) * 100}%` }} />
            <span style={reasonLabelStyle}>{r.reason}</span>
            <span style={countLabelStyle}>{r.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const cardStyle = {
  background: '#fff',
  border: '1px solid #e7e2d8',
  borderRadius: 16,
  padding: 16,
  marginBottom: 12,
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 13,
  color: '#78716c',
  fontWeight: 500,
  marginBottom: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const rowStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '6px 10px',
  borderRadius: 8,
  overflow: 'hidden',
  background: '#faf7f2',
};

const barStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  background: '#fde68a',
  zIndex: 0,
};

const reasonLabelStyle = {
  position: 'relative',
  zIndex: 1,
  fontSize: 14,
  color: '#1c1917',
  fontWeight: 500,
};

const countLabelStyle = {
  position: 'relative',
  zIndex: 1,
  fontSize: 13,
  color: '#78716c',
  fontWeight: 600,
};
