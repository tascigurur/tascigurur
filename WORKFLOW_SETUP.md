# Rota Reformer WhatsApp AI Bot - n8n Workflow Setup

WhatsApp üzerinden otomatik satış ve müşteri desteği sağlayan AI powered chatbot.

## 🔧 Düzeltilen Sorunlar (v2)

### Ana Sorun
**Ürün görselleri gönderilmiyordu** ama katalog/fiyat listesi çalışıyordu.

### Kök Neden
1. **Switch node yanlış yerden veri alıyordu** → Evolution API response'undan TAG okumaya çalışıyordu
2. **HTTP Request node'ları credential hatası**
3. **AI prompt yeterince açık değildi**

### Çözümler
✅ Format Output → hem "Send to Customer" hem de "Switch"e paralel bağlantı
✅ Switch node artık `output` field'ından TAG'leri okuyor
✅ HTTP Request credential tipi düzeltildi (httpHeaderAuth)
✅ AI prompt iyileştirildi - ürün isimleri net belirtildi

## 📥 Kurulum

### 1. Workflow'u İçe Aktar
```bash
# n8n-workflow-fixed-v2.json dosyasını n8n'e import et
```

### 2. Credential'ları Ayarla

#### Evolution API Credential
- Type: `Evolution API`
- Kullanılan node'lar: Send to Customer, Send Coordinator Sales, Send Coordinator Technical

#### HTTP Header Auth Credential (KRİTİK!)
**ÖNEMLİ:** HTTP Request node'ları için ayrı bir credential oluşturmalısınız:

1. n8n'de **Credentials** menüsüne git
2. **Create New Credential** → **HTTP Header Auth**
3. Ayarlar:
   ```
   Name: Evolution API Header Auth
   Header Name: apikey
   Header Value: [Evolution API Key'iniz]
   ```
4. **HTTP Send Images, HTTP Send Color Card, HTTP Send Price List, HTTP Send Catalog** node'larına bu credential'ı ata

#### OpenAI API Credential
- Type: `OpenAI API`
- API Key: OpenAI hesabından alınacak

#### Postgres Credential
- Type: `Postgres`
- Chat memory için

#### Supabase Credential
- Type: `Supabase`
- Vector store için

## 🎯 Workflow Akışı

```
Webhook → AI Agent → Format Output → [Send to Customer + Switch]
                                      │
                                      ├─ Sales → Coordinator
                                      ├─ Technical → Coordinator
                                      ├─ Product Images → HTTP Send
                                      ├─ Color Card → HTTP Send
                                      ├─ Price List → HTTP Send
                                      └─ Catalog → HTTP Send
```

### Kritik Değişiklik
**ÖNCE (Yanlış):**
```
Format Output → Send to Customer → Switch ❌
```

**ŞIMDI (Doğru):**
```
Format Output → [Send to Customer, Switch] ✅
              (paralel bağlantı)
```

## 🏷️ TAG Sistemi

AI Agent mesajlarına TAG ekler, Switch bunları yakalar:

### Satış Talebi
```
Combo Cadillac - 3 adet

[SEND_TO_SALES_COORDINATOR]
```

### Teknik Destek
```
Combo Cadillac - Yaylar çalışmıyor

[SEND_TO_TECHNICAL_SUPPORT]
```

### Ürün Görselleri (Düzeltildi!)
```
Combo Cadillac görsellerini gönderiyorum.

[SEND_PRODUCT_IMAGES:Combo Cadillac]
```

**Desteklenen Ürünler:**
- Combo Cadillac
- Tower Reformer
- Basic Reformer
- Cadillac
- Infinity Reformer
- Metal Reformer
- Katlanabilir Reformer
- Chair
- Barrel
- Spine Corrector

### Diğer TAG'ler
```
[SEND_CATALOG]
[SEND_PRICE_LIST_IMAGE]
[SEND_COLOR_CARD]
```

## 🐛 Debug - Ürün Görselleri Gelmiyorsa

### Adım 1: n8n Execution Log'unu Kontrol Et
1. Workflow çalıştır
2. **Executions** sekmesine git
3. Son execution'a tıkla
4. Her node'un output'una bak

### Adım 2: Format Output Node
- `output` field'ına bak
- TAG var mı: `[SEND_PRODUCT_IMAGES:Combo Cadillac]`
- Ürün adı doğru yazılmış mı? (Büyük harfle başlamalı)

**Örnek output:**
```json
{
  "output": "Combo Cadillac görsellerini gönderiyorum.\n\n[SEND_PRODUCT_IMAGES:Combo Cadillac]",
  "formatted_output": "Combo Cadillac görsellerini gönderiyorum.",
  "recipient": "905551234567@s.whatsapp.net",
  "recipientNumber": "905551234567"
}
```

### Adım 3: Switch Node
- Hangi output'a gitti?
- `product_images` output'una gitmesi gerekiyor
- Eğer gitmediyse → TAG format yanlış veya Switch expression'ı hatalı

### Adım 4: HTTP Send Images Node
- **Credential doğru atandı mı?**
  - HTTP Header Auth credential'ı olmalı
  - Evolution API credential'ı YANLIŞ!
- Request başarılı mı?
- HTTP 200 response geldi mi?

### Adım 5: Google Drive Linkleri
- Linkler public mı?
- Format: `https://drive.google.com/uc?export=download&id=...`
- Browser'dan direkt açılıyor mu?

## 🧪 Test Mesajları

### ✅ Çalışması Gereken
```
"Combo Cadillac fotoğrafları"
"Tower Reformer görselleri"
"Chair resimleri"
"fiyat listesi"
"katalog"
"renk kartelası"
```

