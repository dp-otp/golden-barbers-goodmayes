$gcloud = "C:\Users\David\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"

$functions = @('verifyIncomingPayment', 'whatsappWebhook', 'revolutWebhook')

foreach ($fn in $functions) {
    Write-Host "--- Granting allUsers/invoker on $fn ---" -ForegroundColor Cyan
    & $gcloud functions add-iam-policy-binding $fn --region=europe-west1 --member="allUsers" --role="roles/cloudfunctions.invoker" --quiet 2>&1
    Write-Host ""
}

Write-Host "DONE." -ForegroundColor Green
