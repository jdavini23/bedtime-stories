import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WelcomeStep } from '@/components/story/wizard/steps/WelcomeStep';
import { renderWithWizardContext, mockWizardState } from '@/test/utils';

// Mock the useWizardState hook
vi.mock('@/components/story/wizard/useWizardState', () => ({
  useWizardState: () => ({
    ...mockWizardState,
    currentQuestion: 'welcome',
  }),
}));

describe('WelcomeStep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const renderComponent = () => {
    return renderWithWizardContext(<WelcomeStep />);
  };

  it('should render welcome message', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.getByText(/Let's create a magical story together!/i)).toBeInTheDocument();
    });
  });

  it('should render theme options', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.getByText(/Adventure/i)).toBeInTheDocument();
      expect(screen.getByText(/Fantasy/i)).toBeInTheDocument();
      expect(screen.getByText(/Mystery/i)).toBeInTheDocument();
    });
  });

  it('should render theme descriptions', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.getByText(/Embark on thrilling quests/i)).toBeInTheDocument();
      expect(screen.getByText(/Discover magical realms/i)).toBeInTheDocument();
      expect(screen.getByText(/Solve intriguing puzzles/i)).toBeInTheDocument();
    });
  });

  it('should highlight selected theme', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const adventureButton = await waitFor(() => screen.getByText(/Adventure/i));
    fireEvent.click(adventureButton);
    expect(adventureButton).toHaveClass('bg-blue-500');
  });

  it('should show continue button after theme selection', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const adventureButton = await waitFor(() => screen.getByText(/Adventure/i));
    fireEvent.click(adventureButton);
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
  });
});
