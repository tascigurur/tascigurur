# WordPress URL Yapılandırma Sorunu - Çözüm Kılavuzu

## Sorun Nedir?
WordPress sitenizde tüm CSS, JS ve görseller yanlış domain'e işaret ediyor:
- **Mevcut:** `https://onespace.qudigital.com.tr/...`
- **Olması gereken:** Sitenin bulunduğu domain

## Çözüm Yöntemleri

### Yöntem 1: wp-config.php Düzenleme (ÖNERİLEN)

1. **wp-config.php dosyasını açın**
2. **Şu satırları ekleyin** (en üste, `<?php` satırından sonra):

```php
define('WP_HOME', 'https://DOGRU-DOMAIN.com');
define('WP_SITEURL', 'https://DOGRU-DOMAIN.com');
```

**Örnek:**
```php
<?php
define('WP_HOME', 'https://onespace.com.tr');
define('WP_SITEURL', 'https://onespace.com.tr');

// Diğer WordPress ayarları...
```

### Yöntem 2: Veritabanı Güncelleme

**SQL sorgusu ile URL'leri güncelleyin:**

```sql
-- wp_options tablosunda URL'leri güncelle
UPDATE wp_options
SET option_value = 'https://DOGRU-DOMAIN.com'
WHERE option_name IN ('siteurl', 'home');

-- Tüm içeriklerde eski URL'leri yeni URL ile değiştir
UPDATE wp_posts
SET post_content = REPLACE(post_content,
    'https://onespace.qudigital.com.tr',
    'https://DOGRU-DOMAIN.com');

-- Post meta verilerinde URL güncelle
UPDATE wp_postmeta
SET meta_value = REPLACE(meta_value,
    'https://onespace.qudigital.com.tr',
    'https://DOGRU-DOMAIN.com');

-- Elementor verilerinde URL güncelle
UPDATE wp_postmeta
SET meta_value = REPLACE(meta_value,
    'https:\/\/onespace.qudigital.com.tr',
    'https:\/\/DOGRU-DOMAIN.com')
WHERE meta_key = '_elementor_data';
```

### Yöntem 3: WP-CLI Kullanımı (Terminal Erişimi Varsa)

```bash
# URL'leri güncelle
wp search-replace 'https://onespace.qudigital.com.tr' 'https://DOGRU-DOMAIN.com' --all-tables

# Cache temizle
wp cache flush

# Elementor cache temizle
wp elementor flush-css
```

### Yöntem 4: Plugin Kullanımı

**Better Search Replace** veya **Velvet Blues Update URLs** pluginlerini kullanabilirsiniz.

---

## Adım Adım Çözüm

### 1. wp-config.php Düzenleme

```bash
# Dosyayı düzenle
nano /home/user/tascigurur/wp-config.php
```

**Eklenecek kodlar:**
```php
// Site URL'lerini zorla
define('WP_HOME', 'https://onespace.com.tr');
define('WP_SITEURL', 'https://onespace.com.tr');
```

### 2. .htaccess Kontrolü

**.htaccess dosyanızda redirect olup olmadığını kontrol edin:**

```apache
# Doğru yapılandırma
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
```

### 3. Cache Temizleme

Değişikliklerden sonra mutlaka cache'i temizleyin:

**WordPress Admin Panel:**
1. **WP Rocket** → Clear Cache
2. **Elementor** → Tools → Regenerate CSS
3. **Happy Addons** → Clear Cache

**Manuel:**
```bash
# Cache klasörlerini temizle
rm -rf wp-content/cache/*
rm -rf wp-content/uploads/elementor/css/*
```

### 4. Tarayıcı Cache Temizleme

Tarayıcınızda:
- **Chrome/Edge:** `Ctrl + Shift + Delete`
- **Hard Refresh:** `Ctrl + Shift + R` veya `Ctrl + F5`

---

## Doğrulama

Değişikliklerden sonra kontrol edin:

```bash
# Kaynak kodda URL'leri kontrol et
curl https://SITE-URL.com | grep -o "https://[^\"']*" | sort | uniq
```

Tüm URL'ler doğru domain'e işaret etmeli.

---

## Elementor Özel Kontrol

Elementor kullanıyorsanız ek adımlar:

```bash
# WordPress Admin'e giriş yapın
# Elementor → Tools → Replace URL
# Eski URL: https://onespace.qudigital.com.tr
# Yeni URL: https://DOGRU-DOMAIN.com
```

---

## Güvenlik Önerileri

1. **Değişiklik öncesi yedek alın:**
```bash
# Veritabanı yedeği
mysqldump -u USERNAME -p DATABASE_NAME > backup_$(date +%Y%m%d).sql

# Dosya yedeği
tar -czf backup_files_$(date +%Y%m%d).tar.gz /path/to/wordpress
```

2. **wp-config.php dosyasının yedeğini alın**

3. **Test edin** - Değişikliklerden sonra siteyi test edin

---

## Sık Karşılaşılan Hatalar

### 1. "Too Many Redirects" Hatası
**Çözüm:** wp-config.php'de şunu ekleyin:
```php
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}
```

### 2. Admin Panel'e Giriş Yapamıyorum
**Çözüm:** wp-config.php'deki URL tanımlarını kaldırın, admin'e giriş yapın, Settings → General'den düzeltin.

### 3. Görseller Görünmüyor
**Çözüm:** Veritabanında URL güncelleme yaptıktan sonra:
```bash
wp media regenerate --yes
```

---

## Destek

Sorun devam ederse:
1. Hosting sağlayıcınızla iletişime geçin
2. WordPress destek forumlarına yazın
3. Elementor destek ekibiyle konuşun

---

**NOT:** Bu işlemler sitenizi etkileyebilir. Mutlaka yedek alın!
