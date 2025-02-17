# PowerShell script for NextAuth migration and cleanup

# Set the project root path
$projectRoot = "C:\Users\joeda\CascadeProjects\bedtime-stories"

# Remove old authentication-related files and directories
$filesToRemove = @(
    "$projectRoot\src\contexts\AuthContext.tsx",
    "$projectRoot\src\hooks\useAuth.ts"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Removed $file"
    }
}

# Find and replace old authentication references
$filesToCheck = Get-ChildItem -Path "$projectRoot\src" -Include "*.tsx", "*.ts" -Recurse

foreach ($file in $filesToCheck) {
    $content = Get-Content $file.FullName -Raw
    
    # Remove AuthContext imports
    $content = $content -replace 'import \{[^}]*useAuthContext[^}]*\} from ''@/contexts/AuthContext'';\s*', ''
    $content = $content -replace 'import \{[^}]*useAuth[^}]*\} from ''@/hooks/useAuth'';\s*', ''
    
    # Remove useAuthContext calls
    $content = $content -replace '\s*const \{ [^}]+\} = useAuthContext\(\);', ''
    $content = $content -replace '\s*const \{ [^}]+\} = useAuth\(\);', ''
    
    # Replace authentication checks
    $content = $content -replace 'if \(isAuthenticated\)', 'if (session)'
    $content = $content -replace 'if \(isLoading\)', 'if (false)'
    
    # Write modified content back to file
    $content | Set-Content $file.FullName
}

Write-Host "Authentication migration and cleanup completed."

# Change to project directory
Set-Location $projectRoot

# Install NextAuth and handle peer dependency conflicts
npm install next-auth --legacy-peer-deps

# Optional: Remove Firebase adapter if no longer needed
npm uninstall @next-auth/firebase-adapter

Write-Host "NextAuth installation completed."
