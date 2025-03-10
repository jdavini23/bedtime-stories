import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TraitsStep } from '@/components/story/wizard/steps/TraitsStep';
import { renderWithWizardContext, mockWizardState } from '@/test/utils';

// Mock the useWizardState hook
vi.mock('@/components/story/wizard/useWizardState', () => ({
  useWizardState: () => ({
    ...mockWizardState,
    currentQuestion: 'traits',
  }),
}));

describe('TraitsStep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockWizardState.setSelectedTraits.mockClear();
    mockWizardState.handleTraitsSubmit.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const renderComponent = () => {
    return renderWithWizardContext(<TraitsStep />);
  };

  it('should render trait selection prompt', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.getByText(/What traits would you like/i)).toBeInTheDocument();
    });
  });

  it('should render trait categories', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.getByText(/Personality/i)).toBeInTheDocument();
      expect(screen.getByText(/Physical/i)).toBeInTheDocument();
      expect(screen.getByText(/Skills/i)).toBeInTheDocument();
    });
  });

  it('should allow switching between trait categories', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const physicalTab = await waitFor(() => screen.getByText(/Physical/i));
    fireEvent.click(physicalTab);
    expect(physicalTab).toHaveClass('bg-blue-500');
  });

  it('should allow selecting traits', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const braveButton = await waitFor(() => screen.getByText(/Brave/i));
    fireEvent.click(braveButton);
    expect(mockWizardState.setSelectedTraits).toHaveBeenCalledWith(['brave']);
    expect(braveButton).toHaveClass('bg-blue-500');
  });

  it('should show continue button when at least one trait is selected', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const braveButton = await waitFor(() => screen.getByText(/Brave/i));
    fireEvent.click(braveButton);
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
  });

  it('should not show continue button when no traits are selected', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Continue/i })).not.toBeInTheDocument();
    });
  });

  it('should allow searching for traits', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const searchInput = await waitFor(() => screen.getByPlaceholderText(/Search traits/i));
    fireEvent.change(searchInput, { target: { value: 'brave' } });
    expect(screen.getByText(/Brave/i)).toBeInTheDocument();
  });

  it('should handle traits submission', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const braveButton = await waitFor(() => screen.getByText(/Brave/i));
    fireEvent.click(braveButton);
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueButton);
    expect(mockWizardState.handleTraitsSubmit).toHaveBeenCalled();
  });
});
