# Bedtime Story Magic - Project Rules

This document outlines the specific rules and guidelines for the Bedtime Story Magic project. These rules are designed to ensure consistency, quality, and a smooth development experience for all contributors.

## Content Guidelines

### Story Content
- All stories must be appropriate for children (ages 3-10)
- No violent, scary, or inappropriate themes
- Promote positive values (kindness, courage, friendship, etc.)
- Be inclusive and diverse in character representation
- Avoid stereotypes and biases
- Keep stories between 300-800 words depending on age target

### AI Generation Parameters
- Use temperature settings between 0.7-0.9 for creativity
- Include specific safety parameters in all AI prompts
- Implement content filtering for all generated stories
- Review and validate AI outputs before displaying to users
- Cache successful story generations to reduce API costs

## Technical Rules

### Code Organization
- Follow feature-based folder structure
- Keep components in `src/components/[feature-name]`
- Place API routes in `pages/api/[feature-name]`
- Store types in `src/types/[feature-name].ts`
- Use barrel exports (index.ts) for component directories

### State Management
- Use React Context for global state
- Prefer local state for component-specific state
- Use React Query for server state management
- Implement proper loading and error states for all async operations

### Performance Rules
- Keep First Contentful Paint under 1.2s
- Keep Time to Interactive under 3.5s
- Optimize images using Next.js Image component
- Implement code splitting for all routes
- Keep bundle size under 200KB for initial load

### Accessibility Requirements
- Maintain WCAG 2.1 AA compliance
- Use semantic HTML elements
- Implement proper ARIA attributes where needed
- Ensure keyboard navigation works for all interactive elements
- Maintain color contrast ratio of at least 4.5:1
- Test with screen readers

## Development Process

### Feature Development
1. Create a feature specification in `docs/features/[feature-name].md`
2. Get approval from at least one maintainer
3. Create a feature branch from `develop`
4. Implement the feature with tests and documentation
5. Submit a PR for review

### Bug Fixes
1. Create a detailed bug report with steps to reproduce
2. Assign priority (critical, high, medium, low)
3. Create a bugfix branch
4. Write a test that reproduces the bug
5. Fix the bug and ensure the test passes
6. Submit a PR for review

### Code Review Standards
- All PRs must be reviewed by at least one maintainer
- Address all comments before merging
- Maintain or improve code coverage
- Ensure all CI checks pass
- Follow the PR template completely

## Quality Assurance

### Testing Requirements
- Maintain minimum 80% code coverage
- Write unit tests for all utility functions
- Write component tests for all UI components
- Write integration tests for critical user flows
- Test on multiple browsers (Chrome, Firefox, Safari)
- Test on mobile devices (iOS and Android)

### Monitoring and Analytics
- Implement error tracking with appropriate context
- Track key user journeys and conversion metrics
- Monitor performance metrics in production
- Set up alerts for critical errors and performance degradation

## Deployment and Release

### Environment Strategy
- Development: Local development environment
- Staging: Vercel preview deployments
- Production: Vercel production deployment

### Release Process
1. Merge feature PRs into `develop`
2. Test thoroughly on staging
3. Create a release PR from `develop` to `main`
4. Tag the release with semantic versioning
5. Deploy to production
6. Monitor for any issues post-deployment

### Hotfix Process
1. Create a hotfix branch from `main`
2. Implement and test the fix
3. Create a PR to `main` and `develop`
4. Deploy immediately after approval

## Communication

### Documentation Updates
- Update README.md for user-facing changes
- Update API documentation for backend changes
- Document all configuration options
- Keep architecture diagrams up to date

### Team Communication
- Use GitHub Issues for task tracking
- Use Pull Requests for code review discussions
- Document important decisions in `docs/architecture/decisions`
- Keep the roadmap updated in `docs/ROADMAP.md`

---

These rules are subject to change as the project evolves. All contributors are expected to follow these guidelines to maintain the quality and consistency of the Bedtime Story Magic project. 