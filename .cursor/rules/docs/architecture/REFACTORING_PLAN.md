# Bedtime Stories Codebase Refactoring Plan

This document outlines the comprehensive plan for refactoring the Bedtime Stories codebase to
improve maintainability, reduce technical debt, and enhance performance. The plan is designed to be
implemented incrementally to ensure the application remains functional throughout the refactoring
process.

## Table of Contents

- [Overview](#overview)
- [High-Priority Targets](#high-priority)
- [Refactoring Phases](#refactoring-phases)
- [Implementation Timeline](#implementation-timeline)
- [Tracking Progress](#tracking-progress)

## Overview

The codebase currently has several large files that handle multiple responsibilities, making
maintenance and future development challenging. This refactoring plan aims to:

1. ✅ Split large files into smaller, more focused components
2. ✅ Establish consistent patterns across the codebase
3. ✅ Improve the testing infrastructure
4. ✅ Remove duplicate code
5. Prepare the codebase for upcoming features (subscriptions and plans with Clerk and Supabase)
6. ✅ Enhance error handling and logging
7. Implement API versioning for better maintainability
8. ✅ Improve state management architecture

## High-Priority Targets

The following files have been identified as high-priority refactoring targets:

1. ✅ `src/services/personalizationEngine.ts` (35KB, 1017 lines)

   - ✅ Contains theme descriptions, character traits, preferences management, and story generation
     logic
   - ✅ Has both JS and TS versions causing maintenance issues
   - ✅ Split into multiple focused modules:
     - ✅ `src/services/personalization/types.ts`
     - ✅ `src/services/personalization/preferences.ts`
     - ✅ `src/services/personalization/storyGeneration.ts`
     - ✅ `src/services/personalization/characters.ts`
     - ✅ `src/services/personalization/themes.ts`
     - ✅ `src/services/personalization/cache.ts`
     - ✅ `src/services/personalization/analytics.ts`
   - ✅ Added comprehensive tests for each module
   - ✅ Improved error handling and logging
   - ✅ Added proper TypeScript types
   - ✅ Removed JavaScript version

2. ✅ `src/components/story/StoryWizard.tsx` (32KB, 891 lines)

   - ✅ Improved state management with proper validation
   - ✅ Added comprehensive error handling
   - ✅ Enhanced type safety with proper TypeScript types
   - ✅ Added default values and fallbacks for all required fields
   - ✅ Improved character and setting generation
   - ✅ Added proper state persistence between steps
   - ✅ Enhanced user experience with better validation feedback
   - ✅ Fixed issues with story generation input validation

3. `src/app/page.tsx` (51KB, 1173 lines)

   - Contains multiple UI sections that should be separate components
   - Contains custom hooks and animation logic mixed with UI rendering

4. `src/utils/error-handlers.ts` (12KB, 405 lines)
   - Contains multiple error handling utilities that should be separated
   - Needs a more comprehensive approach to error management

## Refactoring Phases

### Phase 1: Analysis and Setup (Preparation)

- [x] **Step 1: Create a new branch for refactoring**

  ```bash
  git checkout -b refactor/codebase-maintainability
  ```

- [x] **Step 2: Document current test coverage**

  - [x] Analyze existing tests in `src/__tests__/`
  - [x] Identify gaps in test coverage
  - [x] Plan for maintaining and improving test coverage

- [x] **Step 3: Set up enhanced logging infrastructure**
  - [x] Create a structured logging utility
  - [x] Define log levels and categories
  - [x] Implement context-aware logging

### Phase 2: High-Priority Files Refactoring

#### personalizationEngine.ts Refactoring

- [x] **Step 1: Create directory structure**

  ```
  src/services/personalization/
  ├── index.ts                    # Main export file
  ├── types.ts                    # Shared types
  ├── preferences.ts              # User preferences logic
  ├── storyGeneration.ts          # Story generation logic
  ├── characters.ts              # Character generation and traits
  ├── themes.ts                  # Theme descriptions and elements
  ├── cache.ts                   # Redis caching logic
  └── analytics.ts               # Usage analytics and tracking
  ```

- [x] **Step 2: Extract shared types to types.ts**

  - [x] Move `UserPreferencesLocal` interface
  - [x] Move `StoryCharacter` interface
  - [x] Move other shared types

- [x] **Step 3: Extract theme-related constants to themes.ts**

  - [x] Move `THEME_DESCRIPTIONS`
  - [x] Move `THEME_ELEMENTS`

- [x] **Step 4: Extract character-related constants to characters.ts**

  - [x] Move `CHARACTER_TRAITS`
  - [x] Move `CHARACTER_ARCHETYPES`
  - [x] Move character generation functions

- [x] **Step 5: Extract preferences logic to preferences.ts**

  - [x] Move `DEFAULT_PREFERENCES`
  - [x] Move preferences management functions

- [x] **Step 6: Extract story generation logic to storyGeneration.ts**

  - [x] Move story generation functions
  - [x] Move prompt templates
  - [x] Add structured error handling

- [x] **Step 7: Extract caching logic to cache.ts**

  - [x] Move Redis initialization
  - [x] Move caching functions
  - [x] Implement more sophisticated cache invalidation

- [x] **Step 8: Create analytics tracking in analytics.ts**

  - [x] Add usage tracking functions
  - [x] Implement event logging for personalization decisions

- [x] **Step 9: Create index.ts to re-export all modules**

  - [x] Ensure backward compatibility with existing imports

- [x] **Step 10: Update imports across the codebase**

  - [x] Update imports in `ConversationalWizard.tsx`
  - [x] Update imports in `CharacterStep.tsx`
  - [x] Update imports in API routes
  - [x] Update imports in `StoryWizard.tsx`
  - [x] Update imports in `PreviewStep.tsx`
  - [x] Update imports in `ReadingLevelStep.tsx`
  - [x] Update imports in `lib/storyGenerator.ts`
  - [x] Update imports in test files

- [x] **Step 11: Add unit tests for each new module**

  - [x] Test preferences functions
  - [x] Test story generation functions
  - [x] Test character generation functions

- [x] **Step 12: Remove the JavaScript version (personalizationEngine.js)**
  - [x] Ensure all functionality is covered in TypeScript modules

#### ConversationalWizard.tsx Refactoring

- [ ] **Step 1: Create directory structure**

  ```
  src/components/story/wizard/
  ├── index.tsx                   # Main export file
  ├── types.ts                    # Shared types
  ├── ConversationalWizard.tsx    # Container component (simplified)
  ├── WizardContext.tsx           # Context for wizard state
  ├── useWizardState.tsx          # Custom hook for wizard state
  ├── steps/
  │   ├── WelcomeStep.tsx
  │   ├── ThemeStep.tsx
  │   ├── NameStep.tsx
  │   ├── GenderStep.tsx
  │   ├── InterestsStep.tsx
  │   ├── TraitsStep.tsx
  │   ├── SupportingCharacterStep.tsx
  │   ├── ReadingLevelStep.tsx
  │   └── SummaryStep.tsx
  ├── components/
  │   ├── MessageBubble.tsx
  │   ├── OptionSelector.tsx
  │   ├── StepTransition.tsx
  │   └── ErrorBoundary.tsx
  └── utils/
      ├── validation.ts
      └── accessibility.ts
  ```

- [ ] **Step 2: Extract shared types to types.ts**

  - [ ] Move `MessageType` type
  - [ ] Move `Message` interface
  - [ ] Move other shared interfaces

- [ ] **Step 3: Create WizardContext.tsx for state management**

  - [ ] Create context for wizard state
  - [ ] Create provider component
  - [ ] Implement proper state persistence

- [ ] **Step 4: Create useWizardState.tsx custom hook**

  - [ ] Extract state management logic
  - [ ] Handle step transitions
  - [ ] Add form validation

- [ ] **Step 5: Extract each step into its own component**

  - [ ] Extract welcome step
  - [ ] Extract theme selection step
  - [ ] Extract name input step
  - [ ] Extract gender selection step
  - [ ] Extract interests selection step
  - [ ] Extract traits selection step
  - [ ] Extract supporting character step
  - [ ] Extract reading level step
  - [ ] Extract summary step

- [ ] **Step 6: Create shared UI components**

  - [ ] Create MessageBubble component
  - [ ] Create OptionSelector component
  - [ ] Create StepTransition component
  - [ ] Create ErrorBoundary component

- [ ] **Step 7: Add accessibility enhancements**

  - [ ] Implement keyboard navigation
  - [ ] Add proper ARIA attributes
  - [ ] Create accessibility utility functions

- [ ] **Step 8: Simplify main ConversationalWizard.tsx**

  - [ ] Use context for state management
  - [ ] Render appropriate step based on current state
  - [ ] Wrap with error boundary

- [ ] **Step 9: Create index.tsx to re-export components**

  - [ ] Ensure backward compatibility with existing imports

- [ ] **Step 10: Update imports and references**

  - [ ] Update imports in story-related components
  - [ ] Update imports in page components

- [ ] **Step 11: Add unit tests for each component**
  - [ ] Test individual step components
  - [ ] Test wizard state management
  - [ ] Test transitions between steps
  - [ ] Test accessibility features

#### page.tsx (Home Page) Refactoring

- [ ] **Step 1: Create directory structure**

  ```
  src/app/
  ├── page.tsx                    # Main page (simplified)
  └── home/
      ├── components/
      │   ├── HeroSection.tsx
      │   ├── FeatureSection.tsx
      │   ├── FaqSection.tsx
      │   ├── TestimonialSection.tsx
      │   ├── CallToAction.tsx
      │   └── ErrorBoundary.tsx
      ├── hooks/
      │   ├── useIntersectionObserver.tsx
      │   └── useAnimations.tsx
      └── utils/
          ├── analytics.ts
          └── performance.ts
  ```

- [ ] **Step 2: Extract custom hooks**

  - [ ] Move `useIntersectionObserver` to its own file
  - [ ] Create animation hooks in useAnimations.tsx
  - [ ] Add performance monitoring hooks

- [ ] **Step 3: Extract each section into its own component**

  - [ ] Extract hero section
  - [ ] Extract feature section
  - [ ] Extract FAQ section
  - [ ] Extract testimonial section
  - [ ] Extract call-to-action section
  - [ ] Add error boundaries to each section

- [ ] **Step 4: Add analytics tracking**

  - [ ] Create analytics utility
  - [ ] Add section visibility tracking
  - [ ] Track user interactions

- [ ] **Step 5: Implement performance optimizations**

  - [ ] Add proper code-splitting
  - [ ] Optimize image loading
  - [ ] Implement performance monitoring

- [ ] **Step 6: Simplify main page.tsx**

  - [ ] Import and use the extracted components
  - [ ] Keep only the layout and composition logic
  - [ ] Add global error boundary

- [ ] **Step 7: Update imports and references**

  - [ ] Ensure all components are properly imported

- [ ] **Step 8: Add unit tests for each component**
  - [ ] Test individual section components
  - [ ] Test custom hooks
  - [ ] Test analytics tracking

### Phase 3: Enhanced Error Handling and Logging

#### error-handlers.ts Refactoring

- [ ] **Step 1: Create directory structure**

  ```
  src/utils/error-handling/
  ├── index.ts                    # Main export file
  ├── types.ts                    # Error types and interfaces
  ├── circuitBreaker.ts           # Circuit breaker configuration
  ├── openaiErrors.ts             # OpenAI error handling
  ├── geminiErrors.ts             # Gemini error handling
  ├── fallbackGeneration.ts       # Fallback story generation
  ├── validation.ts               # Input validation
  ├── monitoring.ts               # Error monitoring and reporting
  └── userFeedback.ts             # User-facing error messages
  ```

- [ ] **Step 2: Create shared error types**

  - [ ] Define error categories
  - [ ] Create error code constants
  - [ ] Define error interfaces

- [ ] **Step 3: Extract circuit breaker logic**

  - [ ] Move circuit breaker configuration to circuitBreaker.ts
  - [ ] Move metrics tracking functions
  - [ ] Enhance with better retry strategies

- [ ] **Step 4: Extract API-specific error handlers**

  - [ ] Move OpenAI error handling to openaiErrors.ts
  - [ ] Move Gemini error handling to geminiErrors.ts
  - [ ] Add more granular error categorization

- [ ] **Step 5: Extract fallback generation logic**

  - [ ] Move fallback story generation to fallbackGeneration.ts
  - [ ] Improve fallback quality

- [ ] **Step 6: Extract validation functions**

  - [ ] Move API key validation to validation.ts
  - [ ] Move input validation functions
  - [ ] Add more comprehensive validation

- [ ] **Step 7: Create error monitoring system**

  - [ ] Implement error tracking and reporting
  - [ ] Add context to error reports
  - [ ] Create error severity levels

- [ ] **Step 8: Create user feedback system**

  - [ ] Create user-friendly error messages
  - [ ] Implement recovery suggestions
  - [ ] Add error codes for support reference

- [ ] **Step 9: Create index.ts to re-export all modules**

  - [ ] Ensure backward compatibility with existing imports

- [ ] **Step 10: Update imports across the codebase**

  - [ ] Update imports in API routes
  - [ ] Update imports in service files

- [ ] **Step 11: Add unit tests for each module**

  - [ ] Test circuit breaker functionality
  - [ ] Test error handling functions
  - [ ] Test fallback generation
  - [ ] Test error monitoring

### Phase 4: API and Service Layer Refactoring

#### API Versioning Implementation

- [ ] **Step 1: Create versioned API structure**

  ```
  src/app/api/
  ├── v1/
  │   ├── generateStory/
  │   ├── story/
  │   └── user/
  └── shared/
      ├── validation.ts
      ├── response.ts
      └── middleware.ts
  ```

- [ ] **Step 2: Create shared API utilities**

  - [ ] Create standard response formatter
  - [ ] Create validation middleware
  - [ ] Create error handling middleware

- [ ] **Step 3: Migrate existing endpoints to versioned structure**

  - [ ] Move generateStory to v1/generateStory
  - [ ] Update client-side API calls

- [ ] **Step 4: Add API documentation**

  - [ ] Create API documentation for each endpoint
  - [ ] Document request/response formats
  - [ ] Document error codes

#### generateStory API Route Refactoring

- [ ] **Step 1: Create directory structure**

  ```
  src/app/api/v1/generateStory/
  ├── route.ts                    # Main API handler (simplified)
  ├── validation.ts               # Request validation
  ├── generation.ts               # Story generation logic
  ├── caching.ts                  # Caching logic
  ├── responseFormatting.ts       # Response formatting
  └── analytics.ts                # Usage analytics
  ```

- [ ] **Step 2: Extract validation logic**

  - [ ] Move input validation to validation.ts
  - [ ] Add more comprehensive validation

- [ ] **Step 3: Extract generation logic**

  - [ ] Move story generation to generation.ts
  - [ ] Improve error handling

- [ ] **Step 4: Extract caching logic**

  - [ ] Move cache functions to caching.ts
  - [ ] Implement more sophisticated caching strategy

- [ ] **Step 5: Extract response formatting**

  - [ ] Move response formatting to responseFormatting.ts
  - [ ] Standardize response format

- [ ] **Step 6: Add analytics tracking**

  - [ ] Track story generation requests
  - [ ] Track generation success/failure
  - [ ] Track generation time

- [ ] **Step 7: Simplify main route.ts**

  - [ ] Use the extracted modules
  - [ ] Focus on request handling and error management

- [ ] **Step 8: Add unit tests**

  - [ ] Test validation functions
  - [ ] Test generation functions
  - [ ] Test caching functions
  - [ ] Test analytics tracking

#### Standardize Service Layer

- [ ] **Step 1: Create consistent service layer structure**

  ```
  src/services/
  ├── api/                        # API client services
  │   ├── openai.ts
  │   └── gemini.ts
  ├── auth/                       # Authentication services
  │   ├── clerk.ts
  │   └── supabase.ts
  ├── personalization/            # Personalization services (from Phase 2)
  ├── story/                      # Story-related services
  │   ├── generation.ts
  │   └── storage.ts
  ├── user/                       # User-related services
  │   ├── preferences.ts
  │   └── profile.ts
  └── analytics/                  # Analytics services
      ├── events.ts
      └── tracking.ts
  ```

- [ ] **Step 2: Convert all JS files to TS**

  - [ ] Ensure type safety across the codebase

- [ ] **Step 3: Ensure consistent patterns across services**

  - [ ] Standardize error handling
  - [ ] Standardize async patterns
  - [ ] Standardize return types
  - [ ] Add proper logging

- [ ] **Step 4: Implement service-level analytics**

  - [ ] Track service usage
  - [ ] Monitor performance
  - [ ] Log important events

- [ ] **Step 5: Add unit tests for services**

  - [ ] Test API client services
  - [ ] Test auth services
  - [ ] Test story services
  - [ ] Test user services
  - [ ] Test analytics services

### Phase 5: State Management Improvements

- [ ] **Step 1: Create consistent state management architecture**

  ```
  src/state/
  ├── index.ts                    # Main export file
  ├── context/                    # React Context providers
  │   ├── UserContext.tsx
  │   ├── StoryContext.tsx
  │   ├── PreferencesContext.tsx
  │   └── ThemeContext.tsx
  ├── hooks/                      # Custom hooks for state access
  │   ├── useUser.tsx
  │   ├── useStory.tsx
  │   ├── usePreferences.tsx
  │   └── useTheme.tsx
  └── utils/                      # State utilities
      ├── persistence.ts
      └── synchronization.ts
  ```

- [ ] **Step 2: Create context providers**

  - [ ] Implement UserContext for user data
  - [ ] Implement StoryContext for story data
  - [ ] Implement PreferencesContext for user preferences
  - [ ] Implement ThemeContext for theme settings

- [ ] **Step 3: Create custom hooks for state access**

  - [ ] Create useUser hook
  - [ ] Create useStory hook
  - [ ] Create usePreferences hook
  - [ ] Create useTheme hook

- [ ] **Step 4: Implement state persistence**

  - [ ] Add local storage persistence
  - [ ] Add server synchronization

- [ ] **Step 5: Update components to use new state management**

  - [ ] Update ConversationalWizard
  - [ ] Update page components
  - [ ] Update service calls

- [ ] **Step 6: Add unit tests for state management**

  - [ ] Test context providers
  - [ ] Test custom hooks
  - [ ] Test persistence

### Phase 6: Testing Infrastructure Improvement

- [ ] **Step 1: Standardize test structure**

  ```
  src/__tests__/
  ├── components/                 # Component tests
  │   ├── story/
  │   ├── common/
  │   └── ui/
  ├── services/                   # Service tests
  │   ├── personalization/
  │   ├── api/
  │   └── story/
  ├── utils/                      # Utility tests
  ├── hooks/                      # Hook tests
  ├── state/                      # State management tests
  └── api/                        # API tests
  ```

- [ ] **Step 2: Add tests for newly refactored components**

  - [ ] Write tests for each extracted component
  - [ ] Write tests for custom hooks
  - [ ] Write tests for context providers

- [ ] **Step 3: Add integration tests for key user flows**

  - [ ] Story creation wizard flow
  - [ ] Authentication flow
  - [ ] Dashboard interactions

- [ ] **Step 4: Add accessibility tests**

  - [ ] Test keyboard navigation
  - [ ] Test screen reader compatibility
  - [ ] Test color contrast

- [ ] **Step 5: Add performance tests**

  - [ ] Test component render performance
  - [ ] Test API response times
  - [ ] Test page load times

### Phase 7: Code Quality and Standards

- [ ] **Step 1: Implement consistent patterns**

  - [ ] Document component structure
  - [ ] Document file naming conventions
  - [ ] Document directory organization
  - [ ] Document state management patterns
  - [ ] Document error handling patterns

- [ ] **Step 2: Remove duplicate code**

  - [ ] Remove JavaScript versions of TypeScript files
  - [ ] Extract common utilities to shared locations
  - [ ] Standardize on TypeScript

- [ ] **Step 3: Add code quality tools**

  - [ ] Configure ESLint with stricter rules
  - [ ] Add TypeScript strict mode
  - [ ] Add Prettier for consistent formatting
  - [ ] Add husky pre-commit hooks

## Implementation Timeline

### Week 1: Phase 1 & 2 (High-Priority Files)

- [ ] Setup and analysis
- [ ] Refactor personalizationEngine.ts
- [ ] Refactor ConversationalWizard.tsx
- [ ] Refactor page.tsx

### Week 2: Phase 3 & 4 (Error Handling and API)

- [ ] Refactor error-handlers.ts
- [ ] Implement API versioning
- [ ] Refactor generateStory API route
- [ ] Standardize service layer

### Week 3: Phase 5 (State Management)

- [ ] Implement state management architecture
- [ ] Create context providers
- [ ] Create custom hooks
- [ ] Update components to use new state management

### Week 4: Phase 6 & 7 (Testing and Standards)

- [ ] Improve testing infrastructure
- [ ] Add tests for new components and services
- [ ] Implement consistent patterns
- [ ] Remove duplicate code
- [ ] Add code quality tools

## Tracking Progress

For each refactoring step:

1. Create a feature branch from the main refactoring branch
2. Implement changes for a single file/component
3. Write tests to ensure functionality is preserved
4. Create a PR for review
5. Merge back to the refactoring branch
6. Check off the completed item in this document

## Success Metrics

We'll measure the success of this refactoring by:

1. Reduction in file sizes (no files over 300 lines)
2. Improved test coverage (aim for 80%+)
3. Consistent patterns across the codebase
4. Easier onboarding for new developers
5. Faster development cycles for new features
6. Reduced error rates in production
7. Improved accessibility scores
8. Better performance metrics

9. Faster development cycles for new features
