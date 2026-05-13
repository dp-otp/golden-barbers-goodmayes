$gcloud = "C:\Users\David\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"

Write-Host "=== Granting allUsers/invoker on setupGmailWatch ===" -ForegroundColor Cyan
& $gcloud functions add-iam-policy-binding setupGmailWatch `
    --region=europe-west1 `
    --member="allUsers" `
    --role="roles/cloudfunctions.invoker" `
    --quiet 2>&1
Write-Host ""

Write-Host "=== Calling setupGmailWatch to start Gmail Push subscription ===" -ForegroundColor Cyan
$envPath = 'c:\Users\David\Projects\golden-barbers\functions\.env'
$envText = [System.IO.File]::ReadAllText($envPath, [System.Text.Encoding]::UTF8)
$apiKey = if ($envText -match '(?m)^PAYMENT_VERIFY_API_KEY=(.*)$') { $Matches[1].Trim() } else { $null }

if (-not $apiKey) {
    Write-Host "Could not read PAYMENT_VERIFY_API_KEY from .env" -ForegroundColor Red
    exit 1
}

try {
    $resp = Invoke-RestMethod -Uri 'https://europe-west1-golden-barbers-e25db.cloudfunctions.net/setupGmailWatch' `
        -Method POST `
        -Headers @{ 'x-api-key' = $apiKey } `
        -ContentType 'application/json' `
        -Body '{}'
    Write-Host "Response:" -ForegroundColor Green
    $resp | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Watch call failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host $reader.ReadToEnd()
    }
}
