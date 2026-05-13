$gcloud = "C:\Users\David\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"

Write-Host "=== processBarclaysEmail logs (last 5 min) ===" -ForegroundColor Cyan
& $gcloud functions logs read processBarclaysEmail `
    --region=europe-west1 `
    --limit=30 `
    --format="value(time_utc,log)" 2>&1

Write-Host ""
Write-Host "=== verifyIncomingPayment logs (last 5 min) ===" -ForegroundColor Cyan
& $gcloud functions logs read verifyIncomingPayment `
    --region=europe-west1 `
    --limit=20 `
    --format="value(time_utc,log)" 2>&1

Write-Host ""
Write-Host "=== Latest Push run record in DB ===" -ForegroundColor Cyan
& $gcloud --format=json firestore export gs://does-not-matter 2>&1 | Out-Null
# Read RTDB via firebase CLI instead
$firebase = "C:\Users\David\AppData\Roaming\npm\firebase.cmd"
& $firebase database:get /automationV2/gmailPush --project=golden-barbers-e25db 2>&1
