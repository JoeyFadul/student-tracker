/** The one popup surface — centered white panel (radius 24) over a 40% dim backdrop, springy scale-in. */
export interface SheetProps {
  open?: boolean;
  onClose?: () => void;
  /** 20px/700 title in the panel header */
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** render without fixed positioning (previews) */
  inline?: boolean;
}
