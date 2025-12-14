# AWS EC2 Deployment Rehberi

Bu rehber, AppyKod projesini AWS EC2'ya deploy etmek için gerekli adımları içerir.

## 📋 Ön Gereksinimler

- AWS EC2 instance (Ubuntu, Docker ve Git yüklü)
- Domain adı (appykod.com) EC2 IP'sine yönlendirilmiş olmalı
- Lokaldeki MongoDB verilerinin yedeği alınmış olmalı
- SSH erişimi EC2 instance'a

## 🚀 Deployment Adımları

### 1. Lokalde Veri Yedekleme

Lokaldeki MongoDB verilerini yedekleyin:

```bash
# Windows için (Git Bash veya WSL kullanın)
bash scripts/backup-mongodb.sh

# Yedek dosyası backups/ klasöründe oluşturulacak
# Örnek: backups/mongodb_backup_20240101_120000.tar.gz
```

### 2. EC2 Instance Hazırlığı

EC2 instance'a SSH ile bağlanın:

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### 2.1. Docker ve Docker Compose Kontrolü

```bash
# Docker versiyonunu kontrol et
docker --version

# Docker Compose versiyonunu kontrol et
docker compose version

# Eğer yüklü değilse:
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo usermod -aG docker $USER
# Çıkış yapıp tekrar giriş yapın
```

#### 2.2. Git Kurulumu (Eğer yoksa)

```bash
sudo apt-get install -y git
```

#### 2.3. Proje Klasörü Oluşturma

```bash
# Proje için klasör oluştur
mkdir -p ~/appykod
cd ~/appykod
```

### 3. Projeyi EC2'ya Aktarma

#### Seçenek A: Git ile (Önerilen)

```bash
# Git repository'yi clone et
git clone <your-repo-url> .

# Veya mevcut repo'yu pull et
git pull origin master
```

#### Seçenek B: SCP ile Dosya Aktarımı

Lokal makinenizden:

```bash
# Proje dosyalarını EC2'ya kopyala
scp -i your-key.pem -r . ubuntu@your-ec2-ip:~/appykod/

# .git, node_modules gibi gereksiz dosyaları hariç tutmak için
# .dockerignore dosyasını kontrol edin
```

### 4. MongoDB Yedeğini EC2'ya Aktarma

Lokal makinenizden yedek dosyasını EC2'ya kopyalayın:

```bash
scp -i your-key.pem backups/mongodb_backup_*.tar.gz ubuntu@your-ec2-ip:~/appykod/backups/
```

### 5. Docker Network Oluşturma

EC2'da reverse proxy network'ünü oluşturun (eğer yoksa):

```bash
# Mevcut network'ü kontrol et
docker network ls | grep birce_birce-network

# Eğer yoksa oluştur
docker network create birce_birce-network
```

### 6. Docker Compose ile Servisleri Başlatma

```bash
cd ~/appykod

# Önce sadece MongoDB'yi başlat
docker compose up -d mongodb

# MongoDB'nin hazır olmasını bekle (30-60 saniye)
sleep 30

# MongoDB verilerini geri yükle
bash scripts/restore-mongodb.sh backups/mongodb_backup_*.tar.gz

# Tüm servisleri başlat
docker compose up -d

# Logları kontrol et
docker compose logs -f
```

### 7. Servis Durumunu Kontrol Etme

```bash
# Container'ların durumunu kontrol et
docker compose ps

# MongoDB'ye bağlanıp verileri kontrol et
docker exec -it appykod-mongodb mongosh appykod
# MongoDB shell'de:
# show collections
# db.projects.find().count()
# exit
```

### 8. Reverse Proxy Yapılandırması

Eğer nginx-proxy veya traefik kullanıyorsanız, `VIRTUAL_HOST` ve `LETSENCRYPT_HOST` environment variable'ları otomatik olarak SSL sertifikası oluşturacaktır.

Domain'in EC2 IP'sine yönlendirildiğinden emin olun:

