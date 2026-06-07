import { Star, Award, Trophy, Sparkles } from 'lucide-react';

export const TIERS = [
  { name: null,           min: 0,  color: '#a16207', bg: '#fef3c7', icon: Star },
  { name: 'Two Dollars',  min: 30, color: '#475569', bg: '#e2e8f0', icon: Award },
  { name: 'Five Dollars', min: 60, color: '#b45309', bg: '#fde68a', icon: Trophy },
  { name: 'Well Done',    min: 90, color: '#5b21b6', bg: '#ede9fe', icon: Sparkles },
];

/** Returns the highest tier the student has reached. */
export function getTier(/* points */) {
  // Tiers are intentionally off right now — every student renders as the
  // default tier so no achievement chip appears (the call sites only show
  // the chip when tier.name is truthy) and all avatars share one neutral
  // background. To bring tiers back, restore the previous logic:
  //   return [...TIERS].reverse().find(t => points >= t.min) || TIERS[0];
  return TIERS[0];
}
