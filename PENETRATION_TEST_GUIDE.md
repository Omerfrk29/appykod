# Penetration Test Rehberi - Sunucuda Çalıştırma

## Sunucuya Bağlanma

```bash
ssh -i "C:\Users\cubuk\Belgeler\appybir-key.pem" ubuntu@63.181.88.181
```

## Script'leri Sunucuya Aktarma

### Yöntem 1: SCP ile Kopyalama (Önerilen)

**Windows PowerShell'den:**
```powershell
# Script'leri sunucuya kopyala
scp -i "C:\Users\cubuk\Belgeler\appybir-key.pem" scripts/penetration-test.sh ubuntu@63.181.88.181:~/appykod/scripts/
scp -i "C:\Users\cubuk\Belgeler\appybir-key.pem" scripts/security-scan.sh ubuntu@63.181.88.181:~/appykod/scripts/
scp -i "C:\Users\cubuk\Belgeler\appybir-key.pem" scripts/run-penetration-test-remote.sh ubuntu@63.181.88.181:~/appykod/scripts/
```

### Yöntem 2: Git ile (Eğer repo'da ise)

```bash
# SSH ile bağlan
ssh -i "C:\Users\cubuk\Belgeler\appybir-key.pem" ubuntu@63.181.88.181

# Repo'yu güncelle
cd ~/appykod
git pull origin main
```

### Yöntem 3: Manuel Oluşturma

SSH ile bağlandıktan sonra script'i oluşturun:

```bash
cd ~/appykod
nano scripts/run-penetration-test-remote.sh
# Script içeriğini yapıştırın
chmod +x scripts/run-penetration-test-remote.sh
```

## Testleri Çalıştırma

### 1. Temel Penetration Test

```bash
# SSH ile bağlan
ssh -i "C:\Users\cubuk\Belgeler\appybir-key.pem" ubuntu@63.181.88.181

# Script'i çalıştırılabilir yap
cd ~/appykod
chmod +x scripts/run-penetration-test-remote.sh

# Testi çalıştır
./scripts/run-penetration-test-remote.sh https://appykod.com
```

### 2. Güvenlik Taraması

```bash
# Güvenlik taraması script'ini çalıştır
chmod +x scripts/security-scan.sh
./scripts/security-scan.sh https://appykod.com
```

### 3. Manuel Testler

#### A. SSL/TLS Testi

```bash
# testssl.sh yüklü mü kontrol et
which testssl.sh

# Eğer yoksa yükle
cd /tmp
wget https://testssl.sh/testssl.sh
chmod +x testssl.sh

# SSL testi yap
./testssl.sh https://appykod.com
```

#### B. Port Tarama

```bash
# nmap yüklü mü kontrol et
which nmap

# Eğer yoksa yükle
sudo apt-get update
sudo apt-get install -y nmap

# Port tarama
nmap -sV -sC appykod.com
```

#### C. Security Headers Kontrolü

```bash
# Tüm security header'ları kontrol et
curl -I https://appykod.com | grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection|Strict-Transport-Security|Content-Security-Policy|Referrer-Policy)"
```

#### D. API Endpoint Testleri

```bash
# Admin endpoint'lerine authentication olmadan erişim testi
curl -v https://appykod.com/api/admin/services
curl -v https://appykod.com/api/admin/projects

# Beklenen: 401 Unauthorized

# Rate limiting testi
for i in {1..100}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://appykod.com/api/services
done
# Beklenen: 429 Too Many Requests

# CSRF testi
curl -X POST https://appykod.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"test","email":"test@test.com","message":"test"}'
# Beklenen: 403 Forbidden (CSRF token eksik)
```

## OWASP ZAP ile Otomatik Test

### ZAP Kurulumu

```bash
# Docker ile ZAP çalıştır
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://appykod.com \
  -J zap-report.json \
  -g gen.conf

# Raporu görüntüle
cat zap-report.json
```

### ZAP API ile Test

