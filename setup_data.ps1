$workdir = "e:\New folder (2)\future\data\risk_models"
$files = @('cardiovascular_model.pkl', 'diabetes_model.pkl', 'hypertension_model.pkl')

foreach ($file in $files) {
    $filepath = Join-Path $workdir $file
    New-Item -ItemType File -Path $filepath -Force | Out-Null
    Write-Host "Created: $file"
}

Write-Host "`nFinal structure:"
Get-ChildItem -Path $workdir -Name
