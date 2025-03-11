const env = require('../scripts/mock-env').env;

/**
 * Log levels with numeric severity
 */
const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

/**
 * Default logger configuration based on environment
 */
const DEFAULT_CONFIG = {
  level: env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
  enableConsole: true,
  enableRemoteLogging: env.NODE_ENV === 'production',
};

/**
 * Logger class implementing singleton pattern
 */
class Logger {
  constructor(config) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
  }

  /**
   * Core logging method
   */
  log(level, message, context) {
    // Only log if the current log level allows
    if (level > (this.config.level ?? LogLevel.INFO)) return;

    const logEntry = {
      level,
      message,
      context,
      timestamp: Date.now(),
    };

    // Console logging
    if (this.config.enableConsole) {
      this.consoleLog(logEntry);
    }
  }

  /**
   * Console logging with color and formatting
   */
  consoleLog(entry) {
    const { level, message, context, timestamp } = entry;
    const formattedTimestamp = new Date(timestamp).toISOString();
    const levelInfo = this.getLevelInfo(level);
    const contextString = context ? JSON.stringify(context) : '';

    // Get the appropriate console method
    const consoleMethod =
      level === LogLevel.ERROR
        ? console.error
        : level === LogLevel.WARN
          ? console.warn
          : level === LogLevel.INFO
            ? console.info
            : console.debug;

    // Format the log message
    const logPrefix = `${levelInfo.color}[${levelInfo.name}]\x1b[0m ${formattedTimestamp} -`;

    if (contextString) {
      consoleMethod(`${logPrefix} ${message}`, contextString);
    } else {
      consoleMethod(`${logPrefix} ${message}`);
    }
  }

  /**
   * Get level name and color for console output
   */
  getLevelInfo(level) {
    switch (level) {
      case LogLevel.ERROR:
        return { name: 'ERROR', color: '\x1b[31m' }; // Red
      case LogLevel.WARN:
        return { name: 'WARN', color: '\x1b[33m' }; // Yellow
      case LogLevel.INFO:
        return { name: 'INFO', color: '\x1b[36m' }; // Cyan
      case LogLevel.DEBUG:
        return { name: 'DEBUG', color: '\x1b[90m' }; // Gray
      default:
        return { name: 'UNKNOWN', color: '\x1b[0m' };
    }
  }

  error(message, context) {
    this.log(LogLevel.ERROR, message, context);
  }

  warn(message, context) {
    this.log(LogLevel.WARN, message, context);
  }

  info(message, context) {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message, context) {
    this.log(LogLevel.DEBUG, message, context);
  }
}

// Create and export singleton instance
const logger = new Logger();

module.exports = {
  logger,
  LogLevel,
};
