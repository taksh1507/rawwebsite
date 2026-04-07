/**
 * PNG to Favicon Converter
 * Converts logo.png to various favicon sizes
 * 
 * Usage: node scripts/convert-logo-png-to-favicon.js
 */

const fs = require('fs');
const path = require('path');

console.log('📦 Checking for sharp package...');

// Check if sharp is installed
try {
  require.resolve('sharp');
  console.log('✅ sharp is available');
  convertImages();
} catch (e) {
  console.log('⚙️  Installing sharp...');
  const { execSync } = require('child_process');
  
  try {
    execSync('npm install sharp', { stdio: 'inherit' });
    console.log('✅ sharp installed successfully');
    convertImages();
  } catch (error) {
    console.error('❌ Failed to install sharp');
    console.log('\n📝 Manual conversion steps:');
    console.log('1. Go to https://favicon.io/favicon-converter/');
    console.log('2. Upload public/logo.png');
    console.log('3. Download the generated favicon package');
    console.log('4. Extract files to public/ folder');
    process.exit(1);
  }
}

async function convertImages() {
  const sharp = require('sharp');
  
  const pngPath = path.join(__dirname, '..', 'public', 'logo.png');
  const publicPath = path.join(__dirname, '..', 'public');
  const appPath = path.join(__dirname, '..', 'src', 'app');
  
  if (!fs.existsSync(pngPath)) {
    console.error('❌ logo.png not found in public folder');
    console.log('Please place your logo.png in the public/ folder');
    process.exit(1);
  }
  
  console.log('🎨 Converting logo.png to favicon formats...\n');
  
  const sizes = [
    { name: 'favicon-16x16.png', size: 16, folder: publicPath },
    { name: 'favicon-32x32.png', size: 32, folder: publicPath },
    { name: 'favicon-48x48.png', size: 48, folder: publicPath },
    { name: 'favicon.png', size: 64, folder: publicPath },
    { name: 'apple-touch-icon.png', size: 180, folder: publicPath },
    { name: 'android-chrome-192x192.png', size: 192, folder: publicPath },
    { name: 'android-chrome-512x512.png', size: 512, folder: publicPath },
    { name: 'favicon.ico', size: 32, folder: appPath },
  ];
  
  try {
    const pngBuffer = fs.readFileSync(pngPath);
    
    for (const { name, size, folder } of sizes) {
      const outputPath = path.join(folder, name);
      
      await sharp(pngBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Created ${name} (${size}x${size}) in ${folder === appPath ? 'src/app/' : 'public/'}`);
    }
    
    console.log('\n🎉 All favicon files created successfully!');
    console.log('\n📋 Files created:');
    console.log('  • public/favicon-16x16.png');
    console.log('  • public/favicon-32x32.png');
    console.log('  • public/favicon-48x48.png');
    console.log('  • public/favicon.png (64x64)');
    console.log('  • public/apple-touch-icon.png');
    console.log('  • public/android-chrome-192x192.png');
    console.log('  • public/android-chrome-512x512.png');
    console.log('  • src/app/favicon.ico');
    
    console.log('\n🔄 Next steps:');
    console.log('1. Restart your dev server (npm run dev)');
    console.log('2. Hard refresh browser (Ctrl + Shift + R)');
    console.log('3. Check browser tab for new favicon');
    console.log('4. Clear browser cache if needed');
    
  } catch (error) {
    console.error('❌ Error converting images:', error.message);
    console.log('\n📝 Try manual conversion:');
    console.log('Visit: https://realfavicongenerator.net/');
    console.log('Upload: public/logo.png');
    process.exit(1);
  }
}
