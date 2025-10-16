# Certificate Download Site UI

A React application built with Vite for downloading AI program certificates.

## Prerequisites

- Node.js 20.x or higher
- npm

## Local Development

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

The application will open automatically at http://localhost:8080

### Building for Production

```bash
npm run build
```

The build output will be generated in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

Output directory - 'dist'

## CI/CD Pipeline

This project includes a GitHub Actions workflow for continuous deployment to Azure Web App.

### Workflow Overview

The CI/CD pipeline consists of two jobs:

1. **Build Job**: 
   - Checks out the code
   - Sets up Node.js 20.x
   - Installs dependencies
   - Builds the application
   - Uploads the build artifact

2. **Deploy Job** (runs on push to main branch):
   - Downloads the build artifact
   - Deploys to Azure Web App

### Azure Web App Setup

To deploy to Azure Web App, you need to configure the following secrets in your GitHub repository:

1. **AZURE_WEBAPP_NAME**: The name of your Azure Web App
2. **AZURE_WEBAPP_PUBLISH_PROFILE**: The publish profile from your Azure Web App

#### Getting the Publish Profile

1. Go to your Azure Portal
2. Navigate to your Web App
3. Click on "Get publish profile" in the Overview section
4. Copy the entire content of the downloaded file

#### Adding Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add the following secrets:
   - Name: `AZURE_WEBAPP_NAME`, Value: `your-webapp-name`
   - Name: `AZURE_WEBAPP_PUBLISH_PROFILE`, Value: `<paste the publish profile content>`

### Triggering the Workflow

The workflow triggers automatically on:
- Push to the `main` branch
- Pull requests to the `main` branch (build only, no deployment)
- Manual trigger via GitHub Actions UI

### SPA Routing Support

The project includes a `web.config` file in the `public` directory to support Single Page Application routing on Azure Web App. This ensures that all routes are properly handled by the React application.

## Tech Stack

- React 18.3.1
- Vite 5.4.8
- Tailwind CSS 4.0.0
- Lucide React (icons)

## License

[Add your license here]
