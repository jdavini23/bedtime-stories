export const ANALYTICS_SCRIPT_PATH = '/scripts/analytics.js';
export const NON_CRITICAL_SCRIPT_PATH = '/scripts/non-critical.js';
export const CRITICAL_SCRIPT_PATH = '/scripts/critical.js';
export const THEME_SCRIPT_PATH = '/scripts/theme.js';

// Also export the constants as an object for type safety
export const SCRIPT_PATHS = {
  CRITICAL: CRITICAL_SCRIPT_PATH,
  ANALYTICS: ANALYTICS_SCRIPT_PATH,
  NON_CRITICAL: NON_CRITICAL_SCRIPT_PATH,
  THEME: THEME_SCRIPT_PATH,
} as const;

export const SCRIPT_PRIORITIES = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const SOCIAL_SHARE_SCRIPT_PATH = '/scripts/social-share.js';
export const FEEDBACK_WIDGET_SCRIPT_PATH = '/scripts/feedback.js';

export type ScriptPath = (typeof SCRIPT_PATHS)[keyof typeof SCRIPT_PATHS];
export type ScriptPriority = (typeof SCRIPT_PRIORITIES)[keyof typeof SCRIPT_PRIORITIES];
