#!/bin/bash

# 502 Bad Gateway Sorun Giderme Script'i

set -e

# Renkli çıktı için
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== 502 Bad Gateway Sorun Giderme ===${NC}"
echo ""

# 1. Container durumunu kontrol et
echo -e "${YELLOW}1. Container durumları:${NC}"
docker compose ps
echo ""

# 2. Web container'ının çalışıp çalışmadığını kontrol et
echo -e "${YELLOW}2. Web container durumu:${NC}"
if docker ps | grep -q appykod-web; then
    echo -e "${GREEN}✓ Web container çalışıyor${NC}"
else
    echo -e "${RED}✗ Web container çalışmıyor!${NC}"
    echo "   Container'ı başlatmak için: docker compose up -d web"
    exit 1
fi
echo ""

# 3. Web container loglarını göster
echo -e "${YELLOW}3. Web container logları (son 50 satır):${NC}"
docker compose logs --tail=50 web
echo ""

# 4. Web container'ın port 3000'de dinleyip dinlemediğini kontrol et
echo -e "${YELLOW}4. Port 3000 kontrolü:${NC}"
if docker compose exec -T web sh -c "nc -z localhost 3000" 2>/dev/null; then
    echo -e "${GREEN}✓ Port 3000 dinleniyor${NC}"
else
    echo -e "${RED}✗ Port 3000 dinlenmiyor!${NC}"
fi
echo ""

# 5. MongoDB bağlantısını kontrol et
echo -e "${YELLOW}5. MongoDB bağlantı kontrolü:${NC}"
if docker compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" --quiet >/dev/null 2>&1; then
    echo -e "${GREEN}✓ MongoDB çalışıyor${NC}"
else
    echo -e "${RED}✗ MongoDB çalışmıyor!${NC}"
fi
echo ""

# 6. Network bağlantısını kontrol et
echo -e "${YELLOW}6. Network kontrolü:${NC}"
if docker network inspect birce_birce-network >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Network mevcut${NC}"
    echo "   Network'teki container'lar:"
    docker network inspect birce_birce-network --format '{{range .Containers}}{{.Name}} {{end}}'
else
    echo -e "${RED}✗ Network bulunamadı: birce_birce-network${NC}"
    echo "   Network'ü oluşturmak için: docker network create birce_birce-network"
fi
echo ""

# 7. Environment variable'ları kontrol et
echo -e "${YELLOW}7. Environment variable kontrolü:${NC}"
echo "   MONGODB_URI: $(docker compose exec -T web printenv MONGODB_URI 2>/dev/null || echo 'AYARLANMAMIŞ')"
echo "   NODE_ENV: $(docker compose exec -T web printenv NODE_ENV 2>/dev/null || echo 'AYARLANMAMIŞ')"
echo ""

# 8. Container içinden HTTP isteği yap
echo -e "${YELLOW}8. Container içinden HTTP testi:${NC}"
HTTP_CODE=$(docker compose exec -T web sh -c "wget -q -O- -T 5 http://localhost:3000 >/dev/null 2>&1 && echo '200' || echo 'ERROR'" 2>/dev/null || echo "ERROR")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Container içinden HTTP isteği başarılı${NC}"
else
    echo -e "${RED}✗ Container içinden HTTP isteği başarısız${NC}"
    echo "   Uygulama başlamamış olabilir, logları kontrol edin"
fi
echo ""

# 9. Öneriler
echo -e "${YELLOW}=== Öneriler ===${NC}"
echo ""
echo "Eğer web container çalışmıyorsa:"
echo "  1. Logları kontrol edin: docker compose logs -f web"
echo "  2. Container'ı yeniden başlatın: docker compose restart web"
echo "  3. Container'ı yeniden oluşturun: docker compose up -d --force-recreate web"
echo ""
echo "Eğer MongoDB bağlantı hatası varsa:"
echo "  1. MongoDB container'ının çalıştığını kontrol edin: docker compose ps mongodb"
echo "  2. MONGODB_URI environment variable'ını kontrol edin"
echo "  3. MongoDB authentication bilgilerini kontrol edin"
echo ""
echo "Eğer network sorunu varsa:"
echo "  1. Network'ü oluşturun: docker network create birce_birce-network"
echo "  2. Container'ları yeniden başlatın: docker compose down && docker compose up -d"
echo ""

