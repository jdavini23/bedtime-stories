"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LogLevel = void 0;
exports.configureLogger = configureLogger;
// Try to import from the mock environment first, then fall back to the real environment
var env;
try {
    // This will be used when running the test script
    env = require('../scripts/mock-env').env;
}
catch (error) {
    // This will be used in the normal application
    env = require('@/lib/env').env;
}
/**
 * Log levels with numeric severity
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * Default logger configuration based on environment
 */
var DEFAULT_CONFIG = {
    level: env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
    enableConsole: true,
    enableRemoteLogging: env.NODE_ENV === 'production',
};
/**
 * Logger class implementing singleton pattern
 */
var Logger = /** @class */ (function () {
    function Logger(config) {
        this.config = __assign(__assign({}, DEFAULT_CONFIG), config);
    }
    /**
     * Get singleton instance
     */
    Logger.getInstance = function (config) {
        if (!Logger.instance) {
            Logger.instance = new Logger(config);
        }
        return Logger.instance;
    };
    /**
     * Core logging method
     */
    Logger.prototype.log = function (level, message, context) {
        var _a;
        // Only log if the current log level allows
        if (level > ((_a = this.config.level) !== null && _a !== void 0 ? _a : LogLevel.INFO))
            return;
        // Convert unknown context to Record<string, any> or undefined
        var safeContext = context ? this.convertToRecord(context) : undefined;
        var logEntry = {
            level: level,
            message: message,
            context: safeContext,
            timestamp: Date.now(),
        };
        // Console logging
        if (this.config.enableConsole) {
            this.consoleLog(logEntry);
        }
    };
    /**
     * Convert unknown value to a safe record
     */
    Logger.prototype.convertToRecord = function (value) {
        if (value === null)
            return { value: null };
        if (value === undefined)
            return { value: undefined };
        // Special handling for Error objects
        if (value instanceof Error) {
            return {
                message: value.message,
                name: value.name,
                stack: value.stack,
            };
        }
        // Handle empty objects
        if (typeof value === 'object' && value !== null) {
            var obj = value;
            // Check if object is empty or has empty error property
            if (Object.keys(obj).length === 0) {
                return { value: 'Empty object' };
            }
            // Special handling for objects with error property
            if (obj.error !== undefined) {
                if (obj.error === null ||
                    (typeof obj.error === 'object' && Object.keys(obj.error).length === 0)) {
                    return {
                        error: 'Empty error object',
                        originalObject: JSON.stringify(obj),
                    };
                }
            }
            return Object.entries(obj).reduce(function (acc, _a) {
                var key = _a[0], val = _a[1];
                acc[key] = val;
                return acc;
            }, {});
        }
        return { value: value };
    };
    /**
     * Format timestamp to ISO string
     */
    Logger.prototype.formatTimestamp = function (timestamp) {
        return new Date(timestamp).toISOString();
    };
    /**
     * Get level name and color for console output
     */
    Logger.prototype.getLevelInfo = function (level) {
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
    };
    /**
     * Safely stringify context with depth limit and circular reference handling
     */
    Logger.prototype.safeStringify = function (value, depth) {
        var _this = this;
        if (depth === void 0) { depth = 0; }
        // Prevent excessive recursion
        if (depth > 3)
            return '[Depth Limit Exceeded]';
        // Handle null and undefined
        if (value === null)
            return 'null';
        if (value === undefined)
            return 'undefined';
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
            return "[".concat(value.map(function (item) { return _this.safeStringify(item, depth + 1); }).join(', '), "]");
        }
        // Handle objects
        if (typeof value === 'object') {
            try {
                // Prevent circular references
                var seen_1 = new WeakSet();
                var stringifyObject = function (obj) {
                    if (seen_1.has(obj))
                        return '[Circular]';
                    seen_1.add(obj);
                    var entries = Object.entries(obj).map(function (_a) {
                        var key = _a[0], val = _a[1];
                        return "".concat(key, ": ").concat(_this.safeStringify(val, depth + 1));
                    });
                    return "{ ".concat(entries.join(', '), " }");
                };
                return stringifyObject(value);
            }
            catch (_a) {
                return '[Unable to stringify]';
            }
        }
        // Fallback for functions or other unhandled types
        return String(value);
    };
    /**
     * Console logging with color and formatting
     */
    Logger.prototype.consoleLog = function (entry) {
        var level = entry.level, message = entry.message, context = entry.context, timestamp = entry.timestamp;
        var formattedTimestamp = this.formatTimestamp(timestamp);
        var _a = this.getLevelInfo(level), levelName = _a.name, levelColor = _a.color;
        var contextString = context ? this.safeStringify(context) : '';
        // Get the appropriate console method
        var consoleMethod = level === LogLevel.ERROR
            ? console.error
            : level === LogLevel.WARN
                ? console.warn
                : level === LogLevel.INFO
                    ? console.info
                    : console.debug;
        // Format the log message
        var logPrefix = "".concat(levelColor, "[").concat(levelName, "]\u001B[0m ").concat(formattedTimestamp, " -");
        if (contextString) {
            consoleMethod("".concat(logPrefix, " ").concat(message), contextString);
        }
        else {
            consoleMethod("".concat(logPrefix, " ").concat(message));
        }
    };
    /**
     * Remote logging implementation (placeholder)
     */
    /**
     * Public logging methods
     */
    Logger.prototype.error = function (message, context) {
        this.log(LogLevel.ERROR, message, context);
    };
    Logger.prototype.warn = function (message, context) {
        this.log(LogLevel.WARN, message, context);
    };
    Logger.prototype.info = function (message, context) {
        this.log(LogLevel.INFO, message, context);
    };
    Logger.prototype.debug = function (message, context) {
        this.log(LogLevel.DEBUG, message, context);
    };
    /**
     * Set log level dynamically
     */
    Logger.prototype.setLogLevel = function (level) {
        this.config.level = level;
    };
    return Logger;
}());
/**
 * Export singleton instance
 */
exports.logger = Logger.getInstance();
/**
 * Configure logger with custom settings
 */
function configureLogger(config) {
    return Logger.getInstance(config);
}
