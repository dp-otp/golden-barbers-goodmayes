$path = 'c:\Users\David\Projects\golden-barbers\scripts\barclays-payment-watcher.gs'
$text = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# Sanity check: does the loaded text actually contain the pound sign?
$poundIdx = $text.IndexOf([char]0x00A3)
Write-Host "File length (chars): $($text.Length)"
Write-Host "Pound sign (U+00A3) found at index: $poundIdx"

if ($poundIdx -lt 0) {
    Write-Host "ERROR: pound sign missing or corrupted in source file. Aborting." -ForegroundColor Red
    exit 1
}

# Copy via Windows.Forms.Clipboard which is unicode-native
Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.Clipboard]::SetText($text, [System.Windows.Forms.TextDataFormat]::UnicodeText)

# Round-trip verification
$clip = [System.Windows.Forms.Clipboard]::GetText([System.Windows.Forms.TextDataFormat]::UnicodeText)
$clipPound = $clip.IndexOf([char]0x00A3)
Write-Host "Clipboard length (chars): $($clip.Length)"
Write-Host "Pound sign in clipboard at index: $clipPound"
Write-Host ""
if ($clip.Length -eq $text.Length -and $clipPound -eq $poundIdx) {
    Write-Host "OK: clipboard matches source exactly." -ForegroundColor Green
} else {
    Write-Host "MISMATCH: clipboard != source." -ForegroundColor Red
}
