import { Card } from '../ui/Card';

export function ActivityHistory({ history = [] }) {
  return (
    <Card title="Recent activity">
      {history.length === 0 ? (
        <div style={emptyStyle}>No activity yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {history.map((entry, i) => (
            <ActivityEntry key={i} entry={entry} />
          ))}
        </div>
      )}
    </Card>
  );
}

function ActivityEntry({ entry }) {
  const formattedDate = entry.timestamp?.slice(0, 10) || entry.date;
  const isPositive = entry.delta > 0;

  return (
    <div style={entryStyle}>
      <div style={{ flex: 1 }}>
        <div style={reasonStyle}>{entry.reason}</div>
        <div style={dateStyle}>{formattedDate}</div>
      </div>
      <div style={{ ...deltaStyle, color: isPositive ? '#16a34a' : '#dc2626' }}>
        {isPositive ? '+' : ''}{entry.delta}
      </div>
    </div>
  );
}

const emptyStyle = {
  fontSize: 14,
  color: '#a8a29e',
  padding: '20px 0',
  textAlign: 'center',
};

const entryStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 12px',
  background: '#faf7f2',
  borderRadius: 10,
};

const reasonStyle = {
  fontSize: 14,
  color: '#1c1917',
};

const dateStyle = {
  fontSize: 12,
  color: '#a8a29e',
  marginTop: 2,
};

const deltaStyle = {
  fontSize: 16,
  fontWeight: 600,
};
