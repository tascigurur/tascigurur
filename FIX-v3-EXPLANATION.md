# Workflow v3 - Sorunların Çözümü

## 🐛 SORUNLAR

### Sorun 1: Gereksiz Koordinatör Mesajları
**Belirti:** Müşteri sadece fiyat sorduğunda bile koordinatöre mesaj gidiyordu.

**Kök Neden:** AI prompt'u çok gevşekti. TAG kullanım kuralları belirsizdi.

**Çözüm:** AI prompt'u tamamen yeniden yazıldı. Şimdi TAG'ler SADECE şu durumlarda kullanılıyor:
- Görsel açıkça istendiğinde
- Satış talebi + müşteri onayı
- Teknik destek talebi + müşteri onayı

### Sorun 2: Görseller Gönderilmiyor
**Belirti:** AI "gönderiyorum" diyor ama görseller gitmiyor.

**Kök Neden:** AI Agent'ın output field adı bilinmiyordu. `output`, `text`, veya başka bir field olabiliyordu.

**Çözüm:** "Prepare Data" node'u eklendi. Bu node:
1. AI output'u normalize ediyor (field adı ne olursa olsun)
2. Debug log ekliyor
3. Webhook data'yı da sakl

ıyor
4. Garanti edilen format'ta data gönderiyor

---

## 🔧 YENİ MİMARİ

### Önceki Mimari (v2 - BROKEN)
```
AI Agent → [Format Output → Send Customer]
         → [Switch → Media]
```

**Sorun:** Format Output ve Switch AYNI data object'ini görüyordu. JavaScript'te object'ler reference'dır, Format Output object'i değiştirince Switch de değişmiş halini görüyordu.

### Yeni Mimari (v3 - WORKING)
```
AI Agent → Prepare Data → [Format Message → Send Customer]
                        → [Switch → Media]
```

**Çözüm:** Prepare Data node ortak bir normalize edilmiş data oluşturuyor. Hem Format Message hem Switch bu data'dan okuyorlar.

---

## 📊 YENİ NODE: Prepare Data

```javascript
// AI Agent'tan gelen output'u normalize et
const aiData = $json;
const webhookData = $('Webhook').item.json;

// AI output'u bul (farklı field adları dene)
let aiOutput = aiData.output || aiData.text || aiData.response || JSON.stringify(aiData);

// String'e çevir
if (typeof aiOutput !== 'string') {
  aiOutput = JSON.stringify(aiOutput);
}

// Debug log
console.log('=== AI OUTPUT DEBUG ===');
console.log('AI Output:', aiOutput);
console.log('Contains SEND_PRODUCT_IMAGES:', aiOutput.includes('SEND_PRODUCT_IMAGES'));
console.log('========================');

return {
  json: {
    output: aiOutput,
    webhookData: webhookData
  }
};
```

