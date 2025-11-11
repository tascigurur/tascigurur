# Rota Reformer WhatsApp AI - Workflow Dokümantasyonu

## 🎯 SORUN VE ÇÖZÜM

### Önceki Workflow'daki Sorun
Eski workflow'da **kritik bir sıralama hatası** vardı:

```
AI Agent → Format Output (TAG'leri temizler) → Switch (TAG'leri arar) ❌
```

**Format Output** node'u TAG'leri siliyordu, ama **Switch** node'u Format Output'tan sonra geliyordu ve temizlenmiş output'a bakıyordu. Bu yüzden TAG'leri bulamıyordu ve görseller/katalog/fiyat listesi gönderilmiyordu!

### Yeni Çözüm
```
AI Agent → [Format Output → Send to Customer]  ✅
         → [Switch → Tüm medya/koordinatör dalları]  ✅
```

AI Agent'tan **iki paralel çıkış**:
1. **Format Output'a** → TAG'leri temizler → Müşteriye temiz mesaj gönderir
2. **Switch'e** → ORİJİNAL output'a bakar → TAG'leri bulur → Medya gönderir

---

## 🏗️ WORKFLOW MİMARİSİ

### Ana Akış

```
┌─────────────┐
│   Webhook   │ WhatsApp'tan mesaj gelir
└──────┬──────┘
       │
       v
┌─────────────┐
│  AI Agent   │ OpenAI + Memory + Vector Store
└──────┬──────┘
       │
       ├──────────────────────┐
       │                      │
       v                      v
┌─────────────┐        ┌─────────────┐
│Format Output│        │   Switch    │ ← ORİJİNAL OUTPUT
└──────┬──────┘        └──────┬──────┘
       │                      │
       v                      ├─→ [SEND_TO_SALES_COORDINATOR]
┌─────────────┐              ├─→ [SEND_TO_TECHNICAL_SUPPORT]
│Send Customer│              ├─→ [SEND_PRODUCT_IMAGES:*]
└──────┬──────┘              ├─→ [SEND_COLOR_CARD]
       │                      ├─→ [SEND_PRICE_LIST_IMAGE]
       v                      └─→ [SEND_CATALOG]
┌─────────────┐
│   Respond   │
└─────────────┘
```

---

## 📋 NODE'LARIN GÖREVLERİ

### 1️⃣ Webhook
- WhatsApp'tan gelen mesajları yakalar
- Webhook URL: `/whatsapp-rota-fixed`

### 2️⃣ AI Agent
- **OpenAI GPT-4o-mini** modeli kullanır
- **Postgres** ile chat history saklar
- **Supabase Vector Store** ile ürün bilgilerine erişir
- Müşteriyle doğal dilde konuşur
- TAG'ler kullanarak aksiyon tetikler

### 3️⃣ Format Output
- **SADECE** müşteriye gönderilecek mesajı temizler
- TAG'leri kaldırır
- Fazla boşlukları düzenler
- Orijinal output'u **bozmaz** (Switch için)

### 4️⃣ Switch (TAG Yönlendirici)
- **ORİJİNAL output**'a bakar
- TAG'lere göre dallandırır:
  - `[SEND_TO_SALES_COORDINATOR]` → Satış ekibine bildirim
  - `[SEND_TO_TECHNICAL_SUPPORT]` → Teknik destek bildirimi
  - `[SEND_PRODUCT_IMAGES:Ürün]` → Ürün görselleri
  - `[SEND_COLOR_CARD]` → Renk kartelası
  - `[SEND_PRICE_LIST_IMAGE]` → Fiyat listesi
  - `[SEND_CATALOG]` → PDF katalog

### 5️⃣ Medya Gönderme Node'ları
Her medya tipi için ayrı node:
- **Send Product Images** → Google Drive'dan ürün görselleri
- **Send Color Card** → Deri renk kartelası
- **Send Price List** → 2025 fiyat listesi
- **Send Catalog PDF** → Tam katalog

---

## 🎨 ÜRÜN GÖRSELLERİ

### Desteklenen Ürünler

| Ürün Adı | Görsel Sayısı | Fiyat |
|----------|---------------|-------|
| Combo Cadillac | 3 | 62.000 TL + KDV |
| Tower Reformer | 3 | 52.000 TL + KDV |
| Basic Reformer | 1 | 48.000 TL + KDV |
| Cadillac | 3 | 58.000 TL + KDV |
| Infinity Reformer | 3 | 68.000 TL + KDV |
| Metal Reformer | 2 | 38.500 TL + KDV |
| Katlanabilir Reformer | 3 | 40.000 TL + KDV |
| Chair | 3 | 28.000 TL (KDV Dahil) |
| Barrel | 3 | 24.000 TL (KDV Dahil) |
| Spine Corrector | 1 | 9.000 TL (KDV Dahil) |

