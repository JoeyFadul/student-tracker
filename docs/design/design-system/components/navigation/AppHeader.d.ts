/** Large-title screen header — 30px/800 rounded display face on the page background, sticky. */
export interface AppHeaderProps {
  title: React.ReactNode;
  /** 13px muted, single line ellipsized, e.g. "2025–2026 · 24 students" */
  subtitle?: React.ReactNode;
  /** trailing slot, usually an IconButton */
  action?: React.ReactNode;
  /** leading slot (back button) */
  left?: React.ReactNode;
  /** default true */
  sticky?: boolean;
}
