# Contact Form & Admin Panel Setup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Team RAW - Contact Integration Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB URI is set
Write-Host "Checking environment configuration..." -ForegroundColor Yellow
Write-Host ""

$mainEnvFile = ".env.local"
$adminEnvFile = "admin\.env.local"

if (Test-Path $mainEnvFile) {
    Write-Host "[✓] Main website .env.local found" -ForegroundColor Green
    $mainEnvContent = Get-Content $mainEnvFile -Raw
    if ($mainEnvContent -match "MONGODB_URI") {
        Write-Host "[✓] MongoDB URI configured in main site" -ForegroundColor Green
    } else {
        Write-Host "[!] MongoDB URI not found in main site .env.local" -ForegroundColor Red
        Write-Host "    Please add: MONGODB_URI=your_connection_string" -ForegroundColor Yellow
    }
} else {
    Write-Host "[!] Main website .env.local not found" -ForegroundColor Red
}

Write-Host ""

if (Test-Path $adminEnvFile) {
    Write-Host "[✓] Admin panel .env.local found" -ForegroundColor Green
    $adminEnvContent = Get-Content $adminEnvFile -Raw
    if ($adminEnvContent -match "NEXT_PUBLIC_API_URL") {
        Write-Host "[✓] API URL configured in admin panel" -ForegroundColor Green
    } else {
        Write-Host "[!] API URL not found in admin .env.local" -ForegroundColor Red
    }
} else {
    Write-Host "[!] Admin panel .env.local not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Install MongoDB package:" -ForegroundColor White
Write-Host "   npm install mongodb" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Set up MongoDB Atlas:" -ForegroundColor White
Write-Host "   - Visit: https://cloud.mongodb.com" -ForegroundColor Gray
Write-Host "   - Create a cluster and get connection string" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Update environment variables:" -ForegroundColor White
Write-Host "   Main Site (.env.local):" -ForegroundColor Gray
Write-Host "   MONGODB_URI=your_connection_string" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_SITE_URL=https://rawwebsite-seven.vercel.app" -ForegroundColor Gray
Write-Host ""
Write-Host "   Admin Panel (admin/.env.local):" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_API_URL=https://rawwebsite-seven.vercel.app" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Deploy to Vercel:" -ForegroundColor White
Write-Host "   - Main site: vercel --prod" -ForegroundColor Gray
Write-Host "   - Admin panel: cd admin && vercel --prod" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Read full documentation:" -ForegroundColor White
Write-Host "   - Open: CONTACT_INTEGRATION_SETUP.md" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
