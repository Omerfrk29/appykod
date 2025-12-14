# Google Analytics Entegrasyonu - Kurulum Rehberi

Bu dokümantasyon, Google Analytics'in cookie consent ve event tracking ile nasıl entegre edildiğini açıklar.

## 📋 Adım Adım Kurulum

### 1. Google Analytics Hesabı Oluşturma

1. [Google Analytics](https://analytics.google.com/) adresine gidin
2. Yeni bir hesap oluşturun veya mevcut hesabınızı kullanın
3. Yeni bir **GA4 (Google Analytics 4)** özelliği oluşturun
4. **Measurement ID**'nizi alın (format: `G-XXXXXXXXXX`)

### 2. Environment Variable Ayarlama

1. Proje kök dizininde `.env.local` dosyası oluşturun (eğer yoksa)
2. Aşağıdaki satırı ekleyin:

```env
NEXT_PUBLIC_GA_ID=G-EE10SR94QF
```

**Not:** `G-EE10SR94QF` yerine kendi Measurement ID'nizi yazın.

### 3. Cookie Consent

Cookie consent banner'ı otomatik olarak görünecektir. Kullanıcılar:
- **Kabul Et**: Google Analytics aktif olur
- **Reddet**: Google Analytics devre dışı kalır

Cookie consent tercihi 365 gün boyunca saklanır.

### 4. Event Tracking

Aşağıdaki etkileşimler otomatik olarak takip edilir:

#### ✅ Takip Edilen Etkinlikler

1. **Cookie Consent**
   - Event: `cookie_consent`
   - Parametreler: `accepted` (true/false)

2. **Contact Form Gönderimi**
   - Event: `contact_form_submit`
   - Parametreler: `success` (true/false)

3. **CTA Buton Tıklamaları**
   - Event: `cta_click`
   - Parametreler: `cta_name` (örn: "hero-primary", "contact-cta")

4. **Navigasyon Link Tıklamaları**
   - Event: `nav_click`
   - Parametreler: `link_name` (örn: "nav.home", "nav.services")

5. **Servis Kartı Tıklamaları**
   - Event: `service_click`
   - Parametreler: `service_id`, `service_name`

6. **Proje Kartı Tıklamaları**
   - Event: `project_click`
   - Parametreler: `project_id`, `project_name`

7. **External Link Tıklamaları**
   - Event: `external_link_click`
   - Parametreler: `link_url`, `link_text`

8. **Sayfa Görüntülemeleri**
   - Otomatik olarak her sayfa değişiminde takip edilir

## 🔧 Teknik Detaylar

### Dosya Yapısı

```
src/
├── lib/
│   └── analytics.ts          # GA utility fonksiyonları
├── components/
│   ├── CookieConsent.tsx     # Cookie consent banner
│   └── PageViewTracker.tsx    # Sayfa görüntüleme takibi
├── hooks/
│   └── usePageView.ts        # Sayfa görüntüleme hook'u
└── locales/
    ├── tr.json               # Türkçe çeviriler
    └── en.json               # İngilizce çeviriler
```

### Analytics API Kullanımı

```typescript
import { analytics } from '@/lib/analytics';

// Custom event tracking
analytics.contactFormSubmit(true);
analytics.ctaClick('button-name');
analytics.navClick('nav.home');
analytics.serviceClick('service-id', 'Service Name');
analytics.projectClick('project-id', 'Project Name');
analytics.externalLinkClick('https://example.com', 'Link Text');
analytics.cookieConsent(true);
```

### Manuel Event Tracking

```typescript
import { trackEvent } from '@/lib/analytics';

trackEvent('custom_event_name', {
  event_category: 'engagement',
  event_label: 'custom-label',
  value: 100,
});
```

## 🔒 GDPR Uyumluluğu

- ✅ Cookie consent kullanıcıdan alınır
- ✅ Analytics sadece consent verildiğinde yüklenir
- ✅ Consent reddedilirse tüm GA çerezleri temizlenir
- ✅ IP adresleri anonimleştirilir (`anonymize_ip: true`)
- ✅ Consent tercihi 365 gün saklanır

## 📊 Google Analytics'te Görüntüleme

1. [Google Analytics Dashboard](https://analytics.google.com/)'a gidin
2. **Raporlar** > **Etkinlikler** bölümüne gidin
3. Tüm custom event'lerinizi görebilirsiniz

### Önemli Event'ler

- `contact_form_submit`: İletişim formu gönderimleri
- `cta_click`: CTA buton tıklamaları
- `service_click`: Servis kartı tıklamaları
- `project_click`: Proje kartı tıklamaları
- `nav_click`: Navigasyon tıklamaları

## 🐛 Sorun Giderme

### Analytics Çalışmıyor

1. `.env.local` dosyasında `NEXT_PUBLIC_GA_ID` değerini kontrol edin
2. Cookie consent'in kabul edildiğinden emin olun
3. Browser console'da hata mesajlarını kontrol edin
4. Google Analytics'te Measurement ID'nin doğru olduğunu doğrulayın

### Event'ler Görünmüyor

1. Event'lerin sadece cookie consent kabul edildiğinde gönderildiğini unutmayın
2. Google Analytics'te event'lerin görünmesi birkaç dakika sürebilir
3. Real-time raporları kontrol edin: **Raporlar** > **Gerçek Zamanlı**

## 📝 Notlar

- Development ortamında event'ler gönderilir ancak production'da daha güvenilir sonuçlar alırsınız
- Cookie consent tercihi localStorage'da saklanır
- Analytics script'i dinamik olarak yüklenir (sadece consent verildiğinde)

## 🚀 Production Deployment

AWS veya diğer platformlara deploy ederken:

1. `.env.local` dosyasındaki `NEXT_PUBLIC_GA_ID` değerini environment variable olarak ayarlayın
2. Docker Compose kullanıyorsanız, `docker-compose.yml` dosyasına ekleyin:

```yaml
environment:
  - NEXT_PUBLIC_GA_ID=G-EE10SR94QF
```

3. Vercel kullanıyorsanız, dashboard'dan environment variable ekleyin
