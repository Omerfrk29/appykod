#!/bin/bash

# Güvenlik Tarama Script'i
# OWASP Top 10 ve yaygın güvenlik açıklarını tarar

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

TARGET_URL="${1:-https://appykod.com}"
REPORT_FILE="./security-report-$(date +%Y%m%d_%H%M%S).txt"

echo -e "${BLUE}=== Güvenlik Taraması Başlatılıyor ===${NC}" | tee "$REPORT_FILE"
echo "Hedef: $TARGET_URL" | tee -a "$REPORT_FILE"
echo "Rapor: $REPORT_FILE"
echo ""

# 1. Port Tarama (sadece bilgi amaçlı)
echo -e "${YELLOW}[1] Port Tarama...${NC}" | tee -a "$REPORT_FILE"
if command -v nmap &> /dev/null; then
    domain=$(echo "$TARGET_URL" | sed -E 's|https?://||' | sed 's|/.*||')
    echo "  Açık portlar taranıyor..." | tee -a "$REPORT_FILE"
    nmap -p 80,443,8080,3000 "$domain" 2>/dev/null | tee -a "$REPORT_FILE" || echo "  nmap kullanılamıyor"
else
    echo "  nmap yüklü değil" | tee -a "$REPORT_FILE"
fi
echo "" | tee -a "$REPORT_FILE"

# 2. SSL/TLS Güvenlik Kontrolü
echo -e "${YELLOW}[2] SSL/TLS Güvenlik Kontrolü...${NC}" | tee -a "$REPORT_FILE"
ssl_info=$(echo | openssl s_client -connect "$(echo $TARGET_URL | sed -E 's|https?://||' | sed 's|/.*||'):443" -servername "$(echo $TARGET_URL | sed -E 's|https?://||' | sed 's|/.*||')" 2>/dev/null | openssl x509 -noout -text 2>/dev/null || echo "")
if [ -n "$ssl_info" ]; then
    echo "  ✓ SSL sertifikası geçerli" | tee -a "$REPORT_FILE"
    expiry=$(echo "$ssl_info" | grep "Not After" | cut -d: -f2-)
    echo "  Sertifika bitiş: $expiry" | tee -a "$REPORT_FILE"
else
    echo -e "  ${RED}✗ SSL bilgisi alınamadı${NC}" | tee -a "$REPORT_FILE"
fi
echo "" | tee -a "$REPORT_FILE"

# 3. Security Headers Kontrolü
echo -e "${YELLOW}[3] Security Headers Kontrolü...${NC}" | tee -a "$REPORT_FILE"
headers=$(curl -sI "$TARGET_URL" 2>/dev/null || echo "")

check_header() {
    local header_name=$1
    if echo "$headers" | grep -qi "$header_name"; then
        echo -e "  ${GREEN}✓ $header_name mevcut${NC}" | tee -a "$REPORT_FILE"
    else
        echo -e "  ${RED}✗ $header_name eksik!${NC}" | tee -a "$REPORT_FILE"
    fi
}

check_header "X-Frame-Options"
check_header "X-Content-Type-Options"
check_header "X-XSS-Protection"
check_header "Strict-Transport-Security"
check_header "Content-Security-Policy"
check_header "Referrer-Policy"
echo "" | tee -a "$REPORT_FILE"

# 4. API Endpoint Güvenlik Kontrolü
echo -e "${YELLOW}[4] API Endpoint Güvenlik Kontrolü...${NC}" | tee -a "$REPORT_FILE"
api_endpoints=(
    "/api/services"
    "/api/projects"
    "/api/settings"
    "/api/contact"
    "/api/upload"
    "/api/admin/services"
)

