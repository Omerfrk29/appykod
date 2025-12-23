# MongoDB Container'ı Sıfırdan Oluşturma Script'i (PowerShell)
# Bu script mevcut container'ları ve volume'ları siler, sonra yeniden oluşturur

Write-Host "=== MongoDB Container'ı Sıfırdan Oluşturuluyor ===" -ForegroundColor Yellow
Write-Host ""

# Mevcut container'ları durdur ve sil
Write-Host "1. Mevcut container'lar durduruluyor..." -ForegroundColor Yellow
docker compose down 2>$null
if ($LASTEXITCODE -ne 0) {
    docker-compose down 2>$null
}

# Container'ları zorla sil (eğer hala çalışıyorsa)
Write-Host "2. Container'lar zorla siliniyor..." -ForegroundColor Yellow
docker rm -f appykod-mongodb appykod-web 2>$null

# Volume'ları sil (VERİLER SİLİNECEK!)
Write-Host "3. Volume'lar siliniyor (TÜM VERİLER SİLİNECEK!)..." -ForegroundColor Red
docker volume rm appykod_mongodb_data appykod_mongodb_config 2>$null
docker volume rm mongodb_data mongodb_config 2>$null

# Network'ü kontrol et (silme, sadece kontrol)
Write-Host "4. Network kontrol ediliyor..." -ForegroundColor Yellow
$networkExists = docker network ls | Select-String "birce_birce-network"
if (-not $networkExists) {
    Write-Host "   Network bulunamadı, oluşturulacak..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "5. Container'lar yeniden oluşturuluyor..." -ForegroundColor Green
Write-Host ""

# Environment variable'ları kontrol et
if (-not $env:MONGO_ROOT_PASSWORD) {
    Write-Host "UYARI: MONGO_ROOT_PASSWORD environment variable'ı ayarlanmamış!" -ForegroundColor Yellow
    Write-Host "MongoDB authentication olmadan başlatılacak." -ForegroundColor Yellow
    Write-Host ""
}

# Container'ları başlat
docker compose up -d mongodb

# MongoDB'nin hazır olmasını bekle
Write-Host "6. MongoDB'nin hazır olması bekleniyor..." -ForegroundColor Yellow
$timeout = 60
$counter = 0
$ready = $false

while ($counter -lt $timeout) {
    $result = docker compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" --quiet 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ MongoDB hazır!" -ForegroundColor Green
        $ready = $true
        break
    }
    Write-Host "." -NoNewline
    Start-Sleep -Seconds 1
    $counter++
}

if (-not $ready) {
    Write-Host "`n✗ MongoDB başlatılamadı! Logları kontrol edin:" -ForegroundColor Red
    Write-Host "   docker compose logs mongodb" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=== Tamamlandı! ===" -ForegroundColor Green
Write-Host ""
Write-Host "MongoDB container'ı başarıyla oluşturuldu."
Write-Host ""
Write-Host "Kullanışlı komutlar:"
Write-Host "  - Logları görüntüle: docker compose logs -f mongodb"
Write-Host "  - MongoDB'ye bağlan: docker compose exec mongodb mongosh"
Write-Host "  - Container durumunu kontrol et: docker compose ps"
Write-Host ""

