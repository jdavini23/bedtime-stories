# Contributing to Bedtime Story Magic

Thank you for your interest in contributing to Bedtime Story Magic! This document outlines the rules, guidelines, and processes we follow to maintain a high-quality codebase and a productive development environment.

## Table of Contents
- [Code of Conduct](#code-of-npx @agentdeskai/browser-tools-mcp@1.0.11conduct)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Security Guidelines](#security-guidelines)
- [Performance Considerations](#performance-considerations)

## Code of Conduct

- Be respectful and inclusive in all communications
- Provide constructive feedback
- Focus on the best outcome for the project and its users
- Maintain a family-friendly approach in all content and code

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/[feature-name]` - For new features
- `bugfix/[bug-description]` - For bug fixes
- `hotfix/[hotfix-description]` - For urgent production fixes

### Environment Setup
1. Ensure you have Node.js 20+ and npm 10+ installed
2. Fork and clone the repository
3. Run `npm install` to install dependencies
4. Copy `.env.local.example` to `.env.local` and configure your environment variables
5. Run `npm run dev` to start the development server

### Commit Guidelines
- Use conventional commits format: `type(scope): message`
  - Types: feat, fix, docs, style, refactor, test, chore
  - Example: `feat(story-generator): add new fantasy theme option`
- Keep commits focused on a single change
- Write clear, descriptive commit messages

## Coding Standards

### General Rules
- Follow the DRY (Don't Repeat Yourself) principle
- Write self-documenting code with clear variable and function names
- Keep functions small and focused on a single responsibility
- Avoid deep nesting of conditionals and loops

### TypeScript
- Use TypeScript for all new code
- Define explicit types for function parameters and return values
- Avoid using `any` type unless absolutely necessary
- Use interfaces for object shapes and types for unions/primitives

### React
- Use functional components with hooks
- Keep components small and focused
- Use proper React key props in lists
- Implement proper error boundaries
- Follow the React hooks rules

### CSS/Styling
- Use Tailwind CSS for styling
- Follow mobile-first responsive design principles
- Ensure all UI elements are accessible
- Maintain consistent spacing and sizing

## Pull Request Process

1. Create a new branch from `develop` following the branch naming convention
2. Make your changes with appropriate tests and documentation
3. Run `npm run validate` to ensure all checks pass
4. Push your branch and create a pull request to `develop`
5. Fill out the PR template completely
6. Request review from at least one maintainer
7. Address all review comments
8. PRs require approval from at least one maintainer to be merged

### PR Requirements Checklist
- [ ] Code follows project style guidelines
- [ ] Tests added/updated for new functionality
- [ ] Documentation updated
- [ ] All CI checks pass
- [ ] No new warnings or errors introduced
- [ ] Accessibility considerations addressed

## Testing Guidelines

- Write tests for all new functionality
- Maintain or improve test coverage
- Test categories:
  - Unit tests for individual functions and components
  - Integration tests for feature workflows
  - Accessibility tests for UI components
- Run tests before submitting PRs: `npm run test`
- Check test coverage with: `npm run test:coverage`

## Documentation

- Update README.md for significant changes
- Document all public APIs and components
- Add JSDoc comments for functions and complex code
- Update docs/ directory with architectural decisions and feature specifications
- Keep documentation in sync with code changes

## Security Guidelines

- Never commit secrets or credentials
- Run `npm run secrets:scan` before committing to check for leaked secrets
- Follow OWASP security best practices
- Validate all user inputs
- Use Clerk authentication for user management
- Report security vulnerabilities privately to the maintainers

## Performance Considerations

- Optimize bundle size by avoiding unnecessary dependencies
- Use proper React memoization techniques
- Implement lazy loading for components and routes
- Consider mobile performance and data usage
- Test on low-end devices and slow connections

---

By contributing to this project, you agree to abide by these guidelines. Thank you for helping make Bedtime Story Magic better for everyone! 