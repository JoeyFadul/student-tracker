import { theme } from '../../theme';
import { DEFAULT_AVATAR } from '../../lib/avatars';

// The one student avatar tile: photo if set, emoji otherwise, 🌱 default
// (FR-ST-5). Every roster/profile/sheet/archive surface renders through
// this so photo/emoji behavior only ever changes in one place.
export function Avatar({ student, size = 52, radius = theme.radius.lg, emojiSize, style }) {
  const isPhotoUrl = student.photo?.startsWith('http');
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: theme.colors.avatarBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
        ...style,
      }}
    >
      {isPhotoUrl
        ? <img src={student.photo} alt={student.name} style={imgStyle} />
        : <span style={{ fontSize: emojiSize ?? Math.round(size * 0.54) }}>{student.photo || DEFAULT_AVATAR}</span>
      }
    </div>
  );
}

const imgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};
