"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiCircuitBreaker = exports.openAICircuitBreaker = void 0;
exports.serializeError = serializeError;
exports.handleOpenAIError = handleOpenAIError;
exports.handleGeminiError = handleGeminiError;
exports.validateApiKey = validateApiKey;
exports.validateGeminiApiKey = validateGeminiApiKey;
exports.generateFallbackStoryUtil = generateFallbackStoryUtil;
var logger_1 = require("./logger");
var CircuitBreaker = require("opossum");
/**
 * Configure the circuit breaker for OpenAI API calls
 *
 * This implementation uses the Opossum library to provide robust circuit breaking
 * capabilities for API calls. It includes:
 * - Configurable failure thresholds and timeouts
 * - Event-based monitoring and logging
 * - Graceful fallback mechanisms
 * - Automatic recovery testing
 */
var openAICircuitBreakerTimeout = 45000; // 45 seconds
var geminiCircuitBreakerTimeout = 45000; // 45 seconds
exports.openAICircuitBreaker = new CircuitBreaker(function (fn) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, fn()];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); }, {
    resetTimeout: 120000, // 2 minutes before trying again
    timeout: openAICircuitBreakerTimeout, // 45 seconds before timing out a request
    errorThresholdPercentage: 50, // 50% of requests must fail to open circuit
    rollingCountTimeout: 60000, // 1 minute window for failure percentage calculation
    rollingCountBuckets: 10, // Split the rolling window into 10 buckets
    capacity: 10, // Maximum concurrent requests
});
/**
 * Configure the circuit breaker for Gemini API calls
 *
 * This implementation uses the same Opossum library with similar settings
 * to the OpenAI circuit breaker for consistency.
 */
exports.geminiCircuitBreaker = new CircuitBreaker(function (fn) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, fn()];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); }, {
    resetTimeout: 120000, // 2 minutes before trying again
    timeout: geminiCircuitBreakerTimeout, // 45 seconds before timing out a request
    errorThresholdPercentage: 50, // 50% of requests must fail to open circuit
    rollingCountTimeout: 60000, // 1 minute window for failure percentage calculation
    rollingCountBuckets: 10, // Split the rolling window into 10 buckets
    capacity: 10, // Maximum concurrent requests
});
// Track circuit breaker metrics for OpenAI
var totalRequests = 0;
var successfulRequests = 0;
var failedRequests = 0;
var fallbackExecutions = 0;
// Track circuit breaker metrics for Gemini
var geminiTotalRequests = 0;
var geminiSuccessfulRequests = 0;
var geminiFailedRequests = 0;
var geminiFallbackExecutions = 0;
// Log circuit breaker events with enhanced information for OpenAI
exports.openAICircuitBreaker.on('open', function () {
    logger_1.logger.warn('OpenAI circuit breaker opened - too many failures', {
        metrics: exports.openAICircuitBreaker.stats,
        successRate: successfulRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
    });
});
exports.openAICircuitBreaker.on('close', function () {
    logger_1.logger.info('OpenAI circuit breaker closed - service recovered', {
        metrics: exports.openAICircuitBreaker.stats,
    });
});
exports.openAICircuitBreaker.on('halfOpen', function () {
    logger_1.logger.info('OpenAI circuit breaker half-open - testing service', {
        metrics: exports.openAICircuitBreaker.stats,
    });
});
exports.openAICircuitBreaker.on('fallback', function (result) {
    fallbackExecutions++;
    logger_1.logger.warn('OpenAI circuit breaker fallback executed', {
        result: result,
        fallbackCount: fallbackExecutions,
    });
});
exports.openAICircuitBreaker.on('success', function () {
    totalRequests++;
    successfulRequests++;
    logger_1.logger.debug('OpenAI API call successful', {
        totalRequests: totalRequests,
        successRate: (successfulRequests / totalRequests) * 100,
    });
});
exports.openAICircuitBreaker.on('failure', function (error) {
    totalRequests++;
    failedRequests++;
    logger_1.logger.error('OpenAI API call failed', {
        error: serializeError(error),
        totalRequests: totalRequests,
        failureRate: (failedRequests / totalRequests) * 100,
    });
});
exports.openAICircuitBreaker.on('timeout', function () {
    logger_1.logger.warn('OpenAI API call timed out', {
        timeoutMs: openAICircuitBreakerTimeout,
    });
});
exports.openAICircuitBreaker.on('reject', function () {
    logger_1.logger.warn('OpenAI API call rejected (circuit open)', {
        circuitState: exports.openAICircuitBreaker.status.stats,
        metrics: exports.openAICircuitBreaker.stats,
    });
});
// Log circuit breaker events with enhanced information for Gemini
exports.geminiCircuitBreaker.on('open', function () {
    logger_1.logger.warn('Gemini circuit breaker opened - too many failures', {
        metrics: exports.geminiCircuitBreaker.stats,
        successRate: geminiSuccessfulRequests > 0 ? (geminiSuccessfulRequests / geminiTotalRequests) * 100 : 0,
    });
});
exports.geminiCircuitBreaker.on('close', function () {
    logger_1.logger.info('Gemini circuit breaker closed - service recovered', {
        metrics: exports.geminiCircuitBreaker.stats,
    });
});
exports.geminiCircuitBreaker.on('halfOpen', function () {
    logger_1.logger.info('Gemini circuit breaker half-open - testing service', {
        metrics: exports.geminiCircuitBreaker.stats,
    });
});
exports.geminiCircuitBreaker.on('fallback', function (result) {
    geminiFallbackExecutions++;
    logger_1.logger.warn('Gemini circuit breaker fallback executed', {
        result: result,
        fallbackCount: geminiFallbackExecutions,
    });
});
exports.geminiCircuitBreaker.on('success', function () {
    geminiTotalRequests++;
    geminiSuccessfulRequests++;
    logger_1.logger.debug('Gemini API call successful', {
        totalRequests: geminiTotalRequests,
        successRate: (geminiSuccessfulRequests / geminiTotalRequests) * 100,
    });
});
exports.geminiCircuitBreaker.on('failure', function (error) {
    geminiTotalRequests++;
    geminiFailedRequests++;
    logger_1.logger.error('Gemini API call failed', {
        error: serializeError(error),
        totalRequests: geminiTotalRequests,
        failureRate: (geminiFailedRequests / geminiTotalRequests) * 100,
    });
});
exports.geminiCircuitBreaker.on('timeout', function () {
    logger_1.logger.warn('Gemini API call timed out', {
        timeoutMs: geminiCircuitBreakerTimeout,
    });
});
exports.geminiCircuitBreaker.on('reject', function () {
    logger_1.logger.warn('Gemini API call rejected (circuit open)', {
        circuitState: exports.geminiCircuitBreaker.status.stats,
        metrics: exports.geminiCircuitBreaker.stats,
    });
});
/**
 * Serialize error objects for logging
 */
