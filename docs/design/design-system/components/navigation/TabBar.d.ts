/** Frosted-blur bottom tab bar; active tab shown by color alone (terracotta vs muted) — no filled highlight. */
export interface TabBarProps {
  /** key of the active tab; default "students" */
  active?: string;
  onChange?: (key: string) => void;
  /** defaults to the app's three tabs: Students (users), Stats (bar-chart-3), Settings (settings) */
  tabs?: { key: string; label: string; icon: string | React.ReactNode }[];
  /** fixed to viewport bottom (default) or in-flow */
  fixed?: boolean;
}
