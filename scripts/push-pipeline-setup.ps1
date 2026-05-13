$gcloud = "C:\Users\David\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
$projectId = "golden-barbers-e25db"
$topicName = "gmail-payments"

Write-Host "=== Enabling Gmail API ===" -ForegroundColor Cyan
& $gcloud services enable gmail.googleapis.com --quiet 2>&1

Write-Host ""
Write-Host "=== Enabling Pub/Sub API ===" -ForegroundColor Cyan
& $gcloud services enable pubsub.googleapis.com --quiet 2>&1

Write-Host ""
Write-Host "=== Creating Pub/Sub topic '$topicName' ===" -ForegroundColor Cyan
& $gcloud pubsub topics create $topicName --quiet 2>&1

Write-Host ""
Write-Host "=== Granting publisher rights to gmail-api-push@system.gserviceaccount.com ===" -ForegroundColor Cyan
& $gcloud pubsub topics add-iam-policy-binding $topicName `
    --member="serviceAccount:gmail-api-push@system.gserviceaccount.com" `
    --role="roles/pubsub.publisher" `
    --quiet 2>&1

Write-Host ""
Write-Host "=== Listing topic to confirm ===" -ForegroundColor Cyan
& $gcloud pubsub topics list --filter="name:$topicName" 2>&1

Write-Host ""
Write-Host "DONE. Topic: projects/$projectId/topics/$topicName" -ForegroundColor Green
