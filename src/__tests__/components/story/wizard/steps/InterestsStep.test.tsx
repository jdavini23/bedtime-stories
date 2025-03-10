import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InterestsStep } from '@/components/story/wizard/steps/InterestsStep';
import { renderWithWizardContext, mockWizardState } from '@/test/utils';

// Mock the useWizardState hook
vi.mock('@/components/story/wizard/useWizardState', () => ({
  useWizardState: () => ({
    ...mockWizardState,
    currentQuestion: 'interests',
  }),
}));

describe('InterestsStep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockWizardState.setSelectedInterests.mockClear();
    mockWizardState.handleInterestsSubmit.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const renderComponent = () => {
    return renderWithWizardContext(<InterestsStep />);
  };

  it('should render interest selection prompt', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.getByText(/What interests you/i)).toBeInTheDocument();
    });
  });

  it('should render interest options', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.getByText(/Dragons/i)).toBeInTheDocument();
      expect(screen.getByText(/Magic/i)).toBeInTheDocument();
      expect(screen.getByText(/Adventure/i)).toBeInTheDocument();
    });
  });

  it('should allow selecting multiple interests', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const dragonsButton = await waitFor(() => screen.getByText(/Dragons/i));
    const magicButton = await waitFor(() => screen.getByText(/Magic/i));

    fireEvent.click(dragonsButton);
    expect(mockWizardState.setSelectedInterests).toHaveBeenCalledWith(['dragons']);

    fireEvent.click(magicButton);
    expect(mockWizardState.setSelectedInterests).toHaveBeenCalledWith(['dragons', 'magic']);

    expect(dragonsButton).toHaveClass('bg-blue-500');
    expect(magicButton).toHaveClass('bg-blue-500');
  });

  it('should show continue button when at least one interest is selected', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const dragonsButton = await waitFor(() => screen.getByText(/Dragons/i));
    fireEvent.click(dragonsButton);
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
  });

  it('should not show continue button when no interests are selected', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Continue/i })).not.toBeInTheDocument();
    });
  });

  it('should handle interests submission', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const dragonsButton = await waitFor(() => screen.getByText(/Dragons/i));
    fireEvent.click(dragonsButton);
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueButton);
    expect(mockWizardState.handleInterestsSubmit).toHaveBeenCalled();
  });
});
