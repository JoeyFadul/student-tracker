import { theme } from '../../theme';
import { Card } from '../ui/Card';

export function ActivityHistory({ history = [] }) {
  return (
    <Card title="Activity">
      {history.length === 0 ? (
        <div style={emptyStyle}>No activity yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {history.map((entry, i) => (
            <ActivityEntry key={i} entry={entry} isLast={i === history.length - 1} />
          ))}
        </div>
      )}
    </Card>
  );
}

function ActivityEntry({ entry, isLast }) {
  const formattedDate = formatRelativeDate(entry.timestamp);
  const isPositive = entry.delta > 0;

  return (
    <div style={{ ...entryStyle, borderBottom: isLast ? 'none' : `1px solid ${theme.colors.border}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={reasonStyle}>{entry.reason || (isPositive ? 'Points awarded' : 'Points removed')}</div>
        <div style={dateStyle}>{formattedDate}</div>
      </div>
      <div style={{
        ...deltaStyle,
        color: isPositive ? theme.colors.success : theme.colors.danger,
        background: isPositive ? theme.colors.successSoft : theme.colors.dangerSoft,
      }}>
        {isPositive ? '+' : ''}{entry.delta}
      </div>
    </div>
  );
}

function formatRelativeDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const today = new Date();
  const diffDays = Math.floor((today - date) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const emptyStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textFaint,
  padding: '20px 0',
  textAlign: 'center',
};

const entryStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 0',
};

const reasonStyle = {
  fontSize: theme.font.sizes.body,
  color: theme.colors.text,
  fontWeight: 500,
  letterSpacing: '-0.005em',
};

const dateStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textFaint,
  marginTop: 2,
};

const deltaStyle = {
  fontSize: theme.font.sizes.footnote,
  fontWeight: 700,
  padding: '4px 10px',
  borderRadius: theme.radius.pill,
  minWidth: 38,
  textAlign: 'center',
};
