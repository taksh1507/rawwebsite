# Image Conversion Script for Team Members
# This script converts team member images to optimized WebP format

param(
    [Parameter(Mandatory=$false)]
    [string]$InputDir = ".\original-images",
    
    [Parameter(Mandatory=$false)]
    [string]$OutputDir = ".\public\images\team",
    
    [Parameter(Mandatory=$false)]
    [int]$Quality = 75,
    
    [Parameter(Mandatory=$false)]
    [int]$Size = 300
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Team Images WebP Conversion Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if ImageMagick is installed
$imageMagickInstalled = Get-Command "magick" -ErrorAction SilentlyContinue

if (-not $imageMagickInstalled) {
    Write-Host "❌ ImageMagick not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install ImageMagick:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://imagemagick.org/script/download.php" -ForegroundColor Yellow
    Write-Host "2. Install and add to PATH" -ForegroundColor Yellow
    Write-Host "3. Restart PowerShell" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternative: Use the Node.js script with sharp library" -ForegroundColor Yellow
    Write-Host "Run: npm install sharp && node scripts/convert-images-node.js" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ ImageMagick found" -ForegroundColor Green
Write-Host ""

# Check if input directory exists
if (-not (Test-Path $InputDir)) {
    Write-Host "❌ Input directory not found: $InputDir" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please create the directory and add your team member images:" -ForegroundColor Yellow
    Write-Host "  mkdir $InputDir" -ForegroundColor Yellow
    Write-Host "  Copy your JPG/PNG images to this folder" -ForegroundColor Yellow
    exit 1
}

# Create output directory if it doesn't exist
if (-not (Test-Path $OutputDir)) {
    New-Item -Path $OutputDir -ItemType Directory -Force | Out-Null
    Write-Host "✓ Created output directory: $OutputDir" -ForegroundColor Green
} else {
    Write-Host "✓ Output directory exists: $OutputDir" -ForegroundColor Green
}

Write-Host ""
Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  Input:   $InputDir" -ForegroundColor White
Write-Host "  Output:  $OutputDir" -ForegroundColor White
Write-Host "  Quality: $Quality%" -ForegroundColor White
Write-Host "  Size:    ${Size}x${Size}px" -ForegroundColor White
Write-Host ""

# Get all image files
$imageFiles = Get-ChildItem -Path $InputDir -Include @("*.jpg", "*.jpeg", "*.png", "*.JPG", "*.JPEG", "*.PNG") -File

if ($imageFiles.Count -eq 0) {
    Write-Host "❌ No image files found in $InputDir" -ForegroundColor Red
    Write-Host ""
    Write-Host "Supported formats: JPG, JPEG, PNG" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found $($imageFiles.Count) image(s) to convert" -ForegroundColor Green
Write-Host ""
Write-Host "Converting images..." -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$errorCount = 0

foreach ($file in $imageFiles) {
    $outputName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name).ToLower() -replace ' ', '-'
    $outputPath = Join-Path $OutputDir "$outputName.webp"
    
    Write-Host "Processing: $($file.Name)" -NoNewline
    
    try {
        # Convert image using ImageMagick
        # -resize: Resize to target dimensions maintaining aspect ratio
        # ^ : Resize to fill the entire size
        # -gravity center: Center the image
        # -extent: Crop to exact size
        # -quality: WebP quality (70-80 recommended)
        $command = "magick convert `"$($file.FullName)`" -resize ${Size}x${Size}^ -gravity center -extent ${Size}x${Size} -quality $Quality `"$outputPath`""
        
        Invoke-Expression $command 2>&1 | Out-Null
        
        if (Test-Path $outputPath) {
            $originalSize = [math]::Round($file.Length / 1KB, 2)
            $newSize = [math]::Round((Get-Item $outputPath).Length / 1KB, 2)
            $savings = [math]::Round((1 - ($newSize / $originalSize)) * 100, 1)
            
            Write-Host " → $outputName.webp" -ForegroundColor Green
            Write-Host "    Original: ${originalSize}KB | WebP: ${newSize}KB | Saved: ${savings}%" -ForegroundColor Gray
            $successCount++
        } else {
            Write-Host " ✗ Failed" -ForegroundColor Red
            $errorCount++
        }
    }
    catch {
        Write-Host " ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Conversion Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Success: $successCount" -ForegroundColor Green
Write-Host "  Errors:  $errorCount" -ForegroundColor $(if ($errorCount -gt 0) { "Red" } else { "Gray" })
Write-Host ""

if ($successCount -gt 0) {
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Review the converted images in: $OutputDir" -ForegroundColor White
    Write-Host "2. Update team member data in: src\data\teamData.ts" -ForegroundColor White
    Write-Host "3. Ensure image paths match the file names" -ForegroundColor White
    Write-Host ""
}
