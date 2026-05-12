$gcloud = "C:\Users\David\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
$urlOpened = $false

Write-Host "=== Logging in to gcloud (URL flow) ===" -ForegroundColor Cyan
Write-Host "I will auto-open the URL in your browser when gcloud prints it." -ForegroundColor DarkGray
Write-Host ""

& $gcloud auth login --no-launch-browser --update-adc 2>&1 | ForEach-Object {
    Write-Host $_
    if (-not $urlOpened -and $_ -match 'https://accounts\.google\.com/o/oauth2/[^\s"]+') {
        $url = $matches[0]
        Write-Host ""
        Write-Host "==> Opening URL in your default browser now..." -ForegroundColor Yellow
        Start-Process $url
        $urlOpened = $true
    }
}

Write-Host ""
Write-Host "=== Setting project ===" -ForegroundColor Cyan
& $gcloud config set project golden-barbers-e25db

Write-Host ""
Write-Host "=== Verifying ===" -ForegroundColor Cyan
& $gcloud config list
& $gcloud auth list

Write-Host ""
Write-Host "DONE. You can close this window." -ForegroundColor Green
