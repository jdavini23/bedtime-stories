export const themeConfig = {
  light: {
    background: 'bg-cloud',
    backgroundMuted: 'bg-cloud/50',
    backgroundGradient: 'from-cloud via-cloud/50 to-white',
    text: 'text-text-primary',
    textMuted: 'text-text-secondary',
    border: 'border-text-primary/10',
    card: 'bg-white/80',
    cardHover: 'hover:bg-white/90',
    primary: 'bg-primary',
    primaryHover: 'hover:bg-primary/90',
    primaryMuted: 'bg-primary/10',
  },
  dark: {
    background: 'dark:bg-midnight',
    backgroundMuted: 'dark:bg-midnight/50',
    backgroundGradient: 'dark:from-midnight dark:via-midnight/50 dark:to-midnight-deep',
    text: 'dark:text-text-primary',
    textMuted: 'dark:text-text-primary/70',
    border: 'dark:border-text-primary/20',
    card: 'dark:bg-midnight/80',
    cardHover: 'dark:hover:bg-midnight/90',
    primary: 'dark:bg-primary',
    primaryHover: 'dark:hover:bg-primary/90',
    primaryMuted: 'dark:bg-primary/5',
  },
} as const;

export type Theme = 'light' | 'dark' | 'system';

export const themes: Theme[] = ['light', 'dark', 'system'];

// Common class combinations for reusability
export const themeClasses = {
  background: `${themeConfig.light.background} ${themeConfig.dark.background}`,
  backgroundMuted: `${themeConfig.light.backgroundMuted} ${themeConfig.dark.backgroundMuted}`,
  backgroundGradient: `bg-gradient-to-b ${themeConfig.light.backgroundGradient} ${themeConfig.dark.backgroundGradient}`,
  text: `${themeConfig.light.text} ${themeConfig.dark.text}`,
  textMuted: `${themeConfig.light.textMuted} ${themeConfig.dark.textMuted}`,
  border: `${themeConfig.light.border} ${themeConfig.dark.border}`,
  card: `${themeConfig.light.card} ${themeConfig.dark.card}`,
  cardHover: `${themeConfig.light.cardHover} ${themeConfig.dark.cardHover}`,
  primary: `${themeConfig.light.primary} ${themeConfig.dark.primary}`,
  primaryHover: `${themeConfig.light.primaryHover} ${themeConfig.dark.primaryHover}`,
  primaryMuted: `${themeConfig.light.primaryMuted} ${themeConfig.dark.primaryMuted}`,
} as const;