```bash
# ZAP'ı başlat
docker run -d -p 8080:8080 owasp/zap2docker-stable zap.sh -daemon \
  -host 0.0.0.0 -port 8080 -config api.disablekey=true

# Tarama başlat
curl "http://localhost:8080/JSON/spider/action/scan/?url=https://appykod.com"

# Sonuçları al
curl "http://localhost:8080/JSON/core/view/alerts/"
```

## Test Sonuçlarını İndirme

### Windows PowerShell'den:

```powershell
# Test sonuçlarını indir
scp -i "C:\Users\cubuk\Belgeler\appybir-key.pem" -r ubuntu@63.181.88.181:~/appykod/security-tests ./
scp -i "C:\Users\cubuk\Belgeler\appybir-key.pem" ubuntu@63.181.88.181:~/appykod/security-report-*.txt ./
```

## Güvenlik Kontrol Listesi

### ✅ Test Edilmesi Gerekenler

- [ ] **Authentication & Authorization**
  - [ ] Admin endpoint'lerine authentication olmadan erişim
  - [ ] Brute force koruması
  - [ ] Session management
  - [ ] Password policy

- [ ] **Injection Attacks**
  - [ ] SQL/NoSQL Injection
  - [ ] XSS (Cross-Site Scripting)
  - [ ] Command Injection
  - [ ] LDAP Injection

- [ ] **Security Misconfiguration**
  - [ ] Security headers
  - [ ] Error handling
  - [ ] Default credentials
  - [ ] Gereksiz servisler

- [ ] **Sensitive Data Exposure**
  - [ ] Information disclosure
  - [ ] Error messages
  - [ ] Log files

- [ ] **Broken Access Control**
  - [ ] IDOR (Insecure Direct Object Reference)
  - [ ] Horizontal/vertical privilege escalation
  - [ ] Path traversal

- [ ] **CSRF & XSS**
  - [ ] CSRF protection
  - [ ] Stored XSS
  - [ ] Reflected XSS
  - [ ] DOM-based XSS

- [ ] **File Upload**
  - [ ] Zararlı dosya yükleme
  - [ ] File type validation
  - [ ] File size limits

- [ ] **Rate Limiting**
  - [ ] API rate limits
  - [ ] Brute force protection
  - [ ] DDoS protection

## Test Raporu Oluşturma

```bash
# Test sonuçlarını birleştir
cd ~/appykod
cat security-report-*.txt > full-security-report.txt

# Özet rapor oluştur
echo "=== Güvenlik Test Özeti ===" > security-summary.txt
echo "Tarih: $(date)" >> security-summary.txt
echo "" >> security-summary.txt
echo "Test Edilen: https://appykod.com" >> security-summary.txt
echo "" >> security-summary.txt
echo "Bulgular:" >> security-summary.txt
grep -i "✗\|RED\|risk\|vulnerability" security-report-*.txt >> security-summary.txt || echo "Kritik bulgu yok" >> security-summary.txt
```

## Önemli Notlar

⚠️ **DİKKAT:**

1. **Production ortamında test yaparken dikkatli olun** - Rate limiting testleri servisi etkileyebilir
2. **Brute force testlerini sınırlı tutun** - Hesap kilitlemelerine neden olabilir
3. **Test sonuçlarını güvenli saklayın** - Hassas bilgi içerebilir
4. **Bulguları sorumlu şekilde raporlayın** - Güvenlik açıklarını public yapmayın

## Hızlı Test Komutları

```bash
# Tek komutla hızlı test
cd ~/appykod && \
chmod +x scripts/run-penetration-test-remote.sh && \
./scripts/run-penetration-test-remote.sh https://appykod.com

# Security headers kontrolü
curl -I https://appykod.com | grep -E "(X-Frame|X-Content|X-XSS|Strict-Transport|CSP|Referrer)"

# Admin endpoint authentication testi
curl -v https://appykod.com/api/admin/services 2>&1 | grep -E "(401|403|200)"

# Rate limiting testi (hızlı)
for i in {1..20}; do curl -s -o /dev/null -w "%{http_code}\n" https://appykod.com/api/services; done | sort | uniq -c
```

