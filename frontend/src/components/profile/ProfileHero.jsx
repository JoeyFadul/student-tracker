import { useRef, useState } from 'react';
import { Camera, Flame, Loader2 } from 'lucide-react';
import { theme } from '../../theme';
import { Avatar } from '../ui/Avatar';
import { Chip } from '../ui/Chip';

export function ProfileHero({ student, onPhotoUpload, uploading }) {
  const fileInputRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  // Backend filters to active-year-only positive events so a streak can't
  // survive a year boundary.
  const streak = student.streak || 0;

  return (
    <div style={wrapStyle}>
      <div
        style={avatarWrapStyle}
        onClick={() => !uploading && fileInputRef.current?.click()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title="Tap to change photo"
      >
        <Avatar student={student} size={120} radius={32} emojiSize={56} />
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
        {streak > 1 && (
          <Chip tone="accent" icon={<Flame size={14} color={theme.colors.accentDark} />}>
            {streak} day streak
          </Chip>
        )}
      </div>

      <div style={pointsBlockStyle}>
        <div style={pointsValueStyle}>{student.points}</div>
        <div style={pointsLabelStyle}>points earned</div>
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

const avatarWrapStyle = {
  borderRadius: 32,
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: 16,
  boxShadow: theme.shadow.md,
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
