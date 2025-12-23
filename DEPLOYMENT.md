# Deployment Guide

## Environment Variables

### Required Variables

```env
# MongoDB Configuration
# Authentication ile (ÖNERİLİR):
MONGODB_URI=mongodb://mongo_admin:your-strong-password@localhost:27017/appykod?authSource=admin
# veya MongoDB Atlas için:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/appykod

MONGODB_DB_NAME=appykod

# MongoDB Root Credentials (Docker için - ZORUNLU)
MONGO_ROOT_USERNAME=mongo_admin
MONGO_ROOT_PASSWORD=your-strong-password-change-this-in-production

# Admin Authentication
ADMIN_USER=admin
ADMIN_PASSWORD_HASH=scrypt:16384:8:1:base64salt:base64hash
ADMIN_SESSION_SECRET=your-secret-session-key-change-this-in-production
```

### Optional Variables

```env
# Redis Configuration (Optional)
# Redis URL for rate limiting (e.g., redis://localhost:6379 or redis://:password@host:port)
# If not set, rate limiting will use in-memory storage
REDIS_URL=redis://localhost:6379

# Set to 'false' to explicitly disable Redis (use in-memory fallback)
REDIS_ENABLED=true
```

## MongoDB Authentication Kurulumu

### Docker ile MongoDB (Production)

MongoDB authentication için environment variable'ları ayarlayın:

```bash
# .env dosyasına ekleyin:
MONGO_ROOT_USERNAME=mongo_admin
MONGO_ROOT_PASSWORD=your-very-strong-password-here
```

**ÖNEMLİ:** Production'da mutlaka güçlü bir şifre kullanın!

### Yerel MongoDB'ye Authentication Ekleme

Eğer yerel MongoDB kullanıyorsanız:

```bash
# MongoDB'ye bağlanın
mongosh

# Admin kullanıcısı oluşturun
use admin
db.createUser({
  user: "mongo_admin",
  pwd: "your-strong-password",
  roles: [ { role: "root", db: "admin" } ]
})

# MongoDB'yi authentication ile başlatın
# /etc/mongod.conf dosyasında:
# security:
#   authorization: enabled
```

### MongoDB Atlas

MongoDB Atlas kullanıyorsanız, connection string zaten authentication içerir:
```
mongodb+srv://username:password@cluster.mongodb.net/appykod
```

## Redis Kurulumu

### Self-Hosted Redis (Ubuntu/Debian)

```bash
# Redis'i yükleyin
sudo apt update
sudo apt install redis-server -y

# Redis'i başlatın
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Redis durumunu kontrol edin
sudo systemctl status redis-server

# Redis'i test edin
redis-cli ping
# Yanıt: PONG

# Redis şifresi ayarlayın (önerilir)
sudo nano /etc/redis/redis.conf
# requirepass your-strong-password satırını bulun ve açın

# Redis'i yeniden başlatın
sudo systemctl restart redis-server

# .env dosyasına ekleyin
REDIS_URL=redis://:your-strong-password@localhost:6379
```

### Docker ile Redis

```bash
# Docker Compose kullanıyorsanız, docker-compose.yml'e ekleyin:
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --requirepass your-strong-password
    volumes:
      - redis-data:/data

volumes:
  redis-data:
```

## Production Deployment Checklist

### 1. Environment Variables
- [ ] Tüm environment variable'ları ayarlayın
- [ ] `MONGO_ROOT_USERNAME` ve `MONGO_ROOT_PASSWORD` ayarlayın (ZORUNLU)
- [ ] `MONGODB_URI` authentication ile güncelleyin
- [ ] `ADMIN_SESSION_SECRET` güçlü bir değer olarak ayarlayın
- [ ] `ADMIN_PASSWORD_HASH` oluşturun (`npm run hash:admin-password`)
- [ ] `REDIS_URL` ayarlayın (production için)

### 2. Security
- [ ] Firewall kurallarını kontrol edin
- [ ] Fail2Ban kurun ve yapılandırın
- [ ] SSH güvenliğini artırın
- [ ] SSL/TLS sertifikası kurun

### 3. Redis
- [ ] Redis kurulumunu tamamlayın
- [ ] Redis şifresi ayarlayın
- [ ] Redis persistence ayarlarını yapılandırın
- [ ] Redis monitoring ekleyin

### 4. MongoDB
- [ ] MongoDB authentication ayarlayın (ZORUNLU)
- [ ] `MONGO_ROOT_USERNAME` ve `MONGO_ROOT_PASSWORD` ayarlayın
- [ ] `MONGODB_URI` authentication bilgileri ile güncelleyin
- [ ] MongoDB bağlantısını test edin
- [ ] MongoDB backup stratejisi oluşturun

### 5. Application
- [ ] `npm install` çalıştırın
- [ ] `npm run build` ile build alın
- [ ] `npm start` ile production modunda çalıştırın
- [ ] Health check endpoint'lerini test edin

### 6. Monitoring
- [ ] Log dosyalarını izleyin
- [ ] Error tracking kurun (opsiyonel)
- [ ] Performance monitoring ekleyin (opsiyonel)

## Rate Limiting

Rate limiting şu anda şu limitlerle yapılandırılmıştır:

- `/api/services` - 100 istek/dakika
- `/api/projects` - 100 istek/dakika
- `/api/settings` - 60 istek/dakika
- `/api/testimonials` - 100 istek/dakika
- `/api/contact` - 5 istek/dakika
- `/api/auth` (login) - 10 istek/dakika

Bu limitler `src/lib/rateLimit.ts` dosyasında ve ilgili endpoint'lerde tanımlanmıştır.

## CSRF Protection

CSRF koruması tüm POST/PUT/DELETE endpoint'lerinde aktif. Frontend'den istek yaparken:

1. CSRF token'ı cookie'den okuyun
2. `X-CSRF-Token` header'ına ekleyin

Örnek:
```javascript
// CSRF token'ı cookie'den oku
const csrfToken = document.cookie
  .split('; ')
  .find(row => row.startsWith('csrf_token='))
  ?.split('=')[1];

// API isteğine header olarak ekle
fetch('/api/services', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify(data)
});
```

## Troubleshooting

### Redis Bağlantı Sorunları

```bash
# Redis'in çalışıp çalışmadığını kontrol edin
sudo systemctl status redis-server

# Redis loglarını kontrol edin
sudo journalctl -u redis-server -f

# Redis CLI ile bağlantıyı test edin
redis-cli -a your-password ping
```

### Rate Limiting Çalışmıyor

- Redis bağlantısını kontrol edin
- `REDIS_ENABLED` değişkenini kontrol edin
- In-memory fallback kullanılıyorsa, multi-instance durumunda çalışmayabilir

### CSRF Token Hataları

- Cookie'lerin doğru ayarlandığından emin olun
- SameSite cookie policy'yi kontrol edin
- CORS ayarlarını kontrol edin

