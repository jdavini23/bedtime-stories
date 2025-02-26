import React from 'react';
import { render } from '@testing-library/react';
import { ScriptOptimizer } from './ScriptOptimizer';

describe('ScriptOptimizer', () => {
  it('renders without crashing', () => {
    render(<ScriptOptimizer />);
  });
});
