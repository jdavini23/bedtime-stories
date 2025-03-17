/**
 * Converts a hex color to RGBA
 * @param hex - The hex color code
 * @param alpha - The opacity value (0-1)
 * @returns RGBA color string
 */
export function hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Standard opacity values for consistent usage
 */
export const opacityValues = {
  0: '0',
  5: '0.05',
  10: '0.1',
  20: '0.2',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  80: '0.8',
  90: '0.9',
  95: '0.95',
  100: '1',
} as const;

/**
 * Gets the CSS variable value with optional opacity
 * @param variable - The CSS variable name
 * @param opacity - Optional opacity value (0-100)
 * @returns The color value with opacity
 */
export function getColorWithOpacity(
  variable: string,
  opacity?: keyof typeof opacityValues
): string {
  const color = `var(${variable})`;
  if (typeof opacity === 'undefined') return color;
  return `rgb(var(${variable}) / ${opacityValues[opacity]})`;
}

import { type ClassValue } from 'clsx';

// Standard opacity levels
const opacityLevels = {
  hover: '90',
  active: '80',
  disabled: '50',
  muted: '70',
  subtle: '10',
  overlay: '30',
} as const;

// Color opacity classes for different states
export const colorOpacityClasses = {
  hover: {
    primary: `hover:bg-primary/${opacityLevels.hover}`,
    sky: `hover:bg-sky/${opacityLevels.hover}`,
    golden: `hover:bg-golden/${opacityLevels.hover}`,
    midnight: `hover:bg-midnight/${opacityLevels.hover}`,
  },
  active: {
    primary: `active:bg-primary/${opacityLevels.active}`,
    sky: `active:bg-sky/${opacityLevels.active}`,
    golden: `active:bg-golden/${opacityLevels.active}`,
    midnight: `active:bg-midnight/${opacityLevels.active}`,
  },
  disabled: {
    primary: `disabled:bg-primary/${opacityLevels.disabled}`,
    sky: `disabled:bg-sky/${opacityLevels.disabled}`,
    golden: `disabled:bg-golden/${opacityLevels.disabled}`,
    midnight: `disabled:bg-midnight/${opacityLevels.disabled}`,
  },
  muted: {
    primary: `bg-primary/${opacityLevels.muted}`,
    sky: `bg-sky/${opacityLevels.muted}`,
    golden: `bg-golden/${opacityLevels.muted}`,
    midnight: `bg-midnight/${opacityLevels.muted}`,
  },
  subtle: {
    primary: `bg-primary/${opacityLevels.subtle}`,
    sky: `bg-sky/${opacityLevels.subtle}`,
    golden: `bg-golden/${opacityLevels.subtle}`,
    midnight: `bg-midnight/${opacityLevels.subtle}`,
  },
  overlay: {
    primary: `bg-primary/${opacityLevels.overlay}`,
    sky: `bg-sky/${opacityLevels.overlay}`,
    golden: `bg-golden/${opacityLevels.overlay}`,
    midnight: `bg-midnight/${opacityLevels.overlay}`,
  },
} as const;

// Text opacity classes for different states
export const textOpacityClasses = {
  primary: {
    DEFAULT: 'text-text-primary',
    muted: `text-text-primary/${opacityLevels.muted}`,
    subtle: `text-text-primary/${opacityLevels.subtle}`,
  },
  secondary: {
    DEFAULT: 'text-text-secondary',
    muted: `text-text-secondary/${opacityLevels.muted}`,
    subtle: `text-text-secondary/${opacityLevels.subtle}`,
  },
} as const;

// Border opacity classes for different states
export const borderOpacityClasses = {
  primary: {
    DEFAULT: 'border-primary',
    muted: `border-primary/${opacityLevels.muted}`,
    subtle: `border-primary/${opacityLevels.subtle}`,
  },
  sky: {
    DEFAULT: 'border-sky',
    muted: `border-sky/${opacityLevels.muted}`,
    subtle: `border-sky/${opacityLevels.subtle}`,
  },
  golden: {
    DEFAULT: 'border-golden',
    muted: `border-golden/${opacityLevels.muted}`,
    subtle: `border-golden/${opacityLevels.subtle}`,
  },
  midnight: {
    DEFAULT: 'border-midnight',
    muted: `border-midnight/${opacityLevels.muted}`,
    subtle: `border-midnight/${opacityLevels.subtle}`,
  },
} as const;