```bash
# DNS kayıtlarını kontrol et
nslookup appykod.com
```

### 9. Güvenlik Ayarları

#### 9.1. Firewall Yapılandırması

```bash
# Sadece gerekli portları aç
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

#### 9.2. MongoDB Port Güvenliği

`docker-compose.yml` dosyasında MongoDB port'u sadece localhost'tan erişilebilir şekilde yapılandırılmıştır:
```yaml
ports:
  - "127.0.0.1:27017:27017"
```

Bu sayede MongoDB dışarıdan erişilemez.

### 10. Otomatik Yedekleme Kurulumu (Opsiyonel)

Cron job ile otomatik yedekleme ayarlayın:

```bash
# Crontab düzenle
crontab -e

# Her gün saat 02:00'de yedek al
0 2 * * * cd ~/appykod && bash scripts/backup-mongodb.sh

# Yedekleri S3'e yükle (opsiyonel)
# 0 3 * * * aws s3 sync ~/appykod/backups/ s3://your-bucket/backups/
```

## 🔄 Güncelleme İşlemi

Projeyi güncellemek için:

```bash
cd ~/appykod

# Git'ten son değişiklikleri çek
git pull origin master

# Docker image'ları yeniden build et
docker compose build

# Servisleri yeniden başlat
docker compose up -d

# Logları kontrol et
docker compose logs -f web
```

## 🐛 Sorun Giderme

### MongoDB Bağlantı Hatası

```bash
# MongoDB container'ının çalıştığını kontrol et
docker ps | grep mongodb

# MongoDB loglarını kontrol et
docker compose logs mongodb

# MongoDB'ye manuel bağlan
docker exec -it appykod-mongodb mongosh appykod
```

### Web Container Başlamıyor

```bash
# Web container loglarını kontrol et
docker compose logs web

# Container'ı yeniden build et
docker compose build --no-cache web
docker compose up -d web
```

### SSL Sertifikası Sorunları

```bash
# Let's Encrypt loglarını kontrol et (nginx-proxy kullanıyorsanız)
docker logs <nginx-proxy-container-name>

# Domain'in doğru yönlendirildiğini kontrol et
curl -I http://appykod.com
```

### Disk Alanı Sorunları

```bash
# Docker sistem temizliği
docker system prune -a

# Eski yedekleri sil
find ~/appykod/backups -name "*.tar.gz" -mtime +30 -delete
```

## 📊 Monitoring

### Log Takibi

```bash
# Tüm servislerin loglarını takip et
docker compose logs -f

# Sadece web servisinin loglarını takip et
docker compose logs -f web
```

### Kaynak Kullanımı

```bash
# Container kaynak kullanımını kontrol et
docker stats

# Disk kullanımını kontrol et
df -h
du -sh ~/appykod/*
```

## 🔐 Güvenlik Önerileri

1. **SSH Key Authentication**: Password authentication yerine SSH key kullanın
2. **Firewall**: Sadece gerekli portları açın
3. **Düzenli Yedekleme**: Otomatik yedekleme kurun
4. **Güncellemeler**: Düzenli olarak sistem ve Docker image'larını güncelleyin
5. **MongoDB Authentication**: Production'da MongoDB için authentication ekleyin

## 📝 Notlar

- İlk deployment sonrası domain'in DNS propagasyonu için 24-48 saat bekleyin
- SSL sertifikası ilk kez oluşturulurken birkaç dakika sürebilir
- MongoDB verileri `mongodb_data` volume'ünde saklanır, container silinse bile veriler korunur
- `data.json` dosyası hala volume olarak mount edilmiş, MongoDB'ye geçiş yapıldıysa bu satırı kaldırabilirsiniz

## 🆘 Destek

Sorun yaşarsanız:
1. Logları kontrol edin: `docker compose logs`
2. Container durumunu kontrol edin: `docker compose ps`
3. MongoDB bağlantısını test edin: `docker exec -it appykod-mongodb mongosh appykod`
