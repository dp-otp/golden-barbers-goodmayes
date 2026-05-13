$ErrorActionPreference = 'Stop'

$envPath = 'c:\Users\David\Projects\golden-barbers\functions\.env'
$envText = [System.IO.File]::ReadAllText($envPath, [System.Text.Encoding]::UTF8)

function Get-EnvVal([string]$name) {
    if ($envText -match "(?m)^$name=(.*)$") { return $Matches[1].Trim() }
    return $null
}

$clientId     = Get-EnvVal 'GMAIL_OAUTH_CLIENT_ID'
$clientSecret = Get-EnvVal 'GMAIL_OAUTH_CLIENT_SECRET'
$redirectUri  = Get-EnvVal 'GMAIL_OAUTH_REDIRECT_URI'

if (-not $clientId -or -not $clientSecret -or -not $redirectUri) {
    Write-Host "Missing OAuth env vars in $envPath. Aborting." -ForegroundColor Red
    exit 1
}

Add-Type -AssemblyName System.Web
$scope = 'https://www.googleapis.com/auth/gmail.readonly'
$state = ([guid]::NewGuid()).Guid

$authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' `
    + 'client_id=' + [System.Web.HttpUtility]::UrlEncode($clientId) `
    + '&redirect_uri=' + [System.Web.HttpUtility]::UrlEncode($redirectUri) `
    + '&response_type=code' `
    + '&scope=' + [System.Web.HttpUtility]::UrlEncode($scope) `
    + '&access_type=offline' `
    + '&prompt=consent' `
    + '&state=' + $state

# Start HTTP listener BEFORE opening browser
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8080/')
try { $listener.Start() } catch {
    Write-Host "Could not bind to localhost:8080 - $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host "Listening on http://localhost:8080/" -ForegroundColor Cyan

# Open browser via Start-Process (PowerShell native; cmd /c start was
# splitting the URL on ampersands and breaking the query string).
try {
    Start-Process $authUrl
    Write-Host "Browser launched. Sign in as goldenbarbers.payments@gmail.com and click Allow." -ForegroundColor Yellow
} catch {
    Write-Host "Could not auto-open browser: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Open this URL manually:" -ForegroundColor Yellow
    Write-Host $authUrl
}
Write-Host ""

$code = $null
$errorMsg = $null

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $resp = $ctx.Response

    if ($req.Url.AbsolutePath -eq '/oauth-callback') {
        $code = $req.QueryString['code']
        $errorMsg = $req.QueryString['error']
        $returnedState = $req.QueryString['state']

        if ($returnedState -ne $state) {
            $errorMsg = "state_mismatch (expected $state got $returnedState)"
            $code = $null
        }

        $bodyHtml = if ($code) {
            "<html><body style='font-family:sans-serif;background:#0a0a0a;color:#fff;padding:60px;text-align:center'><h1>Authorised.</h1><p>Refresh token saved. You can close this tab.</p></body></html>"
        } else {
            "<html><body style='font-family:sans-serif;background:#0a0a0a;color:#fff;padding:60px;text-align:center'><h1>Auth failed</h1><p>$errorMsg</p></body></html>"
        }
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($bodyHtml)
        $resp.ContentType = 'text/html; charset=utf-8'
        $resp.ContentLength64 = $bytes.Length
        $resp.OutputStream.Write($bytes, 0, $bytes.Length)
        $resp.OutputStream.Close()
        break
    } else {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes('Not found')
        $resp.StatusCode = 404
        $resp.OutputStream.Write($bytes, 0, $bytes.Length)
        $resp.OutputStream.Close()
    }
}

$listener.Stop()

if ($errorMsg -or -not $code) {
    Write-Host "FAILED: $errorMsg" -ForegroundColor Red
    exit 1
}

Write-Host "Got authorization code. Exchanging for refresh token..." -ForegroundColor Cyan

$tokenBody = @{
    code          = $code
    client_id     = $clientId
    client_secret = $clientSecret
    redirect_uri  = $redirectUri
    grant_type    = 'authorization_code'
}

try {
    $tokenResp = Invoke-RestMethod -Uri 'https://oauth2.googleapis.com/token' -Method POST -Body $tokenBody
} catch {
    Write-Host "Token exchange failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host $reader.ReadToEnd() -ForegroundColor Red
    }
    exit 1
}

$refreshToken = $tokenResp.refresh_token
if (-not $refreshToken) {
    Write-Host "No refresh_token in response. Full response:" -ForegroundColor Red
    $tokenResp | ConvertTo-Json | Write-Host
    exit 1
}

$updated = $envText -replace '(?m)^GMAIL_OAUTH_REFRESH_TOKEN=.*$', "GMAIL_OAUTH_REFRESH_TOKEN=$refreshToken"
[System.IO.File]::WriteAllText($envPath, $updated, [System.Text.UTF8Encoding]::new($false))

Write-Host ""
Write-Host "SUCCESS." -ForegroundColor Green
Write-Host ("Refresh token: " + $refreshToken.Length + " chars, saved to .env")
