import { describe, it, expect, beforeEach, vi } from 'vitest';
import CircuitBreaker from 'opossum';
import { openAICircuitBreaker, serializeError } from '@/utils/error-handlers';

// Mock the logger
vi.mock('@/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('CircuitBreaker', () => {
  let circuitBreaker: CircuitBreaker<any>;

  // Mock functions for testing
  const successFn = vi.fn().mockResolvedValue('success');
  const failureFn = vi.fn().mockRejectedValue(new Error('test error'));
  const fallbackFn = vi.fn().mockReturnValue('fallback');

  // CircuitBreaker options type
  const circuitBreakerOptions: CircuitBreaker.Options = {
    errorThresholdPercentage: 50,
    resetTimeout: 1000, // 1 second
    timeout: 3000, // 3 seconds
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Create a new circuit breaker for each test
    circuitBreaker = new CircuitBreaker(async () => await successFn(), circuitBreakerOptions);

    // Add fallback
    circuitBreaker.fallback(() => fallbackFn());
  });

  it('should execute function successfully when circuit is closed', async () => {
    const result = await circuitBreaker.fire();
    expect(result).toBe('success');
    expect(successFn).toHaveBeenCalledTimes(1);
    expect(fallbackFn).not.toHaveBeenCalled();
  });

  it('should use fallback when function fails', async () => {
    // Override the circuit breaker to use the failure function
    circuitBreaker = new CircuitBreaker(async () => await failureFn(), circuitBreakerOptions);

    // Add fallback
    circuitBreaker.fallback(() => fallbackFn());

    const result = await circuitBreaker.fire();
    expect(result).toBe('fallback');
    expect(failureFn).toHaveBeenCalledTimes(1);
    expect(fallbackFn).toHaveBeenCalledTimes(1);
  });

  it('should open circuit after threshold failures', async () => {
    // Override the circuit breaker to use the failure function
    circuitBreaker = new CircuitBreaker(async () => await failureFn(), circuitBreakerOptions);

    // Add fallback
    circuitBreaker.fallback(() => fallbackFn());

    // Spy on the 'open' event
    const openSpy = vi.fn();
    circuitBreaker.on('open', openSpy);

    // First failure
    await circuitBreaker.fire();
    expect(failureFn).toHaveBeenCalledTimes(1);
    expect(openSpy).not.toHaveBeenCalled();

    // Second failure should open the circuit
    await circuitBreaker.fire();
    expect(failureFn).toHaveBeenCalledTimes(2);
    expect(openSpy).toHaveBeenCalledTimes(1);

    // Third call should use fallback without calling the function
    vi.mocked(failureFn).mockClear();
    await circuitBreaker.fire();
    expect(failureFn).not.toHaveBeenCalled();
    expect(fallbackFn).toHaveBeenCalledTimes(3);
  });

  it('should close circuit after reset timeout', async () => {
    const quickResetOptions: CircuitBreaker.Options = {
      ...circuitBreakerOptions,
      resetTimeout: 100, // Very short timeout for testing
    };

    // Override the circuit breaker to use the failure function initially
    circuitBreaker = new CircuitBreaker(async () => await failureFn(), quickResetOptions);

    // Add fallback
    circuitBreaker.fallback(() => fallbackFn());

    // Spy on the events
    const openSpy = vi.fn();
    const closeSpy = vi.fn();
    const halfOpenSpy = vi.fn();

    circuitBreaker.on('open', openSpy);
    circuitBreaker.on('close', closeSpy);
    circuitBreaker.on('halfOpen', halfOpenSpy);

    // Trigger failures to open the circuit
    await circuitBreaker.fire();
    await circuitBreaker.fire();
    expect(openSpy).toHaveBeenCalledTimes(1);

    // Wait for the circuit to go half-open
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Now switch to success function for the next call
    circuitBreaker = new CircuitBreaker(async () => await successFn(), quickResetOptions);

    // Add event listeners again
    circuitBreaker.on('open', openSpy);
    circuitBreaker.on('close', closeSpy);
    circuitBreaker.on('halfOpen', halfOpenSpy);

    // Add fallback
    circuitBreaker.fallback(() => fallbackFn());

    // This should close the circuit
    await circuitBreaker.fire();
    expect(successFn).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});

describe('openAICircuitBreaker', () => {
  it('should be properly configured', () => {
    expect(openAICircuitBreaker).toBeInstanceOf(CircuitBreaker);
  });

  it('should have event handlers registered', () => {
    // This is a bit of a hack to check if event handlers are registered
    // Opossum doesn't expose a way to check registered listeners directly
    const listeners = (openAICircuitBreaker as any)._events;
    expect(listeners).toBeDefined();
    expect(Object.keys(listeners).length).toBeGreaterThan(0);
  });
});

describe('serializeError', () => {
  it('should serialize Error objects', () => {
    const error = new Error('test error');
    const serialized = serializeError(error);
    expect(serialized.name).toBe('Error');
    expect(serialized.message).toBe('test error');
    expect(serialized.stack).toBeDefined();
  });

  it('should handle non-Error objects', () => {
    const obj = { foo: 'bar' };
    const serialized = serializeError(obj);
    expect(serialized).toEqual(obj);
  });

  it('should handle primitive values', () => {
    const serialized = serializeError('test');
    expect(serialized.message).toBe('test');
    expect(serialized.type).toBe('string');
  });

  it('should handle null/undefined', () => {
    const serialized = serializeError(null);
    expect(serialized.message).toBe('Unknown error (null or undefined)');
  });
});
