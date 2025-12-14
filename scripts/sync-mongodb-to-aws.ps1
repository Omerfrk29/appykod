# MongoDB Lokal'den AWS'e Senkronizasyon Script'i
# Lokal MongoDB'den yedek alıp AWS EC2'daki MongoDB'ye yazar

$ErrorActionPreference = "Stop"

# Renkli çıktı için
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

# ========== AYARLAR ==========
# Bu değerleri kendi AWS bilgilerinize göre düzenleyin
$AWS_EC2_HOST = "63.181.88.181"  # Örnek: "ec2-xx-xx-xx-xx.compute-1.amazonaws.com" veya IP adresi
$AWS_EC2_USER = "ubuntu"  # Genellikle "ubuntu" veya "ec2-user"
$AWS_SSH_KEY = "C:\Users\cubuk\Downloads\appybir-key.pem"  # Örnek: "C:\Users\cubuk\.ssh\aws-key.pem"
$AWS_PROJECT_PATH = "~/appykod"  # EC2'daki proje yolu
$AWS_CONTAINER_NAME = "appykod-mongodb"  # AWS'deki MongoDB container adı

# Lokal ayarlar
$LocalBackupDir = ".\backups"
$LocalDBName = "appykod"
$LocalContainerName = "appykod-mongodb"

# ========== KONTROLLER ==========
Write-ColorOutput Green "=== MongoDB Lokal'den AWS'e Senkronizasyon ==="

# AWS ayarlarını kontrol et
if ([string]::IsNullOrWhiteSpace($AWS_EC2_HOST)) {
    Write-ColorOutput Red "Hata: AWS_EC2_HOST ayarlanmamış!"
    Write-Host "Script dosyasını düzenleyip AWS_EC2_HOST değerini girin."
    exit 1
}

if ([string]::IsNullOrWhiteSpace($AWS_SSH_KEY)) {
    Write-ColorOutput Red "Hata: AWS_SSH_KEY ayarlanmamış!"
    Write-Host "Script dosyasını düzenleyip AWS_SSH_KEY değerini girin."
    exit 1
}

if (-not (Test-Path $AWS_SSH_KEY)) {
    Write-ColorOutput Red "Hata: SSH key dosyası bulunamadı: $AWS_SSH_KEY"
    exit 1
}

# Lokal MongoDB container'ının çalışıp çalışmadığını kontrol et
$localContainerRunning = docker ps --format "{{.Names}}" | Select-String -Pattern $LocalContainerName
if (-not $localContainerRunning) {
    Write-ColorOutput Red "Hata: Lokal $LocalContainerName container'ı çalışmıyor!"
    Write-Host "Container'ı başlatmak için: docker-compose up -d mongodb"
    exit 1
}

# ========== ADIM 1: LOKAL YEDEK ALMA ==========
Write-ColorOutput Yellow "`n[1/4] Lokal MongoDB'den yedek alınıyor..."

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupName = "mongodb_backup_$Timestamp"

# Backup dizinini oluştur
if (-not (Test-Path $LocalBackupDir)) {
    New-Item -ItemType Directory -Path $LocalBackupDir | Out-Null
}

# MongoDB dump al
Write-Host "MongoDB verileri yedekleniyor..." -ForegroundColor Yellow
docker exec $LocalContainerName mongodump `
    --db=$LocalDBName `
    --out="/tmp/$BackupName" `
    --quiet

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "Hata: MongoDB dump alınamadı!"
    exit 1
}

# Yedeği container'dan host'a kopyala
docker cp "${LocalContainerName}:/tmp/$BackupName" "$LocalBackupDir\"

# Container içindeki geçici dosyayı temizle
docker exec $LocalContainerName rm -rf "/tmp/$BackupName"

# Yedeği arşivle
$archivePath = Join-Path $LocalBackupDir "${BackupName}.tar.gz"
$tempPath = Join-Path $LocalBackupDir $BackupName

$fullTempPath = (Resolve-Path $tempPath).Path
$fullArchivePath = (Resolve-Path $LocalBackupDir).Path
$fullArchivePath = Join-Path $fullArchivePath "${BackupName}.tar.gz"

$tarResult = & tar -czf $fullArchivePath -C (Split-Path $fullTempPath) (Split-Path $fullTempPath -Leaf) 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "Hata: Arşivleme başarısız! $tarResult"
    exit 1
}

# Geçici klasörü sil
Remove-Item -Recurse -Force $tempPath -ErrorAction SilentlyContinue

$backupSize = (Get-Item $fullArchivePath).Length / 1MB
$backupSizeFormatted = "{0:N2} MB" -f $backupSize

Write-ColorOutput Green "✓ Lokal yedek alındı: $fullArchivePath ($backupSizeFormatted)"

# ========== ADIM 2: AWS EC2'YA YEDEK KOPYALAMA ==========
Write-ColorOutput Yellow "`n[2/4] Yedek dosyası AWS EC2'ya kopyalanıyor..."

# AWS'de backups dizinini oluştur
$sshCmd = "ssh -i `"$AWS_SSH_KEY`" -o StrictHostKeyChecking=no $AWS_EC2_USER@$AWS_EC2_HOST `"mkdir -p $AWS_PROJECT_PATH/backups`""
Invoke-Expression $sshCmd | Out-Null

