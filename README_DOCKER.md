# Docker ile MongoDB Kurulumu

Bu rehber, Docker kullanarak lokal MongoDB kurulumunu açıklar.

## Hızlı Başlangıç

### 1. MongoDB'yi Başlat

```bash
# Development ortamı için MongoDB ve Mongo Express'i başlat
docker-compose -f docker-compose.dev.yml up -d

# Sadece MongoDB'yi başlatmak isterseniz
docker-compose -f docker-compose.dev.yml up -d mongodb
```

### 2. MongoDB Durumunu Kontrol Et

```bash
# Container'ların durumunu kontrol et
docker-compose -f docker-compose.dev.yml ps

# MongoDB loglarını görüntüle
docker-compose -f docker-compose.dev.yml logs mongodb

# MongoDB'ye bağlan (test için)
docker-compose -f docker-compose.dev.yml exec mongodb mongosh appykod
```

### 3. Environment Variables Ayarla

`.env.local` dosyasında MongoDB URI'yi ayarlayın:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=appykod
```

### 4. Verileri Migrate Et

```bash
npm run migrate:mongodb
```

## Mongo Express (Web UI)

Mongo Express, MongoDB veritabanınızı web arayüzünden yönetmenizi sağlar.

**Erişim:**
- URL: http://localhost:8081
- Kullanıcı adı: `admin`
- Şifre: `admin`

**Not:** Mongo Express'i kapatmak isterseniz:

```bash
docker-compose -f docker-compose.dev.yml stop mongo-express
```

## Yaygın Komutlar

### MongoDB'yi Durdur

```bash
docker-compose -f docker-compose.dev.yml down
```

### MongoDB'yi Durdur ve Verileri Sil

```bash
# DİKKAT: Bu komut tüm verileri siler!
docker-compose -f docker-compose.dev.yml down -v
```

### MongoDB'yi Yeniden Başlat

```bash
docker-compose -f docker-compose.dev.yml restart mongodb
```

### MongoDB Loglarını İzle

```bash
docker-compose -f docker-compose.dev.yml logs -f mongodb
```

### MongoDB Container'ına Bağlan

```bash
# MongoDB shell'e bağlan
docker-compose -f docker-compose.dev.yml exec mongodb mongosh appykod

# Bash shell'e bağlan
docker-compose -f docker-compose.dev.yml exec mongodb bash
```

## Veri Kalıcılığı

MongoDB verileri Docker volume'larında saklanır:
- `mongodb_data`: Veritabanı dosyaları
- `mongodb_config`: Konfigürasyon dosyaları

Volume'ları görüntülemek için:
```bash
docker volume ls | grep mongodb
```

## Sorun Giderme

### Port Zaten Kullanılıyor

Eğer `27017` portu zaten kullanılıyorsa, `docker-compose.dev.yml` dosyasında portu değiştirin:

```yaml
ports:
  - "27018:27017"  # 27018 portunu kullan
```

Ve `.env.local` dosyasını güncelleyin:
```env
MONGODB_URI=mongodb://localhost:27018
```

### MongoDB Başlamıyor

1. Container loglarını kontrol edin:
   ```bash
   docker-compose -f docker-compose.dev.yml logs mongodb
   ```

2. Container'ı yeniden oluşturun:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d --force-recreate mongodb
   ```

### Veriler Kayboldu

Volume'ların durumunu kontrol edin:
```bash
docker volume inspect appykod_mongodb_data
```

## Production Kullanımı

Production ortamında:
- MongoDB için authentication kullanın
- Güvenli bir şifre belirleyin
- Network erişimini kısıtlayın
- Düzenli yedekleme yapın

Örnek production docker-compose.yml:
```yaml
mongodb:
  environment:
    - MONGO_INITDB_ROOT_USERNAME=admin
    - MONGO_INITDB_ROOT_PASSWORD=secure-password
```

## Daha Fazla Bilgi

- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Mongo Express Docker Hub](https://hub.docker.com/_/mongo-express)
- [Docker Compose Dokümantasyonu](https://docs.docker.com/compose/)
