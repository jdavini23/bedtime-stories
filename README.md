# Bedtime Stories

A Next.js application that generates personalized bedtime stories for children using AI.

## Features

- Generate personalized bedtime stories based on child's name, interests, and preferences
- Multiple story themes (adventure, fantasy, educational, etc.)
- Responsive design for all devices
- Caching system for improved performance
- Fallback to mock stories when API is unavailable

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: Vercel KV (Redis)
- **AI**: OpenAI GPT-3.5 Turbo
- **Deployment**: Vercel
- **Testing**: Vitest
- **Monitoring**: Sentry
- **Analytics**: Vercel Analytics & Speed Insights
- **Security**: TruffleHog, npm audit

## Project Structure

- Node.js 22+
- npm 10+
- Clerk Account
- OpenAI API Key (required for AI story generation)
- Sentry Account (for error tracking and monitoring)

## Environment Variables

Create a `.env.local` file with the following variables:

```
# OpenAI (server-side only)
OPENAI_API_KEY=your_openai_api_key

# Vercel KV
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token

# Feature Flags
ENABLE_MOCK_STORIES=false
ENABLE_CACHING=true

# Performance
STORY_CACHE_TTL_SECONDS=86400
API_TIMEOUT_MS=25000

# Sentry
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## API Routes

### POST /api/generateStory

Generates a personalized bedtime story.

**Request Body:**

```json
{
  "childName": "Alex",
  "gender": "boy",
  "theme": "adventure",
  "interests": ["dinosaurs", "space"],
  "mostLikedCharacterTypes": ["explorers", "scientists"]
}
```

**Response:**

- Create a Clerk account at [Clerk.com](https://clerk.com)
- Create a new application
- Copy your Publishable and Secret keys into `.env.local`

5. Configure OpenAI (Required for AI story generation)

- Create an OpenAI account at [OpenAI](https://platform.openai.com/)
- Navigate to the API keys section in your account
- Generate a new API key
- Add the key to `.env.local` as `OPENAI_API_KEY=your_key_here` (server-side only for security)
- The application will use a fallback mock story generator if no API key is provided, but for the
  full experience, an OpenAI API key is required

## Development Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production application
- `npm run start`: Start production server
- `npm run test`: Run tests
- `npm run lint`: Run ESLint
- `npm run type:check`: Run TypeScript type checking
- `npm run validate`: Run comprehensive project validation
- `npm run verify:deployment`: Verify deployment configuration
- `npm run deploy:prepare`: Prepare for deployment (clean, build, verify)
- `npm run test:sentry`: Test Sentry integration

## Testing

- Unit tests with Vitest
- React component testing with Testing Library
- Run tests with `npm test`
- View test coverage with `npm run test:coverage`

## Security and Performance

- Trufflehog for secrets scanning
- Clerk for secure authentication
- Vercel Speed Insights
- Vercel Analytics
- Sentry for error tracking and performance monitoring

## OpenAI Integration

The application uses OpenAI's GPT models to generate personalized stories based on user input. The
integration works as follows:

1. User inputs (child name, interests, theme, etc.) are collected through the StoryWizard component
2. The data is sent to the `/api/generateStory` endpoint
3. The API route uses the OpenAI SDK to generate a unique story
4. The generated story is returned to the client and displayed to the user

For development and testing without incurring API costs:

- The application includes a fallback mock story generator
- Set `NEXT_PUBLIC_OPENAI_API_KEY=mock` to always use the mock generator

## Deployment

### Deployment Checklist

Before deploying, run the deployment checklist to ensure everything is properly configured:

```bash
# View the complete deployment checklist
cat DEPLOYMENT.md
```

### Security Check

Run the security check to scan for vulnerabilities and potential security issues:

```bash
npm run security:check
```

This will:

- Check for sensitive information in environment files
- Run npm audit to find vulnerable dependencies
- Check for outdated dependencies
- Scan for potential hardcoded secrets in code

### Environment Verification

Verify that all required environment variables are set:

```bash
npm run verify:env
```

This will check both development (.env.local) and production (.env.production) environment variables
and ensure they are properly configured.

### Deployment Steps

#### Option 1: One-step Deployment

Use the all-in-one deployment script:

```bash
npm run deploy
```

This script will:

1. Verify deployment readiness
2. Clean the build directory
3. Build the application with Sentry source maps
4. Deploy to Vercel

#### Option 2: Step-by-step Deployment

If you prefer to run the deployment steps individually:

1. **Verify deployment configuration**:

   ```bash
   npm run verify:deployment
   ```

2. **Prepare for deployment**:

   ```bash
   npm run deploy:prepare
   ```

3. **Deploy to Vercel**:
   ```bash
   npm run deploy:vercel
   ```

### Environment Variables for Production

Create a `.env.production` file with the following variables:

```
# Sentry DSN (use environment variable in production)
NEXT_PUBLIC_SENTRY_DSN=${SENTRY_DSN}

