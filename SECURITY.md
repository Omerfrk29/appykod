# Güvenlik Önlemleri ve Saldırı Koruması

## Sorun Analizi

Loglarınızda görülen hatalar, sunucunuza zararlı scriptlerin indirilmeye ve çalıştırılmaya çalışıldığını gösteriyor:

- `clean.sh` ve `immunify360firewall.sh` gibi zararlı scriptler
- MoneroOceean mining scripti kurulum girişimleri
- `xmr` (Monero miner) kurulum denemeleri

Bu saldırılar muhtemelen:
1. Sunucu seviyesinde bir güvenlik açığından yararlanıyor
2. API endpoint'lerinizi aşırı yükleyerek sunucuyu çökertmeye çalışıyor
3. Zararlı scriptleri indirip çalıştırmaya çalışıyor

## Uygulanan Çözümler

### 1. Rate Limiting Eklendi

Tüm public API endpoint'lerine rate limiting eklendi:

- `/api/services` - 100 istek/dakika
- `/api/projects` - 100 istek/dakika
- `/api/services/[id]` - 100 istek/dakika
- `/api/projects/[id]` - 100 istek/dakika
- `/api/settings` - 60 istek/dakika
- `/api/testimonials` - 100 istek/dakika
- `/api/contact` - 5 istek/dakika (zaten vardı)

### 2. Middleware Güvenlik Katmanı

`middleware.ts` dosyası oluşturuldu ve şu özellikler eklendi:

- **Zararlı path pattern'lerini engelleme**: `.sh`, `wget`, `curl`, `xmr`, `mining` gibi zararlı path'ler engelleniyor
- **Şüpheli user agent'ları engelleme**: `wget`, `curl`, `python` gibi otomatik araçlar engelleniyor
- **IP engelleme**: Loglardan görünen şüpheli IP'ler engelleniyor
- **Güvenlik header'ları**: Tüm API isteklerine güvenlik header'ları ekleniyor:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`

### 3. CORS Ayarları

API endpoint'lerine güvenli CORS ayarları eklendi.

## Sunucu Seviyesinde Yapılması Gerekenler

### 1. Firewall Kuralları

Sunucunuzda firewall kuralları ekleyin:

```bash
# UFW kullanıyorsanız
sudo ufw deny from 2.57.122.173
sudo ufw deny from 213.142.143.105

# veya iptables
sudo iptables -A INPUT -s 2.57.122.173 -j DROP
sudo iptables -A INPUT -s 213.142.143.105 -j DROP
```

### 2. Fail2Ban Kurulumu

Fail2Ban kurarak otomatik IP engelleme yapın:

```bash
sudo apt-get install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Zararlı Process'leri Kontrol Edin

Sunucunuzda zararlı process'lerin çalışıp çalışmadığını kontrol edin:

```bash
# xmr veya mining process'lerini kontrol edin
ps aux | grep -i xmr
ps aux | grep -i mining
ps aux | grep -i monero

# Şüpheli process'leri bulun
ps aux | grep -E "(wget|curl|bash|sh)" | grep -v grep

# CPU kullanımını kontrol edin
top
htop
```

### 4. Zararlı Dosyaları Temizleyin

Zararlı dosyaları bulup silin:

```bash
# Şüpheli script dosyalarını bulun
find / -name "clean.sh" 2>/dev/null
find / -name "*immunify360*" 2>/dev/null
find / -name "*xmr*" 2>/dev/null
find / -name "*monero*" 2>/dev/null

# /tmp ve /var/tmp dizinlerini temizleyin
sudo rm -rf /tmp/*.sh
sudo rm -rf /var/tmp/*.sh
```

### 5. Cron Job'ları Kontrol Edin

Zararlı cron job'ları kontrol edin:

```bash
# Tüm kullanıcıların cron job'larını kontrol edin
sudo crontab -l
sudo crontab -l -u root
sudo crontab -l -u www-data

# Sistem cron job'larını kontrol edin
ls -la /etc/cron.d/
ls -la /etc/cron.hourly/
ls -la /etc/cron.daily/
cat /etc/crontab
```

