#!/bin/bash

# Penetration Test Script
# Web uygulaması için güvenlik testleri

set -e

# Renkli çıktı için
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

TARGET_URL="${1:-https://appykod.com}"
OUTPUT_DIR="./security-tests/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUTPUT_DIR"

echo -e "${BLUE}=== Penetration Test Başlatılıyor ===${NC}"
echo "Hedef: $TARGET_URL"
echo "Çıktı klasörü: $OUTPUT_DIR"
echo ""

# 1. SSL/TLS Test
echo -e "${YELLOW}[1/10] SSL/TLS Testi...${NC}"
if command -v testssl.sh &> /dev/null; then
    testssl.sh --html "$OUTPUT_DIR/ssl_test.html" "$TARGET_URL" 2>/dev/null || echo "testssl.sh bulunamadı, atlanıyor"
else
    echo "testssl.sh yüklü değil. Yüklemek için: https://testssl.sh/"
fi
echo ""

# 2. HTTP Security Headers Test
echo -e "${YELLOW}[2/10] HTTP Security Headers Testi...${NC}"
curl -sI "$TARGET_URL" > "$OUTPUT_DIR/headers.txt"
echo "Headers kaydedildi: $OUTPUT_DIR/headers.txt"
echo "Kontrol edilen header'lar:"
grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection|Strict-Transport-Security|Content-Security-Policy|Referrer-Policy)" "$OUTPUT_DIR/headers.txt" || echo "  Bazı security header'lar eksik!"
echo ""

# 3. SQL Injection Test (API endpoints)
echo -e "${YELLOW}[3/10] SQL Injection Testi (API endpoints)...${NC}"
API_ENDPOINTS=(
    "/api/services"
    "/api/projects"
    "/api/settings"
)

for endpoint in "${API_ENDPOINTS[@]}"; do
    echo "  Testing: $endpoint"
    # SQL injection payloads
    SQL_PAYLOADS=("' OR '1'='1" "'; DROP TABLE--" "1' UNION SELECT NULL--")
    for payload in "${SQL_PAYLOADS[@]}"; do
        response=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL$endpoint?id=$payload" 2>/dev/null || echo "000")
        if [ "$response" != "200" ] && [ "$response" != "404" ]; then
            echo -e "    ${RED}Potansiyel SQL Injection: $payload (HTTP $response)${NC}"
        fi
    done
done
echo ""

# 4. XSS Test
echo -e "${YELLOW}[4/10] XSS (Cross-Site Scripting) Testi...${NC}"
XSS_PAYLOADS=(
    "<script>alert('XSS')</script>"
    "<img src=x onerror=alert('XSS')>"
    "javascript:alert('XSS')"
    "<svg/onload=alert('XSS')>"
)

for endpoint in "${API_ENDPOINTS[@]}"; do
    echo "  Testing: $endpoint"
    for payload in "${XSS_PAYLOADS[@]}"; do
        response=$(curl -s "$TARGET_URL$endpoint?q=$(echo $payload | sed 's/ /%20/g')" 2>/dev/null || echo "")
        if echo "$response" | grep -qi "<script\|onerror\|javascript:"; then
            echo -e "    ${RED}Potansiyel XSS: $payload${NC}"
        fi
    done
done
echo ""

# 5. CSRF Test
echo -e "${YELLOW}[5/10] CSRF (Cross-Site Request Forgery) Testi...${NC}"
# POST endpoint'lerine origin header olmadan istek gönder
POST_ENDPOINTS=("/api/contact")
for endpoint in "${POST_ENDPOINTS[@]}"; do
    echo "  Testing: $endpoint"
    response=$(curl -s -X POST -o /dev/null -w "%{http_code}" \
        -H "Content-Type: application/json" \
        -d '{"test":"data"}' \
        "$TARGET_URL$endpoint" 2>/dev/null || echo "000")
    if [ "$response" = "200" ] || [ "$response" = "201" ]; then
        echo -e "    ${RED}CSRF koruması eksik olabilir! (HTTP $response)${NC}"
    else
        echo -e "    ${GREEN}CSRF koruması aktif (HTTP $response)${NC}"
    fi
done
echo ""

