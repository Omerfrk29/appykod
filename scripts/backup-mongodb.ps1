# MongoDB Yedekleme Script'i (PowerShell)
# Windows için lokaldeki MongoDB verilerini yedeklemek için

$ErrorActionPreference = "Stop"

# Ayarlar
$BackupDir = ".\backups"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupName = "mongodb_backup_$Timestamp"
$DBName = "appykod"
$ContainerName = "appykod-mongodb"

Write-Host "=== MongoDB Yedekleme Baslatiyor ===" -ForegroundColor Green

# Backup dizinini olustur
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

# Docker container'in calisip calismadigini kontrol et
$containerRunning = docker ps --format "{{.Names}}" | Select-String -Pattern $ContainerName
if (-not $containerRunning) {
    Write-Host "Hata: $ContainerName container'i calismiyor!" -ForegroundColor Red
    Write-Host "Container'i baslatmak icin: docker-compose up -d mongodb"
    exit 1
}

Write-Host "MongoDB verileri yedekleniyor..." -ForegroundColor Yellow

# MongoDB dump al
docker exec $ContainerName mongodump `
    --db=$DBName `
    --out="/tmp/$BackupName" `
    --quiet

if ($LASTEXITCODE -ne 0) {
    Write-Host "Hata: MongoDB dump alinamadi!" -ForegroundColor Red
    exit 1
}

# Yedegi container'dan host'a kopyala
docker cp "${ContainerName}:/tmp/$BackupName" "$BackupDir\"

# Container icindeki gecici dosyayi temizle
docker exec $ContainerName rm -rf "/tmp/$BackupName"

# Yedegi arsivle
$archivePath = Join-Path $BackupDir "${BackupName}.tar.gz"
$tempPath = Join-Path $BackupDir $BackupName

# tar.exe kullanarak arsivle (Windows 10+)
# Mutlak path kullan
$fullTempPath = (Resolve-Path $tempPath).Path
$fullArchivePath = (Resolve-Path $BackupDir).Path
$fullArchivePath = Join-Path $fullArchivePath "${BackupName}.tar.gz"

# tar komutunu calistir
$tarResult = & tar -czf $fullArchivePath -C (Split-Path $fullTempPath) (Split-Path $fullTempPath -Leaf) 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Hata: Arsivleme basarisiz! $tarResult" -ForegroundColor Red
    Write-Host "Alternatif: 7-Zip veya WinRAR kullanarak manuel olarak arsivleyin: $tempPath" -ForegroundColor Yellow
    exit 1
}

# Gecici klasoru sil
Remove-Item -Recurse -Force $tempPath -ErrorAction SilentlyContinue

$backupSize = (Get-Item $archivePath).Length / 1MB
$backupSizeFormatted = "{0:N2} MB" -f $backupSize

Write-Host "Yedekleme tamamlandi!" -ForegroundColor Green
Write-Host "Yedek dosyasi: $archivePath" -ForegroundColor Green
Write-Host "Boyut: $backupSizeFormatted" -ForegroundColor Green

# Son 5 yedegi goster
Write-Host ""
Write-Host "Son 5 yedek:" -ForegroundColor Yellow
$backups = Get-ChildItem "$BackupDir\*.tar.gz" | Sort-Object LastWriteTime -Descending | Select-Object -First 5
foreach ($backup in $backups) {
    $size = $backup.Length / 1MB
    $sizeFormatted = "{0:N2} MB" -f $size
    Write-Host "$($backup.Name) - $sizeFormatted"
}
