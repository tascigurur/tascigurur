# 🚀 v4-MEMORY-ONLY Setup Guide - Basit & Garanti Çalışır

## 🎯 v4-MEMORY-ONLY Nedir?

**EN BASİT VE GÜVENİLİR ÇÖZÜM!**

- **Base:** FINAL-WORKING (zaten çalışıyor!) ✅
- **Yeni:** Sadece Chat Memory (PostgreSQL) ✅
- **NO:** Google Sheets, Vector Store, AI Agent karmaşası ❌

### ✨ Özellikler

1. **Chat Memory (PostgreSQL)**
   - ✅ Konuşma geçmişini hatırlar
   - ✅ "Combo Cadillac 3 tane?" → "Evet" akışı ÇALIŞIR
   - ✅ Son 20 mesajı yükler

2. **Hardcoded Knowledge (System Prompt)**
   - ✅ Tüm şirket bilgileri prompt'ta
   - ✅ 10 ürün detaylı specs
   - ✅ Fiyatlar, nakliye, SSS
   - ✅ Güncellemek için → Workflow'daki system prompt'u düzenle

3. **FINAL-WORKING Base**
   - ✅ Görseller çalışıyor
   - ✅ Katalog çalışıyor
   - ✅ Fiyat listesi çalışıyor
   - ✅ [SALES] tag çalışıyor

---

## 📦 Dosyalar

1. **`rota-reformer-v4-MEMORY-ONLY.json`** - Ana workflow
2. **`setup-v4-database.sql`** - PostgreSQL table (sadece chat_history)

---

## 🛠️ Kurulum

### Adım 1: PostgreSQL Table Oluştur

Supabase Dashboard → SQL Editor → Aşağıdaki SQL'i çalıştır:

```sql
-- Chat History Table (conversation memory için)
CREATE TABLE IF NOT EXISTS public.chat_history (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_history_session
ON public.chat_history(session_id, created_at);

-- Test
SELECT COUNT(*) as chat_history_count FROM public.chat_history;
```

**Sadece 1 table! Basit!** ✅

### Adım 2: n8n Credentials

**3 credential gerekli:**

1. **Postgres** (Supabase)
   - Host: `db.xxx.supabase.co`
   - Database: `postgres`
   - User: `postgres`
   - Password: `[your-password]`
   - Port: `5432`
   - SSL: Require

2. **Header Auth** (Evolution API)
   - Name: `apikey`
   - Value: `[your-evolution-api-key]`

3. **OpenAI API**
   - API Key: `[your-openai-key]`

### Adım 3: Import Workflow

1. n8n → Import → **`rota-reformer-v4-MEMORY-ONLY.json`**
2. Credentials bağla:
   - Postgres account
   - Header Auth
   - OpenAI API
3. **Active** et
4. Webhook URL kopyala → Evolution API'ye set et

**HEPSI BU!** Başka workflow yok, Google Sheets yok, karmaşa yok!

---

## 🔄 Workflow Akışı

```
Webhook (WhatsApp message gelir)
  ↓
Load Chat History (Postgres) ← Son 20 mesaj
  ↓
Build Messages (Code)
  ├─ System prompt (TÜM şirket bilgisi burada!)
  ├─ Chat history ekle
  └─ User message ekle
  ↓
Save User Message (Postgres)
  ↓
OpenAI API (HTTP Request) ← Dynamic messages array
  ↓
Save Assistant Response (Postgres)
  ↓
Parse Response (Extract TAGs)
  ↓
IF Image / Catalog / Pricelist / Sales
  ↓
Send HTTP Request (Evolution API)
```

**Toplam 4 yeni node:**
1. Load Chat History
2. Build Messages
3. Save User Message
4. Save Assistant Response

---

## 🧪 Test Senaryoları

### 1. Chat Memory Test ⭐ EN ÖNEMLİ

```
Müşteri: "Combo Cadillac 3 tane ne kadar?"
AI: "186.000 TL + KDV. Koordinatörümüz arasın mı?"

Müşteri: "Evet"
AI: "Harika! 3 adet Combo Cadillac talebinizi ilettim. [SALES]"
→ Koordinatöre mesaj GİDER ✅
```

