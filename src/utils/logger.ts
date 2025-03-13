import { env } from './envConfig';

/**
 * Log levels with numeric severity
 */
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemoteLogging: boolean;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: unknown;
  timestamp: number;
}

/**
 * Default logger configuration based on environment
 */
const DEFAULT_CONFIG: LogConfig = {
  level: env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
  enableConsole: true,
  enableRemoteLogging: env.NODE_ENV === 'production',
};

/**
 * Logger class implementing singleton pattern with type safety
 */
class Logger {
  private config: LogConfig;

  constructor(config?: Partial<LogConfig>) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, context?: unknown): void {
    // Only log if the current log level allows
    if (level > (this.config.level ?? LogLevel.INFO)) return;

    const logEntry: LogEntry = {
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
  private consoleLog(entry: LogEntry): void {
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
  private getLevelInfo(level: LogLevel): { name: string; color: string } {
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

  error(message: string, context?: unknown): void {
    this.log(LogLevel.ERROR, message, context);
  }

  warn(message: string, context?: unknown): void {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context?: unknown): void {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: unknown): void {
    this.log(LogLevel.DEBUG, message, context);
  }
}

// Create and export singleton instance
export const logger = new Logger();
