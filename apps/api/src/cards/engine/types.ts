/**
 * Card Engine Types
 * Core type definitions for SVG generation, themes, layout nodes, and card options.
 */

export type Density = 'compact' | 'cozy' | 'detailed';

export type FontStyleOption = 'sans' | 'serif' | 'mono' | 'rounded';

export type CardType =
  | 'profile'
  | 'stats'
  | 'languages'
  | 'streak'
  | 'repository'
  | 'rankings'
  | 'trophies'
  | 'topContributed'
  | 'wrapped'
  | 'activityGraph';

export interface ThemeProgressColors {
  background: string;
  fill: string;
}

export interface Theme {
  name: string;
  background: string;
  primaryText: string;
  secondaryText: string;
  border: string;
  accent: string;
  progressColors: ThemeProgressColors;
  fontFamily?: string;
}

export interface CardOptions {
  theme?: string;
  accent?: string;
  background?: string;
  border?: string;
  primary_text?: string;
  secondary_text?: string;
  border_radius?: number | string;
  hide_border?: boolean;
  font_family?: string;
  font_style?: FontStyleOption;
  layout?: Density;
  animated?: boolean;
  sponsor?: boolean;
  mock?: boolean;
  [key: string]: unknown;
}

export type IconName =
  | 'star'
  | 'repo'
  | 'fork'
  | 'commit'
  | 'pullRequest'
  | 'issue'
  | 'followers'
  | 'language'
  | 'fire'
  | 'calendar'
  | 'law'
  | 'lock'
  // Added 12+ new icons for 24+ total
  | 'trophy'
  | 'medal'
  | 'clock'
  | 'graph'
  | 'branch'
  | 'eye'
  | 'organization'
  | 'heart'
  | 'gist'
  | 'trending'
  | 'shield'
  | 'terminal'
  | 'ring';

export interface IconOptions {
  name: IconName;
  x: number;
  y: number;
  size?: number;
  fill?: string;
  className?: string;
}

export interface RectOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
  ry?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  fillOpacity?: number;
  className?: string;
  clipPath?: string;
}

export interface TextOptions {
  x: number;
  y: number;
  text?: string;
  content?: string;
  fontSize?: number;
  fontWeight?: number | string;
  fontFamily?: string;
  fill?: string;
  textAnchor?: 'start' | 'middle' | 'end' | 'center';
  dominantBaseline?: 'auto' | 'middle' | 'hanging' | 'central';
  className?: string;
  letterSpacing?: string;
  opacity?: number;
}

export interface CircleOptions {
  cx: number;
  cy: number;
  r: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
  opacity?: number;
}

export interface LineOptions {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeDasharray?: string;
  strokeLinecap?: 'butt' | 'round' | 'square';
}

export interface ProgressBarOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  progress: number; // 0 to 100
  backgroundColor?: string;
  fillColor?: string;
  rx?: number;
  animated?: boolean;
}
