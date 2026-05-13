$ErrorActionPreference = 'Stop'
$envPath = 'c:\Users\David\Projects\golden-barbers\functions\.env'
$envText = [System.IO.File]::ReadAllText($envPath, [System.Text.Encoding]::UTF8)

function Get-EnvVal([string]$name) {
    if ($envText -match "(?m)^$name=(.*)$") { return $Matches[1].Trim() }
    return $null
}

$clientId    = Get-EnvVal 'GMAIL_OAUTH_CLIENT_ID'
$redirectUri = Get-EnvVal 'GMAIL_OAUTH_REDIRECT_URI'

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

Write-Host "URL length: $($authUrl.Length)"
Write-Host "Contains response_type: $($authUrl.Contains('response_type=code'))"
Write-Host "Contains client_id: $($authUrl.Contains('client_id='))"
Write-Host "Contains redirect_uri: $($authUrl.Contains('redirect_uri='))"
Write-Host ""
Write-Host "FULL URL:"
Write-Host $authUrl