**Neden çalışıyor?**
- PostgreSQL'de chat history var
- AI önceki konuşmayı hatırlıyor
- "Evet" kelimesi context ile birlikte anlam kazanıyor

### 2. Ürün Bilgisi Test

```
Müşteri: "Combo Cadillac özellikleri nedir?"
AI: [System prompt'taki detaylı bilgiyi verir]
- Ölçüler: 75cm x 240cm
- Kasa: İthal ahşap, 37cm yükseklik
- Tower: 195cm
- vb...
```

### 3. Fiyat Test

```
Müşteri: "Tower Reformer kaç para?"
AI: "Tower Reformer 52.000 TL + KDV"
```

### 4. Görsel Gönderme (FINAL-WORKING base sayesinde)

```
"Chair görselleri" → 3 fotoğraf ✅
"Katalog" → PDF ✅
"Fiyat listesi" → Görsel ✅
```

---

## 🐛 Debug

### Chat History Kontrol

```sql
-- Belirli session'ın geçmişi
SELECT session_id, role, content, created_at
FROM public.chat_history
WHERE session_id LIKE '%905368286231%'
ORDER BY created_at DESC
LIMIT 10;

-- Kaç session var?
SELECT COUNT(DISTINCT session_id) as unique_sessions
FROM public.chat_history;

-- En aktif session'lar
SELECT session_id, COUNT(*) as message_count
FROM public.chat_history
GROUP BY session_id
ORDER BY message_count DESC
LIMIT 5;
```

### n8n Execution Logs

1. n8n → Executions → En son execution
2. **Load Chat History** → Kaç mesaj yükledi?
   - 0 ise: İlk mesaj (normal)
   - >0 ise: Chat memory çalışıyor ✅
3. **Build Messages** → Output'ta messages array var mı?
   - Kaç item var? (system + history + user)
4. **OpenAI API** → Request'te messages array doğru mu?
5. **Save User/Assistant** → Başarıyla kaydedildi mi?

---

## 🔧 Sorun Giderme

### Sorun 1: Chat memory çalışmıyor

**Semptom:** "Evet" deyince AI hatırlamıyor

**Çözüm:**
1. `chat_history` table'ı var mı?
```sql
SELECT COUNT(*) FROM public.chat_history;
```

2. Mesajlar kaydediliyor mu?
```sql
SELECT * FROM public.chat_history
ORDER BY created_at DESC
LIMIT 5;
```

3. Load Chat History node çalışıyor mu?
   - n8n execution log'a bak
   - Node'a tıkla → Output var mı?

4. Postgres credential doğru mu?
   - Credentials → Test connection

### Sorun 2: Görseller/katalog gelmiyor

**Semptom:** AI "gönderiyorum" diyor ama gelmiyor

**Çözüm:**
- v4-MEMORY-ONLY FINAL-WORKING base kullanıyor
- Bu sorun OLMAMALI!
- Execution log'a bak:
  - Parse Response → hasImageTag true mu?
  - IF Image → True branch'e girdi mi?
  - Send Image HTTP → Request başarılı mı? (200 OK)
  - Evolution API credential doğru mu?

### Sorun 3: AI ürün bilgilerini bilmiyor

**Semptom:** Yanlış fiyat söylüyor veya "bilmiyorum" diyor

**Çözüm:**
1. Build Messages node'unu aç
2. Code'u kontrol et → systemPrompt değişkeninde tüm bilgi var mı?
3. Execution log → Build Messages output → messages[0].content → System prompt tam mı?

**Bilgi güncellemek için:**
- Workflow'u aç
- Build Messages node → Edit
- systemPrompt değişkenini düzenle
- Save

---

## 📊 Karşılaştırma

