import { Check, Flame } from 'lucide-react';
import { getTier } from '../../lib/tiers';
import { DEFAULT_AVATAR } from '../../lib/avatars';

export function StudentListItem({ student, onClick, selectable, selected }) {
  const tier = getTier(student.points);
  const TierIcon = tier.icon;

  return (
    <button
      onClick={() => onClick(student.id)}
      style={{ ...itemStyle, borderColor: selected ? '#1c1917' : '#e7e2d8', borderWidth: selected ? 1.5 : 1 }}
    >
      {selectable && (
        <div style={getCheckboxStyle(selected)}>
          {selected && <Check size={14} color="#fff" strokeWidth={3} />}
        </div>
      )}
      <div style={{ ...avatarStyle, background: tier.bg, overflow: 'hidden' }}>
        {student.photo?.startsWith('http')
          ? <img src={student.photo} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (student.photo || DEFAULT_AVATAR)
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={nameStyle}>{student.name}</div>
        <div style={subRowStyle}>
          {tier.name && (
            <span style={tierChipStyle}>
              <TierIcon size={12} color={tier.color} />
              <span style={{ fontSize: 12, color: tier.color, fontWeight: 500 }}>{tier.name}</span>
            </span>
          )}
          {student.streak > 1 && (
            <span style={streakChipStyle}>
              <Flame size={12} color="#dc2626" />
              <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 600 }}>{student.streak}</span>
            </span>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={pointsStyle}>{student.points}</div>
        <div style={pointsLabelStyle}>dollars</div>
      </div>
    </button>
  );
}

const getCheckboxStyle = (selected) => ({
  width: 22,
  height: 22,
  borderRadius: 6,
  border: selected ? '2px solid #1c1917' : '2px solid #d6d3d1',
  background: selected ? '#1c1917' : '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

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

const subRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const tierChipStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

const streakChipStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 3,
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
