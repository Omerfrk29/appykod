#!/bin/bash

# MongoDB Container'ı Sıfırdan Oluşturma Script'i
# Bu script mevcut container'ları ve volume'ları siler, sonra yeniden oluşturur

set -e

# Renkli çıktı için
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== MongoDB Container'ı Sıfırdan Oluşturuluyor ===${NC}"
echo ""

# Mevcut container'ları durdur ve sil
echo -e "${YELLOW}1. Mevcut container'lar durduruluyor...${NC}"
docker compose down 2>/dev/null || docker-compose down 2>/dev/null || true

# Container'ları zorla sil (eğer hala çalışıyorsa)
echo -e "${YELLOW}2. Container'lar zorla siliniyor...${NC}"
docker rm -f appykod-mongodb appykod-web 2>/dev/null || true

# Volume'ları sil (VERİLER SİLİNECEK!)
echo -e "${RED}3. Volume'lar siliniyor (TÜM VERİLER SİLİNECEK!)...${NC}"
docker volume rm appykod_mongodb_data appykod_mongodb_config 2>/dev/null || true
docker volume rm mongodb_data mongodb_config 2>/dev/null || true

# Network'ü kontrol et (silme, sadece kontrol)
echo -e "${YELLOW}4. Network kontrol ediliyor...${NC}"
if ! docker network ls | grep -q "birce_birce-network"; then
    echo -e "${YELLOW}   Network bulunamadı, oluşturulacak...${NC}"
fi

echo ""
echo -e "${GREEN}5. Container'lar yeniden oluşturuluyor...${NC}"
echo ""

# Environment variable'ları kontrol et
if [ -z "$MONGO_ROOT_PASSWORD" ]; then
    echo -e "${YELLOW}UYARI: MONGO_ROOT_PASSWORD environment variable'ı ayarlanmamış!${NC}"
    echo -e "${YELLOW}MongoDB authentication olmadan başlatılacak.${NC}"
    echo ""
fi

# Container'ları başlat
docker compose up -d mongodb

# MongoDB'nin hazır olmasını bekle
echo -e "${YELLOW}6. MongoDB'nin hazır olması bekleniyor...${NC}"
timeout=60
counter=0
while [ $counter -lt $timeout ]; do
    if docker compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" --quiet >/dev/null 2>&1; then
        echo -e "${GREEN}✓ MongoDB hazır!${NC}"
        break
    fi
    echo -n "."
    sleep 1
    counter=$((counter + 1))
done

if [ $counter -eq $timeout ]; then
    echo -e "${RED}✗ MongoDB başlatılamadı! Logları kontrol edin:${NC}"
    echo "   docker compose logs mongodb"
    exit 1
fi

echo ""
echo -e "${GREEN}=== Tamamlandı! ===${NC}"
echo ""
echo "MongoDB container'ı başarıyla oluşturuldu."
echo ""
echo "Kullanışlı komutlar:"
echo "  - Logları görüntüle: docker compose logs -f mongodb"
echo "  - MongoDB'ye bağlan: docker compose exec mongodb mongosh"
echo "  - Container durumunu kontrol et: docker compose ps"
echo ""

