import { logger, LogCategory } from './index';

// Create category-specific loggers for easier use
export const apiLogger = {
  debug: (message: string, context?: any) => logger.debug(LogCategory.API, message, context),
  info: (message: string, context?: any) => logger.info(LogCategory.API, message, context),
  warn: (message: string, context?: any) => logger.warn(LogCategory.API, message, context),
  error: (message: string, context?: any) => logger.error(LogCategory.API, message, context),
};

export const storyLogger = {
  debug: (message: string, context?: any) => logger.debug(LogCategory.STORY, message, context),
  info: (message: string, context?: any) => logger.info(LogCategory.STORY, message, context),
  warn: (message: string, context?: any) => logger.warn(LogCategory.STORY, message, context),
  error: (message: string, context?: any) => logger.error(LogCategory.STORY, message, context),
};

export const personalizationLogger = {
  debug: (message: string, context?: any) =>
    logger.debug(LogCategory.PERSONALIZATION, message, context),
  info: (message: string, context?: any) =>
    logger.info(LogCategory.PERSONALIZATION, message, context),
  warn: (message: string, context?: any) =>
    logger.warn(LogCategory.PERSONALIZATION, message, context),
  error: (message: string, context?: any) =>
    logger.error(LogCategory.PERSONALIZATION, message, context),
};

export const authLogger = {
  debug: (message: string, context?: any) => logger.debug(LogCategory.AUTH, message, context),
  info: (message: string, context?: any) => logger.info(LogCategory.AUTH, message, context),
  warn: (message: string, context?: any) => logger.warn(LogCategory.AUTH, message, context),
  error: (message: string, context?: any) => logger.error(LogCategory.AUTH, message, context),
};

export const uiLogger = {
  debug: (message: string, context?: any) => logger.debug(LogCategory.UI, message, context),
  info: (message: string, context?: any) => logger.info(LogCategory.UI, message, context),
  warn: (message: string, context?: any) => logger.warn(LogCategory.UI, message, context),
  error: (message: string, context?: any) => logger.error(LogCategory.UI, message, context),
};

export const performanceLogger = {
  debug: (message: string, context?: any) =>
    logger.debug(LogCategory.PERFORMANCE, message, context),
  info: (message: string, context?: any) => logger.info(LogCategory.PERFORMANCE, message, context),
  warn: (message: string, context?: any) => logger.warn(LogCategory.PERFORMANCE, message, context),
  error: (message: string, context?: any) =>
    logger.error(LogCategory.PERFORMANCE, message, context),
};

// Performance monitoring utility
export const measurePerformance = async <T>(
  name: string,
  fn: () => Promise<T>,
  context: any = {}
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    performanceLogger.info(`${name} completed`, { duration, ...context });
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    performanceLogger.error(`${name} failed`, { duration, error, ...context });
    throw error;
  }
};
