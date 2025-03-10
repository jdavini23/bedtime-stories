import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NameStep } from '@/components/story/wizard/steps/NameStep';
import { renderWithWizardContext, mockWizardState } from '@/test/utils';

// Mock the useWizardState hook
vi.mock('@/components/story/wizard/useWizardState', () => ({
  useWizardState: () => ({
    ...mockWizardState,
    currentQuestion: 'name',
  }),
}));

describe('NameStep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockWizardState.setNameInput.mockClear();
    mockWizardState.handleNameSubmit.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const renderComponent = () => {
    return renderWithWizardContext(<NameStep />);
  };

  it('should render name input field', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter your name/i)).toBeInTheDocument();
    });
  });

  it('should update name input value', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const input = await waitFor(() => screen.getByPlaceholderText(/Enter your name/i));
    fireEvent.change(input, { target: { value: 'Alice' } });
    expect(mockWizardState.setNameInput).toHaveBeenCalledWith('Alice');
  });

  it('should show continue button when name is entered', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const input = await waitFor(() => screen.getByPlaceholderText(/Enter your name/i));
    fireEvent.change(input, { target: { value: 'Alice' } });
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
  });

  it('should not show continue button when name is empty', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Continue/i })).not.toBeInTheDocument();
    });
  });

  it('should handle name submission', async () => {
    renderComponent();
    await vi.runAllTimersAsync();
    const input = await waitFor(() => screen.getByPlaceholderText(/Enter your name/i));
    fireEvent.change(input, { target: { value: 'Alice' } });
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueButton);
    expect(mockWizardState.handleNameSubmit).toHaveBeenCalled();
  });

  it('should handle name submission via Enter key', () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Enter name...');

    fireEvent.change(input, { target: { value: 'Alice' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Should dispatch ADD_MESSAGE action with the name
    expect(vi.mocked(vi.fn())).toHaveBeenCalledWith({
      type: 'ADD_MESSAGE',
      payload: {
        content: 'Alice',
        sender: 'user',
        type: 'name-response',
      },
    });
  });

  it('should not submit when input is empty or whitespace', () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Enter name...');
    const continueButton = screen.getByText('Continue');

    // Try empty input
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(continueButton);
    expect(vi.mocked(vi.fn())).not.toHaveBeenCalled();

    // Try whitespace input
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(continueButton);
    expect(vi.mocked(vi.fn())).not.toHaveBeenCalled();

    // Try Enter key with empty input
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(vi.mocked(vi.fn())).not.toHaveBeenCalled();
  });

  it('should have autofocus on input', () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Enter name...');
    expect(input).toHaveFocus();
  });

  it('should have proper styling', () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Enter name...');
    expect(input).toHaveClass('flex-1');

    const continueButton = screen.getByText('Continue');
    expect(continueButton).toHaveClass(
      'bg-sky/10',
      'hover:bg-sky/20',
      'transition-colors',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed'
    );
  });
});
