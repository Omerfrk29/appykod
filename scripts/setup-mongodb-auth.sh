#!/bin/bash

# MongoDB Authentication Kurulum Scripti
# Bu script MongoDB'ye authentication ekler

set -e

echo "=== MongoDB Authentication Kurulumu ==="
echo ""

# Environment variable'ları kontrol et
if [ -z "$MONGO_ROOT_USERNAME" ]; then
    echo "MONGO_ROOT_USERNAME environment variable'ı ayarlanmamış."
    echo "Lütfen .env dosyasına ekleyin:"
    echo "  MONGO_ROOT_USERNAME=mongo_admin"
    exit 1
fi

if [ -z "$MONGO_ROOT_PASSWORD" ]; then
    echo "MONGO_ROOT_PASSWORD environment variable'ı ayarlanmamış."
    echo "Lütfen .env dosyasına ekleyin:"
    echo "  MONGO_ROOT_PASSWORD=your-strong-password"
    exit 1
fi

echo "MongoDB authentication bilgileri:"
echo "  Username: $MONGO_ROOT_USERNAME"
echo "  Password: [gizli]"
echo ""

# Docker container'ın çalışıp çalışmadığını kontrol et
if ! docker ps | grep -q appykod-mongodb; then
    echo "MongoDB container'ı çalışmıyor. Önce başlatın:"
    echo "  docker-compose -f docker-compose.dev.yml up -d mongodb"
    exit 1
fi

echo "MongoDB container'ına bağlanılıyor..."
echo ""

# MongoDB'ye bağlan ve kullanıcı oluştur
docker exec -i appykod-mongodb mongosh --quiet <<EOF
use admin

// Kullanıcı zaten var mı kontrol et
var user = db.getUser("$MONGO_ROOT_USERNAME");
if (user) {
    print("Kullanıcı zaten mevcut. Şifre güncelleniyor...");
    db.changeUserPassword("$MONGO_ROOT_USERNAME", "$MONGO_ROOT_PASSWORD");
} else {
    print("Yeni kullanıcı oluşturuluyor...");
    db.createUser({
        user: "$MONGO_ROOT_USERNAME",
        pwd: "$MONGO_ROOT_PASSWORD",
        roles: [ { role: "root", db: "admin" } ]
    });
}

print("✓ MongoDB authentication başarıyla ayarlandı!");
EOF

echo ""
echo "=== Kurulum Tamamlandı ==="
echo ""
echo "Şimdi .env dosyanızda MONGODB_URI'yi güncelleyin:"
echo "  MONGODB_URI=mongodb://$MONGO_ROOT_USERNAME:$MONGO_ROOT_PASSWORD@localhost:27017/appykod?authSource=admin"
echo ""
echo "Docker Compose kullanıyorsanız, container'ları yeniden başlatın:"
echo "  docker-compose -f docker-compose.dev.yml restart"

