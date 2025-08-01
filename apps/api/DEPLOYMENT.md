# Google Cloud Run Deployment Guide

This guide walks you through deploying the URL Shortener API to Google Cloud Run using GitHub Actions.

## Prerequisites

1. **Google Cloud Project**: Create a GCP project with billing enabled
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Supabase Database**: PostgreSQL database for the application

## Initial Google Cloud Setup

### 1. Enable Required APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable iam.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
```

### 2. Create Artifact Registry Repository

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
export REGION="us-central1"

# Create repository for Docker images
gcloud artifacts repositories create trimr-api \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for Trimr API"
```

### 3. Set up Workload Identity Federation

Create a service account for GitHub Actions:

```bash
# Create service account
gcloud iam service-accounts create github-actions \
    --description="Service account for GitHub Actions" \
    --display-name="GitHub Actions"

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.admin"

# Create Workload Identity Pool
gcloud iam workload-identity-pools create "github" \
    --project="$PROJECT_ID" \
    --location="global" \
    --display-name="GitHub pool"

# Create Workload Identity Provider
gcloud iam workload-identity-pools providers create-oidc "github" \
    --project="$PROJECT_ID" \
    --location="global" \
    --workload-identity-pool="github" \
    --display-name="GitHub provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
    --issuer-uri="https://token.actions.githubusercontent.com"

# Allow GitHub Actions to impersonate the service account
gcloud iam service-accounts add-iam-policy-binding \
    --project="$PROJECT_ID" \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME" \
    github-actions@$PROJECT_ID.iam.gserviceaccount.com
```

**Note**: Replace `PROJECT_NUMBER`, `YOUR_GITHUB_USERNAME`, and `YOUR_REPO_NAME` with your actual values.

To get your project number:
```bash
gcloud projects describe $PROJECT_ID --format="value(projectNumber)"
```

## GitHub Repository Setup

### Required Secrets

Add these secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

#### Google Cloud Configuration
- `GCP_PROJECT_ID`: Your Google Cloud Project ID
- `GAR_LOCATION`: Artifact Registry location (e.g., `us-central1`)
- `GCP_REGION`: Cloud Run deployment region (e.g., `us-central1`)
- `WIF_PROVIDER`: Workload Identity Provider (format: `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github/providers/github`)
- `WIF_SERVICE_ACCOUNT`: Service account email (`github-actions@PROJECT_ID.iam.gserviceaccount.com`)

#### Application Configuration
- `JWT_SECRET`: Secret key for JWT token signing (generate a secure random string)
- `SUPABASE_DB_URL`: PostgreSQL connection string from Supabase
- `BASE_URL`: Base URL of your deployed application (e.g., `https://your-app.run.app`)

#### Optional Configuration (with defaults)
- `GIN_MODE`: Gin framework mode (`release` - default)
- `RATE_LIMIT_REQUESTS`: Rate limit requests per window (`100` - default)
- `RATE_LIMIT_WINDOW`: Rate limit window in seconds (`60` - default)
- `UNIQUE_CLICK_EXPIRY_HOURS`: Unique click tracking expiry (`24` - default)

### Example Secret Values

```bash
# Required
GCP_PROJECT_ID=my-project-123
GAR_LOCATION=us-central1
GCP_REGION=us-central1
WIF_PROVIDER=projects/123456789/locations/global/workloadIdentityPools/github/providers/github
WIF_SERVICE_ACCOUNT=github-actions@my-project-123.iam.gserviceaccount.com
JWT_SECRET=your-super-secure-jwt-secret-here
SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
BASE_URL=https://trimr-api-xyz-uc.a.run.app

# Optional (with defaults shown)
GIN_MODE=release
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
UNIQUE_CLICK_EXPIRY_HOURS=24
```

## Deployment Process

### Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy-api.yml`) will automatically:

1. **Trigger** on pushes to `main` branch that modify files in `apps/api/`
2. **Build** the Docker image using the Dockerfile
3. **Push** the image to Google Artifact Registry
4. **Deploy** to Cloud Run with the configured environment variables

### Manual Deployment

If you need to deploy manually:

```bash
# Build and tag the image
cd apps/api
docker build -t gcr.io/$PROJECT_ID/trimr-api .

# Push to Artifact Registry
docker tag gcr.io/$PROJECT_ID/trimr-api $REGION-docker.pkg.dev/$PROJECT_ID/trimr-api/trimr-api:latest
docker push $REGION-docker.pkg.dev/$PROJECT_ID/trimr-api/trimr-api:latest

# Deploy to Cloud Run
gcloud run deploy trimr-api \
    --image=$REGION-docker.pkg.dev/$PROJECT_ID/trimr-api/trimr-api:latest \
    --platform=managed \
    --region=$REGION \
    --allow-unauthenticated \
    --set-env-vars="GIN_MODE=release,JWT_SECRET=$JWT_SECRET,SUPABASE_DB_URL=$SUPABASE_DB_URL"
```

## Health Check Endpoint

The application should implement a health check endpoint at `/health` for Cloud Run's health checks. Add this to your Go application:

```go
// In routes/routes.go or main.go
r.GET("/health", func(c *gin.Context) {
    c.JSON(200, gin.H{
        "status": "healthy",
        "timestamp": time.Now().UTC().Format(time.RFC3339),
    })
})
```

## Monitoring and Logging

### View Logs
```bash
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=trimr-api" --limit=50
```

### Monitor Service
```bash
gcloud run services describe trimr-api --region=$REGION
```

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all dependencies are properly specified in `go.mod`
2. **Permission Errors**: Verify that the service account has the required IAM roles
3. **Database Connection**: Ensure the `SUPABASE_DB_URL` is correct and accessible from Cloud Run
4. **Environment Variables**: Double-check that all required secrets are set in GitHub

### Debug Commands

```bash
# Check service status
gcloud run services list

# Get service details
gcloud run services describe trimr-api --region=$REGION

# View recent deployments
gcloud run revisions list --service=trimr-api --region=$REGION

# Stream logs
gcloud logs tail "resource.type=cloud_run_revision AND resource.labels.service_name=trimr-api"
```

## Security Considerations

1. **Use Workload Identity Federation** instead of service account keys
2. **Limit IAM permissions** to minimum required
3. **Use GitHub secrets** for sensitive configuration
4. **Enable HTTPS** (Cloud Run does this by default)
5. **Implement proper CORS** policies in your application
6. **Use strong JWT secrets** and rotate them regularly

## Cost Optimization

1. **Configure autoscaling** with appropriate min/max instances
2. **Set memory and CPU limits** based on actual usage
3. **Use Cloud Run's pay-per-use** pricing model
4. **Monitor usage** through Google Cloud Console

## Next Steps

After successful deployment:

1. **Configure custom domain** if needed
2. **Set up monitoring alerts** 
3. **Implement CI/CD improvements** (testing, staging environments)
4. **Add health checks and monitoring**
5. **Configure backup and disaster recovery**