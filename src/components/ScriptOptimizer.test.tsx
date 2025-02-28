import React from 'react';
import { render } from '@testing-library/react';
import { ScriptOptimizer } from './ScriptOptimizer';

// Mock IntersectionObserver which is not available in Jest environment
class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

describe('ScriptOptimizer', () => {
  it('renders without crashing', () => {
    render(<ScriptOptimizer />);
  });
});