function serializeError(error) {
    if (!error)
        return { message: 'Unknown error (null or undefined)' };
    // Handle Error objects
    if (error instanceof Error) {
        var serialized_1 = {
            name: error.name,
            message: error.message,
            stack: error.stack,
        };
        // Include additional properties that might be on custom errors
        Object.getOwnPropertyNames(error).forEach(function (prop) {
            if (prop !== 'name' && prop !== 'message' && prop !== 'stack') {
                serialized_1[prop] = error[prop];
            }
        });
        return serialized_1;
    }
    // Handle non-Error objects
    if (typeof error === 'object') {
        try {
            // Try to serialize the object
            return JSON.parse(JSON.stringify(error));
        }
        catch (e) {
            // If circular references or other issues prevent serialization
            return { message: 'Unserializable error object', type: typeof error };
        }
    }
    // Handle primitive error values
    return { message: String(error), type: typeof error };
}
/**
 * Handle OpenAI API errors with detailed information
 */
function handleOpenAIError(error) {
    var _a, _b, _c, _d;
    // Default error response
    var errorResponse = {
        error: 'OpenAI API Error',
        message: 'An error occurred while generating the story',
        status: 500,
    };
    // Check if it's an OpenAI API error
    if ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) {
        var openAIError = error.response.data.error;
        if (openAIError) {
            errorResponse = {
                error: "OpenAI Error: ".concat(openAIError.type),
                message: openAIError.message,
                status: error.response.status,
            };
            // Log specific error types for monitoring
            logger_1.logger.error('OpenAI API specific error', {
                type: openAIError.type,
                message: openAIError.message,
                param: openAIError.param,
                code: openAIError.code,
            });
        }
    }
    // Handle network errors
    else if ((error === null || error === void 0 ? void 0 : error.code) === 'ECONNABORTED' || ((_b = error === null || error === void 0 ? void 0 : error.message) === null || _b === void 0 ? void 0 : _b.includes('timeout'))) {
        errorResponse = {
            error: 'OpenAI Timeout',
            message: 'The request to OpenAI API timed out',
            status: 504, // Gateway Timeout
        };
        logger_1.logger.error('OpenAI API timeout', { error: error.message });
    }
    // Handle server errors
    else if (((_c = error === null || error === void 0 ? void 0 : error.message) === null || _c === void 0 ? void 0 : _c.includes('500')) || ((_d = error === null || error === void 0 ? void 0 : error.message) === null || _d === void 0 ? void 0 : _d.includes('server error'))) {
        errorResponse = {
            error: 'OpenAI Server Error',
            message: 'OpenAI servers are experiencing issues',
            status: 503, // Service Unavailable
        };
        logger_1.logger.error('OpenAI server error', { error: error.message });
    }
    // Handle other errors
    else {
        logger_1.logger.error('Unhandled OpenAI error', serializeError(error));
    }
    return errorResponse;
}
/**
 * Handle Gemini API errors with detailed information
 */
