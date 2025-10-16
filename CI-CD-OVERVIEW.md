# CI/CD Pipeline Overview

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GITHUB REPOSITORY                            │
│  (certificate_download_site-ui)                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Push to main / PR / Manual trigger
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       GITHUB ACTIONS WORKFLOW                        │
│              (.github/workflows/azure-webapp-deploy.yml)            │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
        ┌────────────────────┐          ┌────────────────────┐
        │    BUILD JOB       │          │   DEPLOY JOB       │
        │  (runs always)     │          │ (main branch only) │
        └────────────────────┘          └────────────────────┘
                    │                               │
                    │                               │
            1. Checkout code                1. Download artifact
            2. Setup Node.js 20.x           2. Deploy to Azure
            3. npm ci                       3. Return webapp URL
            4. npm run build
            5. Upload artifact
                    │
                    ▼
        ┌────────────────────┐
        │  Build Artifact    │
        │   (dist/ folder)   │
        │  - index.html      │
        │  - assets/*.css    │
        │  - assets/*.js     │
        │  - web.config      │
        └────────────────────┘
                    │
                    ▼
        ┌────────────────────────────────────────┐
        │        AZURE WEB APP                   │
        │  https://your-app.azurewebsites.net    │
        │  - Node.js 20 LTS Runtime              │
        │  - IIS URL Rewrite (web.config)       │
        │  - Static file serving                 │
        └────────────────────────────────────────┘
                    │
                    ▼
        ┌────────────────────────────────────────┐
        │         END USERS                      │
        │  Access the deployed application       │
        └────────────────────────────────────────┘
```

## Workflow Triggers

| Event Type | Build Job | Deploy Job | Use Case |
|------------|-----------|------------|----------|
| Push to main | ✅ Runs | ✅ Runs | Production deployment |
| Pull Request | ✅ Runs | ❌ Skipped | Pre-merge validation |
| Manual Dispatch | ✅ Runs | ✅ Runs | On-demand deployment |

## Build Process

```bash
# 1. Install dependencies (deterministic)
npm ci

# 2. Build the application
npm run build
  ├── Vite bundles React app
  ├── Optimizes assets (minify, tree-shake)
  ├── Generates dist/ folder
  └── Includes web.config from public/

# 3. Build output (dist/)
dist/
├── index.html              # Main HTML file
├── assets/
│   ├── index-[hash].css   # Bundled styles (Tailwind CSS)
│   └── index-[hash].js    # Bundled JavaScript (React app)
├── web.config              # IIS configuration for SPA routing
└── ai-certificate-preview.jpg
```

## Deployment Process

```
┌────────────────────────────────────────────────────────────┐
│ 1. Artifact Download                                       │
│    - Downloads dist/ from Build Job                        │
└────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│ 2. Azure Authentication                                     │
│    - Uses AZURE_WEBAPP_PUBLISH_PROFILE secret              │
│    - Secure credential-based deployment                    │
└────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│ 3. File Upload to Azure                                    │
│    - Uploads all files from dist/                          │
│    - Replaces existing files                               │
└────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│ 4. Azure App Service Restart                               │
│    - Applies new configuration                             │
│    - Loads new application files                           │
└────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│ 5. Health Check                                            │
│    - Verifies app is running                               │
│    - Returns deployment URL                                │
└────────────────────────────────────────────────────────────┘
```

## Configuration Files

### `.github/workflows/azure-webapp-deploy.yml`
**Purpose:** Defines the CI/CD pipeline  
**Key Features:**
- Two-job workflow (build + deploy)
- Node.js 20.x environment
- Artifact-based deployment
- Conditional deployment logic

### `public/web.config`
**Purpose:** Configures IIS for SPA routing  
**Key Features:**
- URL rewrite rules for React Router
- Static file MIME type mappings
- Custom 404 error handling
- API route preservation

### `.gitignore`
**Purpose:** Excludes files from version control  
**Excluded:**
- node_modules/ (dependencies)
- dist/ (build output)
- *.log (log files)
- .env* (environment variables)

## Required GitHub Secrets

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `AZURE_WEBAPP_NAME` | Your Azure Web App name | From Azure Portal → Web App → Overview |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Deployment credentials | Azure Portal → Web App → "Get publish profile" |

## Success Criteria

✅ **Build Success:**
- All dependencies installed
- TypeScript/JavaScript compiled
- Assets bundled and optimized
- Build artifact created

✅ **Deploy Success:**
- Files uploaded to Azure
- App service restarted
- Application accessible at URL
- No 5xx errors

## Monitoring Deployment

### During Deployment
1. Go to **GitHub → Actions** tab
2. Click on the running workflow
3. View real-time logs for each step
4. Check for errors or warnings

### After Deployment
1. Check **workflow summary** for deployment URL
2. Visit the URL to verify app is running
3. Check **Azure Portal → Log Stream** for app logs
4. Use **Azure Metrics** for performance data

## Rollback Strategy

If deployment fails or introduces bugs:

### Option 1: Revert Git Commit
```bash
git revert <commit-hash>
git push origin main
# Triggers automatic redeployment
```

### Option 2: Manual Redeploy Previous Version
1. Go to **GitHub → Actions**
2. Find the last successful workflow run
3. Click **Re-run all jobs**

### Option 3: Azure Portal Deployment Slots
- Use deployment slots for zero-downtime deployments
- Swap slots if new version has issues

## Performance Optimizations

**Build-time:**
- npm caching reduces install time
- Vite fast build (~2-3 seconds)
- Parallel job execution

**Runtime:**
- Gzip compression enabled
- Asset hashing for cache busting
- Code splitting for faster loads
- Minified JavaScript and CSS

## Security Considerations

✅ **Secrets Management:**
- Publish profile stored as GitHub secret
- Never committed to repository
- Automatically rotated by Azure

✅ **Access Control:**
- GitHub Actions environment protection
- Azure RBAC for Web App access
- Optional PR approval requirements

✅ **Network Security:**
- HTTPS enforced by default
- Azure DDoS protection
- Optional VNet integration

## Cost Estimation

| Tier | Cost | Suitable For |
|------|------|--------------|
| Free (F1) | $0/month | Development/Testing |
| Basic (B1) | ~$13/month | Small production apps |
| Standard (S1) | ~$70/month | Production apps with scaling |

**GitHub Actions:** 2,000 free minutes/month for public repos

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Build fails | Check package.json dependencies, run `npm ci` locally |
| Deploy authentication error | Verify AZURE_WEBAPP_PUBLISH_PROFILE secret |
| 404 on page refresh | Ensure web.config is in dist/ folder |
| Slow builds | Enable npm caching (already configured) |
| App doesn't start | Check Node.js version matches (20.x) |

## Additional Resources

- 📚 [Full Deployment Guide](./DEPLOYMENT.md)
- 📖 [README - Getting Started](./README.md)
- 🔗 [Azure Web Apps Documentation](https://docs.microsoft.com/azure/app-service/)
- 🔗 [GitHub Actions Documentation](https://docs.github.com/actions)
- 🔗 [Vite Build Documentation](https://vitejs.dev/guide/build.html)
