param(
    [string]$Output = "migrator.exe"
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$MigratorDir = Join-Path $ScriptDir "..\migrator"

Push-Location $MigratorDir

try {
    Write-Host "[1/2] go mod tidy..." -ForegroundColor Cyan
    go mod tidy
    if ($LASTEXITCODE -ne 0) { throw "go mod tidy failed" }

    Write-Host "[2/2] go build -o $Output..." -ForegroundColor Cyan
    go build -o $Output
    if ($LASTEXITCODE -ne 0) { throw "go build failed" }

    Write-Host "Build successful: $MigratorDir\$Output" -ForegroundColor Green
}
catch {
    Write-Host "Build failed: $_" -ForegroundColor Red
    exit 1
}
finally {
    Pop-Location
}