function handleGeminiError(error) {
    var _a, _b, _c, _d;
    // Default error response
    var errorResponse = {
        error: 'Gemini API Error',
        message: 'An error occurred while generating the story',
        status: 500,
    };
    // Check if it's a Gemini API error with response data
    if ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) {
        var geminiError = error.response.data;
        errorResponse = {
            error: "Gemini Error: ".concat(geminiError.error || 'Unknown'),
            message: geminiError.message || 'An error occurred with the Gemini API',
            status: error.response.status || 500,
        };
        // Log specific error types for monitoring
        logger_1.logger.error('Gemini API specific error', {
            error: geminiError.error,
            message: geminiError.message,
        });
    }
    // Handle network errors
    else if ((error === null || error === void 0 ? void 0 : error.code) === 'ECONNABORTED' || ((_b = error === null || error === void 0 ? void 0 : error.message) === null || _b === void 0 ? void 0 : _b.includes('timeout'))) {
        errorResponse = {
            error: 'Gemini Timeout',
            message: 'The request to Gemini API timed out',
            status: 504, // Gateway Timeout
        };
        logger_1.logger.error('Gemini API timeout', { error: error.message });
    }
    // Handle server errors
    else if (((_c = error === null || error === void 0 ? void 0 : error.message) === null || _c === void 0 ? void 0 : _c.includes('500')) || ((_d = error === null || error === void 0 ? void 0 : error.message) === null || _d === void 0 ? void 0 : _d.includes('server error'))) {
        errorResponse = {
            error: 'Gemini Server Error',
            message: 'Gemini servers are experiencing issues',
            status: 503, // Service Unavailable
        };
        logger_1.logger.error('Gemini server error', { error: error.message });
    }
    // Handle other errors
    else {
        logger_1.logger.error('Unhandled Gemini error', serializeError(error));
    }
    return errorResponse;
}
/**
 * Validate that the OpenAI API key is set and has a valid format
 */
function validateApiKey(apiKey) {
    if (!apiKey) {
        logger_1.logger.error('OpenAI API key is not set');
        return false;
    }
    // Check for valid key format (both standard sk- and project sk-proj- formats)
    if (!apiKey.startsWith('sk-')) {
        logger_1.logger.error('OpenAI API key has invalid format - must start with sk-');
        return false;
    }
    // Additional validation for key length
    if (apiKey.length < 20) {
        logger_1.logger.error('OpenAI API key is too short');
        return false;
    }
    // Log key format type for debugging
    var keyType = apiKey.startsWith('sk-proj-') ? 'project' : 'standard';
    var maskedKey = keyType === 'project'
        ? apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 3)
        : apiKey.substring(0, 5) + '...' + apiKey.substring(apiKey.length - 3);
    logger_1.logger.debug("Using OpenAI ".concat(keyType, " API key: ").concat(maskedKey));
    logger_1.logger.debug("API key length: ".concat(apiKey.length));
    return true;
}
/**
 * Validate that the Gemini API key is set and has a valid format
 */
function validateGeminiApiKey(apiKey) {
    if (!apiKey) {
        logger_1.logger.error('Gemini API key is not set');
        return false;
    }
    // Gemini API keys are typically longer than 20 characters
    if (apiKey.length < 20) {
        logger_1.logger.error('Gemini API key appears to be invalid (too short)');
        return false;
    }
    return true;
}
/**
 * Utility function to import the generateFallbackStory function from personalizationEngine
 * This avoids circular dependencies
 */
function generateFallbackStoryUtil(input) {
    // Import dynamically to avoid circular dependencies
    var generateFallbackStory = require('../services/personalizationEngine').generateFallbackStory;
    return generateFallbackStory(input);
}
