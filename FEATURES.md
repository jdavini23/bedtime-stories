# New Features Added to Bedtime Stories

This document outlines the new features and tools that have been added to enhance the Bedtime
Stories application.

## 1. Text-to-Speech Functionality

A new Text-to-Speech component has been added to allow parents and children to listen to stories
rather than just read them. This is particularly useful for:

- Parents who want to rest their eyes while the story is read aloud
- Children who are still learning to read
- Creating a more immersive bedtime experience

### Features:

- Play, pause, and stop controls
- Voice selection from available system voices
- Speed adjustment to control the pace of narration
- Automatic selection of female voices for a more soothing storytelling experience

### Implementation:

The component uses the Web Speech API, which is built into modern browsers, so no external service
is required.

## 2. Reading Time Estimator

A Reading Time component has been added to help parents plan bedtime routines by showing
approximately how long it will take to read a story.

### Features:

- Displays estimated reading time in minutes
- Adjusts for bedtime reading pace (30% slower than normal reading)
- Integrates seamlessly with the story display

### Implementation:

Uses the `reading-time` package to calculate the base reading time, with custom adjustments for
bedtime reading.

## 3. Error Tracking with Sentry

Sentry has been integrated to track errors in production, helping to identify and fix issues
quickly.

### Features:

- Automatic error capturing and reporting
- Performance monitoring
- Session replay for debugging user experiences
- Environment-specific configuration

### Implementation:

- Client, server, and edge runtime configurations
- Privacy-focused settings (masking text and blocking media in replays)
- Configurable sampling rates for different environments

## 4. Storybook for Component Development

Storybook has been set up to facilitate component development, testing, and documentation.

### Features:

- Interactive component playground
- Component documentation
- Visual testing environment
- Isolated component development

### Implementation:

- Story files for key components
- Various states and configurations for each component
- Autodocs for automatic documentation generation

## How to Use These Features

### Text-to-Speech

The Text-to-Speech component is automatically included in the StoryDisplay component. Users can:

- Click "Play" to start narration
- Adjust the voice and speed using the provided controls
- Pause or stop the narration at any time

### Reading Time

The Reading Time indicator appears automatically with each story, showing the estimated time to read
the story aloud.

### Sentry

For developers:

1. Add your Sentry DSN to the `.env.local` file
2. Errors will be automatically captured and reported to your Sentry dashboard

### Storybook

For developers:

1. Run `npm run storybook` to start the Storybook development environment
2. Browse and interact with components in isolation
3. Add new stories for new components as they are developed
