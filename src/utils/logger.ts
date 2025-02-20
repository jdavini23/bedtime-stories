import { env } from '@/lib/env';

// Log levels with numeric severity
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

// Interface for log entry
export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  timestamp?: number;
}

// Configuration interface for logger
interface LoggerConfig {
  level?: LogLevel;
  enableConsole?: boolean;
  enableRemoteLogging?: boolean;
}

class Logger {
  private config: LoggerConfig;
  private static instance: Logger;

  private constructor(config?: LoggerConfig) {
    this.config = {
      level: env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
      enableConsole: true,
      enableRemoteLogging: env.NODE_ENV === 'production',
      ...config,
    };
  }

  // Singleton pattern
  public static getInstance(config?: LoggerConfig): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    return Logger.instance;
  }

  // Core logging method
  private log(level: LogLevel, message: string, context?: unknown): void {
    // Only log if the current log level allows
    if (!this.config || !this.config.level || level > this.config.level) return;

    // Convert unknown context to Record<string, any> or undefined
    const safeContext = context ? this.convertToRecord(context) : undefined;

    const logEntry: LogEntry | null = {
      level,
      message,
      context: safeContext,
      timestamp: Date.now(),
    };

    // Console logging
    if (this.config.enableConsole && logEntry) {
      this.consoleLog(logEntry);
    }

    // Remote logging (placeholder for future implementation)
    if (this.config.enableRemoteLogging) {
      this.remoteLog(logEntry);
    }
  }

  // Console logging with color and formatting
  private convertToRecord(value: unknown): Record<string, any> {
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value).reduce(
        (acc, [key, val]) => {
          acc[key] = val;
          return acc;
        },
        {} as Record<string, any>
      );
    }
    return { value };
  }

  private consoleLog(entry: LogEntry): void {
    const { level, message, context, timestamp } = entry;

    // Modify the timestamp handling to ensure a valid timestamp
    const ensureValidTimestamp = (timestamp?: number | string | Date): string => {
      if (timestamp == null) {
        return new Date().toISOString();
      }

      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

      return date.toISOString();
    };

    const formattedTimestamp = ensureValidTimestamp(timestamp);

    // Advanced context stringification with depth and circular reference handling
    const safeStringify = (value: unknown, depth: number = 0): string => {
      // Prevent excessive recursion
      if (depth > 3) return '[Depth Limit Exceeded]';

      // Handle primitive types
      if (value == null) return 'null';
      if (value == null) return 'undefined';

      // Handle basic types
      if (['string', 'number', 'boolean'].includes(typeof value)) {
        return String(value);
      }

      // Handle Date objects
      if (value instanceof Date) {
        return value.toISOString();
      }

      // Handle arrays
      if (Array.isArray(value)) {
        return `[${value.map((item) => safeStringify(item, depth + 1)).join(', ')}]`;
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
              ([key, val]) => `${key}: ${safeStringify(val, depth + 1)}`
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
    };

    const contextString = context ? safeStringify(context) : '';

    // Colorized log levels with context
    const logWithContext = (
      consoleMethod: (...args: unknown[]) => void,
      levelColor: string,
      levelName: string
    ) => {
      if (contextString) {
        consoleMethod(
          `${levelColor}[${levelName}]\x1b[0m ${formattedTimestamp} - ${message}`,
          contextString
        );
      } else {
        consoleMethod(`${levelColor}[${levelName}]\x1b[0m ${formattedTimestamp} - ${message}`);
      }
    };

    switch (level) {
      case LogLevel.ERROR:
        logWithContext(console.error, '\x1b[31m', 'ERROR');
        break;
      case LogLevel.WARN:
        logWithContext(console.warn, '\x1b[33m', 'WARN');
        break;
      case LogLevel.INFO:
        logWithContext(console.info, '\x1b[36m', 'INFO');
        break;
      case LogLevel.DEBUG:
        logWithContext(console.debug, '\x1b[90m', 'DEBUG');
        break;
    }
  }

  // Placeholder for remote logging (e.g., to Sentry, LogRocket, etc.)
  private remoteLog(entry: LogEntry): void {
    if (env.SENTRY_DSN) {
      try {
        // Basic implementation of Sentry logging
        const level = entry.level;
        const { message, context, timestamp } = entry;

        // Log to console in development for debugging
        if (env.NODE_ENV === 'development') {
          console.debug('[Sentry Mock]', {
            level,
            message,
            context,
            timestamp,
          });
        }

        // TODO: Implement actual Sentry integration
        // Sentry.captureMessage(message, {
        //   level: this.convertLogLevel(level),
        //   extra: { context, timestamp }
        // });
      } catch (error) {
        // Fail silently in production, log in development
        if (env.NODE_ENV === 'development') {
          console.error('[Remote Logging Error]', error);
        }
      }
    }
  }

  // Public logging methods
  public error(message: string, context?: Record<string, any>): void {
    // Ensure context is not an empty object
    const validContext = context && Object.keys(context).length > 0 ? context : undefined;

    this.log(LogLevel.ERROR, message, validContext);
  }

  public warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  public info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  public debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  // Method to set log level dynamically
  public setLogLevel(level: LogLevel): void {
    this.config.level = level;
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
export { Logger };

// Optional: Export a function to configure logger if needed
export function configureLogger(config: LoggerConfig): Logger {
  return Logger.getInstance(config);
}
