$gcloud = "C:\Users\David\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
$billingAccount = "017D3D-58E094-241288"
$projectId = "golden-barbers-e25db"

Write-Host "=== Enabling Billing Budgets API ===" -ForegroundColor Cyan
& $gcloud services enable billingbudgets.googleapis.com --quiet 2>&1

Write-Host ""
Write-Host "=== Creating GBP 1/month budget with 50/90/100 alerts ===" -ForegroundColor Cyan
& $gcloud billing budgets create `
    --billing-account=$billingAccount `
    --display-name="Golden Barbers - GBP 1 alert" `
    --budget-amount=1GBP `
    --threshold-rule=percent=50 `
    --threshold-rule=percent=90 `
    --threshold-rule=percent=100 `
    --filter-projects=projects/$projectId `
    --quiet 2>&1

Write-Host ""
Write-Host "=== Listing budgets to confirm ===" -ForegroundColor Cyan
& $gcloud billing budgets list --billing-account=$billingAccount --format="table(displayName,amount.specifiedAmount.units,amount.specifiedAmount.currencyCode)" 2>&1

Write-Host ""
Write-Host "DONE." -ForegroundColor Green
