param(
    [string]$Output = "",
    [ValidateSet("arm64", "armv7", "armv6", "")]
    [string]$Target = ""
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$MigratorDir = Join-Path $ScriptDir "..\migrator"

$savedEnv = @{
    GOOS   = $env:GOOS
    GOARCH = $env:GOARCH
    GOARM  = $env:GOARM
}

switch ($Target) {
    "arm64" {
        $env:GOOS = "linux"
        $env:GOARCH = "arm64"
        if (-not $Output) { $Output = "migrator-linux-arm64" }
    }
    "armv7" {
        $env:GOOS = "linux"
        $env:GOARCH = "arm"
        $env:GOARM = "7"
        if (-not $Output) { $Output = "migrator-linux-armv7" }
    }
    "armv6" {
        $env:GOOS = "linux"
        $env:GOARCH = "arm"
        $env:GOARM = "6"
        if (-not $Output) { $Output = "migrator-linux-armv6" }
    }
    default {
        if (-not $Output) { $Output = "migrator.exe" }
    }
}

Push-Location $MigratorDir

try {
    Write-Host "[1/2] go mod tidy..." -ForegroundColor Cyan
    go mod tidy
    if ($LASTEXITCODE -ne 0) { throw "go mod tidy failed" }

    $buildInfo = ""
    if ($Target) {
        $envParts = @("GOOS=$env:GOOS", "GOARCH=$env:GOARCH")
        if ($env:GOARM) { $envParts += "GOARM=$env:GOARM" }
        $buildInfo = " (" + ($envParts -join " ") + ")"
    }

    Write-Host "[2/2] go build -o $Output$buildInfo..." -ForegroundColor Cyan
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

    foreach ($name in @("GOOS", "GOARCH", "GOARM")) {
        if ($null -eq $savedEnv[$name]) {
            Remove-Item "Env:$name" -ErrorAction SilentlyContinue
        } else {
            Set-Item "Env:$name" $savedEnv[$name]
        }
    }
}
