import React from 'react';

const DEFAULT_AVATAR = '🌱';

// The one student avatar tile: photo if set, emoji otherwise, 🌱 default.
// Honey-soft squircle background; emoji is data, not decoration.
export function Avatar({ student = {}, size = 52, radius = 16, emojiSize, style }) {
  const isPhotoUrl = student.photo && student.photo.startsWith('http');
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: 'var(--wd-avatar-bg)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0, overflow: 'hidden', ...style,
    }}>
      {isPhotoUrl
        ? <img src={student.photo} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ fontSize: emojiSize != null ? emojiSize : Math.round(size * 0.54) }}>{student.photo || DEFAULT_AVATAR}</span>}
    </div>
  );
}
