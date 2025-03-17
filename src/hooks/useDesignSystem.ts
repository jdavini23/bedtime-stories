import { useTheme } from 'next-themes';
import {
  colors,
  spacing,
  typography,
  shadows,
  animations,
  breakpoints,
  zIndices,
  componentVariants,
} from '@/config/design-system';

export function useDesignSystem() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const getColor = (path: string) => {
    const parts = path.split('.');
    let result: any = colors;
    for (const part of parts) {
      result = result[part];
    }
    return result;
  };

  const getSpacing = (key: keyof typeof spacing) => spacing[key];

  const getTypography = (size: keyof typeof typography.sizes) => typography.sizes[size];

  const getShadow = (key: keyof typeof shadows) => shadows[key];

  const getAnimation = (
    keyframe: keyof typeof animations.keyframes,
    duration: keyof typeof animations.durations = 'normal',
    easing: keyof typeof animations.easings = 'default'
  ) => ({
    animation: `${keyframe} ${animations.durations[duration]} ${animations.easings[easing]}`,
  });

  const getBreakpoint = (key: keyof typeof breakpoints) => breakpoints[key];

  const getZIndex = (key: keyof typeof zIndices) => zIndices[key];
  const getVariant = <T extends keyof typeof componentVariants>(
    component: T,
    variant: keyof (typeof componentVariants)[T],
    props?: (typeof componentVariants)[T][typeof variant] extends (...args: any) => any
      ? Parameters<(typeof componentVariants)[T][typeof variant]>[0]
      : any
  ) => {
    const variantFn = componentVariants[component][variant];
    return typeof variantFn === 'function' ? variantFn(props) : (variantFn as any);
  };

  return {
    theme: currentTheme,
    isDark,
    colors,
    spacing,
    typography,
    shadows,
    animations,
    breakpoints,
    zIndices,
    getColor,
    getSpacing,
    getTypography,
    getShadow,
    getAnimation,
    getBreakpoint,
    getZIndex,
    getVariant,
  };
}
