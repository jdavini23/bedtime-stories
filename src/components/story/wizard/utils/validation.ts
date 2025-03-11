import { ExtendedStoryInput } from '../types';

// Validate name input
export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }
  if (name.length > 50) {
    return { isValid: false, error: 'Name must be less than 50 characters' };
  }
  return { isValid: true };
}

// Validate interests selection
export function validateInterests(interests: string[]): { isValid: boolean; error?: string } {
  if (interests.length === 0) {
    return { isValid: false, error: 'Please select at least one interest' };
  }
  if (interests.length > 5) {
    return { isValid: false, error: 'Please select no more than 5 interests' };
  }
  return { isValid: true };
}

// Validate traits selection
export function validateTraits(traits: string[]): { isValid: boolean; error?: string } {
  if (traits.length === 0) {
    return { isValid: false, error: 'Please select at least one trait' };
  }
  if (traits.length > 3) {
    return { isValid: false, error: 'Please select no more than 3 traits' };
  }
  return { isValid: true };
}

// Validate age input
export function validateAge(age: number | undefined): { isValid: boolean; error?: string } {
  if (!age) {
    return { isValid: false, error: 'Age is required' };
  }
  if (age < 4 || age > 12) {
    return { isValid: false, error: 'Age must be between 4 and 12' };
  }
  return { isValid: true };
}

// Validate the entire story input before submission
export function validateStoryInput(input: Partial<ExtendedStoryInput>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.childName?.trim()) {
    errors.childName = 'Name is required';
  }

  if (!input.childAge || input.childAge < 4 || input.childAge > 12) {
    errors.childAge = 'Age must be between 4 and 12';
  }

  if (!input.theme) {
    errors.theme = 'Theme is required';
  }

  if (!input.characters || input.characters.length === 0) {
    errors.characters = 'At least one character is required';
  }

  if (!input.mainCharacter?.traits || input.mainCharacter.traits.length === 0) {
    errors.traits = 'At least one trait is required';
  }

  if (!input.readingLevel) {
    errors.readingLevel = 'Reading level is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Validate step completion before proceeding
export function canProceedToNextStep(
  currentStep: string,
  input: Partial<ExtendedStoryInput>,
  selectedInterests: string[],
  selectedTraits: string[]
): { canProceed: boolean; error?: string } {
  switch (currentStep) {
    case 'theme-question':
      if (!input.theme) {
        return { canProceed: false, error: 'Please select a theme' };
      }
      break;
    case 'name-question':
      const nameValidation = validateName(input.childName || '');
      if (!nameValidation.isValid) {
        return { canProceed: false, error: nameValidation.error };
      }
      break;
    case 'age-question':
      const ageValidation = validateAge(input.childAge);
      if (!ageValidation.isValid) {
        return { canProceed: false, error: ageValidation.error };
      }
      break;
    case 'interests-question':
      const interestsValidation = validateInterests(selectedInterests);
      if (!interestsValidation.isValid) {
        return { canProceed: false, error: interestsValidation.error };
      }
      break;
    case 'traits-question':
      const traitsValidation = validateTraits(selectedTraits);
      if (!traitsValidation.isValid) {
        return { canProceed: false, error: traitsValidation.error };
      }
      break;
    case 'reading-level-question':
      if (!input.readingLevel) {
        return { canProceed: false, error: 'Please select a reading level' };
      }
      break;
  }

  return { canProceed: true };
}
