# PowerShell script to clean secrets from repository

# Remove cached environment files
git rm --cached .env .env.local .env.local.bak 2>$null

# Create a comprehensive .gitignore
$gitignoreContent = @"
# Dependency directories
node_modules/
.pnp/
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# Build and output directories
/.next/
/out/
/build/

# Environment files
.env
.env.local
.env.local.bak
*.env
*.env.local
*.env.development
*.env.production
.env.*.local

# Secrets and credentials
*.key
*.pem
*.p12

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE and editor files
.idea/
.vscode/
*.swp
*.swo

# OS generated files
.DS_Store
Thumbs.db
"@

Set-Content -Path .gitignore -Value $gitignoreContent

# Create environment template
$envTemplateContent = @"
# Firebase Web App Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=replace_with_your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=replace_with_your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=replace_with_your_project_id

# Add other placeholders for sensitive information
"@

Set-Content -Path .env.local.template -Value $envTemplateContent

# Stage changes
git add .gitignore .env.local.template

Write-Host "Secrets cleanup completed. Please replace placeholders in .env.local.template with your actual credentials."
