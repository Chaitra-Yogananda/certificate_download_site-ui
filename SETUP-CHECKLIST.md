# Azure Deployment Setup Checklist

Use this checklist to set up your Azure Web App deployment. Check off each item as you complete it.

## Prerequisites ✓

- [ ] Azure account with active subscription
- [ ] GitHub repository admin access
- [ ] Ability to add GitHub secrets

## Step 1: Create Azure Web App

### Using Azure Portal

- [ ] Log in to [Azure Portal](https://portal.azure.com)
- [ ] Click "Create a resource" → "Web App"
- [ ] Fill in the configuration:
  - [ ] **Name**: `____________________` (must be unique, e.g., certificate-app-prod)
  - [ ] **Runtime**: Node 20 LTS
  - [ ] **Region**: Choose nearest to your users
  - [ ] **Plan**: Free (F1) for testing, Basic (B1) for production
- [ ] Click "Review + Create" → "Create"
- [ ] Wait for deployment to complete (~2 minutes)
- [ ] Note your app URL: `https://______________.azurewebsites.net`

### OR Using Azure CLI

```bash
# Login
az login

# Create resource group (if needed)
az group create --name myResourceGroup --location eastus

# Create App Service plan
az appservice plan create --name myPlan --resource-group myResourceGroup --sku B1 --is-linux

# Create web app (REPLACE with your unique name)
az webapp create --resource-group myResourceGroup --plan myPlan --name YOUR-UNIQUE-APP-NAME --runtime "NODE:20-lts"
```

- [ ] Commands executed successfully
- [ ] Note your app name: `____________________`

## Step 2: Get Publish Profile

- [ ] Go to Azure Portal → Your Web App
- [ ] Click "Get publish profile" in the Overview section
- [ ] Download the `.PublishSettings` file
- [ ] Open the file in a text editor
- [ ] Copy the entire content (keep it safe, we'll use it next)

## Step 3: Configure GitHub Secrets

- [ ] Go to your GitHub repository
- [ ] Navigate to: **Settings** → **Secrets and variables** → **Actions**

### Add First Secret

- [ ] Click "New repository secret"
- [ ] Name: `AZURE_WEBAPP_NAME`
- [ ] Value: `____________________` (your Azure Web App name from Step 1)
- [ ] Click "Add secret"

### Add Second Secret

- [ ] Click "New repository secret" again
- [ ] Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
- [ ] Value: Paste the entire content from the publish profile file
- [ ] Click "Add secret"

### Verify Secrets

- [ ] You should see both secrets listed (values are hidden)
- [ ] `AZURE_WEBAPP_NAME` ✓
- [ ] `AZURE_WEBAPP_PUBLISH_PROFILE` ✓

## Step 4: (Optional) Create GitHub Environment

This adds extra protection for production deployments.

- [ ] Go to **Settings** → **Environments**
- [ ] Click "New environment"
- [ ] Name: `Production`
- [ ] Click "Configure environment"
- [ ] (Optional) Add protection rules:
  - [ ] Required reviewers
  - [ ] Wait timer
  - [ ] Deployment branches: `main` only
- [ ] Click "Save protection rules"

## Step 5: Deploy

### Option A: Merge PR (Recommended)

- [ ] Review the changes in this PR
- [ ] Merge the PR to the `main` branch
- [ ] Go to **Actions** tab in GitHub
- [ ] Watch the "Deploy to Azure Web App" workflow run
- [ ] Wait for it to complete (~3-5 minutes)

### Option B: Manual Trigger

- [ ] Go to **Actions** tab
- [ ] Click "Deploy to Azure Web App"
- [ ] Click "Run workflow"
- [ ] Select `main` branch
- [ ] Click "Run workflow"
- [ ] Wait for completion (~3-5 minutes)

## Step 6: Verify Deployment

- [ ] Workflow completed successfully (green checkmark)
- [ ] Click on the workflow run
- [ ] Find the deployment URL in the output
- [ ] Open your Azure Web App URL: `https://______________.azurewebsites.net`
- [ ] Application loads correctly ✓
- [ ] All features work as expected ✓

## Step 7: Test CI/CD Pipeline

Make a small change to verify automatic deployment:

- [ ] Edit `src/page.jsx` (change some text)
- [ ] Commit and push to `main`
- [ ] Check **Actions** tab - workflow should start automatically
- [ ] Wait for workflow to complete
- [ ] Verify the change appears on your Azure Web App

## Troubleshooting

If you encounter issues, check:

- [ ] GitHub secrets are correctly set (no typos)
- [ ] Publish profile is valid (re-download if needed)
- [ ] Azure Web App is running (check Azure Portal)
- [ ] Workflow logs for error messages (Actions tab)
- [ ] Refer to [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting

## Post-Deployment Tasks

### Security

- [ ] (Recommended) Enable HTTPS-only in Azure Portal
- [ ] (Optional) Add custom domain
- [ ] (Optional) Configure Application Insights for monitoring

### Monitoring

- [ ] Bookmark Azure Portal → Your Web App → Log stream
- [ ] Set up Azure cost alerts
- [ ] (Optional) Configure GitHub notifications for workflow failures

### Documentation

- [ ] Update repository README with your live URL
- [ ] Document any environment variables needed
- [ ] Share deployment URL with your team

## Quick Reference

| Resource | Location |
|----------|----------|
| Azure Web App | https://______________.azurewebsites.net |
| Azure Portal | https://portal.azure.com |
| GitHub Actions | https://github.com/YOUR-ORG/certificate_download_site-ui/actions |
| Workflow File | `.github/workflows/azure-webapp-deploy.yml` |

## Next Steps After Setup

✅ **Automatic Deployment Active**
- Every push to `main` triggers deployment
- Pull requests run build validation only
- Manual deployments available anytime

✅ **Monitoring**
- Check GitHub Actions for deployment status
- Use Azure Portal for app health monitoring
- Set up alerts for failures

✅ **Scaling**
- Start with Free/Basic tier
- Scale up as traffic grows
- Azure auto-scaling available in Standard tier

---

## Questions or Issues?

- 📚 Read the [full deployment guide](./DEPLOYMENT.md)
- 📖 Check the [CI/CD overview](./CI-CD-OVERVIEW.md)
- 🐛 Open an issue in this repository
- 💬 Contact your Azure administrator

---

**Congratulations!** 🎉 Once you complete this checklist, your application will be automatically deployed to Azure on every code push!
