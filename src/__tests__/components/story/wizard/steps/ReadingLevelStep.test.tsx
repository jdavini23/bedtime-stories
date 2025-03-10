import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ReadingLevelStep } from '@/components/story/wizard/steps/ReadingLevelStep';
import { renderWithWizardContext, mockWizardState } from '@/test/utils';

// Mock the useWizardState hook
vi.mock('@/components/story/wizard/useWizardState', () => ({
  useWizardState: () => ({
    ...mockWizardState,
    currentQuestion: 'reading-level',
  }),
}));

describe('ReadingLevelStep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockWizardState.setReadingLevel.mockClear();
    mockWizardState.handleReadingLevelSubmit.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const renderComponent = () => {
    return renderWithWizardContext(<ReadingLevelStep />);
  };

  it('should render reading level prompt', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.getByText(/What reading level would you like/i)).toBeInTheDocument();
    });
  });

  it('should render reading level options', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.getByText(/Easy/i)).toBeInTheDocument();
      expect(screen.getByText(/Medium/i)).toBeInTheDocument();
      expect(screen.getByText(/Hard/i)).toBeInTheDocument();
    });
  });

  it('should highlight selected reading level', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const easyButton = await waitFor(() => screen.getByText(/Easy/i));
    fireEvent.click(easyButton);
    expect(mockWizardState.setReadingLevel).toHaveBeenCalledWith('easy');
    expect(easyButton).toHaveClass('bg-blue-500');
  });

  it('should show continue button after reading level selection', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const mediumButton = await waitFor(() => screen.getByText(/Medium/i));
    fireEvent.click(mediumButton);
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
  });

  it('should not show continue button before reading level selection', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Continue/i })).not.toBeInTheDocument();
    });
  });

  it('should display reading level descriptions', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.getByText(/Simple words and short sentences/i)).toBeInTheDocument();
      expect(screen.getByText(/More complex vocabulary/i)).toBeInTheDocument();
      expect(screen.getByText(/Advanced vocabulary/i)).toBeInTheDocument();
    });
  });

  it('should handle reading level submission', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const easyButton = await waitFor(() => screen.getByText(/Easy/i));
    fireEvent.click(easyButton);
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueButton);
    expect(mockWizardState.handleReadingLevelSubmit).toHaveBeenCalled();
  });
});
