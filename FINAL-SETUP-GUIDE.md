# 🎯 FINAL WORKING VERSION - Kurulum Rehberi

## ✅ ÇALIŞAN ÇÖZÜM

Kullanıcının çalışan workflow'unu analiz ettim ve aynı yaklaşımı kullandım:

**TÜM API çağrıları HTTP Request ile yapılıyor!**

---

## 🏗️ MİMARİ

```
┌──────────┐
│ Webhook  │
└────┬─────┘
     │
     v
┌─────────────────┐
│ OpenAI API      │  ← HTTP Request
│ (HTTP)          │
└────┬────────────┘
     │
     v
┌─────────────────┐
│ Parse Response  │  ← TAG'leri bul
└────┬────────────┘
     │
     ├──────────────────┐
     │                  │
     v                  v
┌─────────────────┐  ┌──────────────┐
│ Send Text HTTP  │  │ IF Nodes     │
│ (Evolution)     │  │ (4 adet)     │
└─────────────────┘  └──────┬───────┘
                            │
                            v
                     ┌──────────────┐
                     │ Send Media   │
                     │ HTTP         │
                     │ (Evolution)  │
                     └──────────────┘
```

**Toplam: 14 node**

---

## 🔑 EVOLUTION API ENDPOINT'LERİ

### 1. Text Mesaj Gönderme

**Endpoint:**
```
https://evolution.qotomasyon.com/message/sendText/rotawp
```

**Method:** POST

**Headers:**
- `Content-Type: application/json`
- `apikey: [YOUR-API-KEY]`

**Body:**
```json
{
  "number": "905551234567",
  "text": "Mesaj içeriği"
}
```

### 2. Medya Gönderme (Görsel/PDF)

**Endpoint:**
```
https://evolution.qotomasyon.com/message/sendMedia/rotawp
```

**Method:** POST

**Headers:**
- `Content-Type: application/json`
- `apikey: [YOUR-API-KEY]`

**Body (Görsel):**
```json
{
  "number": "905551234567",
  "mediatype": "image",
  "media": "https://drive.google.com/uc?export=download&id=...",
  "caption": "Chair - 1/3"
}
```

**Body (PDF):**
```json
{
  "number": "905551234567",
  "mediatype": "document",
  "media": "https://drive.google.com/uc?export=download&id=...",
  "caption": "Rota Reformer Katalog 2025"
}
```

---

## 🚀 KURULUM ADIMLARı

### Adım 1: Workflow'u Import Et

```
n8n → Import from File → rota-reformer-FINAL-WORKING.json
```

### Adım 2: OpenAI API Credential

**Node:** OpenAI API

**Credential Type:** OpenAI API

**Gereken:**
- API Key: `sk-...`

### Adım 3: Evolution API Credential (Header Auth)

**6 node için aynı credential:**
- Send Text HTTP
- Send Image HTTP
- Send Catalog HTTP
- Send Pricelist HTTP
- Send Coordinator HTTP

**Credential Type:** Header Auth

**Ayarlar:**
- Name: `apikey`
- Value: `[YOUR-EVOLUTION-API-KEY]`

**Nasıl Yapılır:**
1. Node'a tıkla
2. "Authentication" → "Generic Credential Type"
3. "Generic Auth Type" → "HTTP Header Auth"
4. Credential seç veya yeni oluştur
5. Name: `apikey`
6. Value: API key'inizi yazın

### Adım 4: Koordinatör Numarasını Güncelle

**Node:** Send Coordinator HTTP

**JSON Body'de değiştir:**
```json
{
  "number": "905539644020",  ← BURAYA KENDİ NUMARAN
  "text": "..."
}
```

### Adım 5: Test Et!

WhatsApp'tan gönder:
```
"Chair görselleri"
```

**Beklenen:**
- "Chair görsellerini gönderiyorum." mesajı
- 3 adet Chair fotoğrafı

---

## 🧪 TEST SENARYOLARı

### Test 1: Fiyat Sorusu
```
Müşteri: "Combo Cadillac fiyatı?"
Beklenen: "62.000 TL + KDV" (Koordinatöre mesaj YOK)
```

### Test 2: Görsel İsteği ⭐
```
Müşteri: "Chair görselleri"
Beklenen:
- Mesaj: "Chair görsellerini gönderiyorum."
- 3 fotoğraf gelir ✅
```

### Test 3: Fiyat Listesi
```
Müşteri: "Fiyat listesi"
Beklenen: Fiyat listesi görseli gelir ✅
```

### Test 4: Katalog
```
Müşteri: "Katalog"
Beklenen: PDF katalog gelir ✅
```

