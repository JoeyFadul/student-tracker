import { getTier } from '../../lib/tiers';
import { DEFAULT_AVATAR } from '../../lib/avatars';
import { TierBadge } from './TierBadge';

export function ProfileHeader({ student }) {
  const tier = getTier(student.points);

  return (
    <div style={cardStyle}>
      <div style={topRowStyle}>
        <div style={{ ...avatarStyle, background: tier.bg }}>
          {student.photo || DEFAULT_AVATAR}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={nameStyle}>{student.name}</div>
          <div style={gradeStyle}>{student.grade}</div>
        </div>
      </div>
      <TierBadge tier={tier} points={student.points} />
    </div>
  );
}

const cardStyle = {
  background: '#fff',
  borderRadius: 20,
  padding: 24,
  border: '1px solid #e7e2d8',
  marginBottom: 16,
};

const topRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  marginBottom: 16,
};

const avatarStyle = {
  width: 72,
  height: 72,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 40,
};

const nameStyle = {
  fontSize: 22,
  fontWeight: 600,
  color: '#1c1917',
  marginBottom: 2,
};

const gradeStyle = {
  fontSize: 14,
  color: '#78716c',
};
