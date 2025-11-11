# 🤖 Rota Reformer WhatsApp AI Bot

**Pilates ekipmanları satışı için akıllı WhatsApp asistanı**

---

## 🎯 v4: Chat Memory + Google Sheets ⭐ (ÖNERİLEN)

### En Doğru Çözüm: FINAL-WORKING + Chat Memory + Google Sheets

**Dosya:** `rota-reformer-v4-MEMORY-SHEETS.json`

Bu versiyon **FINAL-WORKING'in garanti çalışan yapısına** chat memory ve Google Sheets entegrasyonu ekliyor.

### ✅ v4 Özellikleri

- **FINAL-WORKING Base** - Zaten çalışıyor! ✅
- **Chat Memory (PostgreSQL)** - Konuşma geçmişini hatırlar
- **Google Sheets Dynamic Data** - Ürün bilgileri otomatik güncellenir
- **Dynamic System Prompt** - Sheet data'sı prompt'a otomatik eklenir
- **"Evet" → [SALES] Akışı** - ÇALIŞIYOR ✅

### 🚀 Yeni Yetenekler

```
Müşteri: "Combo Cadillac 3 tane ne kadar?"
AI: "186.000 TL + KDV. Koordinatörümüz arasın mı?"

Müşteri: "Evet"
→ Chat Memory hatırlıyor ✅
→ [SALES] TAG ✅
→ Koordinatöre mesaj gidiyor ✅

---

Müşteri: "Combo Cadillac özellikleri?"
→ Google Sheets'ten data çekiliyor ✅
→ AI detaylı bilgi veriyor ✅

---

Google Sheets'i güncellersin
→ 1 saat sonra otomatik yüklenir ✅
→ AI güncel bilgiyi kullanır ✅
```

**Detaylı kurulum:** [V4-SETUP-GUIDE.md](./V4-SETUP-GUIDE.md)

---

## 📊 Workflow Versiyonları

| Versiyon | Chat Memory | Google Sheets | Durum | Kullan |
|----------|-------------|---------------|-------|--------|
| **v4** ⭐ | ✅ | ✅ | **Production** | **ÖNERİLEN** |
| COMPLETE | ✅ AI Agent | ❌ | Hatalı | ❌ |
| WITH-MEMORY | ✅ Manuel | ❌ | Test | Test için |
| FINAL-WORKING | ❌ | ❌ | Base | Basit prototip |

### 🥇 rota-reformer-v4-MEMORY-SHEETS.json (ÖNERİLEN)
- ✅ FINAL-WORKING base (garanti çalışır)
- ✅ PostgreSQL chat memory (konuşma hatırlar)
- ✅ Google Sheets dynamic data (otomatik güncelleme)
- ✅ "Combo Cadillac 3 tane?" → "Evet" ÇALIŞIR
- ✅ Ürün bilgileri Google Sheets'ten
- ✅ **Production-ready!**

### 🥈 google-sheets-loader.json (v4 ile birlikte)
- Google Sheets'ten data yükler
- Her 1 saatte bir otomatik
- PostgreSQL'e kaydeder
- v4 workflow'u tarafından kullanılır

### 🥉 rota-reformer-FINAL-WORKING.json
- Chat memory YOK
- Her mesaj bağımsız
- Basit prototip
- Hızlı test için

---

## ✨ Özellikler

- 💬 **Chat Memory:** PostgreSQL ile konuşma geçmişi
- 📚 **Google Sheets Data:** Dinamik ürün bilgileri & SSS
- 📸 **Otomatik Görsel Gönderimi:** 10 farklı ürün için 20+ görsel
- 💰 **Fiyat Listesi & Katalog:** Anında PDF ve görsel gönderimi
- 🔔 **Satış Koordinatörü:** Otomatik lead yönlendirme
- 🤖 **Dynamic System Prompt:** Sheet data otomatik eklenir
- 🔄 **Otomatik Güncelleme:** Sheet'i değiştir → 1 saat sonra aktif

---

## 🚀 Hızlı Başlangıç (v4)

### 1. PostgreSQL Tables Oluştur

Supabase Dashboard → SQL Editor → [`setup-v4-database.sql`](./setup-v4-database.sql) çalıştır:

```sql
-- Chat History
CREATE TABLE IF NOT EXISTS public.chat_history (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Knowledge
CREATE TABLE IF NOT EXISTS public.product_knowledge (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Google Sheets Hazırla

**Sheet:** https://docs.google.com/spreadsheets/d/1cCXNnB7t8m32LQvhrcPxgxM4lHE-NfzlCtISbr7_EyQ/edit

1. Share → "Anyone with the link" → Viewer
2. Tablar:
   - `Urun Bilgi` - Ürün detayları
   - `S.S.S` - Sık Sorulan Sorular

### 3. n8n'e Import Et

```bash
git clone https://github.com/tascigurur/tascigurur.git
cd tascigurur
```

**A) Ana Workflow:**
- n8n → Import → **`rota-reformer-v4-MEMORY-SHEETS.json`**
- Credentials: Postgres, OpenAI API, Header Auth
- Active et

**B) Data Loader:**
- n8n → Import → **`google-sheets-loader.json`**
- Credentials: Google Sheets, Postgres
- Active et
- İlk yükleme için manuel çalıştır

### 4. Test Et!

```
"Combo Cadillac 3 tane ne kadar?"
→ "186.000 TL. Koordinatörümüz arasın mı?"