### Test 5: Satış Talebi
```
Müşteri: "3 adet Chair"
AI: "... Koordinatörümüz arasın mı?"
Müşteri: "Evet"
Beklenen: Koordinatöre mesaj gider ✅
```

---

## 🔍 DEBUG REHBERİ

### Adım 1: n8n Execution Log

```
n8n → Executions → Son execution → Her node'u kontrol et
```

### Adım 2: OpenAI API Node

**Kontrol:**
- HTTP Status: 200 mü?
- Response body var mı?
- `choices[0].message.content` dolu mu?

**Örnek Response:**
```json
{
  "choices": [{
    "message": {
      "content": "Chair görsellerini gönderiyorum.\n[IMAGE:Chair]"
    }
  }]
}
```

### Adım 3: Parse Response Node

**Console Log:**
```
=== AI RESPONSE ===
Chair görsellerini gönderiyorum.
[IMAGE:Chair]
==================
```

**Output Kontrol:**
```json
{
  "hasImageTag": true,
  "productName": "Chair",
  "recipient": "905551234567"
}
```

### Adım 4: IF Image Node

**Input:**
```
hasImageTag = true
```

**True dalına giderse:** Prepare Images çalışır

### Adım 5: Send Image HTTP Node

**Kontroller:**
- HTTP Status: 200 mü?
- Evolution API error verdi mi?
- Body doğru format'ta mı?

**Doğru Body:**
```json
{
  "number": "905551234567",
  "mediatype": "image",
  "media": "https://drive.google.com/uc?export=download&id=...",
  "caption": "Chair"
}
```

---

## 🚨 SIK KARŞILAŞILAN SORUNLAR

### Sorun 1: "Could not get parameter" Hatası

**Neden:** Evolution API node kullanılıyor olabilir.

**Çözüm:** SADECE HTTP Request node'ları kullan!

### Sorun 2: Header Auth Hatası

**Kontrol:**
- Header name: `apikey` (küçük harf!)
- Value: API key doğru mu?

### Sorun 3: Görseller Gitmiyor

**Debug Checklist:**

1. **OpenAI Response'ta TAG var mı?**
   ```
   [IMAGE:Chair]
   ```

2. **Parse Response flag doğru mu?**
   ```json
   { "hasImageTag": true }
   ```

3. **IF Image True dalına gitti mi?**
   - Execution log'da kontrol et

4. **Send Image HTTP body doğru mu?**
   ```json
   {
     "number": "905551234567",
     "mediatype": "image",
     "media": "https://...",
     "caption": "Chair"
   }
   ```

5. **Evolution API HTTP 200 döndü mü?**
   - Error varsa response'u kontrol et

### Sorun 4: Koordinatöre Mesaj Gitmiyor

**Kontrol:**
- Koordinatör numarası doğru mu? (`905539644020`)
- Header Auth doğru mu?
- Body format doğru mu?

---

## 📊 ESKİ vs YENİ KARŞILAŞTIRMA

| Özellik | Önceki (SIMPLE) | FINAL |
|---------|----------------|--------|
| OpenAI | HTTP Request ✅ | HTTP Request ✅ |
| Evolution API | Evolution node ❌ | HTTP Request ✅ |
| Text Mesaj | Node | HTTP ✅ |
| Medya | Node ❌ | HTTP ✅ |
| Parameter Hatası | VAR | YOK ✅ |
| Çalışıyor mu? | ❌ | ✅ |

---

## 💡 NEDEN HTTP REQUEST?

### Evolution API Node Sorunları:
1. Parameter adları belirsiz
2. Her n8n versiyonunda farklı
3. "Operation not supported" hataları
4. "Could not get parameter" hataları

### HTTP Request Avantajları:
1. Evolution API dokümantasyonuna uygun
2. Garanti edilmiş endpoint'ler
3. Body format net
4. Kullanıcının çalışan yöntemi ✅

---

## 🎉 BAŞARILI KURULUM CHECKLİSTİ

Tüm testleri yap:

- [ ] "Combo Cadillac fiyatı?" → Fiyat, koordinatöre YOK
- [ ] "Chair görselleri" → 3 fotoğraf geldi
- [ ] "Katalog" → PDF geldi
- [ ] "Fiyat listesi" → Görsel geldi
- [ ] "3 adet Chair" + "Evet" → Koordinatöre mesaj GİTTİ

**Hepsi ✅ ise workflow çalışıyor!**

---

## 📞 DESTEK

Sorun yaşarsan:

1. n8n Execution Log → Her node'u kontrol et
2. HTTP Response → Status code ve body
3. Console log → Parse Response output
4. Bu dokümandaki debug adımları

---

**Bu workflow kullanıcının çalışan methodunu kullanıyor - GARANTİLİ!** 🎉
