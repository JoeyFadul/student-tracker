import { useRef, useState } from 'react';
import { Camera, Flame } from 'lucide-react';
import { getTier } from '../../lib/tiers';
import { DEFAULT_AVATAR } from '../../lib/avatars';
import { computeStreak } from '../../lib/streaks';
import { TierBadge } from './TierBadge';

export function ProfileHeader({ student, onPhotoUpload, uploading }) {
  const tier = getTier(student.points);
  const fileInputRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const isPhotoUrl = student.photo?.startsWith('http');
  const streak = computeStreak(student.history);

  return (
    <div style={cardStyle}>
      <div style={topRowStyle}>
        <div
          style={{ ...avatarStyle, background: tier.bg, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
          onClick={() => !uploading && fileInputRef.current?.click()}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          title="Click to upload photo"
        >
          {isPhotoUrl
            ? <img src={student.photo} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : (student.photo || DEFAULT_AVATAR)
          }
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (uploading || hovered) ? 1 : 0, transition: 'opacity 0.15s' }}>
            {uploading
              ? <span style={{ fontSize: 20 }}>⏳</span>
              : <Camera size={22} color="#fff" />
            }
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) onPhotoUpload(f); e.target.value = ''; }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={nameStyle}>{student.name}</div>
          <div style={gradeStyle}>{student.grade}</div>
          {streak > 1 && (
            <div style={streakStyle}>
              <Flame size={14} color="#dc2626" />
              <span>{streak} day streak</span>
            </div>
          )}
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

const streakStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  marginTop: 6,
  fontSize: 13,
  fontWeight: 600,
  color: '#dc2626',
};