# 6. Rate Limiting Test
echo -e "${YELLOW}[6/10] Rate Limiting Testi...${NC}"
echo "  Hızlı istekler gönderiliyor..."
success_count=0
for i in {1..100}; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL/api/services" 2>/dev/null || echo "000")
    if [ "$response" = "200" ]; then
        ((success_count++))
    fi
    if [ "$response" = "429" ]; then
        echo -e "    ${GREEN}Rate limiting aktif! (HTTP 429)${NC}"
        break
    fi
done
if [ $success_count -eq 100 ]; then
    echo -e "    ${RED}Rate limiting çalışmıyor olabilir!${NC}"
fi
echo ""

# 7. Directory Traversal Test
echo -e "${YELLOW}[7/10] Directory Traversal Testi...${NC}"
TRAVERSAL_PAYLOADS=(
    "../../../etc/passwd"
    "..\\..\\..\\windows\\system32\\config\\sam"
    "....//....//etc/passwd"
)

for payload in "${TRAVERSAL_PAYLOADS[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL/api/upload?file=$payload" 2>/dev/null || echo "000")
    if [ "$response" = "200" ]; then
        echo -e "    ${RED}Potansiyel Directory Traversal: $payload${NC}"
    fi
done
echo ""

# 8. File Upload Test
echo -e "${YELLOW}[8/10] File Upload Güvenlik Testi...${NC}"
# Test için geçersiz dosya türleri
echo "  SVG upload testi (XSS riski)..."
response=$(curl -s -X POST -o /dev/null -w "%{http_code}" \
    -F "file=@/dev/null;filename=test.svg" \
    "$TARGET_URL/api/upload" 2>/dev/null || echo "000")
if [ "$response" = "200" ] || [ "$response" = "201" ]; then
    echo -e "    ${RED}SVG upload kabul ediliyor (XSS riski!)${NC}"
else
    echo -e "    ${GREEN}SVG upload reddediliyor (HTTP $response)${NC}"
fi
echo ""

# 9. Authentication Bypass Test
echo -e "${YELLOW}[9/10] Authentication Bypass Testi...${NC}"
ADMIN_ENDPOINTS=(
    "/api/admin/services"
    "/api/admin/projects"
    "/api/admin/settings"
)

for endpoint in "${ADMIN_ENDPOINTS[@]}"; do
    echo "  Testing: $endpoint"
    response=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL$endpoint" 2>/dev/null || echo "000")
    if [ "$response" = "200" ]; then
        echo -e "    ${RED}Authentication bypass mümkün olabilir! (HTTP $response)${NC}"
    else
        echo -e "    ${GREEN}Authentication korumalı (HTTP $response)${NC}"
    fi
done
echo ""

# 10. Information Disclosure Test
echo -e "${YELLOW}[10/10] Information Disclosure Testi...${NC}"
# Error mesajlarında hassas bilgi kontrolü
response=$(curl -s "$TARGET_URL/api/nonexistent" 2>/dev/null || echo "")
if echo "$response" | grep -qiE "(password|secret|key|token|database|mongodb|redis)"; then
    echo -e "    ${RED}Potansiyel information disclosure!${NC}"
    echo "$response" > "$OUTPUT_DIR/info_disclosure.txt"
else
    echo -e "    ${GREEN}Information disclosure korumalı${NC}"
fi
echo ""

# 11. CORS Test
echo -e "${YELLOW}[11/11] CORS (Cross-Origin Resource Sharing) Testi...${NC}"
cors_response=$(curl -s -H "Origin: https://evil.com" -H "Access-Control-Request-Method: POST" \
    -X OPTIONS "$TARGET_URL/api/services" 2>/dev/null || echo "")
if echo "$cors_response" | grep -qi "Access-Control-Allow-Origin.*\*"; then
    echo -e "    ${RED}CORS wildcard (*) kullanılıyor - güvenlik riski!${NC}"
elif echo "$cors_response" | grep -qi "Access-Control-Allow-Origin.*evil.com"; then
    echo -e "    ${RED}CORS herkese açık - güvenlik riski!${NC}"
else
    echo -e "    ${GREEN}CORS güvenli görünüyor${NC}"
fi
echo ""

# Özet
echo -e "${BLUE}=== Test Tamamlandı ===${NC}"
echo "Sonuçlar: $OUTPUT_DIR"
echo ""
echo "Öneriler:"
echo "  1. Sonuçları gözden geçirin: ls -la $OUTPUT_DIR"
echo "  2. OWASP ZAP veya Burp Suite ile daha detaylı test yapın"
echo "  3. Manuel testler yapın (admin panel, file upload, vb.)"
echo ""

