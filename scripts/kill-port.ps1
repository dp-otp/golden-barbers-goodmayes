$listening = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
if ($listening) {
    $listening | ForEach-Object {
        $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "Killing PID $($proc.Id) ($($proc.ProcessName)) holding 8080"
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        }
    }
} else {
    Write-Host 'Port 8080 already free.'
}
