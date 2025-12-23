# MongoDB Authentication Kurulum Scripti (PowerShell)
# Bu script MongoDB'ye authentication ekler

Write-Host "=== MongoDB Authentication Kurulumu ===" -ForegroundColor Cyan
Write-Host ""

# Environment variable'ları kontrol et
$mongoUsername = $env:MONGO_ROOT_USERNAME
$mongoPassword = $env:MONGO_ROOT_PASSWORD

if (-not $mongoUsername) {
    Write-Host "MONGO_ROOT_USERNAME environment variable'ı ayarlanmamış." -ForegroundColor Red
    Write-Host "Lütfen .env dosyasına ekleyin:" -ForegroundColor Yellow
    Write-Host "  MONGO_ROOT_USERNAME=mongo_admin" -ForegroundColor Yellow
    exit 1
}

if (-not $mongoPassword) {
    Write-Host "MONGO_ROOT_PASSWORD environment variable'ı ayarlanmamış." -ForegroundColor Red
    Write-Host "Lütfen .env dosyasına ekleyin:" -ForegroundColor Yellow
    Write-Host "  MONGO_ROOT_PASSWORD=your-strong-password" -ForegroundColor Yellow
    exit 1
}

Write-Host "MongoDB authentication bilgileri:" -ForegroundColor Green
Write-Host "  Username: $mongoUsername" -ForegroundColor White
Write-Host "  Password: [gizli]" -ForegroundColor White
Write-Host ""

# Docker container'ın çalışıp çalışmadığını kontrol et
$containerRunning = docker ps --filter "name=appykod-mongodb" --format "{{.Names}}"
if (-not $containerRunning) {
    Write-Host "MongoDB container'ı çalışmıyor. Önce başlatın:" -ForegroundColor Red
    Write-Host "  docker-compose -f docker-compose.dev.yml up -d mongodb" -ForegroundColor Yellow
    exit 1
}

Write-Host "MongoDB container'ına bağlanılıyor..." -ForegroundColor Cyan
Write-Host ""

# MongoDB'ye bağlan ve kullanıcı oluştur
$mongoScript = @"
use admin

// Kullanıcı zaten var mı kontrol et
var user = db.getUser('$mongoUsername');
if (user) {
    print('Kullanıcı zaten mevcut. Şifre güncelleniyor...');
    db.changeUserPassword('$mongoUsername', '$mongoPassword');
} else {
    print('Yeni kullanıcı oluşturuluyor...');
    db.createUser({
        user: '$mongoUsername',
        pwd: '$mongoPassword',
        roles: [ { role: 'root', db: 'admin' } ]
    });
}

print('✓ MongoDB authentication başarıyla ayarlandı!');
"@

docker exec -i appykod-mongodb mongosh --quiet --eval $mongoScript

Write-Host ""
Write-Host "=== Kurulum Tamamlandı ===" -ForegroundColor Green
Write-Host ""
Write-Host "Şimdi .env dosyanızda MONGODB_URI'yi güncelleyin:" -ForegroundColor Yellow
Write-Host "  MONGODB_URI=mongodb://$mongoUsername`:$mongoPassword@localhost:27017/appykod?authSource=admin" -ForegroundColor White
Write-Host ""
Write-Host "Docker Compose kullanıyorsanız, container'ları yeniden başlatın:" -ForegroundColor Yellow
Write-Host "  docker-compose -f docker-compose.dev.yml restart" -ForegroundColor White

