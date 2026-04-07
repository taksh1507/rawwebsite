/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

// Node.js script to convert team images to WebP format
// Requires: npm install sharp

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  inputDir: './original-images',
  outputDir: './public/images/team',
  quality: 75,
  size: 300,
  supportedFormats: ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(2);
}

async function convertImages() {
  log('========================================', 'cyan');
  log('Team Images WebP Conversion Script', 'cyan');
  log('========================================', 'cyan');
  console.log();

  // Check if sharp is installed
  try {
    require.resolve('sharp');
    log('✓ Sharp library found', 'green');
  } catch (e) {
    log('❌ Sharp library not found!', 'red');
    console.log();
    log('Please install sharp:', 'yellow');
    log('  npm install sharp', 'yellow');
    console.log();
    process.exit(1);
  }

  // Check if input directory exists
  if (!fs.existsSync(CONFIG.inputDir)) {
    log(`❌ Input directory not found: ${CONFIG.inputDir}`, 'red');
    console.log();
    log('Please create the directory and add your team member images:', 'yellow');
    log(`  mkdir ${CONFIG.inputDir}`, 'yellow');
    log('  Copy your JPG/PNG images to this folder', 'yellow');
    console.log();
    process.exit(1);
  }

  // Create output directory if it doesn't exist
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    log(`✓ Created output directory: ${CONFIG.outputDir}`, 'green');
  } else {
    log(`✓ Output directory exists: ${CONFIG.outputDir}`, 'green');
  }

  console.log();
  log('Configuration:', 'cyan');
  console.log(`  Input:   ${CONFIG.inputDir}`);
  console.log(`  Output:  ${CONFIG.outputDir}`);
  console.log(`  Quality: ${CONFIG.quality}%`);
  console.log(`  Size:    ${CONFIG.size}x${CONFIG.size}px`);
  console.log();

  // Get all image files
  const files = fs.readdirSync(CONFIG.inputDir).filter(file => {
    const ext = path.extname(file);
    return CONFIG.supportedFormats.includes(ext);
  });

  if (files.length === 0) {
    log(`❌ No image files found in ${CONFIG.inputDir}`, 'red');
    console.log();
    log('Supported formats: JPG, JPEG, PNG', 'yellow');
    process.exit(1);
  }

  log(`Found ${files.length} image(s) to convert`, 'green');
  console.log();
  log('Converting images...', 'cyan');
  console.log();

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const inputPath = path.join(CONFIG.inputDir, file);
    const baseName = path.basename(file, path.extname(file))
      .toLowerCase()
      .replace(/\s+/g, '-');
    const outputName = `${baseName}.webp`;
    const outputPath = path.join(CONFIG.outputDir, outputName);

    process.stdout.write(`Processing: ${file}`);

    try {
      // Get original file size
      const originalStats = fs.statSync(inputPath);
      const originalSize = originalStats.size;

      // Convert image
      await sharp(inputPath)
        .resize(CONFIG.size, CONFIG.size, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: CONFIG.quality })
        .toFile(outputPath);

      // Get new file size
      const newStats = fs.statSync(outputPath);
      const newSize = newStats.size;
      const savings = ((1 - (newSize / originalSize)) * 100).toFixed(1);

      log(` → ${outputName}`, 'green');
      log(`    Original: ${formatBytes(originalSize)}KB | WebP: ${formatBytes(newSize)}KB | Saved: ${savings}%`, 'gray');
      
      successCount++;
    } catch (error) {
      log(` ✗ Error: ${error.message}`, 'red');
      errorCount++;
    }
  }

  console.log();
  log('========================================', 'cyan');
  log('Conversion Complete!', 'green');
  log('========================================', 'cyan');
  log(`  Success: ${successCount}`, 'green');
  log(`  Errors:  ${errorCount}`, errorCount > 0 ? 'red' : 'gray');
  console.log();

  if (successCount > 0) {
    log('Next steps:', 'cyan');
    console.log(`1. Review the converted images in: ${CONFIG.outputDir}`);
    console.log('2. Update team member data in: src/data/teamData.ts');
    console.log('3. Ensure image paths match the file names');
    console.log();
  }
}

// Run the conversion
convertImages().catch(error => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