### Beklenen AI Yanıtı
```
Müşteri: "Combo Cadillac fotoğrafları"

AI: "Combo Cadillac görsellerini gönderiyorum.

[SEND_PRODUCT_IMAGES:Combo Cadillac]"
```

## 📊 AI Prompt İyileştirmeleri (v2)

### Eklenen Bölümler

1. **Ürün İsimleri Net Belirtildi**
   ```
   DİKKAT: Ürün adını TAG içinde TAM OLARAK şu şekilde yaz:
   - Combo Cadillac
   - Tower Reformer
   ...
   ```

2. **Format Kuralları Açıklandı**
   ```
   ✅ DOĞRU: "Combo Cadillac görsellerini gönderiyorum.\n\n[SEND_PRODUCT_IMAGES:Combo Cadillac]"
   ❌ YANLIŞ: "[SEND_PRODUCT_IMAGES:combo cadillac]"
   ❌ YANLIŞ: "Gönderiyorum [SEND_PRODUCT_IMAGES:Combo Cadillac]" (yeni satır yok)
   ```

3. **Yeni Satır Kuralı**
   ```
   TAG'den ÖNCE MUTLAKA YENİ SATIR (\n\n) ekle!
   ```

## 🎨 Ürün Görselleri Güncelleme

Görselleri değiştirmek için **Code Product Images** node'unu düzenle:

```javascript
const productImages = {
  'Combo Cadillac': [
    'https://drive.google.com/uc?export=download&id=YOUR_ID_1',
    'https://drive.google.com/uc?export=download&id=YOUR_ID_2'
  ],
  'Tower Reformer': [
    'https://drive.google.com/uc?export=download&id=YOUR_ID_3'
  ]
  // ...
};
```

### Google Drive Link Nasıl Alınır

1. Google Drive'da dosyayı sağ tıkla → **Get Link**
2. **Anyone with the link** seç → **Copy link**
3. Link şu formatta olacak:
   `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
4. FILE_ID'yi çıkar ve şu formatta kullan:
   `https://drive.google.com/uc?export=download&id=FILE_ID`

## ⚙️ Yapılandırma

### Koordinatör Numarası
**Code Sales** ve **Code Technical** node'larında:
```javascript
const coordinatorNumber = '905539644020@s.whatsapp.net';
```

### Evolution API Instance
Tüm Evolution API node'larında:
```javascript
instanceName: "rotawp"
```

Eğer instance adın farklıysa (örn: "myinstance"), tüm node'larda değiştir.

### Webhook Path
```
POST /whatsapp-rota-complete-working
```

Tam URL: `https://your-n8n-domain.com/webhook/whatsapp-rota-complete-working`

## 🚀 Kullanıma Başlama Checklist

- [ ] `n8n-workflow-fixed-v2.json` import edildi
- [ ] Evolution API credential eklendi (Send to Customer için)
- [ ] HTTP Header Auth credential eklendi (HTTP Request node'ları için) **← KRİTİK!**
- [ ] OpenAI API credential eklendi
- [ ] Postgres credential eklendi
- [ ] Supabase credential eklendi
- [ ] Tüm HTTP node'lara HTTP Header Auth credential atandı
- [ ] Koordinatör numarası güncellendi
- [ ] Evolution instance adı doğru
- [ ] Workflow aktif edildi
- [ ] Test mesajları gönderildi:
  - [ ] "katalog" → PDF geldi
  - [ ] "fiyat listesi" → Görsel geldi
  - [ ] "Combo Cadillac görselleri" → Fotoğraflar geldi

## 🆘 En Sık Karşılaşılan Hatalar

### 1. Ürün Görselleri Gelmiyor
**Semptom:** AI "gönderiyorum" diyor ama görsel gelmiyor

**Çözüm:**
- HTTP Request node'larına HTTP Header Auth credential ekle
- Evolution API credential değil, HTTP Header Auth olmalı!

### 2. TAG Yakalanmıyor
**Semptom:** Switch node hiçbir output'a gitmiyor

**Çözüm:**
- Format Output → Switch bağlantısını kontrol et
- Switch expression'ında `$json.output` kullanılıyor mu kontrol et

### 3. AI Yanlış TAG Üretiyor
**Semptom:** TAG format yanlış, örn: `[SEND_PRODUCT_IMAGES:combo cadillac]`

**Çözüm:**
- AI Agent prompt'unu kontrol et
- v2 workflow kullandığından emin ol (ürün isimleri eklenmiş)

### 4. Google Drive Linki Çalışmıyor
**Semptom:** HTTP request başarısız, 404 hatası

**Çözüm:**
- Link public mı kontrol et
- Format: `uc?export=download&id=...` olmalı
- Browser'dan manuel test et

## 📝 Versiyon Geçmişi

### v2 (2025-01-11) - Mevcut
- 🔧 Ürün görselleri sorunu çözüldü
- 🔧 HTTP credential hatası düzeltildi
- 🔧 AI prompt iyileştirildi
- 📝 Format Output → Switch paralel bağlantı
- 📚 Detaylı setup dokümantasyonu

### v1 (2025-01-10)
- 🎉 İlk versiyon
- ✅ Satış/teknik destek çalışıyor
- ✅ Katalog/fiyat listesi çalışıyor
- ❌ Ürün görselleri çalışmıyor

## 📞 İletişim

Sorun yaşıyorsanız:
1. Bu dokümandaki debug adımlarını takip edin
2. n8n execution log'larını kontrol edin
3. HTTP Header Auth credential'ın doğru ayarlandığından emin olun

---

**Hazırlayan:** Claude AI
**Tarih:** 2025-01-11
**Versiyon:** 2.0
**Dosyalar:**
- `n8n-workflow-fixed-v2.json` - Ana workflow
- `WORKFLOW_SETUP.md` - Bu dosya
