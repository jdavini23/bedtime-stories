import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GenderStep } from '@/components/story/wizard/steps/GenderStep';
import { renderWithWizardContext, mockWizardState } from '@/test/utils';
import { GENDER_OPTIONS } from '@/components/story/wizard/types';

// Mock the useWizardState hook
vi.mock('@/components/story/wizard/useWizardState', () => ({
  useWizardState: () => ({
    ...mockWizardState,
    currentQuestion: 'gender',
  }),
}));

describe('GenderStep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockWizardState.handleGenderSelect.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const renderComponent = () => {
    return renderWithWizardContext(<GenderStep />);
  };

  it('should render all gender options', () => {
    renderComponent();

    GENDER_OPTIONS.forEach((option) => {
      const button = screen.getByText(option.label);
      expect(button).toBeInTheDocument();
      expect(button.closest('button')).toHaveTextContent(option.emoji);
    });
  });

  it('should handle gender selection', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const boyButton = await waitFor(() => screen.getByRole('button', { name: /Boy/i }));
    fireEvent.click(boyButton);
    expect(mockWizardState.handleGenderSelect).toHaveBeenCalledWith('boy');
  });

  it('should have proper button styling', () => {
    renderComponent();

    const buttons = screen.getAllByRole('button');

    buttons.forEach((button) => {
      expect(button).toHaveClass(
        'flex',
        'items-center',
        'justify-start',
        'space-x-2',
        'h-auto',
        'py-3',
        'px-4',
        'text-left',
        'bg-sky-800/50',
        'hover:bg-sky-700/50',
        'border-sky-600/30',
        'hover:border-sky-500/50',
        'transition-all',
        'duration-200',
        'text-white'
      );
    });
  });

  it('should have proper grid layout', () => {
    renderComponent();

    const grid = screen.getByRole('list') || screen.getByRole('group');
    expect(grid).toHaveClass('grid', 'grid-cols-2', 'gap-2');
  });

  it('should display emojis with proper styling', () => {
    renderComponent();

    GENDER_OPTIONS.forEach((option) => {
      const emoji = screen.getByText(option.emoji);
      expect(emoji).toHaveClass('text-xl');
    });
  });

  it('should transition to next step after selection', () => {
    renderComponent();

    // Click the first gender option
    const firstOption = GENDER_OPTIONS[0];
    const button = screen.getByText(firstOption.label);
    fireEvent.click(button);

    // Should dispatch SET_CURRENT_QUESTION action to move to interests step
    expect(vi.mocked(vi.fn())).toHaveBeenCalledWith({
      type: 'SET_CURRENT_QUESTION',
      payload: 'interests-question',
    });
  });

  it('should update story input with selected gender', () => {
    renderComponent();

    // Click the first gender option
    const firstOption = GENDER_OPTIONS[0];
    const button = screen.getByText(firstOption.label);
    fireEvent.click(button);

    // Should dispatch UPDATE_STORY_INPUT action with the selected gender
    expect(vi.mocked(vi.fn())).toHaveBeenCalledWith({
      type: 'UPDATE_STORY_INPUT',
      payload: { gender: firstOption.value },
    });
  });

  it('should render gender selection buttons', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Boy/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Girl/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /They\/Them/i })).toBeInTheDocument();
    });
  });

  it('should highlight selected gender button', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const boyButton = await waitFor(() => screen.getByRole('button', { name: /Boy/i }));
    fireEvent.click(boyButton);
    expect(boyButton).toHaveClass('bg-blue-500');
  });

  it('should show continue button after gender selection', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const girlButton = await waitFor(() => screen.getByRole('button', { name: /Girl/i }));
    fireEvent.click(girlButton);
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
  });

  it('should not show continue button before gender selection', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Continue/i })).not.toBeInTheDocument();
    });
  });
});