### 6. Sistem Loglarını İnceleyin

Sistem loglarını inceleyerek saldırı kaynaklarını bulun:

```bash
# Auth log'larını kontrol edin
sudo tail -f /var/log/auth.log
sudo grep "Failed password" /var/log/auth.log

# Apache/Nginx log'larını kontrol edin
sudo tail -f /var/log/apache2/access.log
sudo tail -f /var/log/nginx/access.log

# Sistem log'larını kontrol edin
sudo journalctl -xe
```

### 7. SSH Güvenliği

SSH güvenliğini artırın:

```bash
# SSH port'unu değiştirin (varsayılan 22 yerine)
sudo nano /etc/ssh/sshd_config
# Port 2222 gibi bir port kullanın

# Root login'i devre dışı bırakın
# PermitRootLogin no

# Password authentication'ı devre dışı bırakın, key-based auth kullanın
# PasswordAuthentication no

sudo systemctl restart sshd
```

### 8. Fail2Ban Jails Oluşturun

Next.js uygulamanız için özel fail2ban jail'i oluşturun:

```bash
sudo nano /etc/fail2ban/jail.local
```

```ini
[nextjs-api]
enabled = true
port = http,https
filter = nextjs-api
logpath = /var/log/nextjs/access.log
maxretry = 10
bantime = 3600
findtime = 600
```

### 9. Nginx/Apache Rate Limiting

Web sunucunuzda rate limiting ekleyin:

**Nginx:**
```nginx
http {
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    
    server {
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            proxy_pass http://localhost:3000;
        }
    }
}
```

**Apache:**
```apache
<IfModule mod_ratelimit.c>
    <Location /api/>
        SetOutputFilter RATE_LIMIT
        SetEnv rate-limit 400
    </Location>
</IfModule>
```

### 10. Monitoring ve Alerting

Sunucu kaynaklarını izleyin:

```bash
# CPU ve memory kullanımını izleyin
watch -n 1 'ps aux | head -20'

# Network trafiğini izleyin
sudo iftop
sudo nethogs

# Disk kullanımını izleyin
df -h
du -sh /*
```

## Uygulama Seviyesinde İyileştirmeler

### Rate Limiting İyileştirmeleri

Mevcut rate limiting in-memory'dir. Production'da Redis kullanmanız önerilir:

```typescript
// src/lib/rateLimit.ts - Redis entegrasyonu eklenebilir
```

### Logging İyileştirmeleri

Daha detaylı logging ekleyin:

```typescript
// Şüpheli istekleri loglayın
console.warn('[SECURITY] Suspicious request:', {
  ip,
  path,
  userAgent,
  timestamp: new Date().toISOString()
});
```

### IP Whitelist/Blacklist

Önemli endpoint'ler için IP whitelist ekleyin:

```typescript
const ALLOWED_IPS = ['your-ip-address'];
```

## Test Etme

Güvenlik önlemlerini test edin:

```bash
# Rate limiting testi
for i in {1..150}; do curl http://localhost:3000/api/services; done

# Middleware testi
curl -H "User-Agent: wget" http://localhost:3000/api/services
curl http://localhost:3000/api/services?test=clean.sh
```

## Acil Durum Müdahalesi

Eğer saldırı devam ediyorsa:

1. **Sunucuyu geçici olarak kapatın** (sadece gerekirse)
2. **Tüm şüpheli IP'leri engelleyin**
3. **Zararlı process'leri sonlandırın**
4. **Sistem güncellemelerini yapın**
5. **Güvenlik açıklarını kapatın**

## İletişim

Güvenlik sorunları için: [güvenlik e-posta adresiniz]

## Kaynaklar

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Fail2Ban Documentation](https://www.fail2ban.org/wiki/index.php/Main_Page)

