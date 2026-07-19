/** Student avatar squircle: photo, emoji, or 🌱 default on a honey-soft tile. */
export interface AvatarProps {
  /** { name, photo } — photo is an http URL or an emoji string */
  student: { name?: string; photo?: string };
  /** px, default 52. Roster 56, profile hero 120. */
  size?: number;
  /** default 16; use ~38% of size for large avatars (120 → 32) */
  radius?: number;
  /** default 54% of size */
  emojiSize?: number;
  style?: React.CSSProperties;
}
