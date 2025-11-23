#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building for Custom Domain...');

try {
  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Build the project for custom domain (baseHref: "/")
  console.log('🔨 Building Angular project for custom domain...');
  execSync('ng build --configuration=custom-domain', { stdio: 'inherit' });

  // Create a 404.html file for SPA routing
  console.log('📄 Creating 404.html for SPA routing...');
  const indexPath = path.join('dist', 'yaara-art-studio', 'browser', 'index.html');
  const notFoundPath = path.join('dist', 'yaara-art-studio', 'browser', '404.html');
  
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, notFoundPath);
    console.log('✅ 404.html created successfully');
  }

  // Create .nojekyll file to prevent Jekyll processing
  console.log('📄 Creating .nojekyll file...');
  const noJekyllPath = path.join('dist', 'yaara-art-studio', 'browser', '.nojekyll');
  fs.writeFileSync(noJekyllPath, '');
  console.log('✅ .nojekyll file created');

  console.log('🎉 Build completed successfully!');
  console.log('📁 Build output: dist/yaara-art-studio/browser/');
  console.log('🌐 Ready for custom domain deployment!');
  console.log('📝 Note: Make sure your server is configured to serve from the root path (/)');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

