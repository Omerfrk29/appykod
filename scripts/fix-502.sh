#!/bin/bash

# 502 Bad Gateway Düzeltme Script'i

set -e

# Renkli çıktı için
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== 502 Bad Gateway Düzeltme ===${NC}"
echo ""

# 1. Web container'ını durdur
echo -e "${YELLOW}1. Web container durduruluyor...${NC}"
docker compose stop web 2>/dev/null || true
docker rm -f appykod-web 2>/dev/null || true
echo ""

# 2. MongoDB'nin çalıştığını kontrol et
echo -e "${YELLOW}2. MongoDB kontrol ediliyor...${NC}"
if ! docker compose ps mongodb | grep -q "Up"; then
    echo -e "${RED}✗ MongoDB çalışmıyor! Önce MongoDB'yi başlatın.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ MongoDB çalışıyor${NC}"
echo ""

# 3. Network'ü kontrol et ve oluştur
echo -e "${YELLOW}3. Network kontrol ediliyor...${NC}"
if ! docker network ls | grep -q "birce_birce-network"; then
    echo -e "${YELLOW}   Network oluşturuluyor...${NC}"
    docker network create birce_birce-network
    echo -e "${GREEN}✓ Network oluşturuldu${NC}"
else
    echo -e "${GREEN}✓ Network mevcut${NC}"
fi
echo ""

# 4. Environment variable'ları kontrol et
echo -e "${YELLOW}4. Environment variable kontrolü...${NC}"
if [ -z "$MONGO_ROOT_PASSWORD" ]; then
    echo -e "${YELLOW}   UYARI: MONGO_ROOT_PASSWORD ayarlanmamış${NC}"
    echo -e "${YELLOW}   MongoDB authentication olmadan bağlanılacak${NC}"
fi
echo ""

# 5. Web container'ını yeniden oluştur ve başlat
echo -e "${YELLOW}5. Web container yeniden oluşturuluyor...${NC}"
docker compose build web
docker compose up -d web
echo ""

# 6. Container'ın başlamasını bekle
echo -e "${YELLOW}6. Container'ın başlaması bekleniyor (30 saniye)...${NC}"
sleep 30
echo ""

# 7. Logları göster
echo -e "${YELLOW}7. Web container logları:${NC}"
docker compose logs --tail=30 web
echo ""

# 8. Durum kontrolü
echo -e "${YELLOW}8. Durum kontrolü:${NC}"
if docker compose ps web | grep -q "Up"; then
    echo -e "${GREEN}✓ Web container çalışıyor${NC}"
    
    # Port kontrolü
    sleep 5
    if docker compose exec -T web sh -c "nc -z localhost 3000" 2>/dev/null; then
        echo -e "${GREEN}✓ Port 3000 dinleniyor${NC}"
        echo ""
        echo -e "${GREEN}=== Başarılı! ===${NC}"
        echo ""
        echo "Container başarıyla başlatıldı. Eğer hala 502 hatası alıyorsanız:"
        echo "  1. Reverse proxy (Traefik/Nginx) loglarını kontrol edin"
        echo "  2. Traefik container'ını yeniden başlatın: docker restart traefik"
        echo "  3. DNS ayarlarını kontrol edin"
    else
        echo -e "${RED}✗ Port 3000 henüz dinlenmiyor, biraz daha bekleyin${NC}"
        echo "   Logları izlemek için: docker compose logs -f web"
    fi
else
    echo -e "${RED}✗ Web container başlatılamadı!${NC}"
    echo "   Logları kontrol edin: docker compose logs web"
    exit 1
fi
echo ""

