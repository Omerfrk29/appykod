#!/bin/bash

# MongoDB Yedekleme Script'i
# Lokaldeki MongoDB verilerini yedeklemek için kullanılır

set -e

# Renkli çıktı için
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Ayarlar
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="mongodb_backup_${TIMESTAMP}"
DB_NAME="appykod"
CONTAINER_NAME="appykod-mongodb"

echo -e "${GREEN}=== MongoDB Yedekleme Başlatılıyor ===${NC}"

# Backup dizinini oluştur
mkdir -p "$BACKUP_DIR"

# Docker container'ın çalışıp çalışmadığını kontrol et
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo -e "${RED}Hata: $CONTAINER_NAME container'ı çalışmıyor!${NC}"
    echo "Container'ı başlatmak için: docker-compose up -d mongodb"
    exit 1
fi

echo -e "${YELLOW}MongoDB verileri yedekleniyor...${NC}"

# MongoDB dump al
docker exec "$CONTAINER_NAME" mongodump \
    --db="$DB_NAME" \
    --out="/tmp/$BACKUP_NAME" \
    --quiet

# Yedeği container'dan host'a kopyala
docker cp "$CONTAINER_NAME:/tmp/$BACKUP_NAME" "$BACKUP_DIR/"

# Container içindeki geçici dosyayı temizle
docker exec "$CONTAINER_NAME" rm -rf "/tmp/$BACKUP_NAME"

# Yedeği arşivle
cd "$BACKUP_DIR"
tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"
rm -rf "$BACKUP_NAME"
cd ..

BACKUP_SIZE=$(du -h "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" | cut -f1)

echo -e "${GREEN}✓ Yedekleme tamamlandı!${NC}"
echo -e "Yedek dosyası: ${GREEN}$BACKUP_DIR/${BACKUP_NAME}.tar.gz${NC}"
echo -e "Boyut: ${GREEN}$BACKUP_SIZE${NC}"

# Son 5 yedeği göster
echo -e "\n${YELLOW}Son 5 yedek:${NC}"
ls -lh "$BACKUP_DIR"/*.tar.gz 2>/dev/null | tail -5 | awk '{print $9, "(" $5 ")"}'