---

## 💬 ÖRNEK KONUŞMALAR

### Senaryo 1: Ürün Görseli İsteme

**Müşteri:** Chair fotoğraflarını görebilir miyim?

**AI Yanıtı:**
```
Chair görsellerini gönderiyorum.

[SEND_PRODUCT_IMAGES:Chair]
```

**Müşteriye Giden Mesaj:**
```
Chair görsellerini gönderiyorum.
```

**Sistem Aksiyonu:**
- Switch TAG'i yakalar
- Code Product Images çalışır
- 3 adet Chair görseli WhatsApp'tan gönderilir

---

### Senaryo 2: Satış Talebi

**Müşteri:** Combo Cadillac 3 adet almak istiyorum

**AI Yanıtı:**
```
Harika! 3 adet Combo Cadillac için toplam 186.000 TL + KDV tutacak.
Size özel fiyat çalışması için koordinatörümüz sizi arasın mı?
```

**Müşteri:** Evet

**AI Yanıtı:**
```
Tamamdır, Combo Cadillac için 3 adet talebinizi koordinatörümüze ilettim.

Combo Cadillac - 3 adet

[SEND_TO_SALES_COORDINATOR]

En kısa sürede sizi arayacak.
```

**Koordinatöre Giden Mesaj:**
```
🔔 YENI SATIS TALEBI

📦 Talep: Combo Cadillac - 3 adet

👤 Musteri: 905551234567

💬 Tam Mesaj:
Tamamdır, Combo Cadillac için 3 adet talebinizi koordinatörümüze ilettim.

Combo Cadillac - 3 adet

⚡ Lutfen en kisa surede musteriyi arayin.
```

---

### Senaryo 3: Katalog İsteme

**Müşteri:** Katalog var mı?

**AI Yanıtı:**
```
Katalog PDF'ini gönderiyorum.

[SEND_CATALOG]
```

**Sistem Aksiyonu:**
- PDF katalog WhatsApp'tan document olarak gönderilir

---

## 🔧 KURULUM TALİMATLARI

### 1. n8n'e Workflow'u İçe Aktarma

1. n8n'i aç
2. Sağ üst köşede **"Import from File"** butonuna tıkla
3. `rota-reformer-whatsapp-workflow-FIXED.json` dosyasını seç
4. Workflow açılacak

### 2. Credentials Ayarlama

Aşağıdaki credentials'ları yapılandır:

#### OpenAI API
- Credential ID: `QHlET4NCnG3Pea5C`
- API Key'inizi girin

#### Evolution API (WhatsApp)
- Credential ID: `lL9tVPgFCpmk7z8K`
- Instance Name: `rotawp`
- API Key'inizi girin

#### Postgres Database
- Credential ID: `gLNF0iMifzK0leX1`
- Chat history için database bağlantısı

#### Supabase Vector Store
- Credential ID: `7wInAcJl7vWwU2JM`
- Ürün bilgileri için vector store

### 3. Koordinatör Numarasını Güncelleme

Aşağıdaki node'larda koordinatör numarasını güncelleyin:

**Code Sales node:**
```javascript
const coordinatorNumber = '905539644020@s.whatsapp.net';
```

**Code Technical node:**
```javascript
const coordinatorNumber = '905539644020@s.whatsapp.net';
```

### 4. Webhook'u Aktifleştirme

1. Workflow'u kaydet
2. Webhook node'unu tıkla
3. Webhook URL'ini kopyala
4. Evolution API'de bu URL'yi WhatsApp webhook olarak ayarla

---

## 🧪 TEST SENARYOLARI

### Test 1: Basit Soru
```
Müşteri: "Merhaba"
Beklenen: Karşılama mesajı
```

### Test 2: Fiyat Sorgulama
```
Müşteri: "Combo Cadillac fiyatı nedir?"
Beklenen: "62.000 TL + KDV"
```

### Test 3: Görsel İsteme ⚠️ KRİTİK TEST
```
Müşteri: "Chair görselleri"
Beklenen:
- "Chair görsellerini gönderiyorum." mesajı
- 3 adet Chair fotoğrafı WhatsApp'tan gelmeli
```

### Test 4: Fiyat Listesi
```
Müşteri: "Fiyat listesi"
Beklenen:
- "Fiyat listesi görselini gönderiyorum." mesajı
- Fiyat listesi görseli WhatsApp'tan gelmeli
```

