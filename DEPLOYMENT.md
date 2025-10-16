# Azure Web App Deployment Guide

This guide will help you set up Azure Web App and configure the CI/CD pipeline to automatically deploy your React application.

## Prerequisites

- An Azure account with an active subscription
- A GitHub repository (this one!)
- Azure CLI (optional, but recommended)

## Step 1: Create Azure Web App

### Option A: Using Azure Portal

1. Log in to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Web App" and click "Create"
4. Configure the following:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or use existing
   - **Name**: Choose a unique name (this will be your URL: `<name>.azurewebsites.net`)
   - **Publish**: Select "Code"
   - **Runtime stack**: Select "Node 20 LTS"
   - **Operating System**: Linux or Windows (both supported)
   - **Region**: Choose a region close to your users
   - **App Service Plan**: Choose or create a plan (Free tier F1 works for testing)
5. Click "Review + Create" and then "Create"

### Option B: Using Azure CLI

```bash
# Login to Azure
az login

# Create a resource group (if you don't have one)
az group create --name myResourceGroup --location eastus

# Create an App Service plan
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku F1 --is-linux

# Create the web app
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name your-unique-app-name --runtime "NODE:20-lts"
```

## Step 2: Get Publish Profile

1. In Azure Portal, navigate to your Web App
2. In the left menu, click "Overview"
3. Click "Get publish profile" button at the top
4. A file will be downloaded (e.g., `your-app-name.PublishSettings`)
5. Open this file in a text editor and copy its entire content

## Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add the first secret:
   - **Name**: `AZURE_WEBAPP_NAME`
   - **Value**: `your-unique-app-name` (the name you chose in Step 1)
6. Click "Add secret"
7. Click "New repository secret" again
8. Add the second secret:
   - **Name**: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - **Value**: Paste the entire content from the publish profile file
9. Click "Add secret"

## Step 4: Create Production Environment (Optional but Recommended)

1. In your GitHub repository, go to "Settings" → "Environments"
2. Click "New environment"
3. Name it "Production" (must match the workflow file)
4. Click "Configure environment"
5. (Optional) Add protection rules:
   - Required reviewers
   - Wait timer
   - Deployment branches (e.g., only main)

## Step 5: Deploy

### Automatic Deployment

The CI/CD pipeline will automatically deploy when you:
- Push to the `main` branch
- Merge a pull request to `main`

### Manual Deployment

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Click on "Deploy to Azure Web App" workflow
4. Click "Run workflow" button
5. Select the branch and click "Run workflow"

## Step 6: Verify Deployment

1. After the workflow completes, go to your Azure Portal
2. Navigate to your Web App
3. Click on the URL (e.g., `https://your-app-name.azurewebsites.net`)
4. Your application should be live!

## Workflow Explanation

The GitHub Actions workflow (`.github/workflows/azure-webapp-deploy.yml`) has two jobs:

### Build Job
- Runs on every push and pull request to `main`
- Checks out the code
- Sets up Node.js 20.x
- Installs dependencies using `npm ci`
- Builds the application
- Uploads the build artifact

### Deploy Job
- Only runs on push to `main` (not on pull requests)
- Downloads the build artifact
- Deploys to Azure Web App using the publish profile
- Shows the deployment URL in the workflow output

## Troubleshooting

### Deployment fails with authentication error
- Verify that `AZURE_WEBAPP_PUBLISH_PROFILE` secret is correctly set
- Try downloading a fresh publish profile from Azure Portal

### App shows "Application Error" after deployment
- Check Azure App Service logs in Azure Portal
- Verify that the Node.js version matches (20.x)
- Ensure the `web.config` file is included in the deployment

### Build fails in GitHub Actions
- Check the workflow run logs in GitHub Actions
- Verify that `package.json` and `package-lock.json` are committed
- Ensure all dependencies are listed in `package.json`

### SPA routing doesn't work (404 errors on refresh)
- Verify that `web.config` is present in the `dist` folder
- Check Azure App Service configuration for URL rewrite module

## Additional Configuration

### Custom Domain

1. In Azure Portal, go to your Web App
2. Click "Custom domains" in the left menu
3. Click "Add custom domain"
4. Follow the instructions to verify and add your domain

### SSL Certificate

1. In Azure Portal, go to your Web App
2. Click "TLS/SSL settings" in the left menu
3. Either upload a certificate or use App Service Managed Certificate (free)

### Environment Variables

If your app needs environment variables:

1. In Azure Portal, go to your Web App
2. Click "Configuration" in the left menu
3. Under "Application settings", click "New application setting"
4. Add your environment variables

For sensitive values, use Azure Key Vault and reference them in the configuration.

## Monitoring

- **Logs**: Go to your Web App → "Log stream" to see real-time logs
- **Metrics**: Go to your Web App → "Metrics" to see performance data
- **Application Insights**: Enable for advanced monitoring and diagnostics

## Cost Management

- **Free Tier (F1)**: Suitable for development/testing, includes 60 minutes of compute per day
- **Basic Tier (B1)**: Starting point for production, ~$13/month
- **Standard Tier (S1)**: Better performance, ~$70/month

Set up cost alerts in Azure Portal to avoid unexpected charges.

## Support

For issues with:
- Azure setup: [Azure Support](https://azure.microsoft.com/support/)
- GitHub Actions: Check workflow logs and [GitHub Actions documentation](https://docs.github.com/actions)
- Application bugs: Open an issue in this repository
