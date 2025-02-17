# OAuth Provider Setup Guide for Bedtime Stories

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project named "Bedtime Stories"
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Application Type: Web application
6. Name: Bedtime Stories Web App
7. Authorized JavaScript origins:
   - http://localhost:3000
   - https://your-production-domain.com
8. Authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google
   - https://your-production-domain.com/api/auth/callback/google

## Environment Variables to Update in .env.local

```bash
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Security Best Practices

1. Never commit OAuth credentials to version control
2. Use environment variables
3. Implement proper scopes
4. Rotate credentials periodically
5. Enable two-factor authentication for provider accounts
