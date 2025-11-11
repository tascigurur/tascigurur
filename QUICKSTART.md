# 🚀 Hızlı Başlangıç Rehberi

## 5 Dakikada Kurulum

### Adım 1: Workflow'u İmport Et

1. n8n'i aç
2. Sağ üst köşede **"⋮"** menüsüne tıkla
3. **"Import from File"** seç
4. `rota-reformer-whatsapp-workflow-FIXED.json` dosyasını seç
5. **"Import"** butonuna tıkla

### Adım 2: Credentials Ayarla

#### OpenAI API
```
Node: OpenAI Chat Model
Credential: OpenAI API
API Key: sk-... (OpenAI API key'iniz)
```

#### Evolution API (WhatsApp)
```
Node: Tüm "Evolution..." node'ları
Credential: Evolution API
Base URL: https://your-evolution-api.com
API Key: your-api-key
Instance Name: rotawp
```

#### Postgres
```
Node: Postgres Chat Memory
Credential: Postgres
Host: your-postgres-host
Database: n8n_chat_memory
User: postgres
Password: your-password
```

#### Supabase
```
Node: Supabase Vector Store
Credential: Supabase API
Host: your-supabase-url
Service Key: your-service-key
```

### Adım 3: Koordinatör Numarasını Güncelle

**Code Sales** node'unu aç ve düzenle:
```javascript
const coordinatorNumber = '905539644020@s.whatsapp.net'; // BURAYA KENDİ NUMARANIZI YAYIN
```

**Code Technical** node'unu aç ve düzenle:
```javascript
const coordinatorNumber = '905539644020@s.whatsapp.net'; // BURAYA KENDİ NUMARANIZI YAYIN
```

### Adım 4: Workflow'u Aktifleştir

1. Sağ üst köşede **"Active"** toggle'ı aç
2. Workflow kaydedilecek ve aktif hale gelecek

### Adım 5: Webhook URL'ini Kopyala

1. **Webhook** node'una tıkla
2. **"Test URL"** veya **"Production URL"** kopyala
3. Evolution API'de bu URL'yi webhook olarak ayarla

---

## ✅ İlk Test

WhatsApp'tan şu mesajı gönder:

```
Chair fotoğrafları
```

**Beklenen Sonuç:**
1. "Chair görsellerini gönderiyorum." mesajı gelir
2. 3 adet Chair fotoğrafı gelir

---

## 🎯 Test Senaryoları

### Test 1: Basit Merhaba
```
Müşteri: "Merhaba"
Beklenen: Karşılama mesajı
```

### Test 2: Fiyat Sorgulama
```
Müşteri: "Combo Cadillac fiyatı?"
Beklenen: "62.000 TL + KDV"
```

### Test 3: Görsel İsteme ⭐
```
Müşteri: "Tower Reformer görselleri"
Beklenen: 3 adet Tower Reformer fotoğrafı
```

### Test 4: Fiyat Listesi
```
Müşteri: "Fiyat listesi"
Beklenen: Fiyat listesi görseli
```

### Test 5: Katalog
```
Müşteri: "Katalog gönder"
Beklenen: PDF katalog
```

### Test 6: Renk Kartelası
```
Müşteri: "Renk seçenekleri"
Beklenen: Deri renk kartelası görseli
```

### Test 7: Satış Talebi ⭐⭐
```
Müşteri: "Combo Cadillac 3 adet almak istiyorum"
AI: "Koordinatörümüz sizi arasın mı?"
Müşteri: "Evet"
Beklenen:
- Müşteriye onay mesajı
- Koordinatöre WhatsApp bildirimi
```

### Test 8: Teknik Destek
```
Müşteri: "Combo Cadillac'ımdaki yaylar çalışmıyor"
AI: "Teknik ekibimize ileteyim mi?"
Müşteri: "Evet lütfen"
Beklenen:
- Müşteriye onay mesajı
- Koordinatöre teknik destek bildirimi
```

---

## 🐛 Sorun mu Yaşıyorsun?

### Görseller Gelmiyor

**Kontrol Listesi:**
1. ✅ Switch node aktif mi?
2. ✅ Evolution API credentials doğru mu?
3. ✅ Google Drive linkler erişilebilir mi?
4. ✅ n8n Execution Log'da hata var mı?

**Debug Adımları:**
1. n8n'de workflow'u manuel olarak çalıştır
2. "Switch" node'una tıkla ve hangi dala gittiğini gör
3. "AI Agent" output'unu incele - TAG var mı?

### Koordinatöre Mesaj Gitmiyor

**Kontrol Listesi:**
1. ✅ Koordinatör numarası doğru mu? (`905539644020@s.whatsapp.net`)
2. ✅ Evolution API instance'ı çalışıyor mu?
3. ✅ "Code Sales" veya "Code Technical" node'u çalıştı mı?

---

## 📊 Workflow Akışı (Basitleştirilmiş)

```
┌─────────────┐
│ WhatsApp    │ Müşteri mesaj gönderir
│ Webhook     │
└──────┬──────┘
       │
       v
┌─────────────┐
│  AI Agent   │ Mesajı analiz eder, TAG ekler
│  (OpenAI)   │
└──────┬──────┘
       │
       ├───────────────────────┐
       │                       │
       v                       v
┌──────────────┐      ┌──────────────┐
│ Format       │      │   Switch     │
│ Output       │      │  (TAG Arar)  │
└──────┬───────┘      └──────┬───────┘
       │                     │
       v                     ├─→ Satış Koordinatörü
┌──────────────┐            ├─→ Teknik Destek
│ Müşteriye    │            ├─→ Ürün Görselleri
│ Temiz Mesaj  │            ├─→ Fiyat Listesi
└──────────────┘            ├─→ Renk Kartelası
                            └─→ Katalog PDF
```

---

## 💡 Pro İpuçları

### 1. Test Mode'da Başla
İlk testlerde Webhook node'unun "Test URL"'ini kullan. Stabil olunca "Production URL"'e geç.

### 2. Execution Log'u İzle
Her mesajda n8n'in "Executions" tab'ını kontrol et. Hangi node'ların çalıştığını görürsün.

### 3. AI Prompt'u Özelleştir
"AI Agent" node'unda system message'ı kendi ihtiyaçlarına göre düzenle.

### 4. Görsel Linklerini Güncelle
Kendi Google Drive linkerini kullanmak istersen "Code Product Images" node'unu düzenle.

---

## 🎉 Tebrikler!

Workflow'un çalışıyorsa artık tam otomatik bir WhatsApp satış asistanın var! 🚀

**Sonraki Adımlar:**
- [ ] Production'a taşı
- [ ] Daha fazla ürün ekle
- [ ] Analytics ekle
- [ ] CRM entegrasyonu yap

Detaylı dokümantasyon için: [WORKFLOW-DOCUMENTATION.md](./WORKFLOW-DOCUMENTATION.md)