| Özellik | FINAL-WORKING | v4-MEMORY-ONLY ⭐ |
|---------|---------------|-------------------|
| Çalışır mı? | ✅ | ✅ |
| Chat Memory | ❌ | ✅ |
| Görseller | ✅ | ✅ |
| Katalog/Fiyat Listesi | ✅ | ✅ |
| [SALES] TAG | ✅ | ✅ |
| "Evet" → [SALES] | ❌ | ✅ |
| Karmaşıklık | Basit | Basit |
| Google Sheets | ❌ | ❌ |
| Vector Store | ❌ | ❌ |
| AI Agent | ❌ | ❌ |
| Dependency | Sadece OpenAI | OpenAI + Postgres |

---

## 🎯 Avantajlar

### ✅ Neden v4-MEMORY-ONLY?

1. **Garanti çalışır**
   - FINAL-WORKING base (ispatlanmış)
   - Sadece 4 node eklendi
   - Yapı bozulmadı

2. **Basit ve anlaşılır**
   - Google Sheets yok → Hata yok
   - Vector Store yok → Karmaşa yok
   - AI Agent yok → Sorun yok

3. **Chat memory var**
   - "Combo Cadillac 3 tane?" → "Evet" ÇALIŞIR
   - Context hatırlama
   - Akıllı konuşma

4. **Tüm bilgi kontrol altında**
   - System prompt'ta her şey var
   - Güncellemek kolay (workflow'da düzenle)
   - External dependency yok

5. **Maintenance kolay**
   - 1 workflow
   - 1 PostgreSQL table
   - 3 credential
   - Hepsi bu!

### ❌ Dezavantajlar (kabul edilebilir)

1. **Dinamik güncelleme yok**
   - Ürün eklemek için → System prompt'u düzenle
   - Google Sheets gibi otomatik değil
   - FAKAT: User kabul etti, basitlik öncelik

2. **System prompt büyük**
   - ~3000+ karakter
   - Token maliyeti biraz fazla
   - FAKAT: GPT-4o-mini ucuz, sorun değil

---

## 📝 Maintenance

### Ürün Bilgisi Güncelle

1. n8n → rota-reformer-v4-MEMORY-ONLY workflow
2. Build Messages node → Edit
3. systemPrompt değişkenini bul
4. İlgili bölümü düzenle:
   ```javascript
   const systemPrompt = `Sen Rota Reformer'ın profesyonel satış danışmanısın...

   === FİYATLAR (2025) ===
   - Combo Cadillac: 62.000 TL + KDV  // BURAYA GÜNCELLE
   - Tower Reformer: 52.000 TL + KDV
   ...
   ```
5. Save
6. Workflow otomatik güncellenir

### Yeni Ürün Ekle

System prompt'ta `=== ÜRÜN DETAYLARI ===` bölümüne ekle:

```javascript
**Yeni Ürün Adı (Fiyat)**
- Ölçüler: ...
- Özellikler: ...
- Garanti: ...
- Teslimat: ...
```

### Chat History Temizle

Eski konuşmaları temizle (30 günlükten eski):

```sql
DELETE FROM public.chat_history
WHERE created_at < NOW() - INTERVAL '30 days';
```

### Belirli Session'ı Sil

```sql
DELETE FROM public.chat_history
WHERE session_id = '905368286231@s.whatsapp.net';
```

---

## 🎉 Sonuç

**v4-MEMORY-ONLY = FINAL-WORKING + Chat Memory**

✅ **Garanti çalışır** (FINAL-WORKING base)
✅ **Chat geçmişi** (Postgres)
✅ **Tüm bilgi embed** (System prompt)
✅ **Basit** (1 workflow, 1 table, 3 credential)
✅ **Maintenance kolay** (Workflow'da düzenle)
✅ **NO karmaşa** (Google Sheets yok, AI Agent yok)

---

## 🚀 Hızlı Başlangıç (TL;DR)

```bash
1. Supabase → SQL Editor → setup-v4-database.sql çalıştır
2. n8n → Import → rota-reformer-v4-MEMORY-ONLY.json
3. Credentials bağla (Postgres, Header Auth, OpenAI)
4. Active et
5. Test et: "Combo Cadillac 3 tane?" → "Evet"
6. ✅ ÇALIŞIR!
```

**Bu kadar basit!** 🎉
