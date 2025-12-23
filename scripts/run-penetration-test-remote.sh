#!/bin/bash

# Sunucuda çalıştırılacak penetration test script'i
# Bu script sunucuya kopyalandıktan sonra çalıştırılmalı

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

TARGET_URL="${1:-https://appykod.com}"
OUTPUT_DIR="./security-tests/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUTPUT_DIR"

echo -e "${BLUE}=== Penetration Test Başlatılıyor ===${NC}"
echo "Hedef: $TARGET_URL"
echo "Çıktı klasörü: $OUTPUT_DIR"
echo ""

# 1. HTTP Security Headers Test
echo -e "${YELLOW}[1/8] HTTP Security Headers Testi...${NC}"
curl -sI "$TARGET_URL" > "$OUTPUT_DIR/headers.txt"
echo "Headers kaydedildi: $OUTPUT_DIR/headers.txt"
echo "Kontrol edilen header'lar:"
grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection|Strict-Transport-Security|Content-Security-Policy|Referrer-Policy)" "$OUTPUT_DIR/headers.txt" || echo "  Bazı security header'lar eksik!"
echo ""

# 2. SQL/NoSQL Injection Test
echo -e "${YELLOW}[2/8] SQL/NoSQL Injection Testi...${NC}"
API_ENDPOINTS=("/api/services" "/api/projects" "/api/settings")

for endpoint in "${API_ENDPOINTS[@]}"; do
    echo "  Testing: $endpoint"
    SQL_PAYLOADS=("' OR '1'='1" "'; DROP TABLE--" "1' UNION SELECT NULL--" "{\"\$ne\": null}")
    for payload in "${SQL_PAYLOADS[@]}"; do
        encoded_payload=$(echo "$payload" | sed 's/ /%20/g' | sed 's/"/%22/g')
        response=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL$endpoint?id=$encoded_payload" 2>/dev/null || echo "000")
        if [ "$response" != "200" ] && [ "$response" != "404" ] && [ "$response" != "400" ]; then
            echo -e "    ${YELLOW}Potansiyel injection: $payload (HTTP $response)${NC}"
        fi
    done
done
echo ""

# 3. XSS Test
echo -e "${YELLOW}[3/8] XSS (Cross-Site Scripting) Testi...${NC}"
XSS_PAYLOADS=(
    "<script>alert('XSS')</script>"
    "<img src=x onerror=alert('XSS')>"
    "javascript:alert('XSS')"
)

for endpoint in "${API_ENDPOINTS[@]}"; do
    echo "  Testing: $endpoint"
    for payload in "${XSS_PAYLOADS[@]}"; do
        encoded_payload=$(echo "$payload" | sed 's/ /%20/g' | sed 's/</%3C/g' | sed 's/>/%3E/g')
        response=$(curl -s "$TARGET_URL$endpoint?q=$encoded_payload" 2>/dev/null || echo "")
        if echo "$response" | grep -qi "<script\|onerror\|javascript:"; then
            echo -e "    ${RED}Potansiyel XSS: $payload${NC}"
        fi
    done
done
echo ""

# 4. CSRF Test
echo -e "${YELLOW}[4/8] CSRF (Cross-Site Request Forgery) Testi...${NC}"
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

# 5. Rate Limiting Test
echo -e "${YELLOW}[5/8] Rate Limiting Testi...${NC}"
echo "  Hızlı istekler gönderiliyor (50 istek)..."
success_count=0
rate_limited=0
for i in {1..50}; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL/api/services" 2>/dev/null || echo "000")
    if [ "$response" = "200" ]; then
        ((success_count++))
    fi
    if [ "$response" = "429" ]; then
        rate_limited=1
        echo -e "    ${GREEN}Rate limiting aktif! (HTTP 429)${NC}"
        break
    fi
    sleep 0.1
done
if [ $rate_limited -eq 0 ] && [ $success_count -eq 50 ]; then
    echo -e "    ${YELLOW}Rate limiting test edilemedi veya çalışmıyor${NC}"
fi
echo ""

# 6. Authentication Bypass Test
echo -e "${YELLOW}[6/8] Authentication Bypass Testi...${NC}"
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

# 7. Information Disclosure Test
echo -e "${YELLOW}[7/8] Information Disclosure Testi...${NC}"
response=$(curl -s "$TARGET_URL/api/nonexistent-endpoint-12345" 2>/dev/null || echo "")
if echo "$response" | grep -qiE "(password|secret|key|token|database|mongodb|redis|stack trace|error at|internal)"; then
    echo -e "    ${RED}Potansiyel information disclosure!${NC}"
    echo "$response" > "$OUTPUT_DIR/info_disclosure.txt"
else
    echo -e "    ${GREEN}Information disclosure korumalı${NC}"
fi
echo ""

# 8. CORS Test
echo -e "${YELLOW}[8/8] CORS (Cross-Origin Resource Sharing) Testi...${NC}"
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

