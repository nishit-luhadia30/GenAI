#!/bin/bash

# CareerAI Deployment Script
# This script builds and deploys the application to Google Cloud Run

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-""}
REGION=${DEPLOY_REGION:-"asia-south1"}
SERVICE_NAME=${SERVICE_NAME:-"careerai"}
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if gcloud is installed
    if ! command -v gcloud &> /dev/null; then
        log_error "gcloud CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    # Check if project ID is set
    if [ -z "$PROJECT_ID" ]; then
        PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
        if [ -z "$PROJECT_ID" ]; then
            log_error "Google Cloud project ID is not set. Set GOOGLE_CLOUD_PROJECT environment variable or run 'gcloud config set project YOUR_PROJECT_ID'"
            exit 1
        fi
    fi
    
    log_success "Prerequisites check passed"
}

setup_environment() {
    log_info "Setting up environment..."
    
    # Authenticate with gcloud
    gcloud auth configure-docker --quiet
    
    # Enable required APIs
    log_info "Enabling required Google Cloud APIs..."
    gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID
    gcloud services enable run.googleapis.com --project=$PROJECT_ID
    gcloud services enable containerregistry.googleapis.com --project=$PROJECT_ID
    
    log_success "Environment setup completed"
}

build_application() {
    log_info "Building application..."
    
    # Install dependencies
    npm ci
    
    # Run linting
    log_info "Running linter..."
    npm run lint
    
    # Build the application
    log_info "Building production bundle..."
    npm run build
    
    log_success "Application build completed"
}

build_docker_image() {
    log_info "Building Docker image..."
    
    # Build Docker image
    docker build -t $IMAGE_NAME .
    
    # Push to Google Container Registry
    log_info "Pushing image to Google Container Registry..."
    docker push $IMAGE_NAME
    
    log_success "Docker image built and pushed"
}

deploy_to_cloud_run() {
    log_info "Deploying to Google Cloud Run..."
    
    # Deploy to Cloud Run
    gcloud run deploy $SERVICE_NAME \
        --image $IMAGE_NAME \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --memory 512Mi \
        --cpu 1 \
        --max-instances 10 \
        --set-env-vars "NODE_ENV=production" \
        --project $PROJECT_ID
    
    # Get the service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)' --project=$PROJECT_ID)
    
    log_success "Deployment completed!"
    log_success "Service URL: $SERVICE_URL"
}

setup_custom_domain() {
    if [ ! -z "$CUSTOM_DOMAIN" ]; then
        log_info "Setting up custom domain: $CUSTOM_DOMAIN"
        
        gcloud run domain-mappings create \
            --service $SERVICE_NAME \
            --domain $CUSTOM_DOMAIN \
            --region $REGION \
            --project $PROJECT_ID
        
        log_success "Custom domain setup completed"
        log_warning "Don't forget to update your DNS records!"
    fi
}

run_health_check() {
    log_info "Running health check..."
    
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)' --project=$PROJECT_ID)
    
    # Wait a moment for the service to be ready
    sleep 10
    
    # Check health endpoint
    if curl -f "$SERVICE_URL/health" > /dev/null 2>&1; then
        log_success "Health check passed"
    else
        log_warning "Health check failed - service might still be starting up"
    fi
}

cleanup() {
    log_info "Cleaning up..."
    
    # Remove local Docker image to save space
    docker rmi $IMAGE_NAME 2>/dev/null || true
    
    log_success "Cleanup completed"
}

main() {
    echo "🚀 CareerAI Deployment Script"
    echo "=============================="
    
    check_prerequisites
    setup_environment
    build_application
    build_docker_image
    deploy_to_cloud_run
    setup_custom_domain
    run_health_check
    cleanup
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "📱 Your CareerAI application is now live!"
    echo ""
    echo "Next steps:"
    echo "1. Test the application thoroughly"
    echo "2. Set up monitoring and alerting"
    echo "3. Configure your custom domain DNS"
    echo "4. Set up CI/CD pipeline for automated deployments"
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "CareerAI Deployment Script"
        echo ""
        echo "Usage: $0 [options]"
        echo ""
        echo "Environment variables:"
        echo "  GOOGLE_CLOUD_PROJECT  - Google Cloud project ID"
        echo "  DEPLOY_REGION        - Deployment region (default: asia-south1)"
        echo "  SERVICE_NAME         - Cloud Run service name (default: careerai)"
        echo "  CUSTOM_DOMAIN        - Custom domain to map (optional)"
        echo ""
        echo "Examples:"
        echo "  $0                                    # Deploy with defaults"
        echo "  CUSTOM_DOMAIN=careerai.com $0        # Deploy with custom domain"
        echo "  SERVICE_NAME=careerai-staging $0     # Deploy to staging"
        exit 0
        ;;
    *)
        main
        ;;
esac