# App Configuration
NEXT_PUBLIC_APP_URL=${VERCEL_URL}

# Disable source maps in production (they'll be uploaded to Sentry)
GENERATE_SOURCEMAP=false

# Enable Sentry tracing in production
NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE=0.1
```

### Sentry Integration

The application uses Sentry for error tracking and performance monitoring. To set up Sentry:

1. Create a Sentry account at [Sentry.io](https://sentry.io)
2. Create a new project for JavaScript Next.js
3. Copy the DSN into your environment variables
4. Configure Sentry in your Vercel project settings:
   - Add the `SENTRY_AUTH_TOKEN` to your Vercel environment variables
   - Add the `SENTRY_ORG` and `SENTRY_PROJECT` to your Vercel environment variables
5. Test the Sentry integration:
   ```bash
   npm run test:sentry
   ```

## Troubleshooting

### Vercel Deployment Dependency Conflicts

If you encounter dependency conflicts during Vercel deployment (particularly with OpenTelemetry
packages), you can use one of these solutions:

#### Solution 1: Use the Deployment Helper Script

Run the deployment helper script which automatically fixes common dependency issues:

```bash
npm run deploy:fix
```

Or run it directly:

```bash
node scripts/deploy-to-vercel.js
```

This interactive script will:

1. Fix OpenTelemetry API version conflicts
2. Update Vercel configuration to use `--legacy-peer-deps`
3. Guide you through the commit, push, and deployment process

#### Solution 2: Manual Fix

1. Update `@opentelemetry/api` version in package.json:

   ```json
   "@opentelemetry/api": "1.8.0"
   ```

2. Modify the `installCommand` in vercel.json:

   ```json
   "installCommand": "npm ci --legacy-peer-deps"
   ```

3. Commit and push these changes, then deploy to Vercel

#### Solution 3: Quick Fix Script

Run the dependency conflict resolution script:

```bash
npm run fix:dependencies
```

Or run it directly:

```bash
node scripts/fix-dependency-conflict.js
```

This will automatically update your package.json and reinstall dependencies.

### Other Common Issues

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

## License

This project is licensed under the MIT License.

## Contact

GitHub: [@jdavini23](https://github.com/jdavini23)

Project Link:
[https://github.com/jdavini23/bedtime-stories](https://github.com/jdavini23/bedtime-stories)

## Row Level Security (RLS) Policies

This project uses Supabase's Row Level Security (RLS) to protect data access. RLS ensures that users
can only access their own data, and unauthenticated users cannot access any data.

### RLS Status

The current RLS configuration provides the following security:

1. **Unauthenticated users:**

   - Cannot insert, update, or delete data in any table
   - Cannot view data in any table (empty results are returned)

2. **Authenticated users:**

   - Can only view, insert, update, and delete their own data
   - Cannot access other users' data

3. **Service role (admin):**
   - Has full access to all tables for administrative operations

### Testing RLS Policies

To test the RLS policies, run:

```bash
node simple-rls-test.js
```

This script will check if unauthenticated users can access or modify data in the database.

### Applying RLS Policies

If the RLS policies need to be updated, follow these steps:

1. Go to the Supabase dashboard at https://supabase.com/dashboard
2. Select your project
3. Navigate to the SQL Editor
4. Create a new query
5. Copy and paste the contents of the `deny-all-access.sql` file
6. Run the SQL script

### RLS Policy Best Practices

1. Always enable RLS on all tables in public schemas
2. Create policies that restrict access based on authentication status
3. Use `auth.uid()` to match the authenticated user with the appropriate records
4. Test your policies with both authenticated and unauthenticated users
5. Consider adding service role policies for admin operations
