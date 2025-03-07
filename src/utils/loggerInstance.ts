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

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: redactConfig,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
});
