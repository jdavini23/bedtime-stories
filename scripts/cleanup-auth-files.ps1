# PowerShell script to clean up old auth files and set up new structure

# Remove old auth files
$filesToRemove = @(
    "src\contexts\AuthContext.tsx",
    "src\hooks\useAuth.ts",
    "src\hooks\useAuth.tsx"
)

foreach ($file in $filesToRemove) {
    $fullPath = Join-Path $PSScriptRoot "..\$file"
    if (Test-Path $fullPath) {
        Remove-Item $fullPath -Force
        Write-Host "Removed $file"
    }
}

# Create necessary directories
$directories = @(
    "src\contexts",
    "src\hooks",
    "src\providers"
)

foreach ($dir in $directories) {
    $fullPath = Join-Path $PSScriptRoot "..\$dir"
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "Created directory: $dir"
    }
}

# Remove node_modules and reinstall dependencies
Set-Location (Join-Path $PSScriptRoot "..")
if (Test-Path "node_modules") {
    Remove-Item "node_modules" -Recurse -Force
    Write-Host "Removed node_modules"
}

if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -Force
    Write-Host "Removed package-lock.json"
}

# Install dependencies
npm install

Write-Host "Cleanup completed successfully"
