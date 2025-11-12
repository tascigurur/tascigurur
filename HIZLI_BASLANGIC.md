# 🚀 Hızlı Başlangıç Rehberi

## ⏱️ 5 Dakikada Düzeltme Uygulama

### Adım 1: n8n'e Giriş Yap
1. n8n dashboard'a git
2. "Rota Reformer WhatsApp - v4" workflow'unu aç

### Adım 2: Build Messages Node'unu Güncelle
1. **"Build Messages"** node'una çift tıkla
2. Mevcut JavaScript kodunun **tamamını sil**
3. Aşağıdaki yeni kodu yapıştır:

**📋 Kopyalanacak Kod:** `build-messages-improved.js` dosyasındaki kodun tamamı

veya alternatif olarak:

4. **Import** seçeneği varsa: `workflow-improved.json` dosyasını import et

### Adım 3: Load Chat History'yi Optimize Et
1. **"Load Chat History"** node'una çift tıkla
2. SQL query'yi değiştir:

**ESKI:**
```sql
SELECT role, content FROM chat_history
WHERE session_id = '{{ $json.body.data.key.remoteJid }}'
ORDER BY created_at ASC LIMIT 20
```

**YENİ:**
```sql
SELECT role, content FROM chat_history
WHERE session_id = '{{ $json.body.data.key.remoteJid }}'
ORDER BY created_at DESC LIMIT 10
```

**Değişiklikler:**
- `ASC` → `DESC` (en yeni mesajlar önce)
- `LIMIT 20` → `LIMIT 10` (token tasarrufu)

### Adım 4: OpenAI API Node'unu Optimize Et
1. **"OpenAI API"** node'una çift tıkla
2. JSON body'de `max_tokens` ekle:

**ESKI:**
```json
{
  "model": "gpt-4o-mini",
  "messages": $('Build Messages').first().json.messages,
  "temperature": 0.7
}
```

**YENİ:**
```json
{
  "model": "gpt-4o-mini",
  "messages": $('Build Messages').first().json.messages,
  "temperature": 0.7,
  "max_tokens": 500
}
```

### Adım 5: Kaydet ve Test Et
1. **Save** butonuna tıkla
2. Workflow'u **Activate** et
3. Test mesajı gönder

---

## 🧪 Test Senaryoları

### Test 1: Fiyat Sonrası Quote Reply ✅

**Adımlar:**
1. WhatsApp'tan test numarana şunu yaz:
   ```
   3 combo cadillac 2 tower 1 barrel ne kadar?
   ```

2. AI şöyle yanıt vermeli:
   ```
   3 adet Combo Cadillac (186.000 TL + KDV), 2 adet Tower Reformer (104.000 TL + KDV) ve 1 adet Barrel (24.000 TL + KDV) için toplam 314.000 TL + KDV.

   Koordinatörümüz size özel indirimli fiyat konuşsun mu?
   ```

3. Araya başka bir mesaj gönder:
   ```
   katalog var mı?
   ```

4. AI katalog gönderecek.

5. **ÖNEMLİ:** Şimdi FİYAT mesajını **QUOTE/REPLY** edip şunu yaz:
   ```
   evet arayabilir
   ```

6. **Beklenen yanıt:**
   ```
   Harika! Talebinizi koordinatörüme ilettim.

   [SALES]

   En kısa sürede sizi arayacak.
   ```

7. Koordinatöre bildirim gitmeli ✅

**n8n Log Kontrolü:**
```
=== MESSAGE INFO ===
User message: evet arayabilir
Is reply: true
Quoted message: 314.000 TL + KDV. Koordinatörümüz size özel indirimli fiyat konuşsun mu?
```

Eğer `Is reply: true` görüyorsan → **Başarılı!** ✅

---

### Test 2: Katalog Sonrası "Evet" (SALES Olmamalı) ✅

**Adımlar:**
1. WhatsApp'tan:
   ```
   katalog yollar mısın?
   ```

2. AI katalog gönderecek.

3. Şimdi sadece:
   ```
   evet
   ```

4. **Beklenen yanıt:**
   ```
   Size yardımcı olabildiysem sevinirim. Başka sorunuz var mı?
   ```
   (veya benzer normal yanıt)

5. **OLMAMASI GEREKEN:**
   ❌ `[SALES]` tag
   ❌ Koordinatöre bildirim

**n8n Log:**
```
=== MESSAGE INFO ===
User message: evet
Is reply: false
Quoted message: null
```

---

### Test 3: Arıza Quote Reply ✅

**Adımlar:**
1. WhatsApp'tan:
   ```
   tower reformer tekerlek ses yapıyor
   ```

2. AI şöyle yanıt vermeli:
   ```
   Anlıyorum, yardımcı olalım. Ne zaman başladı? Koordinatörümüz sizi arayıp teknik destek sağlasın mı?
   ```

