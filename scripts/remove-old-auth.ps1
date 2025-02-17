# PowerShell script to remove old authentication files and references

$filesToRemove = @(
    "src\contexts\AuthContext.tsx",
    "src\hooks\useAuth.ts",
    "src\hooks\useAuth.tsx"
)

# Remove old auth files
foreach ($file in $filesToRemove) {
    $fullPath = Join-Path $PSScriptRoot "..\$file"
    if (Test-Path $fullPath) {
        Remove-Item $fullPath -Force
        Write-Host "Removed $file"
    }
}

# Create contexts directory if it doesn't exist
$contextsDir = Join-Path $PSScriptRoot "..\src\contexts"
if (-not (Test-Path $contextsDir)) {
    New-Item -ItemType Directory -Path $contextsDir -Force
    Write-Host "Created contexts directory"
}

# Create hooks directory if it doesn't exist
$hooksDir = Join-Path $PSScriptRoot "..\src\hooks"
if (-not (Test-Path $hooksDir)) {
    New-Item -ItemType Directory -Path $hooksDir -Force
    Write-Host "Created hooks directory"
}

Write-Host "Cleanup completed."
