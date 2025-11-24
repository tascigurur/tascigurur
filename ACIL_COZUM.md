# 🚨 ACİL ÇÖZÜM - HTTP 500 Hatası

## Site çalışmıyor! Hemen düzeltin:

### SEÇENEK 1: ESKİ HALİNE DÖN (EN HIZLI)

Sunucunuzdaki `wp-config.php` dosyasını bu dosya ile değiştirin:
**`wp-config-ORIGINAL.php`**

Bu eski, çalışan versiyondur. Site tekrar açılacaktır.

---

### SEÇENEK 2: DÜZELTİLMİŞ VERSİYONU KULLAN

Sunucunuzdaki `wp-config.php` dosyasını bu dosya ile değiştirin:
**`wp-config-FIXED.php`**

Bu düzeltilmiş versiyon hem çalışır hem de CSS/JS sorununu çözer.

---

## ADIM ADIM ÇÖZÜM:

### FTP/Hosting Panel ile:

1. **Hosting panel veya FTP'ye giriş yapın**

2. **WordPress root klasörüne gidin:**
   ```
   /public_html/
   veya
   /httpdocs/
   veya
   /www/
   ```

3. **Mevcut wp-config.php dosyasını yedek alın:**
   - Dosyayı indirin
   - Veya adını `wp-config-backup.php` yapın

4. **İKİ SEÇENEKTEN BİRİNİ YAPIN:**

   **A) Site hemen açılsın (eski haline dön):**
   - `wp-config-ORIGINAL.php` dosyasını yükleyin
   - Adını `wp-config.php` yapın

   **B) Hem açılsın hem CSS/JS düzelsin:**
   - `wp-config-FIXED.php` dosyasını yükleyin
   - Adını `wp-config.php` yapın

5. **Dosya izinlerini kontrol edin:**
   ```
   chmod 644 wp-config.php
   ```

6. **Siteyi test edin:**
   - https://onespace.qudigital.com.tr
   - Site açılıyor mu?

---

## SORUN NE İDİ?

İlk wp-config.php dosyasında syntax hatası veya yanlış yerleştirilmiş kod vardı.

**Düzeltilmiş versiyonda:**
- URL tanımları doğru yere konuldu
- PHP syntax düzeltildi
- HTTPS proxy kontrolü eklendi

---

## HALA ÇALIŞMIYOR MU?

### Error Log Kontrol:

1. **Hosting panel → Error Logs** bölümüne gidin
2. Son hataları kontrol edin
3. Bana gönderin, analiz edeyim

### Manuel Kontrol:

```bash
# SSH erişiminiz varsa:
tail -f /var/log/apache2/error.log
# veya
tail -f /var/log/php-fpm/error.log
```

### Acil İletişim:

Hosting sağlayıcınızla iletişime geçin:
- "wp-config.php dosyam bozuldu"
- "Yedekten geri yükleyin"
- "Veya eski haline döndürün"

---

## NEDEN 500 HATASI ALDI?

HTTP 500 = Internal Server Error

Olası sebepler:
1. ❌ PHP syntax hatası
2. ❌ Yanlış dosya izinleri
3. ❌ Bozuk wp-config.php
4. ❌ Memory limit aşımı
5. ❌ Plugin çakışması

Bizim durumumuzda: **wp-config.php'de syntax hatası**

---

## GELECEKTE BU OLMASIN:

1. ✅ Her zaman yedek alın
2. ✅ Değişikliklerden önce test edin
3. ✅ Staging ortamı kullanın
4. ✅ Dosya izinlerini kontrol edin
5. ✅ PHP error log'larını takip edin

---

## ÖNEMLİ:

**Şu an yapmanız gereken:**
1. Sunucuya giriş yapın
2. wp-config.php'yi değiştirin
3. Site açılsın

**Sonra:**
- CSS/JS sorununu WordPress Admin Panel'den çözeriz
- Daha güvenli yöntemler kullanırız

---

**Bu belgeyi yazdırın veya kaydedin!**
Acil durumlarda hazır olsun.
