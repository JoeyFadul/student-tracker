import { useRef, useState } from 'react';
import { Camera, Flame, Loader2 } from 'lucide-react';
import { theme } from '../../theme';
import { getTier } from '../../lib/tiers';
import { DEFAULT_AVATAR } from '../../lib/avatars';

export function ProfileHero({ student, onPhotoUpload, uploading }) {
  const tier = getTier(student.points);
  const fileInputRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const isPhotoUrl = student.photo?.startsWith('http');
  // Backend filters to active-year-only positive events so a streak can't
  // survive a year boundary.
  const streak = student.streak || 0;
  const TierIcon = tier.icon;

  return (
    <div style={wrapStyle}>
      <div
        style={{ ...avatarStyle, background: tier.bg }}
        onClick={() => !uploading && fileInputRef.current?.click()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title="Tap to change photo"
      >
        {isPhotoUrl
          ? <img src={student.photo} alt={student.name} style={imgStyle} />
          : <span style={{ fontSize: 56 }}>{student.photo || DEFAULT_AVATAR}</span>
        }
        <div style={{ ...overlayStyle, opacity: (uploading || hovered) ? 1 : 0 }}>
          {uploading
            ? <Loader2 size={28} color="#fff" strokeWidth={2.5} className="spin" />
            : <Camera size={26} color="#fff" />}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) onPhotoUpload(f); e.target.value = ''; }}
        />
      </div>

      <div style={chipRowStyle}>
        {tier.name && (
          <div style={{ ...chipStyle, background: tier.bg, color: tier.color }}>
            <TierIcon size={14} color={tier.color} />
            <span>{tier.name}</span>
          </div>
        )}
        {streak > 1 && (
          <div style={{ ...chipStyle, background: theme.colors.dangerSoft, color: theme.colors.danger }}>
            <Flame size={14} color={theme.colors.danger} />
            <span>{streak} day streak</span>
          </div>
        )}
      </div>

      <div style={pointsBlockStyle}>
        <div style={pointsValueStyle}>{student.points}</div>
        <div style={pointsLabelStyle}>dollars earned</div>
      </div>
    </div>
  );
}

const wrapStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px 0 12px',
  marginBottom: 4,
};

const avatarStyle = {
  width: 120,
  height: 120,
  borderRadius: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: 16,
  boxShadow: theme.shadow.md,
};

const imgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const overlayStyle = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.15s ease',
};

const chipRowStyle = {
  display: 'flex',
  gap: 8,
  marginTop: 12,
  flexWrap: 'wrap',
  justifyContent: 'center',
};

const chipStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  padding: '6px 12px',
  borderRadius: theme.radius.pill,
  fontSize: theme.font.sizes.footnote,
  fontWeight: 600,
};

const pointsBlockStyle = {
  textAlign: 'center',
  marginTop: 20,
};

const pointsValueStyle = {
  fontSize: 64,
  fontWeight: 800,
  color: theme.colors.accent,
  letterSpacing: '-0.04em',
  lineHeight: 1,
  fontFamily: theme.font.display,
};

const pointsLabelStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  fontWeight: 500,
  marginTop: 6,
};
