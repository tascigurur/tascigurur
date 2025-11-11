# 🚀 v4 Setup Guide - Chat Memory + Google Sheets

## 🎯 v4 Nedir?

**Base:** FINAL-WORKING (zaten çalışıyor!) ✅
**Yeni:** Chat Memory + Google Sheets Dynamic Data ✅

### ✨ Yeni Özellikler

1. **Chat Memory (PostgreSQL)**
   - ✅ Konuşma geçmişini hatırlar
   - ✅ "Combo Cadillac 3 tane?" → "Evet" akışı ÇALIŞIR
   - ✅ Son 20 mesajı yükler

2. **Google Sheets Dynamic Data**
   - ✅ Ürün bilgileri Google Sheets'ten otomatik yüklenir
   - ✅ SSS'ler Google Sheets'ten otomatik yüklenir
   - ✅ Her 1 saatte bir güncellenir
   - ✅ Sheet'i güncellersin → 1 saat sonra aktif

3. **Dynamic System Prompt**
   - ✅ Google Sheets data'sı prompt'a otomatik eklenir
   - ✅ AI her zaman güncel bilgi kullanır

---

## 📦 Dosyalar

1. **`rota-reformer-v4-MEMORY-SHEETS.json`** - Ana workflow
2. **`google-sheets-loader.json`** - Data loader (her 1 saat)
3. **`setup-v4-database.sql`** - PostgreSQL table'ları

---

## 🛠️ Kurulum

### Adım 1: PostgreSQL Tables Oluştur

Supabase Dashboard → SQL Editor → `setup-v4-database.sql` çalıştır:

```sql
-- Chat History
CREATE TABLE IF NOT EXISTS public.chat_history (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_history_session
ON public.chat_history(session_id, created_at);

-- Product Knowledge
CREATE TABLE IF NOT EXISTS public.product_knowledge (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('product', 'faq')),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Adım 2: Google Sheets Hazırla

**Sheet:** https://docs.google.com/spreadsheets/d/1cCXNnB7t8m32LQvhrcPxgxM4lHE-NfzlCtISbr7_EyQ/edit

1. **Share → "Anyone with the link" → Viewer**
2. **Tablar:**
   - `Urun Bilgi` - Ürün detayları
   - `S.S.S` - Sık Sorulan Sorular

**Urun Bilgi kolumları:**
- Ürün (ürün adı)
- Açıklama
- Özellikler
- Fiyat
- Teslimat
- Garanti

**S.S.S kolumları:**
- Soru
- Cevap
- Kategori

### Adım 3: n8n Credentials

**3 credential gerekli:**

1. **Google Sheets OAuth2**
   - Settings → Credentials → Add → Google Sheets
   - OAuth2 ile bağlan

2. **Postgres** (Supabase)
   - Host: `db.xxx.supabase.co`
   - Database: `postgres`
   - User: `postgres`
   - Password: `[your-password]`
   - Port: `5432`
   - SSL: Require

3. **Header Auth** (Evolution API)
   - Name: `apikey`
   - Value: `[your-evolution-api-key]`

4. **OpenAI API**
   - API Key: `[your-openai-key]`

### Adım 4: Import Workflows

#### A) Ana Workflow

1. n8n → Import → `rota-reformer-v4-MEMORY-SHEETS.json`
2. Credentials bağla:
   - Postgres account
   - Header Auth
   - OpenAI API
3. **Active** et
4. Webhook URL kopyala → Evolution API'ye set et

#### B) Data Loader Workflow

1. n8n → Import → `google-sheets-loader.json`
2. Credentials bağla:
   - Google Sheets OAuth2
   - Postgres account
3. **Active** et (her 1 saatte bir otomatik çalışır)
4. **İlk yükleme için:** Manuel çalıştır (Test workflow button)

---

## 🔄 Workflow Akışı

### Ana Workflow (v4)

```
Webhook
  ↓
  ├─ Load Chat History (Postgres) ← Son 20 mesaj
  └─ Load Product Knowledge (Postgres) ← Google Sheets data
  ↓
Build Messages (Code)
  ├─ Chat history ekle
  ├─ Product knowledge ekle (dynamic prompt)
  └─ User message ekle
  ↓
Save User Message (Postgres)
  ↓
OpenAI API (HTTP Request) ← Dynamic messages array
  ↓
Save Assistant Response (Postgres)
  ↓
Parse Response
  ↓
IF Image / Catalog / Pricelist / Sales
  ↓
Send HTTP Request
```

### Data Loader Workflow

```
Schedule (Every 1 Hour)
  ↓
  ├─ Read Products (Urun Bilgi)
  └─ Read FAQ (S.S.S)
  ↓
  ├─ Format Products
  └─ Format FAQ
  ↓
Merge Data
  ↓
Clear Old Data (DELETE FROM product_knowledge)
  ↓
