# Deployment Checklist

This document provides a comprehensive checklist for deploying the Bedtime Stories application to
production.

## Pre-Deployment Checklist

### 1. Environment Configuration

- [ ] Verify all required environment variables are set in `.env.production`
- [ ] Ensure Sentry DSN is configured correctly
- [ ] Check that Clerk authentication keys are valid
- [ ] Verify OpenAI API key is valid and has sufficient quota
- [ ] Run environment verification: `npm run verify:env`

### 2. Build Configuration

- [ ] Verify `next.config.js` is properly configured
- [ ] Check Sentry source map configuration in `.sentryclirc`
- [ ] Ensure `vercel.json` has the correct build commands
- [ ] Verify Node.js and npm version requirements in `package.json`

### 3. Code Quality

- [ ] Run linting: `npm run lint`
- [ ] Run type checking: `npm run type:check`
- [ ] Run tests: `npm test`
- [ ] Run comprehensive validation: `npm run validate`

### 4. Security

- [ ] Run security scan: `npm run secrets:scan`
- [ ] Check for vulnerable dependencies: `npm audit`
- [ ] Ensure no hardcoded secrets in the codebase
- [ ] Verify proper CORS configuration
- [ ] Run security check: `npm run security:check`

### 5. Performance

- [ ] Run performance checks: `npm run monitor`
- [ ] Analyze bundle size: `npm run analyze`
- [ ] Verify source map generation

## Setting Up Environment Variables

### Local Environment

1. Make sure your `.env.local` file contains all required variables:

   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   - CLERK_SECRET_KEY
   - OPENAI_API_KEY
   - KV_REST_API_URL
   - KV_REST_API_TOKEN
   - NEXT_PUBLIC_SENTRY_DSN

2. For Sentry configuration, also add:

   - SENTRY_AUTH_TOKEN
   - SENTRY_ORG
   - SENTRY_PROJECT

3. Set up local environment variables for testing:

   ```bash
   npm run setup:local
   ```

4. Follow the instructions to set the environment variables in your terminal session.

### Vercel Environment

To set up environment variables in Vercel:

1. Run the Vercel environment setup script:

   ```bash
   npm run setup:vercel
   ```

2. Follow the instructions to add each environment variable to Vercel using the Vercel CLI:

   ```bash
   vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   # Enter the value when prompted
   ```

3. Repeat for all required environment variables.

## Setting Up Sentry

1. Run the Sentry setup script:

   ```bash
   npm run setup:sentry
   ```

2. Follow the prompts to configure Sentry authentication.

3. Make sure the following environment variables are set in Vercel:
   - SENTRY_AUTH_TOKEN
   - SENTRY_ORG
   - SENTRY_PROJECT

## Deployment Steps

1. **Verify deployment configuration**:

   ```bash
   npm run verify:deployment
   ```

   This will check if all required files and environment variables are set correctly.

2. **Prepare for deployment**:

   ```bash
   npm run deploy:prepare
   ```

   This will:

   - Clean the build directory
   - Build the application with Sentry source maps
   - Verify deployment configuration

3. **Deploy to Vercel**:

   ```bash
   npm run deploy:vercel
   ```

4. **Post-Deployment Verification**:
   - [ ] Verify application loads correctly
   - [ ] Check authentication flow
   - [ ] Test story generation
   - [ ] Verify Sentry is capturing errors
   - [ ] Check Vercel Analytics and Speed Insights

## Troubleshooting Common Deployment Issues

### Environment Variable Issues

If you encounter environment variable issues:

1. Run the verification script to identify missing variables:

   ```bash
   npm run verify:env
   ```

2. Set up the missing variables in Vercel:

   ```bash
   npm run setup:vercel
   ```

3. Follow the instructions to add each variable to Vercel.

4. For local testing, set up the environment variables in your terminal:
   ```bash
   npm run setup:local
   ```

### Sentry Configuration Issues

If Sentry is not working correctly:

1. Run the Sentry setup script:

   ```bash
   npm run setup:sentry
   ```

2. Make sure the Sentry auth token is set in Vercel environment variables.

3. Test Sentry configuration:
   ```bash
   npm run sentry:test
   ```

### Source Map Issues

If source maps are not being uploaded to Sentry:

1. Verify the Sentry auth token is set in Vercel environment variables
2. Check the `.sentryclirc` file configuration
3. Ensure the `sentry:sourcemaps` script is running during build

### Node.js Version Issues

If you encounter Node.js compatibility issues:

1. Verify the Node.js version in `package.json` matches the version on Vercel
2. Update the `engines` field in `package.json` if necessary
3. Set the Node.js version in Vercel project settings

### Build Failures

If the build fails:

1. Check the build logs for specific errors
2. Verify all dependencies are installed correctly
3. Check for TypeScript errors
4. Ensure environment variables are set correctly

## Rollback Procedure

If the deployment causes issues:

1. Identify the last stable deployment in Vercel
2. Roll back to that deployment in the Vercel dashboard
3. Investigate and fix the issues
4. Re-deploy when fixed

## Monitoring and Maintenance

- Monitor Sentry for errors and performance issues
- Check Vercel Analytics for user behavior and performance metrics
- Regularly update dependencies to address security vulnerabilities
- Perform regular security audits
