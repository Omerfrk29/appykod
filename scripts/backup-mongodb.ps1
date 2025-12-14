# MongoDB Yedekleme Script'i (PowerShell)
# Windows için lokaldeki MongoDB verilerini yedeklemek için

$ErrorActionPreference = "Stop"

# Ayarlar
$BackupDir = ".\backups"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupName = "mongodb_backup_$Timestamp"
$DBName = "appykod"
$ContainerName = "appykod-mongodb"

Write-Host "=== MongoDB Yedekleme Başlatılıyor ===" -ForegroundColor Green

# Backup dizinini oluştur
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

# Docker container'ın çalışıp çalışmadığını kontrol et
$containerRunning = docker ps --format "{{.Names}}" | Select-String -Pattern $ContainerName
if (-not $containerRunning) {
    Write-Host "Hata: $ContainerName container'ı çalışmıyor!" -ForegroundColor Red
    Write-Host "Container'ı başlatmak için: docker-compose up -d mongodb"
    exit 1
}

Write-Host "MongoDB verileri yedekleniyor..." -ForegroundColor Yellow

# MongoDB dump al
docker exec $ContainerName mongodump `
    --db=$DBName `
    --out="/tmp/$BackupName" `
    --quiet

if ($LASTEXITCODE -ne 0) {
    Write-Host "Hata: MongoDB dump alınamadı!" -ForegroundColor Red
    exit 1
}

# Yedeği container'dan host'a kopyala
docker cp "${ContainerName}:/tmp/$BackupName" "$BackupDir\"

# Container içindeki geçici dosyayı temizle
docker exec $ContainerName rm -rf "/tmp/$BackupName"

# Yedeği arşivle
$archivePath = "$BackupDir\${BackupName}.tar.gz"
$tempPath = "$BackupDir\$BackupName"

# tar.exe kullanarak arşivle (Git Bash veya WSL'de tar varsa)
# Windows'ta tar.exe genellikle mevcuttur (Windows 10+)
tar -czf $archivePath -C $BackupDir $BackupName

# Geçici klasörü sil
Remove-Item -Recurse -Force $tempPath

$backupSize = (Get-Item $archivePath).Length / 1MB
$backupSizeFormatted = "{0:N2} MB" -f $backupSize

Write-Host "✓ Yedekleme tamamlandı!" -ForegroundColor Green
Write-Host "Yedek dosyası: $archivePath" -ForegroundColor Green
Write-Host "Boyut: $backupSizeFormatted" -ForegroundColor Green

# Son 5 yedeği göster
Write-Host "`nSon 5 yedek:" -ForegroundColor Yellow
Get-ChildItem "$BackupDir\*.tar.gz" | Sort-Object LastWriteTime -Descending | Select-Object -First 5 | ForEach-Object {
    $size = $_.Length / 1MB
    Write-Host "$($_.Name) ($("{0:N2} MB" -f $size))"
}
