/** White card: 1px hairline border + subtle neutral shadow, 20px radius. Bordered surface, not a floating tile. */
export interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  /** default 20 */
  padding?: number | string;
  style?: React.CSSProperties;
}
