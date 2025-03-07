// Simple logger for development
const formatValue = (value: any): string => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return value;

  try {
    return JSON.stringify(value, null, 2);
  } catch (e) {
    return String(value);
  }
};

const formatArgs = (args: any[]): string => {
  return args
    .map((arg) => {
      if (typeof arg === 'object' && arg !== null) {
        return formatValue(arg);
      }
      return String(arg);
    })
    .join(' ');
};

export const logger = {
  info: (...args: any[]) => {
    const message = formatArgs(args);
    console.log('[INFO]', message);
  },
  warn: (...args: any[]) => {
    const message = formatArgs(args);
    console.warn('[WARN]', message);
  },
  error: (...args: any[]) => {
    const message = formatArgs(args);
    console.error('[ERROR]', message);
  },
  debug: (...args: any[]) => {
    const message = formatArgs(args);
    console.debug('[DEBUG]', message);
  },
};