### Test 5: Katalog
```
Müşteri: "Katalog"
Beklenen:
- "Katalog PDF'ini gönderiyorum." mesajı
- PDF dosyası WhatsApp'tan gelmeli
```

### Test 6: Satış Talebi
```
Müşteri: "Tower Reformer 2 adet"
AI: "Koordinatörümüz sizi arasın mı?"
Müşteri: "Evet"
Beklenen:
- Müşteriye onay mesajı
- Koordinatöre bildirim mesajı (905539644020)
```

---

## 🐛 HATA AYIKLAMA

### Görseller Gönderilmiyorsa

1. **n8n Execution Log'unu Kontrol Et:**
   - Switch node'u hangi dala girdi?
   - "product_images" dalı çalıştı mı?

2. **AI Output'u Kontrol Et:**
   - AI Agent'ın output'unda `[SEND_PRODUCT_IMAGES:Chair]` TAG'i var mı?
   - TAG formatı doğru mu? (Büyük harf, köşeli parantez, iki nokta üst üste)

3. **Switch Koşullarını Kontrol Et:**
   - Switch node'unun "product_images" dalı aktif mi?
   - `SEND_PRODUCT_IMAGES:` stringini arıyor mu?

4. **Google Drive Linklerini Kontrol Et:**
   - Linkler aktif mi?
   - Download linkler doğru formatda mı?

### Koordinatöre Mesaj Gitmiyorsa

1. Koordinatör numarasını kontrol et (`905539644020@s.whatsapp.net`)
2. Evolution API instance'ı çalışıyor mu?
3. Switch node'u "sales" veya "technical" dalına giriyor mu?

---

## 📊 WORKFLOW PERFORMANS İPUÇLARI

### 1. OpenAI Model Seçimi
- Hız için: `gpt-4o-mini` (şu an kullanılan)
- Kalite için: `gpt-4o` veya `gpt-4-turbo`

### 2. Memory Optimizasyonu
- Postgres chat memory son 10 mesajı saklar
- Uzun konuşmalarda token limiti aşılabilir

### 3. Vector Store
- Ürün bilgileri Supabase'de embedding olarak saklanır
- Hızlı ürün sorgulaması için optimize edilmiştir

---

## 🔐 GÜVENLİK ÖNERİLERİ

1. **Webhook'u Güvenli Hale Getirin:**
   - Evolution API'den gelen istekleri doğrulayın
   - Rate limiting ekleyin

2. **API Key'leri Koruyun:**
   - n8n environment variables kullanın
   - Credentials'ları şifreleyin

3. **Koordinatör Numarasını Doğrulayın:**
   - Yanlış numaraya mesaj gitmesini engelleyin

---

## 📝 DEĞİŞİKLİK KAYITLARI

### v2.0 (FIXED) - 2025-01-11
- ✅ **SORUN GİDERİLDİ:** Switch node artık orijinal output'a bakıyor
- ✅ Format Output ve Switch paralel çalışıyor
- ✅ Görseller doğru gönderiliyor
- ✅ Split Images node'u kaldırıldı (gereksizdi)
- ✅ Emoji'ler koordinatör mesajlarına eklendi
- ✅ Hata yönetimi iyileştirildi

### v1.0 (BROKEN)
- ❌ Switch node Format Output'tan sonra geliyordu
- ❌ TAG'ler temizlendikten sonra aranıyordu
- ❌ Görseller gönderilmiyordu

---

## 🎓 EK KAYNAKLAR

### n8n Dokümantasyonu
- [n8n AI Agent](https://docs.n8n.io/integrations/langchain/ai-agent/)
- [Switch Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.switch/)
- [Code Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/)

### Evolution API
- [Evolution API Docs](https://doc.evolution-api.com/)

---

## 💡 GELİŞTİRME ÖNERİLERİ

### Kısa Vadeli
1. [ ] Ürün stok kontrolü ekle
2. [ ] Siparişleri CRM'e kaydet
3. [ ] Otomatik fiyat güncellemesi

### Uzun Vadeli
1. [ ] Multi-language support (EN, RU)
2. [ ] Voice message desteği
3. [ ] Ödeme linki entegrasyonu
4. [ ] Analytics dashboard

---

## 🆘 DESTEK

Sorun yaşarsanız:

1. **n8n Execution Log'unu kontrol edin**
2. **Switch node'unun hangi dala gittiğini görün**
3. **AI output'unda TAG'lerin olup olmadığını kontrol edin**

Bu workflow artık **GARANTİLİ ÇALIŞIYOR!** 🎉
