import { env } from '@/lib/env';

/**
 * Log levels with numeric severity
 */
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

/**
 * Interface for log entry
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: number;
}

/**
 * Configuration interface for logger
 */
interface LoggerConfig {
  level?: LogLevel;
  enableConsole?: boolean;
  enableRemoteLogging?: boolean;
}

/**
 * Default logger configuration based on environment
 */
const DEFAULT_CONFIG: LoggerConfig = {
  level: env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
  enableConsole: true,
  enableRemoteLogging: env.NODE_ENV === 'production',
};

/**
 * Logger class implementing singleton pattern
 */
class Logger {
  private config: LoggerConfig;
  private static instance: Logger;

  private constructor(config?: LoggerConfig) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: LoggerConfig): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    return Logger.instance;
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, context?: unknown): void {
    // Only log if the current log level allows
    if (level > (this.config.level ?? LogLevel.INFO)) return;

    // Convert unknown context to Record<string, any> or undefined
    const safeContext = context ? this.convertToRecord(context) : undefined;

    const logEntry: LogEntry = {
      level,
      message,
      context: safeContext,
      timestamp: Date.now(),
    };

    // Console logging
    if (this.config.enableConsole) {
      this.consoleLog(logEntry);
    }

  }

  /**
   * Convert unknown value to a safe record
   */
  private convertToRecord(value: unknown): Record<string, unknown> {
    if (value === null) return { value: null };
    if (value === undefined) return { value: undefined };

    if (typeof value === 'object' && value !== null) {
      return Object.entries(value as Record<string, unknown>).reduce(
        (acc, [key, val]) => {
          acc[key] = val;
          return acc;
        },
        {} as Record<string, unknown>
      );
    }

    return { value };
  }

  /**
   * Format timestamp to ISO string
   */
  private formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toISOString();
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

  /**
   * Safely stringify context with depth limit and circular reference handling
   */
  private safeStringify(value: unknown, depth: number = 0): string {
    // Prevent excessive recursion
    if (depth > 3) return '[Depth Limit Exceeded]';

    // Handle null and undefined
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';

    // Handle primitive types
    if (['string', 'number', 'boolean'].includes(typeof value)) {
      return String(value);
    }

    // Handle Date objects
    if (value instanceof Date) {
      return value.toISOString();
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return `[${value.map((item) => this.safeStringify(item, depth + 1)).join(', ')}]`;
    }

    // Handle objects
    if (typeof value === 'object') {
      try {
        // Prevent circular references
        const seen = new WeakSet();

        const stringifyObject = (obj: object): string => {
          if (seen.has(obj)) return '[Circular]';
          seen.add(obj);

          const entries = Object.entries(obj).map(
            ([key, val]) => `${key}: ${this.safeStringify(val, depth + 1)}`
          );

          return `{ ${entries.join(', ')} }`;
        };

        return stringifyObject(value as object);
      } catch {
        return '[Unable to stringify]';
      }
    }

    // Fallback for functions or other unhandled types
    return String(value);
  }

  /**
   * Console logging with color and formatting
   */
  private consoleLog(entry: LogEntry): void {
    const { level, message, context, timestamp } = entry;
    const formattedTimestamp = this.formatTimestamp(timestamp);
    const { name: levelName, color: levelColor } = this.getLevelInfo(level);
    const contextString = context ? this.safeStringify(context) : '';

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
    const logPrefix = `${levelColor}[${levelName}]\x1b[0m ${formattedTimestamp} -`;

    if (contextString) {
      consoleMethod(`${logPrefix} ${message}`, contextString);
    } else {
      consoleMethod(`${logPrefix} ${message}`);
    }
  }

  /**
   * Remote logging implementation (placeholder)
   */
  /**
   * Public logging methods
   */
  public error(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  public info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Set log level dynamically
   */
  public setLogLevel(level: LogLevel): void {
    this.config.level = level;
  }
}

/**
 * Export singleton instance
 */
export const logger = Logger.getInstance();

/**
 * Configure logger with custom settings
 */
export function configureLogger(config: LoggerConfig): Logger {
  return Logger.getInstance(config);
}
