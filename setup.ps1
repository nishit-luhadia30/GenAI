# CareerAI Setup Script for Windows
# This script sets up the development environment and installs dependencies

param(
    [switch]$Install,
    [switch]$Dev,
    [switch]$Build,
    [switch]$Deploy,
    [switch]$Help
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Cyan"

function Write-Info {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

function Show-Help {
    Write-Host "CareerAI Setup Script" -ForegroundColor $Green
    Write-Host "=====================" -ForegroundColor $Green
    Write-Host ""
    Write-Host "Usage: .\setup.ps1 [options]" -ForegroundColor $Blue
    Write-Host ""
    Write-Host "Options:" -ForegroundColor $Blue
    Write-Host "  -Install    Install dependencies and setup environment"
    Write-Host "  -Dev        Start development server"
    Write-Host "  -Build      Build production bundle"
    Write-Host "  -Deploy     Deploy to Google Cloud Run"
    Write-Host "  -Help       Show this help message"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor $Blue
    Write-Host "  .\setup.ps1 -Install    # Setup project"
    Write-Host "  .\setup.ps1 -Dev        # Start development"
    Write-Host "  .\setup.ps1 -Build      # Build for production"
    Write-Host ""
}

function Test-Prerequisites {
    Write-Info "Checking prerequisites..."
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-Success "Node.js found: $nodeVersion"
    }
    catch {
        Write-Error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
        return $false
    }
    
    # Check npm
    try {
        $npmVersion = npm --version
        Write-Success "npm found: $npmVersion"
    }
    catch {
        Write-Error "npm is not installed. Please install npm"
        return $false
    }
    
    # Check Git
    try {
        $gitVersion = git --version
        Write-Success "Git found: $gitVersion"
    }
    catch {
        Write-Warning "Git is not installed. Some features may not work properly"
    }
    
    return $true
}

function Install-Dependencies {
    Write-Info "Installing dependencies..."
    
    if (-not (Test-Prerequisites)) {
        return $false
    }
    
    # Install npm dependencies
    Write-Info "Installing npm packages..."
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dependencies installed successfully"
    } else {
        Write-Error "Failed to install dependencies"
        return $false
    }
    
    # Setup environment file
    if (-not (Test-Path ".env")) {
        Write-Info "Creating environment file..."
        Copy-Item ".env.example" ".env"
        Write-Warning "Please edit .env file with your configuration"
    }
    
    Write-Success "Setup completed successfully!"
    Write-Info "Next steps:"
    Write-Info "1. Edit .env file with your Google Cloud configuration"
    Write-Info "2. Run '.\setup.ps1 -Dev' to start development server"
    
    return $true
}

function Start-Development {
    Write-Info "Starting development server..."
    
    if (-not (Test-Path "node_modules")) {
        Write-Warning "Dependencies not found. Installing..."
        if (-not (Install-Dependencies)) {
            return $false
        }
    }
    
    Write-Info "Starting Vite development server..."
    npm run dev
}

function Build-Production {
    Write-Info "Building production bundle..."
    
    if (-not (Test-Path "node_modules")) {
        Write-Error "Dependencies not found. Run '.\setup.ps1 -Install' first"
        return $false
    }
    
    # Run linting
    Write-Info "Running linter..."
    npm run lint
    
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Linting issues found, but continuing with build..."
    }
    
    # Build the application
    Write-Info "Building application..."
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Build completed successfully!"
        Write-Info "Built files are in the 'dist' directory"
        Write-Info "Run 'npm run preview' to test the production build"
    } else {
        Write-Error "Build failed"
        return $false
    }
    
    return $true
}

function Deploy-Application {
    Write-Info "Deploying to Google Cloud Run..."
    
    # Check if gcloud is installed
    try {
        $gcloudVersion = gcloud version --format="value(Google Cloud SDK)"
        Write-Success "Google Cloud SDK found: $gcloudVersion"
    }
    catch {
        Write-Error "Google Cloud SDK is not installed. Please install it from https://cloud.google.com/sdk"
        return $false
    }
    
    # Check if Docker is installed
    try {
        $dockerVersion = docker --version
        Write-Success "Docker found: $dockerVersion"
    }
    catch {
        Write-Error "Docker is not installed. Please install Docker Desktop"
        return $false
    }
    
    # Run deployment script
    if (Test-Path "deploy.sh") {
        Write-Info "Running deployment script..."
        bash deploy.sh
    } else {
        Write-Error "Deployment script not found"
        return $false
    }
}

# Main execution
if ($Help) {
    Show-Help
    exit 0
}

if ($Install) {
    Install-Dependencies
    exit $LASTEXITCODE
}

if ($Dev) {
    Start-Development
    exit $LASTEXITCODE
}

if ($Build) {
    Build-Production
    exit $LASTEXITCODE
}

if ($Deploy) {
    Deploy-Application
    exit $LASTEXITCODE
}

# If no parameters provided, show help
Show-Help