Save to Database (INSERT INTO product_knowledge)
```

---

## 🧪 Test Senaryoları

### 1. Chat Memory Test

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

### 2. Google Sheets Data Test

**A) Ürün Bilgisi**
```
Müşteri: "Combo Cadillac özellikleri nedir?"
AI: [Google Sheets'teki "Urun Bilgi" tabından bilgi verir]
```

**B) SSS**
```
Müşteri: "Teslimat ne kadar sürer?"
AI: [Google Sheets'teki "S.S.S" tabından cevap verir]
```

**C) Sheet Güncelleme**
1. Google Sheets'e yeni ürün ekle
2. 1 saat bekle (veya data loader'ı manuel çalıştır)
3. AI'ya yeni ürünü sor → Bilgi verecek!

### 3. Görsel Gönderme

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

-- Tüm session'lar
SELECT session_id, COUNT(*) as message_count
FROM public.chat_history
GROUP BY session_id
ORDER BY message_count DESC;
```

### Product Knowledge Kontrol

```sql
-- Kaç ürün/FAQ var?
SELECT type, COUNT(*) as count
FROM public.product_knowledge
GROUP BY type;

-- Tüm ürünler
SELECT name, content
FROM public.product_knowledge
WHERE type = 'product';

-- Tüm FAQ'ler
SELECT name, content
FROM public.product_knowledge
WHERE type = 'faq';
```

### n8n Execution Logs

1. n8n → Executions → En son execution
2. **Load Chat History** → Kaç mesaj yükledi?
3. **Load Product Knowledge** → Kaç item yükledi?
4. **Build Messages** → Total messages kaç?
5. **OpenAI API** → Request'te messages array var mı?

### Google Sheets Loader

Data loader çalıştı mı kontrol et:

```sql
-- En son ne zaman data yüklendi?
SELECT MAX(created_at) as last_update
FROM public.product_knowledge;

-- Boşsa loader çalışmamış, manuel çalıştır
```

---

## 🔧 Sorun Giderme

### Sorun 1: Chat memory çalışmıyor

**Semptom:** "Evet" deyince AI hatırlamıyor

**Çözüm:**
1. `chat_history` table'ı var mı?
```sql
SELECT COUNT(*) FROM public.chat_history;
```

2. Postgres credential doğru mu?
3. n8n'de execution log'a bak - Save User/Assistant node'ları çalışıyor mu?

### Sorun 2: Google Sheets data gelmiyor

**Semptom:** AI ürün bilgilerini bilmiyor

**Çözüm:**
1. `product_knowledge` table'ı var mı?
```sql
SELECT COUNT(*) FROM public.product_knowledge;
```

2. Sıfır mı? → Data loader'ı manuel çalıştır
3. Google Sheets public mi? (Anyone with link can view)
4. Google Sheets credential doğru mu?

### Sorun 3: Görseller/katalog gelmiyor

**Semptom:** AI "gönderiyorum" diyor ama gelmiyor

**Çözüm:**
- v4'te bu sorun YOK (FINAL-WORKING base)
- Execution log'a bak:
  - Parse Response → hasImageTag true mu?
  - IF Image → True branch'e girdi mi?
  - Send Image HTTP → Request başarılı mı?

---

## 📊 Avantajlar

| Özellik | FINAL-WORKING | v4 |
|---------|---------------|-----|
| Çalışır mı? | ✅ | ✅ |
| Chat Memory | ❌ | ✅ |
| Google Sheets Data | ❌ | ✅ |
| Dynamic Prompt | ❌ | ✅ |
| "Evet" → [SALES] | ❌ | ✅ |
| Ürün güncelleme | Manuel | **Otomatik** |

---

## 🎯 Sonuç

**v4 = FINAL-WORKING + Chat Memory + Google Sheets**

✅ **Garanti çalışır** (FINAL-WORKING base)
✅ **Chat geçmişi** (Postgres)
✅ **Dinamik data** (Google Sheets → her 1 saat güncellenir)
✅ **Kolay yönetim** (Sheet'i güncelle, 1 saat bekle)

---

## 📝 Maintenance

### Ürün Ekle/Güncelle

1. Google Sheets'i aç
2. "Urun Bilgi" tabına yeni satır ekle
3. 1 saat bekle (veya data loader'ı manuel çalıştır)
4. ✅ AI yeni ürünü biliyor!

### FAQ Ekle/Güncelle

1. Google Sheets'i aç
2. "S.S.S" tabına yeni satır ekle
3. 1 saat bekle
4. ✅ AI yeni SSS'yi biliyor!

### Chat History Temizle

Eski konuşmaları temizle (30 günlükten eski):

```sql
DELETE FROM public.chat_history
WHERE created_at < NOW() - INTERVAL '30 days';
```

---

**v4 ile artık tam otomatik, dinamik ve akıllı bir WhatsApp asistanına sahipsin!** 🎉