"Evet"
→ Chat Memory hatırlıyor ✅
→ Koordinatöre mesaj gidiyor ✅

"Combo Cadillac özellikleri?"
→ Google Sheets'ten bilgi çekiliyor ✅
```

---

## 📚 Dokümantasyon

### Ana Rehberler
- **⭐ V4 GUIDE:** [V4-SETUP-GUIDE.md](./V4-SETUP-GUIDE.md) - **TAVSİYE EDİLEN**
- **Complete Guide:** [COMPLETE-SETUP-GUIDE.md](./COMPLETE-SETUP-GUIDE.md)
- **Memory Guide:** [MEMORY-SETUP-GUIDE.md](./MEMORY-SETUP-GUIDE.md)

### SQL Scripts
- [setup-v4-database.sql](./setup-v4-database.sql) - v4 için PostgreSQL tables
- [chat_history_table.sql](./chat_history_table.sql) - Sadece chat history

---

## 🛠️ Teknolojiler

- **n8n** - Workflow automation
- **OpenAI GPT-4o-mini** - AI model (HTTP Request)
- **PostgreSQL** - Chat history + Product knowledge
- **Supabase** - Managed PostgreSQL
- **Google Sheets** - Dynamic data source
- **Evolution API** - WhatsApp integration (HTTP Request)
- **Google Drive** - Media hosting

---

## 📦 Ürünler

| Ürün | Fiyat |
|------|-------|
| Combo Cadillac | 62.000 TL + KDV |
| Tower Reformer | 52.000 TL + KDV |
| Basic Reformer | 48.000 TL + KDV |
| Cadillac | 58.000 TL + KDV |
| Infinity Reformer | 68.000 TL + KDV |
| Metal Reformer | 38.500 TL + KDV |
| Katlanabilir Reformer | 40.000 TL + KDV |
| Chair | 28.000 TL (KDV Dahil) |
| Barrel | 24.000 TL (KDV Dahil) |
| Spine Corrector | 9.000 TL (KDV Dahil) |

*Fiyatlar ve detaylı bilgiler Google Sheets'ten otomatik yüklenir*

---

## 🧪 Test Senaryoları

### Chat Memory
```
✅ "Combo Cadillac 3 tane?" → "186.000 TL. Arasın mı?"
✅ "Evet" → AI hatırlıyor → [SALES] → Koordinatör ✅
```

### Google Sheets Data
```
✅ "Combo Cadillac özellikleri?" → Sheet'ten bilgi
✅ Sheet'i güncelle → 1 saat → AI biliyor
```

### Görseller
```
✅ "Chair görselleri" → 3 fotoğraf
✅ "Katalog" → PDF
✅ "Fiyat listesi" → Görsel
```

---

## 🔧 Debugging

### Chat History Kontrol
```sql
SELECT session_id, role, content, created_at
FROM public.chat_history
WHERE session_id LIKE '%905368286231%'
ORDER BY created_at DESC
LIMIT 10;
```

### Product Knowledge Kontrol
```sql
SELECT type, COUNT(*) as count
FROM public.product_knowledge
GROUP BY type;
```

### n8n Execution Log
1. n8n → Executions → En son execution
2. Load Chat History → Kaç mesaj yükledi?
3. Load Product Knowledge → Kaç item yükledi?
4. Build Messages → Total messages?

Detaylı troubleshooting: [V4-SETUP-GUIDE.md](./V4-SETUP-GUIDE.md)

---

## 🎯 MİMARİ (v4)

```
Webhook
  ↓
  ├─ Load Chat History (Postgres)
  └─ Load Product Knowledge (Postgres - Google Sheets data)
  ↓
Build Messages (dynamic system prompt)
  ↓
Save User Message → OpenAI API → Save Assistant
  ↓
Parse Response
  ↓
IF Image / Catalog / Pricelist / Sales
  ↓
Send HTTP Request (Evolution API)
```

**Ayrı Workflow: Google Sheets Loader**
```
Schedule (Every 1 Hour)
  ↓
Read Sheets (Urun Bilgi + S.S.S)
  ↓
Save to product_knowledge table
```

---

## 📝 Lisans

MIT License

## 👨‍💻 Geliştirici

[@tascigurur](https://github.com/tascigurur)

---

## 🎉 v4 Avantajları

✅ **Garanti çalışır** - FINAL-WORKING base
✅ **Chat memory** - Konuşmaları hatırlar
✅ **Dinamik data** - Google Sheets → otomatik
✅ **Kolay yönetim** - Sheet güncelle, 1 saat bekle
✅ **Production-ready** - Tüm özellikler aktif

**Bu workflow GERÇEKTEN çalışır ve dinamiktir!** 🚀