3. Araya:
   ```
   fiyat listesi var mı?
   ```

4. AI fiyat listesi gönderecek.

5. **ÖNEMLİ:** ARIZA mesajını **QUOTE/REPLY** edip:
   ```
   dün başladı, evet arasın
   ```

6. **Beklenen yanıt:**
   ```
   Teşekkürler, arıza kaydınızı ilettim.

   [ISSUE]

   En kısa sürede sizi arayacak.
   ```

7. Koordinatöre **arıza bildirimi** gitmeli (🔧 ARIZA KAYDI)

---

## 🐛 Sorun Giderme

### Sorun 1: "Is reply: false" her zaman

**Neden:** WhatsApp API `contextInfo` göndermiyor olabilir.

**Çözüm:**
1. Evolution API ayarlarını kontrol et
2. Webhook'un tam payload'ını logla:
   ```javascript
   console.log('=== FULL WEBHOOK ===');
   console.log(JSON.stringify(webhookData, null, 2));
   ```

3. `extendedTextMessage` ve `contextInfo` var mı kontrol et

### Sorun 2: AI hala yanlış yanıt veriyor

**Olası nedenler:**
- Eski workflow versiyonu hala aktif
- Build Messages node'u güncellenmemiş
- Chat history cache'lendi (DB'yi temizle)

**Çözüm:**
```sql
-- Test session'ını temizle
DELETE FROM chat_history
WHERE session_id = 'TEST_NUMARA@s.whatsapp.net';
```

### Sorun 3: [SALES] hiç tetiklenmiyor

**Kontrol edilecekler:**
1. Parse Response node çalışıyor mu?
2. AI yanıtında `[SALES]` tag var mı? (log'lara bak)
3. IF Sales node condition'ı doğru mu?

**Debug:**
```javascript
console.log('=== AI RESPONSE ===');
console.log(aiMessage);
console.log('Has SALES tag:', hasSalesTag);
```

---

## 📊 Performans Metrikleri

### İyileştirme Sonrası Beklentiler

| Metrik | Önce | Sonra | İyileştirme |
|--------|------|-------|-------------|
| **Token kullanımı** | ~2500/msg | ~1500/msg | ↓ %40 |
| **Yanıt süresi** | 3-5 sn | 2-3 sn | ↓ %40 |
| **[SALES] doğruluğu** | %60 | %95+ | ↑ %58 |
| **Müşteri memnuniyeti** | 3.5/5 | 4.5/5 | ↑ %28 |

### İlk Hafta Takip Edilecekler

1. **n8n Dashboard:**
   - Execution success rate (hedef: >95%)
   - Avg execution time (hedef: <3 sn)
   - Error rate (hedef: <2%)

2. **OpenAI Usage:**
   - Daily token consumption
   - Cost per conversation
   - Avg tokens per message

3. **Koordinatör Feedback:**
   - Doğru yönlendirme oranı
   - Yanlış [SALES] bildirimleri
   - Eksik bilgi nedeniyle geri dönüş

---

## 🔄 Rollback Planı

Eğer sorun çıkarsa eski versiyona dönmek için:

### Yöntem 1: Workflow Import
1. n8n → Workflows → Import
2. `workflow-original.json` dosyasını seç
3. Aktive et

### Yöntem 2: Manuel Düzenleme
1. Build Messages node → Eski kodu geri yapıştır
2. Load Chat History → `LIMIT 20` yap
3. OpenAI API → `max_tokens` kaldır

---

## 📞 Destek ve Yardım

**Sorun yaşarsanız:**
1. n8n execution log'larını kaydedin
2. Hatalı konuşmanın screenshot'unu alın
3. WhatsApp webhook payload'ını export edin

**Gerekli bilgiler:**
- Workflow execution ID
- Hata mesajı (varsa)
- Test senaryosu detayları
- Beklenen vs gerçekleşen davranış

---

## ✅ Kontrol Listesi

Implementasyondan önce:
- [ ] n8n backup alındı
- [ ] PostgreSQL backup alındı
- [ ] Test WhatsApp numarası hazır
- [ ] Koordinatör bilgilendirildi
- [ ] Monitoring hazır

Implementasyondan sonra:
- [ ] Test 1 başarılı (quote reply)
- [ ] Test 2 başarılı (katalog)
- [ ] Test 3 başarılı (arıza)
- [ ] Log'lar düzgün
- [ ] Performance iyileşti
- [ ] İlk günün sonunda review

---

## 🎯 Başarı Kriterleri

**İlk 24 saat:**
- Hiç kritik hata olmamalı
- En az 10 gerçek müşteri testi
- Koordinatör 0 şikayet

**İlk hafta:**
- [SALES] doğruluğu >90%
- Müşteri memnuniyeti artışı
- Token maliyeti azalışı
- Koordinatör pozitif feedback

Başarılar! 🚀