**Bu node ne yapar?**
1. AI Agent'tan gelen data'nın format'ını kontrol eder
2. Output field'ını bulur (`output`, `text`, `response` gibi)
3. String'e çevirir
4. Debug log ekler (n8n console'da görünür)
5. Standart format'ta data döner

---

## 🎯 YENİ AI PROMPT

### Ana Değişiklikler

#### 1. TAG Kullanım Kuralları Çok Net

**ESKİ (Belirsiz):**
```
Müşteri ürün görseli istediğinde TAG kullan.
```

**YENİ (Net):**
```
TAG'leri SADECE ve SADECE belirtilen durumlarda kullan!
Her mesajda TAG yok!

YANLIŞ KULLANIM:
Müşteri: "Combo Cadillac fiyatı?"
Sen: "62.000 TL + KDV" (TAG YOK!)

DOĞRU KULLANIM:
Müşteri: "Chair fotoğrafları"
Sen: "Chair görsellerini gönderiyorum.

[SEND_PRODUCT_IMAGES:Chair]"
```

#### 2. Satış TAG'i İçin İki Aşamalı Onay

**ESKİ:**
Müşteri satış sorunca direkt TAG gidiyordu.

**YENİ:**
```
Müşteri: "Combo Cadillac 3 adet almak istiyorum"
Sen: "Harika! 3 adet için 186.000 TL + KDV.
     Özel fiyat için koordinatörümüz sizi arasın mı?"

Müşteri: "Evet arasın"
Sen: "Tamamdır, 3 adet Combo Cadillac talebinizi ilettim.

[SEND_TO_SALES_COORDINATOR]

Koordinatörümüz en kısa sürede sizi arayacak."
```

**Önemli:** TAG sadece müşteri "Evet" dedikten SONRA ekleniyor!

#### 3. Örnek Senaryolar Eklendi

Her durum için YANLIŞ ve DOĞRU örnekler var:

**Fiyat Sorusu:**
```
❌ Müşteri: "Combo Cadillac fiyatı?"
❌ Sen: "62.000 TL + KDV [SEND_TO_SALES_COORDINATOR]"

✅ Müşteri: "Combo Cadillac fiyatı?"
✅ Sen: "62.000 TL + KDV" (TAG YOK!)
```

**Görsel İsteği:**
```
✅ Müşteri: "Chair resimleri"
✅ Sen: "Chair görsellerini gönderiyorum.

[SEND_PRODUCT_IMAGES:Chair]"
```

---

## 🔍 DEBUG NASIL YAPILIR?

### 1. n8n Execution Log'u Kontrol Et

1. n8n'de workflow'u çalıştır
2. Sağ panelde "Executions" sekmesine tıkla
3. Son execution'ı aç
4. Her node'a tıkla, input/output data'sını gör

### 2. Prepare Data Node'unu Kontrol Et

Prepare Data node'una tıkla ve şunlara bak:
- `output` field'ı var mı?
- İçinde TAG var mı?
- Console log'da ne yazıyor?

```
=== AI OUTPUT DEBUG ===
AI Output: Chair görsellerini gönderiyorum.\n\n[SEND_PRODUCT_IMAGES:Chair]
Contains SEND_PRODUCT_IMAGES: true
========================
```

### 3. Switch Node'unu Kontrol Et

Switch node'una tıkla ve şunlara bak:
- Hangi dala girdi? (sales, technical, product_images, vs.)
- Input data'da `output` field'ı var mı?
- TAG doğru format'ta mı?

### 4. Evolution API Response'u Kontrol Et

Send Product Images node'una tıkla:
- HTTP response code: 200 mı?
- Error var mı?
- Media URL doğru mu?

---

## 🧪 TEST SENARYOLARI

### Test 1: Fiyat Sorusu (TAG OLMAMALI)
```
Müşteri: "Combo Cadillac fiyatı?"
Beklenen: "62.000 TL + KDV"
Koordinatör Mesajı: YOK ✅
```

### Test 2: Ürün Bilgisi (TAG OLMAMALI)
```
Müşteri: "Combo Cadillac hakkında bilgi"
Beklenen: Ürün açıklaması
Koordinatör Mesajı: YOK ✅
```

### Test 3: Görsel İsteği (TAG OLMALI)
```
Müşteri: "Chair fotoğrafları"
Beklenen:
- "Chair görsellerini gönderiyorum."
- 3 adet Chair fotoğrafı ✅
```

### Test 4: Satış Talebi - Onay Bekliyor (TAG OLMAMALI)
```
Müşteri: "Combo Cadillac 3 adet almak istiyorum"
Beklenen: "186.000 TL + KDV. Koordinatörümüz arasın mı?"
Koordinatör Mesajı: YOK (henüz onay yok) ✅

Müşteri: "Evet arasın"
Beklenen: Koordinatöre mesaj gider ✅
```

### Test 5: Katalog İsteği (TAG OLMALI)
```
Müşteri: "Katalog"
Beklenen:
- "Katalog PDF'ini gönderiyorum."
- PDF dosyası ✅
```

### Test 6: Fiyat Listesi (TAG OLMALI)
```
Müşteri: "Fiyat listesi"
Beklenen:
- "Fiyat listesini gönderiyorum."
- Fiyat listesi görseli ✅
```

---

## 🚨 SIKÇA YAŞANAN SORUNLAR

### Sorun: Görseller hala gönderilmiyor

**Debug Adımları:**

1. **Prepare Data output'unu kontrol et:**
   ```
   {
     "output": "Chair görsellerini gönderiyorum.\n\n[SEND_PRODUCT_IMAGES:Chair]",
     "webhookData": {...}
   }
   ```
   - `output` field'ı var mı? ✅
   - TAG doğru format'ta mı? ✅

2. **Switch hangi dala girdi?**
   - "product_images" dalı çalıştı mı?
   - Başka bir dala gittiyse neden?

3. **Code Product Images çalıştı mı?**
   - Console log'da "Sending X images for Chair" yazıyor mu?
   - Return edilen array'in uzunluğu kaç?

4. **Evolution API çalışıyor mu?**
   - HTTP response 200 mü?
   - Error mesajı var mı?

### Sorun: Koordinatöre gereksiz mesaj gidiyor

**Debug Adımları:**

1. **AI output'u kontrol et:**
   ```
   Müşteri sadece fiyat sormuşsa output'ta
   [SEND_TO_SALES_COORDINATOR] TAG'i OLMAMALI!
   ```

2. **Switch "sales" dalına girdiyse:**
   - AI prompt'u yeniden kontrol et
   - AI model doğru mu? (gpt-4o-mini)
   - Chat memory'de eski konuşma kalmış olabilir mi?

3. **Chat memory'yi temizle:**
   - Postgres'te ilgili session'ı sil
   - Yeni bir telefon numarasıyla test et

---

## 📝 WORKFLOW v2 → v3 FARKLARI

| Özellik | v2 (BROKEN) | v3 (WORKING) |
|---------|-------------|--------------|
| AI Output Normalize | Yok | Prepare Data node ✅ |
| Debug Log | Yok | Console.log ekli ✅ |
| AI Prompt Katılığı | Gevşek | Çok sıkı kurallar ✅ |
| TAG Kullanım Örnekleri | Belirsiz | Hem YANLIŞ hem DOĞRU örnekler ✅ |
| Satış Onayı | Tek adım | İki adımlı onay ✅ |
| Field Adı Garantisi | `$json.output` (risk) | Normalize edilmiş ✅ |
| Webhook Data Erişimi | Karmaşık | Tüm node'larda `$json.webhookData` ✅ |

---

## 🎉 BAŞARILI KURULUM KONTROLLERİ

Workflow'un çalıştığından emin olmak için:

### ✅ Checklist

- [ ] Prepare Data node AI Agent'tan sonra geliyor
- [ ] Format Message ve Switch, Prepare Data'dan paralel çıkıyor
- [ ] Switch condition'ları tam TAG'leri kontrol ediyor (`[SEND_CATALOG]` gibi)
- [ ] Console log'da debug mesajları görünüyor
- [ ] "Chair görselleri" testi çalışıyor
- [ ] "Fiyat listesi" testi çalışıyor
- [ ] "Combo Cadillac fiyatı?" sorusunda koordinatöre mesaj GİTMİYOR
- [ ] "Combo Cadillac 3 adet" + "Evet" ile koordinatöre mesaj GİDİYOR

---

## 💡 PRO İPUÇLARI

### 1. Test İçin Farklı Telefon Kullan
Chat memory session'ları karıştırmasın diye her testte farklı numara kullan.

### 2. n8n Console'u İzle
n8n Docker container'ın console'unu izle:
```bash
docker logs -f n8n-container-name
```

Debug log'lar burada görünür.

### 3. Webhook Test URL Kullan
Production'a geçmeden önce Webhook'un "Test URL"'ini kullan.

### 4. Evolution API Status Kontrol
Evolution API instance'ının çalıştığından emin ol:
```bash
curl https://your-evolution-api.com/instance/status/rotawp
```

---

## 🔮 GELECEK İYİLEŞTİRMELER

- [ ] Retry mekanizması (medya gönderimi başarısız olursa)
- [ ] Rate limiting (spam koruması)
- [ ] Analytics (kaç görsel gönderildi, kaç satış talebi)
- [ ] A/B testing (farklı AI prompt'ları)
- [ ] Multi-language support

---

Bu workflow artık **GEREKTİĞİNDE** çalışıyor! 🎉