# SCP ile dosyayı kopyala
$scpCmd = "scp -i `"$AWS_SSH_KEY`" -o StrictHostKeyChecking=no `"$fullArchivePath`" $AWS_EC2_USER@${AWS_EC2_HOST}:$AWS_PROJECT_PATH/backups/"
Write-Host "Dosya kopyalanıyor: $BackupName.tar.gz" -ForegroundColor Yellow
Invoke-Expression $scpCmd

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "Hata: Dosya AWS EC2'ya kopyalanamadı!"
    exit 1
}

Write-ColorOutput Green "✓ Yedek dosyası AWS EC2'ya kopyalandı"

# ========== ADIM 3: AWS'DEKİ MONGODB CONTAINER KONTROLÜ ==========
Write-ColorOutput Yellow "`n[3/4] AWS'deki MongoDB container kontrol ediliyor..."

# AWS'deki container'ın çalışıp çalışmadığını kontrol et
$checkContainerCmd = "ssh -i `"$AWS_SSH_KEY`" -o StrictHostKeyChecking=no $AWS_EC2_USER@$AWS_EC2_HOST `"docker ps --format '{{.Names}}' | grep -q '$AWS_CONTAINER_NAME' && echo 'running' || echo 'not_running'`""
$containerStatus = Invoke-Expression $checkContainerCmd | Select-Object -Last 1

if ($containerStatus -ne "running") {
    Write-ColorOutput Red "Hata: AWS'deki $AWS_CONTAINER_NAME container'ı çalışmıyor!"
    Write-Host "AWS EC2'da container'ı başlatmak için:"
    Write-Host "  ssh -i `"$AWS_SSH_KEY`" $AWS_EC2_USER@$AWS_EC2_HOST"
    Write-Host "  cd $AWS_PROJECT_PATH"
    Write-Host "  docker compose up -d mongodb"
    exit 1
}

Write-ColorOutput Green "✓ AWS MongoDB container çalışıyor"

# ========== ADIM 4: AWS'DE RESTORE İŞLEMİ ==========
Write-ColorOutput Yellow "`n[4/4] AWS'deki MongoDB'ye veriler geri yükleniyor..."

# AWS'de restore script'ini çalıştır
# PowerShell'de heredoc kullanılamadığı için bash -c ile komutları çalıştırıyoruz
$restoreCmd = "ssh -i `"$AWS_SSH_KEY`" -o StrictHostKeyChecking=no $AWS_EC2_USER@$AWS_EC2_HOST `"bash -c 'cd $AWS_PROJECT_PATH && bash scripts/restore-mongodb.sh backups/$BackupName.tar.gz'`""

Write-Host "Restore islemi baslatiliyor..." -ForegroundColor Yellow
Invoke-Expression $restoreCmd

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "Hata: AWS'de restore işlemi başarısız!"
    Write-Host "Manuel olarak kontrol edin:"
    Write-Host "  ssh -i `"$AWS_SSH_KEY`" $AWS_EC2_USER@$AWS_EC2_HOST"
    Write-Host "  cd $AWS_PROJECT_PATH"
    Write-Host "  bash scripts/restore-mongodb.sh backups/$BackupName.tar.gz"
    exit 1
}

# ========== TAMAMLANDI ==========
Write-ColorOutput Green "`n=== Senkronizasyon Tamamlandı! ==="
Write-ColorOutput Green "✓ Lokal MongoDB'den yedek alındı"
Write-ColorOutput Green "✓ Yedek AWS EC2'ya kopyalandı"
Write-ColorOutput Green "✓ AWS MongoDB'ye veriler geri yüklendi"
Write-Host ""
Write-Host "Yedek dosyası: $fullArchivePath" -ForegroundColor Cyan
Write-Host "AWS'deki yedek: $AWS_PROJECT_PATH/backups/$BackupName.tar.gz" -ForegroundColor Cyan

# AWS'deki yedek dosyasını silmek ister misiniz? (opsiyonel)
# Non-interactive modda çalışıyorsa bu kısmı atla
try {
    Write-Host ""
    $deleteRemote = Read-Host "AWS'deki yedek dosyasini silmek ister misiniz? (y/n)"
    if ($deleteRemote -eq "y" -or $deleteRemote -eq "Y") {
        $deleteCmd = "ssh -i `"$AWS_SSH_KEY`" -o StrictHostKeyChecking=no $AWS_EC2_USER@$AWS_EC2_HOST `"rm $AWS_PROJECT_PATH/backups/$BackupName.tar.gz`""
        Invoke-Expression $deleteCmd | Out-Null
        Write-ColorOutput Green "✓ AWS'deki yedek dosyasi silindi"
    }
} catch {
    # Non-interactive modda Read-Host çalışmaz, sessizce devam et
    Write-Host "Not: AWS'deki yedek dosyasi korunuyor (manuel silinebilir)" -ForegroundColor Yellow
}

Write-Host ""
Write-ColorOutput Green "Islem basariyla tamamlandi!"
