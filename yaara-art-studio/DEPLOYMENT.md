# GitHub Pages Deployment Guide

This guide explains how to deploy the Yaara Art Studio website to GitHub Pages.

## 🚀 Quick Deployment

### Option 1: Automatic Deployment (Recommended)

1. **Push to GitHub**: Push your code to the main branch
2. **GitHub Actions**: The workflow will automatically build and deploy
3. **Access your site**: Visit `https://yourusername.github.io/YaaraArtStudioClassesSite/`

### Option 2: Manual Deployment

1. **Build the project**:
   ```bash
   npm run build:github-pages
   ```

2. **Deploy to GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch and `/` folder
   - Save the settings

## 📁 Build Output

The build process creates:
- `dist/yaara-art-studio/` - Main build output
- `404.html` - For SPA routing support
- `.nojekyll` - Prevents Jekyll processing

## 🔧 Configuration

### Base URL
The app is configured with base href: `/YaaraArtStudioClassesSite/`

### Custom Domain (Optional)
To use a custom domain:
1. Add your domain to the CNAME file
2. Update the GitHub Pages settings
3. Configure DNS records

## 🐛 Troubleshooting

### Common Issues:

1. **404 errors on refresh**:
   - Ensure `404.html` is created (handled automatically)
   - Check that `.nojekyll` file exists

2. **Assets not loading**:
   - Verify `baseHref` is set correctly
   - Check that assets are in the correct path

3. **Build fails**:
   - Check Node.js version (requires 18+)
   - Ensure all dependencies are installed
   - Check for TypeScript errors

### Manual Build Steps:

```bash
# Install dependencies
npm install

# Build for production
ng build --configuration=production

# The build output will be in dist/yaara-art-studio/
```

## 📝 Notes

- The site uses Angular 17 with SSR disabled for GitHub Pages
- All assets are optimized for production
- The build includes proper routing support for SPAs
- Form submissions work with Formspree integration

## 🌐 Live Site

Once deployed, your site will be available at:
`https://yourusername.github.io/YaaraArtStudioClassesSite/`
