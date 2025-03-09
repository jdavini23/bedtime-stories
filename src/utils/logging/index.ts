export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export enum LogCategory {
  API = 'api',
  STORY = 'story',
  PERSONALIZATION = 'personalization',
  AUTH = 'auth',
  UI = 'ui',
  PERFORMANCE = 'performance',
}

interface LogContext {
  userId?: string;
  requestId?: string;
  component?: string;
  [key: string]: any;
}

export class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    context: LogContext = {}
  ): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      category,
      message,
      ...context,
    };

    // In development, log to console
    if (this.isDevelopment) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(JSON.stringify(logEntry, null, 2));
          break;
        case LogLevel.INFO:
          console.info(JSON.stringify(logEntry, null, 2));
          break;
        case LogLevel.WARN:
          console.warn(JSON.stringify(logEntry, null, 2));
          break;
        case LogLevel.ERROR:
          console.error(JSON.stringify(logEntry, null, 2));
          break;
      }
    } else {
      // In production, we could send logs to a service like Sentry, LogRocket, etc.
      // For now, we'll just use console, but this would be replaced with proper production logging
      console.log(JSON.stringify(logEntry));
    }
  }

  public debug(category: LogCategory, message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, category, message, context);
  }

  public info(category: LogCategory, message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, category, message, context);
  }

  public warn(category: LogCategory, message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, category, message, context);
  }

  public error(category: LogCategory, message: string, context?: LogContext): void {
    this.log(LogLevel.ERROR, category, message, context);
  }
}

// Export a singleton instance
export const logger = Logger.getInstance();
