# PowerShell Secrets Generation Script

function Generate-Secret {
    param (
        [int]$Length = 32
    )
    $bytes = New-Object Byte[] $Length
    (New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}

function Generate-ApiKey {
    param (
        [int]$Length = 32
    )
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    $result = -join ($chars | Get-Random -Count $Length)
    return "sk-$result"
}

# Create .env.local with secure defaults
$envLocalContent = @"
# NextAuth Configuration
NEXTAUTH_SECRET=$(Generate-Secret)
NEXTAUTH_URL=http://localhost:3000

# OpenAI API (optional)
OPENAI_API_KEY=$(Generate-ApiKey)

# Firebase Web App Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=$(Generate-Secret)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=$(Generate-Secret)

# OAuth Placeholder Credentials (MUST BE REPLACED)
GOOGLE_CLIENT_ID=replace_with_actual_client_id
GOOGLE_CLIENT_SECRET=replace_with_actual_client_secret
GITHUB_CLIENT_ID=replace_with_actual_client_id
GITHUB_CLIENT_SECRET=replace_with_actual_client_secret
"@

# Write to .env.local
$envLocalContent | Out-File -FilePath .env.local -Encoding UTF8

Write-Host "Generated secure .env.local with placeholder credentials"
