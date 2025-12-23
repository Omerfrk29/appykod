# MongoDB Setup Guide

Bu dokümantasyon, projeyi MongoDB ile çalışacak şekilde kurmak için gerekli adımları açıklar.

## Gereksinimler

- Node.js 20 veya üzeri
- MongoDB (yerel veya MongoDB Atlas)

## Kurulum Adımları

### 1. MongoDB Kurulumu

#### Docker ile MongoDB (Önerilen - Development)

Docker kullanarak MongoDB'yi hızlıca başlatmak için:

**ÖNEMLİ:** MongoDB authentication için environment variable'ları ayarlayın:

```bash
# .env dosyasına ekleyin:
MONGO_ROOT_USERNAME=mongo_admin
MONGO_ROOT_PASSWORD=your-strong-password-change-this
```

```bash
# Development için MongoDB ve Mongo Express'i başlat
docker-compose -f docker-compose.dev.yml up -d

# Sadece MongoDB'yi başlatmak isterseniz
docker-compose -f docker-compose.dev.yml up -d mongodb

# MongoDB'yi durdurmak için
docker-compose -f docker-compose.dev.yml down

# Verileri de silmek için (dikkatli kullanın!)
docker-compose -f docker-compose.dev.yml down -v
```

Bu komut:
- MongoDB'yi `localhost:27017` portunda başlatır (authentication ile)
- Mongo Express web UI'ını `localhost:8081` portunda başlatır (opsiyonel)
- Verileri kalıcı volume'larda saklar

**Mongo Express'e erişim:**
- URL: http://localhost:8081
- Kullanıcı adı: `admin`
- Şifre: `admin`

**MongoDB'ye doğrudan bağlanma:**
```bash
# Docker container içinden
docker exec -it appykod-mongodb mongosh -u mongo_admin -p your-strong-password

# Veya dışarıdan
mongosh "mongodb://mongo_admin:your-strong-password@localhost:27017/appykod?authSource=admin"
```

#### Yerel MongoDB (Development)

MongoDB'yi yerel olarak kurmak için:

**Windows:**
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) indirin ve kurun
- MongoDB servisinin çalıştığından emin olun

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

#### MongoDB Atlas (Production/Cloud)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluşturun
2. Yeni bir cluster oluşturun
3. Database Access'te bir kullanıcı oluşturun
4. Network Access'te IP adresinizi ekleyin (veya 0.0.0.0/0 tüm IP'lere izin verir)
5. Connection string'i kopyalayın

### 2. Environment Variables Ayarlama

`.env.local` dosyası oluşturun (veya `.env`):

```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
# MongoDB Configuration
# Docker kullanıyorsanız (authentication ile):
MONGODB_URI=mongodb://mongo_admin:your-strong-password@localhost:27017/appykod?authSource=admin
# veya authentication olmadan (sadece development):
# MONGODB_URI=mongodb://localhost:27017/appykod
# veya MongoDB Atlas için:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/appykod

MONGODB_DB_NAME=appykod

# MongoDB Root Credentials (Docker için)
MONGO_ROOT_USERNAME=mongo_admin
MONGO_ROOT_PASSWORD=your-strong-password-change-this

# Admin Authentication (Uygulama admin paneli için)
ADMIN_USER=admin
ADMIN_PASSWORD_HASH=scrypt:16384:8:1:base64salt:base64hash
ADMIN_SESSION_SECRET=your-secret-session-key-change-this-in-production
```

### 3. Admin Şifresi Oluşturma

Admin şifresinin hash'ini oluşturmak için:

```bash
npm run hash:admin-password
```

Bu komut size bir hash üretecek. Bu hash'i `ADMIN_PASSWORD_HASH` değişkenine kopyalayın.

### 4. Veri Migrasyonu

Mevcut `data.json` dosyasındaki verileri MongoDB'ye taşımak için:

```bash
npm run migrate:mongodb
```

Bu komut:
- `data.json` dosyasını okur
- Tüm servisleri, projeleri, mesajları ve ayarları MongoDB'ye aktarır
- Mevcut veriler varsa günceller (upsert)

### 5. Uygulamayı Başlatma

```bash
npm run dev
```

## API Endpoint'leri

### Public Endpoints

- `GET /api/services` - Tüm servisleri listele
- `GET /api/projects` - Tüm projeleri listele
- `GET /api/projects/[id]` - Belirli bir projeyi getir
- `GET /api/services/[id]` - Belirli bir servisi getir
- `GET /api/settings` - Site ayarlarını getir
- `POST /api/contact` - İletişim formu gönder

### Admin Endpoints (Authentication Required)

- `GET /api/admin/services` - Admin için servisleri listele
- `GET /api/admin/projects` - Admin için projeleri listele
- `GET /api/admin/messages` - Mesajları listele
- `GET /api/admin/settings` - Ayarları getir
- `GET /api/admin/stats` - Dashboard istatistikleri
- `POST /api/services` - Yeni servis oluştur
- `PUT /api/services/[id]` - Servis güncelle
- `DELETE /api/services/[id]` - Servis sil
- `POST /api/projects` - Yeni proje oluştur
- `PUT /api/projects/[id]` - Proje güncelle
- `DELETE /api/projects/[id]` - Proje sil
- `PUT /api/settings` - Ayarları güncelle
- `PUT /api/admin/messages/[id]` - Mesajı okundu olarak işaretle
- `DELETE /api/admin/messages/[id]` - Mesaj sil

## API Response Formatı

Tüm API endpoint'leri standart bir format kullanır:

**Başarılı Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Hata Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

## Sorun Giderme

### MongoDB Bağlantı Hatası

1. MongoDB servisinin çalıştığından emin olun
2. `MONGODB_URI` değişkeninin doğru olduğunu kontrol edin
3. Firewall ayarlarını kontrol edin (MongoDB Atlas için)

### Migration Hatası

1. `data.json` dosyasının mevcut olduğundan emin olun
2. MongoDB bağlantısının çalıştığını kontrol edin
3. Veritabanı adının doğru olduğunu kontrol edin

### Admin Giriş Sorunu

1. `ADMIN_PASSWORD_HASH` değişkeninin doğru oluşturulduğundan emin olun
2. `ADMIN_SESSION_SECRET` değişkeninin ayarlandığından emin olun
3. Tarayıcı çerezlerini temizleyin

## Production Deployment

Production ortamında:

1. Güçlü bir `ADMIN_SESSION_SECRET` kullanın
2. MongoDB Atlas gibi yönetilen bir MongoDB servisi kullanın
3. Environment variables'ları güvenli bir şekilde saklayın (Vercel, Railway, vb.)
4. HTTPS kullanın
5. Rate limiting'i etkinleştirin

## Daha Fazla Bilgi

- [MongoDB Dokümantasyonu](https://docs.mongodb.com/)
- [Mongoose Dokümantasyonu](https://mongoosejs.com/docs/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
