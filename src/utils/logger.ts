import { env } from '@/lib/env';

// Log levels with numeric severity
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
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
      ...config
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
  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    // Only log if the current log level allows
    if (level > this.config.level) return;

    const logEntry: LogEntry = {
      level,
      message,
      context,
      timestamp: Date.now()
    };

    // Console logging
    if (this.config.enableConsole) {
      this.consoleLog(logEntry);
    }

    // Remote logging (placeholder for future implementation)
    if (this.config.enableRemoteLogging) {
      this.remoteLog(logEntry);
    }
  }

  // Console logging with color and formatting
  private consoleLog(entry: LogEntry): void {
    const { level, message, context, timestamp } = entry;
    const formattedTimestamp = new Date(timestamp).toISOString();

    switch (level) {
      case LogLevel.ERROR:
        console.error(
          `\x1b[31m[ERROR]\x1b[0m ${formattedTimestamp} - ${message}`, 
          context ? context : ''
        );
        break;
      case LogLevel.WARN:
        console.warn(
          `\x1b[33m[WARN]\x1b[0m ${formattedTimestamp} - ${message}`, 
          context ? context : ''
        );
        break;
      case LogLevel.INFO:
        console.info(
          `\x1b[36m[INFO]\x1b[0m ${formattedTimestamp} - ${message}`, 
          context ? context : ''
        );
        break;
      case LogLevel.DEBUG:
        console.debug(
          `\x1b[90m[DEBUG]\x1b[0m ${formattedTimestamp} - ${message}`, 
          context ? context : ''
        );
        break;
    }
  }

  // Placeholder for remote logging (e.g., to Sentry, LogRocket, etc.)
  private remoteLog(entry: LogEntry): void {
    // Future implementation for production logging services
    // Could integrate with services like Sentry, LogRocket, etc.
    if (env.SENTRY_DSN) {
      // Example pseudo-code
      // Sentry.captureMessage(entry.message, {
      //   level: this.convertLogLevel(entry.level),
      //   extra: entry.context
      // });
    }
  }

  // Public logging methods
  public error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context);
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

// Optional: Export a function to configure logger if needed
export function configureLogger(config: LoggerConfig): Logger {
  return Logger.getInstance(config);
}


