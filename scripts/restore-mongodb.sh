#!/bin/bash

# MongoDB Geri Yükleme Script'i
# EC2'da MongoDB verilerini geri yüklemek için kullanılır

set -e

# Renkli çıktı için
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Ayarlar
DB_NAME="appykod"
CONTAINER_NAME="appykod-mongodb"

echo -e "${GREEN}=== MongoDB Geri Yükleme Başlatılıyor ===${NC}"

# Backup dosyasını kontrol et
if [ -z "$1" ]; then
    echo -e "${RED}Hata: Yedek dosyası belirtilmedi!${NC}"
    echo "Kullanım: $0 <backup_file.tar.gz>"
    echo "Örnek: $0 backups/mongodb_backup_20240101_120000.tar.gz"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}Hata: Yedek dosyası bulunamadı: $BACKUP_FILE${NC}"
    exit 1
fi

# Docker container'ın çalışıp çalışmadığını kontrol et
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo -e "${RED}Hata: $CONTAINER_NAME container'ı çalışmıyor!${NC}"
    echo "Container'ı başlatmak için: docker-compose up -d mongodb"
    exit 1
fi

echo -e "${YELLOW}Yedek dosyası açılıyor...${NC}"
TEMP_DIR=$(mktemp -d)
tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"
BACKUP_DIR=$(find "$TEMP_DIR" -type d -name "appykod" | head -1 | xargs dirname)

if [ -z "$BACKUP_DIR" ]; then
    echo -e "${RED}Hata: Yedek dosyası geçersiz format!${NC}"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo -e "${YELLOW}Mevcut veriler yedekleniyor (güvenlik için)...${NC}"
# Mevcut verileri yedekle (güvenlik için)
docker exec "$CONTAINER_NAME" mongodump \
    --db="$DB_NAME" \
    --out="/tmp/pre_restore_backup_$(date +%Y%m%d_%H%M%S)" \
    --quiet || true

echo -e "${YELLOW}Veritabanı geri yükleniyor...${NC}"

# Yedeği container'a kopyala
docker cp "$BACKUP_DIR" "$CONTAINER_NAME:/tmp/restore_backup"

# MongoDB restore işlemi
docker exec "$CONTAINER_NAME" mongorestore \
    --db="$DB_NAME" \
    --drop \
    "/tmp/restore_backup/appykod" \
    --quiet

# Geçici dosyaları temizle
docker exec "$CONTAINER_NAME" rm -rf "/tmp/restore_backup"
rm -rf "$TEMP_DIR"

echo -e "${GREEN}✓ Geri yükleme tamamlandı!${NC}"
echo -e "${GREEN}Veritabanı başarıyla geri yüklendi.${NC}"
