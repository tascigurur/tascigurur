# 🤖 Rota Reformer WhatsApp AI Bot

**Pilates ekipmanları satışı için akıllı WhatsApp asistanı**

---

## 🎯 v4-MEMORY-ONLY: Chat Memory ⭐ (ÖNERİLEN)

### En Basit ve Güvenilir Çözüm: FINAL-WORKING + Chat Memory

**Dosya:** `rota-reformer-v4-MEMORY-ONLY.json`

Bu versiyon **FINAL-WORKING'in garanti çalışan yapısına** sadece chat memory ekliyor. **Karmaşa yok, Google Sheets yok, garanti çalışır!**

### ✅ v4-MEMORY-ONLY Özellikleri

- **FINAL-WORKING Base** - Zaten çalışıyor! ✅
- **Chat Memory (PostgreSQL)** - Konuşma geçmişini hatırlar
- **Hardcoded Knowledge** - Tüm bilgi system prompt'ta (güvenilir!)
- **"Evet" → [SALES] Akışı** - ÇALIŞIYOR ✅
- **Basit Yapı** - Sadece 1 workflow, 1 PostgreSQL table

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
→ System prompt'taki detaylı bilgi ✅
→ AI doğru fiyat ve specs veriyor ✅

---

Bilgi güncellemek istersen
→ Workflow'daki system prompt'u düzenle ✅
→ Hemen aktif olur ✅
```

**Detaylı kurulum:** [V4-MEMORY-ONLY-SETUP-GUIDE.md](./V4-MEMORY-ONLY-SETUP-GUIDE.md)

---

## 📊 Workflow Versiyonları

| Versiyon | Chat Memory | Google Sheets | Durum | Kullan |
|----------|-------------|---------------|-------|--------|
| **v4-MEMORY-ONLY** ⭐ | ✅ | ❌ (Hardcoded) | **Production** | **ÖNERİLEN** |
| v4-MEMORY-SHEETS | ✅ | ✅ | Karmaşık | Test için |
| COMPLETE | ✅ AI Agent | ❌ | Hatalı | ❌ |
| FINAL-WORKING | ❌ | ❌ | Base | Basit prototip |

### 🥇 rota-reformer-v4-MEMORY-ONLY.json (ÖNERİLEN)
- ✅ FINAL-WORKING base (garanti çalışır)
- ✅ PostgreSQL chat memory (konuşma hatırlar)
- ✅ Hardcoded knowledge (tüm bilgi system prompt'ta)
- ✅ "Combo Cadillac 3 tane?" → "Evet" ÇALIŞIR
- ✅ Basit yapı (1 workflow, 1 table)
- ✅ **Production-ready!**
- ✅ **Google Sheets karmaşası YOK!**

### 🥈 rota-reformer-v4-MEMORY-SHEETS.json
- FINAL-WORKING base + chat memory + Google Sheets
- Google Sheets entegrasyonu karmaşık
- google-sheets-loader.json ayrı workflow gerektirir
- Hata riski daha fazla
- Dinamik güncelleme var (ama gerek yok genelde)

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

## 🚀 Hızlı Başlangıç (v4-MEMORY-ONLY)

### 1. PostgreSQL Table Oluştur

Supabase Dashboard → SQL Editor → [`setup-v4-database.sql`](./setup-v4-database.sql) çalıştır:

```sql
-- Chat History (sadece bu table gerekli!)
CREATE TABLE IF NOT EXISTS public.chat_history (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_history_session
ON public.chat_history(session_id, created_at);
```

**Sadece 1 table! Google Sheets YOK!** ✅

### 2. n8n'e Import Et

```bash
git clone https://github.com/tascigurur/tascigurur.git
cd tascigurur
```

**Tek Workflow:**
- n8n → Import → **`rota-reformer-v4-MEMORY-ONLY.json`**
- Credentials: Postgres, OpenAI API, Header Auth
- Active et
- Webhook URL kopyala → Evolution API'ye set et

**HEPSI BU!** Başka workflow yok, Google Sheets yok! ✅

### 3. Test Et!

```
"Combo Cadillac 3 tane ne kadar?"
→ "186.000 TL + KDV. Koordinatörümüz arasın mı?"

"Evet"
→ Chat Memory hatırlıyor ✅
→ Koordinatöre mesaj gidiyor ✅

"Combo Cadillac özellikleri?"
→ System prompt'taki bilgi ✅
→ Doğru fiyat ve specs veriyor ✅
```

---

## 📚 Dokümantasyon

### Ana Rehberler
- **⭐ V4-MEMORY-ONLY:** [V4-MEMORY-ONLY-SETUP-GUIDE.md](./V4-MEMORY-ONLY-SETUP-GUIDE.md) - **TAVSİYE EDİLEN**
- **V4 with Sheets:** [V4-SETUP-GUIDE.md](./V4-SETUP-GUIDE.md) - Google Sheets ile (karmaşık)
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

## 🎯 MİMARİ (v4-MEMORY-ONLY)

```
Webhook (WhatsApp message)
  ↓
Load Chat History (Postgres) ← Son 20 mesaj
  ↓
Build Messages (Code)
  ├─ System prompt (TÜM bilgi burada!)
  ├─ Chat history ekle
  └─ User message ekle
  ↓
Save User Message → OpenAI API → Save Assistant
  ↓
Parse Response (Extract TAGs)
  ↓
IF Image / Catalog / Pricelist / Sales
  ↓
Send HTTP Request (Evolution API)
```

**Tek workflow! Başka workflow yok!** ✅

---

## 📝 Lisans

MIT License

## 👨‍💻 Geliştirici

[@tascigurur](https://github.com/tascigurur)

---

## 🎉 v4-MEMORY-ONLY Avantajları

✅ **Garanti çalışır** - FINAL-WORKING base
✅ **Chat memory** - Konuşmaları hatırlar
✅ **Basit yapı** - 1 workflow, 1 table, 3 credential
✅ **Kolay yönetim** - System prompt düzenle, hemen aktif
✅ **Production-ready** - Tüm özellikler aktif
✅ **NO karmaşa** - Google Sheets yok, AI Agent yok

**Bu workflow GERÇEKTEN çalışır ve basittir!** 🚀
