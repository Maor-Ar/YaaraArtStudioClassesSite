#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building for GitHub Pages...');

try {
  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Build the project for production
  console.log('🔨 Building Angular project...');
  execSync('ng build --configuration=production', { stdio: 'inherit' });

  // Create a 404.html file for GitHub Pages SPA routing
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

  // Create CNAME file if you have a custom domain (optional)
  // Uncomment and modify if you have a custom domain
  // console.log('📄 Creating CNAME file...');
  // const cnamePath = path.join('dist', 'yaara-art-studio', 'CNAME');
  // fs.writeFileSync(cnamePath, 'your-domain.com');
  // console.log('✅ CNAME file created');

  console.log('🎉 Build completed successfully!');
  console.log('📁 Build output: dist/yaara-art-studio/browser/');
  console.log('🌐 Ready for GitHub Pages deployment!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
