$url = 'https://europe-west1-golden-barbers-e25db.cloudfunctions.net/verifyIncomingPayment'
$key = 'e0pVZrSP3jkquGtiqW7eR4XkZVT8Hb9mnEsTvEBlrhc'
$body = '{"amount":42.50,"reference":"DEDUP-TEST","source":"smoke_test","transactionId":"smoketest-001"}'
$headers = @{ 'x-api-key' = $key }

Write-Host '=== First call (expect: matched=false, reason=no_matching_pending_payment) ===' -ForegroundColor Cyan
(Invoke-WebRequest -Uri $url -Method POST -Body $body -ContentType 'application/json' -Headers $headers -UseBasicParsing).Content

Write-Host ""
Write-Host '=== Second call (expect: reason=already_processed) ===' -ForegroundColor Cyan
(Invoke-WebRequest -Uri $url -Method POST -Body $body -ContentType 'application/json' -Headers $headers -UseBasicParsing).Content
