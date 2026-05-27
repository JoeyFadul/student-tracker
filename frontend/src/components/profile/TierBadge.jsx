// TierBadge: shows the current tier with icon and total points.

export function TierBadge({ tier, points }) {
  const TierIcon = tier.icon;

  return (
    <div style={{ ...rowStyle, background: tier.bg }}>
      <TierIcon size={24} color={tier.color} />
      <div style={{ flex: 1 }}>
        {tier.name && <div style={{ ...tierNameStyle, color: tier.color }}>{tier.name}</div>}
        <div style={{ ...pointsStyle, color: tier.color }}>
          {points} <span style={{ fontSize: 14, fontWeight: 500 }}>dollars</span>
        </div>
      </div>
    </div>
  );
}

const rowStyle = {
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  padding: '14px 16px',
  borderRadius: 12,
};

const tierNameStyle = {
  fontSize: 12,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const pointsStyle = {
  fontSize: 28,
  fontWeight: 700,
  lineHeight: 1,
};
