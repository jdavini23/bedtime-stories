import { KeyboardEvent } from 'react';

// Handle keyboard navigation for option selection
export function handleKeyboardNavigation(
  event: KeyboardEvent,
  currentIndex: number,
  totalItems: number,
  onSelect: (index: number) => void
) {
  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowLeft':
      event.preventDefault();
      onSelect((currentIndex - 1 + totalItems) % totalItems);
      break;
    case 'ArrowDown':
    case 'ArrowRight':
      event.preventDefault();
      onSelect((currentIndex + 1) % totalItems);
      break;
    case 'Home':
      event.preventDefault();
      onSelect(0);
      break;
    case 'End':
      event.preventDefault();
      onSelect(totalItems - 1);
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      onSelect(currentIndex);
      break;
    default:
      break;
  }
}

// Generate ARIA labels for different steps
export function getStepAriaLabel(step: string, currentStep: number, totalSteps: number) {
  return `Step ${currentStep} of ${totalSteps}: ${step}`;
}

// Focus management for modal dialogs
export function trapFocus(event: KeyboardEvent, containerRef: React.RefObject<HTMLElement>) {
  if (!containerRef.current) return;

  const focusableElements = containerRef.current.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }
}

// Announce messages to screen readers
export function announceMessage(message: string) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;

  document.body.appendChild(announcement);
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Check color contrast ratio
export function getContrastRatio(foreground: string, background: string): number {
  const getLuminance = (color: string) => {
    const rgb = color
      .replace('#', '')
      .match(/.{2}/g)
      ?.map((x) => parseInt(x, 16) / 255) || [0, 0, 0];

    const [r, g, b] = rgb.map((val) =>
      val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);

  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Math.round(ratio * 100) / 100;
}
