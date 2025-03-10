import pino from 'pino';

const sensitiveKeys = [
  'api_key',
  'apikey',
  'key',
  'token',
  'secret',
  'password',
  'auth',
  'credentials',
];

const redactConfig = {
  paths: sensitiveKeys,
  remove: true,
};

// Create a browser-safe logger for client-side
const createClientLogger = () => {
  return {
    info: (...args: any[]) => console.info(...args),
    error: (...args: any[]) => console.error(...args),
    warn: (...args: any[]) => console.warn(...args),
    debug: (...args: any[]) => console.debug(...args),
  };
};

// Create a full Pino logger for server-side
const createServerLogger = () => {
  return pino({
    level: process.env.LOG_LEVEL || 'info',
    redact: redactConfig,
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
  });
};

// Export the appropriate logger based on the environment
export const logger = typeof window === 'undefined' ? createServerLogger() : createClientLogger();
