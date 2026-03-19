# PowerShell script to load .env variables and run Spring Boot app
# Usage: .\run-with-env.ps1

$envFile = ".env"

if (-not (Test-Path $envFile)) {
    Write-Host "Error: .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file from .env.example"
    exit 1
}

Write-Host "Loading environment variables from .env file..." -ForegroundColor Green

# Read .env file and set environment variables
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    
    # Skip empty lines and comments
    if ($line -and -not $line.StartsWith("#")) {
        $parts = $line -split "=", 2
        if ($parts.Count -eq 2) {
            $key = $parts[0].Trim()
            $value = $parts[1].Trim()
            
            # Set environment variable
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Host "  $key=***" -ForegroundColor Cyan
        }
    }
}

Write-Host "Environment variables loaded!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting Spring Boot application..." -ForegroundColor Yellow
Write-Host ""

# Run Maven
mvn clean spring-boot:run
