import { type ClassValue } from 'clsx';
import { type Config } from 'tailwindcss';

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

export const typography = {
  fonts: {
    sans: 'var(--font-inter)',
    dyslexic: 'var(--font-opendyslexic)',
  },
  sizes: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }],
  },
  weights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
} as const;

export const colors = {
  primary: {
    DEFAULT: 'var(--primary)',
    light: 'var(--primary-light)',
    dark: 'var(--primary-dark)',
    '50': '#f0f9ff',
    '100': '#e0f2fe',
    '200': '#bae6fd',
    '300': '#7dd3fc',
    '400': '#38bdf8',
    '500': '#0ea5e9',
    '600': '#0284c7',
    '700': '#0369a1',
    '800': '#075985',
    '900': '#0c4a6e',
  },
  sky: {
    DEFAULT: 'var(--sky)',
    light: 'var(--sky-light)',
    dark: 'var(--sky-dark)',
    '50': '#f0f9ff',
    '100': '#e0f2fe',
    '200': '#bae6fd',
    '300': '#7dd3fc',
    '400': '#38bdf8',
    '500': '#0ea5e9',
    '600': '#0284c7',
    '700': '#0369a1',
    '800': '#075985',
    '900': '#0c4a6e',
  },
  golden: {
    DEFAULT: 'var(--golden)',
    light: 'var(--golden-light)',
    dark: 'var(--golden-dark)',
    '50': '#fefce8',
    '100': '#fef9c3',
    '200': '#fef08a',
    '300': '#fde047',
    '400': '#facc15',
    '500': '#eab308',
    '600': '#ca8a04',
    '700': '#a16207',
    '800': '#854d0e',
    '900': '#713f12',
  },
  midnight: {
    DEFAULT: 'var(--midnight)',
    light: 'var(--midnight-light)',
    dark: 'var(--midnight-dark)',
    deep: 'var(--midnight-deep)',
    '50': '#f8fafc',
    '100': '#f1f5f9',
    '200': '#e2e8f0',
    '300': '#cbd5e1',
    '400': '#94a3b8',
    '500': '#64748b',
    '600': '#475569',
    '700': '#334155',
    '800': '#1e293b',
    '900': '#0f172a',
  },
  cloud: {
    DEFAULT: 'var(--cloud)',
    light: 'var(--cloud-light)',
    dark: 'var(--cloud-dark)',
    '50': '#f8fafc',
    '100': '#f1f5f9',
    '200': '#e2e8f0',
    '300': '#cbd5e1',
    '400': '#94a3b8',
    '500': '#64748b',
    '600': '#475569',
    '700': '#334155',
    '800': '#1e293b',
    '900': '#0f172a',
  },
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    inverted: 'var(--text-inverted)',
  },
  background: {
    DEFAULT: 'var(--background)',
    light: 'var(--background-light)',
    dark: 'var(--background-dark)',
  },
  border: {
    DEFAULT: 'var(--border)',
    light: 'var(--border-light)',
    dark: 'var(--border-dark)',
  },
  // Semantic colors
  success: {
    DEFAULT: 'var(--success)',
    light: 'var(--success-light)',
    dark: 'var(--success-dark)',
  },
  warning: {
    DEFAULT: 'var(--warning)',
    light: 'var(--warning-light)',
    dark: 'var(--warning-dark)',
  },
  error: {
    DEFAULT: 'var(--error)',
    light: 'var(--error-light)',
    dark: 'var(--error-dark)',
  },
  info: {
    DEFAULT: 'var(--info)',
    light: 'var(--info-light)',
    dark: 'var(--info-dark)',
  },
  lavender: {
    DEFAULT: '#A5A58D', // Sage Green
    dark: '#8A8A73',
    light: '#BCBCA7',
  },
  teal: {
    DEFAULT: '#6B9080', // Forest Green
    dark: '#567568',
    light: '#7FA895',
  },
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  dreamy: '0 4px 14px 0 rgba(60, 110, 113, 0.2)',
  glow: '0 0 15px rgba(242, 204, 143, 0.5)',
} as const;

export const animations = {
  keyframes: {
    float: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    twinkle: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },
    pageTurn: {
      '0%': { transform: 'rotateY(0deg)', transformOrigin: 'left' },
      '100%': { transform: 'rotateY(-180deg)', transformOrigin: 'left' },
    },
  },
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },
  easings: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndices = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Common component variants
export const componentVariants = {
  button: {
    solid: (props: { color?: keyof typeof colors }) => ({
      bg: `${props.color || 'primary'}.DEFAULT`,
      color: `${props.color || 'primary'}.foreground`,
      _hover: {
        bg: `${props.color || 'primary'}.dark`,
      },
    }),
    outline: (props: { color?: keyof typeof colors }) => ({
      borderWidth: '1px',
      borderColor: `${props.color || 'primary'}.DEFAULT`,
      color: `${props.color || 'primary'}.DEFAULT`,
      _hover: {
        bg: `${props.color || 'primary'}.light`,
        color: `${props.color || 'primary'}.foreground`,
      },
    }),
    ghost: (props: { color?: keyof typeof colors }) => ({
      color: `${props.color || 'primary'}.DEFAULT`,
      _hover: {
        bg: `${props.color || 'primary'}.light`,
        color: `${props.color || 'primary'}.foreground`,
      },
    }),
  },
  input: {
    outline: {
      borderWidth: '1px',
      borderColor: 'border.DEFAULT',
      _hover: {
        borderColor: 'border.hover',
      },
      _focus: {
        borderColor: 'primary.DEFAULT',
        boxShadow: `0 0 0 1px ${colors.primary.DEFAULT}`,
      },
    },
  },
} as const;