for endpoint in "${api_endpoints[@]}"; do
    echo "  Testing: $endpoint" | tee -a "$REPORT_FILE"
    
    # OPTIONS request (CORS)
    cors=$(curl -s -X OPTIONS -H "Origin: https://evil.com" \
        -H "Access-Control-Request-Method: POST" \
        "$TARGET_URL$endpoint" 2>/dev/null || echo "")
    
    if echo "$cors" | grep -qi "Access-Control-Allow-Origin.*\*"; then
        echo -e "    ${RED}✗ CORS wildcard kullanılıyor!${NC}" | tee -a "$REPORT_FILE"
    fi
    
    # Admin endpoint authentication kontrolü
    if [[ "$endpoint" == *"/admin/"* ]]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL$endpoint" 2>/dev/null || echo "000")
        if [ "$response" = "200" ]; then
            echo -e "    ${RED}✗ Authentication bypass mümkün!${NC}" | tee -a "$REPORT_FILE"
        else
            echo -e "    ${GREEN}✓ Authentication korumalı (HTTP $response)${NC}" | tee -a "$REPORT_FILE"
        fi
    fi
done
echo "" | tee -a "$REPORT_FILE"

# 5. File Upload Güvenlik Kontrolü
echo -e "${YELLOW}[5] File Upload Güvenlik Kontrolü...${NC}" | tee -a "$REPORT_FILE"
# SVG upload testi
svg_test=$(curl -s -X POST -o /dev/null -w "%{http_code}" \
    -F "file=@/dev/null;filename=test.svg" \
    "$TARGET_URL/api/upload" 2>/dev/null || echo "000")

if [ "$svg_test" = "200" ] || [ "$svg_test" = "201" ]; then
    echo -e "  ${RED}✗ SVG upload kabul ediliyor (XSS riski!)${NC}" | tee -a "$REPORT_FILE"
else
    echo -e "  ${GREEN}✓ SVG upload reddediliyor${NC}" | tee -a "$REPORT_FILE"
fi
echo "" | tee -a "$REPORT_FILE"

# 6. Rate Limiting Kontrolü
echo -e "${YELLOW}[6] Rate Limiting Kontrolü...${NC}" | tee -a "$REPORT_FILE"
echo "  100 istek gönderiliyor..." | tee -a "$REPORT_FILE"
rate_limited=0
for i in {1..100}; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL/api/services" 2>/dev/null || echo "000")
    if [ "$response" = "429" ]; then
        rate_limited=1
        echo -e "  ${GREEN}✓ Rate limiting aktif (HTTP 429)${NC}" | tee -a "$REPORT_FILE"
        break
    fi
done

if [ $rate_limited -eq 0 ]; then
    echo -e "  ${YELLOW}⚠ Rate limiting test edilemedi veya çalışmıyor${NC}" | tee -a "$REPORT_FILE"
fi
echo "" | tee -a "$REPORT_FILE"

# 7. Error Handling Kontrolü
echo -e "${YELLOW}[7] Error Handling Kontrolü...${NC}" | tee -a "$REPORT_FILE"
error_response=$(curl -s "$TARGET_URL/api/nonexistent-endpoint-12345" 2>/dev/null || echo "")
if echo "$error_response" | grep -qiE "(password|secret|key|token|database|mongodb|redis|stack trace|error at)"; then
    echo -e "  ${RED}✗ Information disclosure riski!${NC}" | tee -a "$REPORT_FILE"
    echo "  Error response hassas bilgi içeriyor olabilir" | tee -a "$REPORT_FILE"
else
    echo -e "  ${GREEN}✓ Error handling güvenli${NC}" | tee -a "$REPORT_FILE"
fi
echo "" | tee -a "$REPORT_FILE"

# Özet
echo -e "${BLUE}=== Tarama Tamamlandı ===${NC}" | tee -a "$REPORT_FILE"
echo "Rapor dosyası: $REPORT_FILE" | tee -a "$REPORT_FILE"
echo ""
echo "Sonraki adımlar:"
echo "  1. Raporu gözden geçirin: cat $REPORT_FILE"
echo "  2. OWASP ZAP ile detaylı test yapın"
echo "  3. Manuel penetration test yapın"
echo ""

