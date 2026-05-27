// Reward tier definitions. Based on the Parable of the Talents (Matthew 25).

import { Star, Award, Trophy, Sparkles } from 'lucide-react';

export const TIERS = [
  { name: 'One Talent',   min: 0,  color: '#a16207', bg: '#fef3c7', icon: Star },
  { name: 'Two Talents',  min: 30, color: '#475569', bg: '#e2e8f0', icon: Award },
  { name: 'Five Talents', min: 60, color: '#b45309', bg: '#fde68a', icon: Trophy },
  { name: 'Well Done',    min: 90, color: '#5b21b6', bg: '#ede9fe', icon: Sparkles },
];

/** Returns the highest tier the student has reached. */
export function getTier(points) {
  return [...TIERS].reverse().find(t => points >= t.min) || TIERS[0];
}
