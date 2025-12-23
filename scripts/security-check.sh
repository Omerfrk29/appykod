#!/bin/bash

# Güvenlik Kontrol Scripti
# Bu script sunucunuzdaki güvenlik durumunu kontrol eder

echo "=== Güvenlik Kontrolü Başlatılıyor ==="
echo ""

# 1. Zararlı process'leri kontrol et
echo "1. Zararlı Process Kontrolü:"
echo "----------------------------"
if ps aux | grep -iE "(xmr|mining|monero|clean\.sh|immunify)" | grep -v grep; then
    echo "⚠️  UYARI: Zararlı process bulundu!"
else
    echo "✅ Zararlı process bulunamadı"
fi
echo ""

# 2. Şüpheli dosyaları kontrol et
echo "2. Şüpheli Dosya Kontrolü:"
echo "-------------------------"
echo "Aranıyor: clean.sh, immunify360, xmr, monero..."
found_files=$(find /home /var /opt /tmp -name "*clean.sh" -o -name "*immunify360*" -o -name "*xmr*" -o -name "*monero*" 2>/dev/null | head -20)
if [ -n "$found_files" ]; then
    echo "⚠️  Şüpheli dosyalar bulundu:"
    echo "$found_files"
else
    echo "✅ Şüpheli dosya bulunamadı"
fi
echo ""

# 3. Cron job'ları kontrol et
echo "3. Cron Job Kontrolü:"
echo "-------------------"
echo "Root cron jobs:"
sudo crontab -l 2>/dev/null | grep -v "^#" | grep -v "^$" || echo "  (boş)"
echo ""
echo "Ubuntu user cron jobs:"
crontab -l 2>/dev/null | grep -v "^#" | grep -v "^$" || echo "  (boş)"
echo ""
echo "Sistem cron jobs (/etc/cron.d/):"
ls -la /etc/cron.d/ 2>/dev/null | tail -n +2
echo ""

# 4. Son başarısız login denemelerini kontrol et
echo "4. Son Başarısız Login Denemeleri:"
echo "---------------------------------"
echo "Son 20 başarısız deneme:"
sudo grep "Failed password" /var/log/auth.log 2>/dev/null | tail -20 || echo "  Log bulunamadı"
echo ""

# 5. Aktif network bağlantılarını kontrol et
echo "5. Aktif Network Bağlantıları:"
echo "-----------------------------"
echo "Şüpheli bağlantılar (port 8001, 4444, vb.):"
sudo netstat -tulpn 2>/dev/null | grep -E ":(8001|4444|3333|9999)" || echo "  Şüpheli port bulunamadı"
echo ""

# 6. CPU ve Memory kullanımını kontrol et
echo "6. Sistem Kaynak Kullanımı:"
echo "--------------------------"
echo "Top 5 CPU kullanan process:"
ps aux --sort=-%cpu | head -6
echo ""

# 7. Firewall durumunu kontrol et
echo "7. Firewall Durumu:"
echo "------------------"
sudo ufw status | head -20
echo ""

# 8. Son sistem güncellemelerini kontrol et
echo "8. Sistem Güncellemeleri:"
echo "------------------------"
echo "Son güncelleme kontrolü:"
if [ -f /var/log/apt/history.log ]; then
    tail -5 /var/log/apt/history.log | grep -E "Start-Date|Commandline" | head -10
else
    echo "  Güncelleme log'u bulunamadı"
fi
echo ""

echo "=== Kontrol Tamamlandı ==="
echo ""
echo "Öneriler:"
echo "1. Şüpheli dosyalar bulunduysa, inceleyin ve gerekirse silin"
echo "2. Şüpheli cron job'ları kaldırın"
echo "3. Başarısız login denemeleri varsa, IP'leri engelleyin"
echo "4. Fail2Ban kurun: sudo apt-get install fail2ban"
echo "5. Sistem güncellemelerini yapın: sudo apt update && sudo apt upgrade"

