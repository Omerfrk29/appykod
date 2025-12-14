# MongoDB Geri Yükleme Script'i (PowerShell)
# Windows için lokaldeki MongoDB verilerini geri yüklemek için

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

# Ayarlar
$DBName = "appykod"
$ContainerName = "appykod-mongodb"

Write-ColorOutput Green "=== MongoDB Geri Yükleme Başlatılıyor ==="

# Backup dosyasını kontrol et
if (-not $args[0]) {
    Write-ColorOutput Red "Hata: Yedek dosyası belirtilmedi!"
    Write-Host "Kullanım: .\restore-mongodb.ps1 <backup_file.tar.gz>"
    Write-Host "Örnek: .\restore-mongodb.ps1 backups\mongodb_backup_20240101_120000.tar.gz"
    
    # Mevcut yedekleri göster
    if (Test-Path ".\backups") {
        Write-Host "`nMevcut yedek dosyaları:" -ForegroundColor Yellow
        Get-ChildItem ".\backups\*.tar.gz" | ForEach-Object {
            Write-Host "  $($_.Name)"
        }
    }
    exit 1
}

$BackupFile = $args[0]

# Backup dosyasını bul
if (-not (Test-Path $BackupFile)) {
    # Relatif path dene
    if (Test-Path ".\$BackupFile") {
        $BackupFile = ".\$BackupFile"
    } else {
        Write-ColorOutput Red "Hata: Yedek dosyası bulunamadı: $BackupFile"
        
        # Mevcut yedekleri göster
        if (Test-Path ".\backups") {
            Write-Host "`nMevcut yedek dosyaları:" -ForegroundColor Yellow
            Get-ChildItem ".\backups\*.tar.gz" | ForEach-Object {
                Write-Host "  $($_.Name)"
            }
        }
        exit 1
    }
}

$BackupFile = (Resolve-Path $BackupFile).Path

# Docker container'ın çalışıp çalışmadığını kontrol et
$containerRunning = docker ps --format "{{.Names}}" | Select-String -Pattern $ContainerName
if (-not $containerRunning) {
    Write-ColorOutput Red "Hata: $ContainerName container'ı çalışmıyor!"
    Write-Host "Container'ı başlatmak için: docker-compose up -d mongodb"
    exit 1
}

Write-ColorOutput Yellow "Yedek dosyası açılıyor..."

# Geçici dizin oluştur
$TempDir = New-TemporaryFile | ForEach-Object { Remove-Item $_; New-Item -ItemType Directory -Path $_ }

try {
    # Yedek dosyasını aç
    $tarResult = & tar -xzf $BackupFile -C $TempDir.FullName 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Red "Hata: Yedek dosyası açılamadı! $tarResult"
        exit 1
    }
    
    # Yedek klasörünü bul
    $BackupDir = Get-ChildItem -Path $TempDir.FullName -Recurse -Directory | 
        Where-Object { $_.Name -eq "appykod" } | 
        Select-Object -First 1 | 
        ForEach-Object { $_.Parent.FullName }
    
    if (-not $BackupDir) {
        Write-ColorOutput Red "Hata: Yedek dosyası geçersiz format!"
        Write-Host "Yedek dosyası içeriği:" -ForegroundColor Yellow
        Get-ChildItem -Path $TempDir.FullName -Recurse | ForEach-Object { Write-Host "  $($_.FullName)" }
        exit 1
    }
    
    Write-ColorOutput Yellow "Mevcut veriler yedekleniyor (güvenlik için)..."
    # Mevcut verileri yedekle (güvenlik için)
    $preBackupName = "pre_restore_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    docker exec $ContainerName mongodump `
        --db=$DBName `
        --out="/tmp/$preBackupName" `
        --quiet 2>&1 | Out-Null
    
    Write-ColorOutput Yellow "Veritabanı geri yükleniyor..."
    
    # Yedeği container'a kopyala
    $restorePath = "/tmp/restore_backup"
    docker cp "$BackupDir" "${ContainerName}:$restorePath"
    
    # MongoDB restore işlemi
    docker exec $ContainerName mongorestore `
        --db=$DBName `
        --drop `
        "$restorePath/appykod" `
        --quiet
    
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Red "Hata: Geri yükleme başarısız!"
        exit 1
    }
    
    # Geçici dosyaları temizle
    docker exec $ContainerName rm -rf $restorePath
    Remove-Item -Recurse -Force $TempDir
    
    Write-ColorOutput Green "✓ Geri yükleme tamamlandı!"
    Write-ColorOutput Green "Veritabanı başarıyla geri yüklendi."
    
} catch {
    Write-ColorOutput Red "Hata: $($_.Exception.Message)"
    if (Test-Path $TempDir) {
        Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue
    }
    exit 1
}
