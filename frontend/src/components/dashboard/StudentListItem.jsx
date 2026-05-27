import { getTier } from '../../lib/tiers';
import { DEFAULT_AVATAR } from '../../lib/avatars';

export function StudentListItem({ student, onClick }) {
  const tier = getTier(student.points);
  const TierIcon = tier.icon;

  return (
    <button onClick={() => onClick(student.id)} style={itemStyle}>
      <div style={{ ...avatarStyle, background: tier.bg, overflow: 'hidden' }}>
        {student.photo?.startsWith('http')
          ? <img src={student.photo} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (student.photo || DEFAULT_AVATAR)
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={nameStyle}>{student.name}</div>
        <div style={tierRowStyle}>
          <TierIcon size={12} color={tier.color} />
          <span style={{ fontSize: 12, color: tier.color, fontWeight: 500 }}>{tier.name}</span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={pointsStyle}>{student.points}</div>
        <div style={pointsLabelStyle}>talents</div>
      </div>
    </button>
  );
}

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: 14,
  background: '#fff',
  border: '1px solid #e7e2d8',
  borderRadius: 16,
  cursor: 'pointer',
  textAlign: 'left',
  width: '100%',
  fontFamily: 'inherit',
};

const avatarStyle = {
  width: 52,
  height: 52,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 28,
  flexShrink: 0,
};

const nameStyle = {
  fontSize: 16,
  fontWeight: 600,
  color: '#1c1917',
  marginBottom: 2,
};

const tierRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

const pointsStyle = {
  fontSize: 22,
  fontWeight: 700,
  color: '#1c1917',
  lineHeight: 1,
};

const pointsLabelStyle = {
  fontSize: 11,
  color: '#a8a29e',
  marginTop: 2,
};
