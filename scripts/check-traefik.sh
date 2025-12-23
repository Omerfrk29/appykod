#!/bin/bash

# Traefik ve Reverse Proxy Kontrol Script'i

set -e

# Renkli çıktı için
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Traefik ve Reverse Proxy Kontrolü ===${NC}"
echo ""

# 1. Traefik container'ını kontrol et
echo -e "${YELLOW}1. Traefik container durumu:${NC}"
if docker ps | grep -q traefik; then
    echo -e "${GREEN}✓ Traefik container çalışıyor${NC}"
    TRAEFIK_CONTAINER=$(docker ps --filter "name=traefik" --format "{{.Names}}" | head -1)
    echo "   Container adı: $TRAEFIK_CONTAINER"
else
    echo -e "${RED}✗ Traefik container çalışmıyor!${NC}"
    echo "   Traefik'i başlatmak için: docker start traefik"
    exit 1
fi
echo ""

# 2. Traefik network'ünü kontrol et
echo -e "${YELLOW}2. Traefik network kontrolü:${NC}"
if docker network inspect birce_birce-network >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Network mevcut: birce_birce-network${NC}"
    
    # Network'teki container'ları listele
    echo "   Network'teki container'lar:"
    docker network inspect birce_birce-network --format '{{range .Containers}}{{.Name}} {{end}}' | tr ' ' '\n' | grep -v '^$' | sed 's/^/     - /'
    
    # Traefik ve web container'ının aynı network'te olup olmadığını kontrol et
    if docker network inspect birce_birce-network --format '{{range .Containers}}{{.Name}} {{end}}' | grep -q "traefik"; then
        echo -e "${GREEN}   ✓ Traefik network'te${NC}"
    else
        echo -e "${RED}   ✗ Traefik network'te değil!${NC}"
    fi
    
    if docker network inspect birce_birce-network --format '{{range .Containers}}{{.Name}} {{end}}' | grep -q "appykod-web"; then
        echo -e "${GREEN}   ✓ Web container network'te${NC}"
    else
        echo -e "${RED}   ✗ Web container network'te değil!${NC}"
    fi
else
    echo -e "${RED}✗ Network bulunamadı: birce_birce-network${NC}"
    echo "   Network'ü oluşturmak için: docker network create birce_birce-network"
fi
echo ""

# 3. Web container label'larını kontrol et
echo -e "${YELLOW}3. Web container label'ları:${NC}"
if docker ps | grep -q appykod-web; then
    echo "   Traefik label'ları:"
    docker inspect appykod-web --format '{{range $key, $value := .Config.Labels}}{{$key}}={{$value}}{{"\n"}}{{end}}' | grep traefik | sed 's/^/     /'
    
    # Traefik enable kontrolü
    if docker inspect appykod-web --format '{{index .Config.Labels "traefik.enable"}}' | grep -q "true"; then
        echo -e "${GREEN}   ✓ traefik.enable=true${NC}"
    else
        echo -e "${RED}   ✗ traefik.enable eksik veya false!${NC}"
    fi
else
    echo -e "${RED}✗ Web container çalışmıyor!${NC}"
fi
echo ""

# 4. Traefik dashboard'u kontrol et
echo -e "${YELLOW}4. Traefik dashboard kontrolü:${NC}"
TRAEFIK_PORT=$(docker port $TRAEFIK_CONTAINER 2>/dev/null | grep "8080" | head -1 | cut -d: -f2 || echo "")
if [ -n "$TRAEFIK_PORT" ]; then
    echo "   Traefik dashboard portu: $TRAEFIK_PORT"
    echo "   Dashboard URL: http://localhost:$TRAEFIK_PORT"
    echo -e "${GREEN}   ✓ Dashboard erişilebilir${NC}"
else
    echo -e "${YELLOW}   ⚠ Dashboard portu bulunamadı${NC}"
fi
echo ""

# 5. Traefik loglarını göster (son 20 satır)
echo -e "${YELLOW}5. Traefik logları (son 20 satır):${NC}"
docker logs $TRAEFIK_CONTAINER --tail=20 2>&1 | grep -E "(error|Error|ERROR|appykod|502)" || echo "   Önemli hata bulunamadı"
echo ""

# 6. Web container'dan Traefik'e erişim testi
echo -e "${YELLOW}6. Network bağlantı testi:${NC}"
if docker compose exec -T web sh -c "nc -z traefik 80" 2>/dev/null; then
    echo -e "${GREEN}   ✓ Web container'dan Traefik'e erişim var${NC}"
else
    echo -e "${RED}   ✗ Web container'dan Traefik'e erişim yok${NC}"
    echo "   Network bağlantısı sorunlu olabilir"
fi
echo ""

# 7. Öneriler
echo -e "${YELLOW}=== Öneriler ===${NC}"
echo ""
echo "Eğer Traefik web container'ı görmüyorsa:"
echo "  1. Traefik'i yeniden başlatın: docker restart $TRAEFIK_CONTAINER"
echo "  2. Web container'ı yeniden başlatın: docker compose restart web"
echo "  3. Her iki container'ın da aynı network'te olduğundan emin olun"
echo ""
echo "Eğer label'lar eksikse:"
echo "  1. docker-compose.yml dosyasını güncelleyin"
echo "  2. Container'ı yeniden oluşturun: docker compose up -d --force-recreate web"
echo ""
echo "Traefik dashboard'u kontrol edin:"
echo "  http://localhost:$TRAEFIK_PORT (veya sunucu IP'si)"
echo "  Dashboard'da 'HTTP Services' bölümünde appykod servisini görmelisiniz"
echo ""

