# PowerShell script to clean up old authentication references

# Files to check and modify
$filesToCheck = @(
    "src\app\login\page.tsx",
    "src\components\auth\LoginButton.tsx",
    "src\app\dashboard\page.tsx"
)

foreach ($file in $filesToCheck) {
    $fullPath = Join-Path $PSScriptRoot "..\$file"
    
    # Read file content
    $content = Get-Content $fullPath -Raw
    
    # Remove imports
    $content = $content -replace 'import \{ useAuthContext \} from ''@/contexts/AuthContext'';\s*', ''
    $content = $content -replace '\s*const \{ [^}]+\} = useAuthContext\(\);', ''
    
    # Remove isLoading and isAuthenticated checks
    $content = $content -replace 'if \(isAuthenticated\)', 'if (session)'
    $content = $content -replace 'if \(isLoading\)', 'if (false)'
    
    # Write modified content back to file
    $content | Set-Content $fullPath
}

Write-Host "Authentication context cleanup completed."
