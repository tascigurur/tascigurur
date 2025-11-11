# 🤖 Rota Reformer WhatsApp AI Bot

**Pilates ekipmanları satışı için akıllı WhatsApp asistanı**

---

## 🎯 COMPLETE VERSION (Production-Ready) ⭐

### En Doğru Yaklaşım: v3'ün Başarılı Yapısı + Stabil API Çağrıları

**Dosya:** `rota-reformer-COMPLETE.json`

Bu versiyon **v3'ün tüm güçlü özelliklerini koruyup** sadece hatalı Evolution API node'larını HTTP Request ile değiştiriyor.

### ✅ v3'ten KORUNAN YAPILAR

- **AI Agent (LangChain)** - n8n'nin native AI engine
- **Postgres Chat Memory** - Otomatik konuşma geçmişi yönetimi
- **Supabase Vector Store** - RAG (Retrieval Augmented Generation) ile dinamik ürün bilgisi
- **OpenAI Chat Model** - GPT-4o-mini entegrasyonu

### ✅ DEĞİŞTİRİLEN

- ❌ Evolution API node'ları (hatalı) → ✅ **HTTP Request** (stabil)

### 🚀 Yeni Yetenekler

```
Müşteri: "Combo Cadillac'ın özellikleri neler?"
→ Vector Store'dan detaylı bilgi çekiliyor (RAG)
→ AI dinamik cevap veriyor

Müşteri: "Combo Cadillac 3 tane ne kadar?"
AI: "186.000 TL + KDV. Koordinatörümüz arasın mı?"

Müşteri: "Evet"
→ Chat Memory sayesinde AI hatırlıyor
→ [SALES] TAG → Koordinatöre mesaj gidiyor ✅
```

**Detaylı kurulum:** [COMPLETE-SETUP-GUIDE.md](./COMPLETE-SETUP-GUIDE.md)

---

## 📊 Workflow Versiyonları

| Versiyon | Chat Memory | Vector Store | Karmaşıklık | Durum |
|----------|-------------|--------------|-------------|-------|
| **COMPLETE** ⭐ | ✅ Otomatik | ✅ RAG | Profesyonel | **Production** |
| WITH-MEMORY | ✅ Manuel | ❌ | Orta | Test |
| FINAL-WORKING | ❌ | ❌ | Basit | Prototip |
| v3-ORIGINAL | ✅ | ✅ | Profesyonel | Hatalı API |

### 🥇 rota-reformer-COMPLETE.json (ÖNERİLEN)
- AI Agent + Postgres Memory + Vector Store (RAG)
- HTTP Request (stabil Evolution API)
- "Combo Cadillac 3 tane?" → "Evet" akışı ÇALIŞIYOR
- Dinamik ürün bilgisi (hardcode değil, vector store'dan)
- **Production-ready!**

### 🥈 rota-reformer-WITH-MEMORY.json
- Manuel Postgres chat history
- HTTP Request
- Vector store YOK
- Orta seviye

### 🥉 rota-reformer-FINAL-WORKING.json
- Chat memory YOK
- Her mesaj bağımsız
- Hızlı test için

---

## ✨ Özellikler

- 💬 **AI Agent:** LangChain ile güçlü conversation yönetimi
- 🧠 **Chat Memory:** Postgres ile otomatik konuşma geçmişi
- 📚 **Vector Store (RAG):** Supabase ile dinamik ürün bilgisi
- 📸 **Otomatik Görsel Gönderimi:** 10 farklı ürün için 20+ görsel
- 💰 **Fiyat Listesi & Katalog:** Anında PDF ve görsel gönderimi
- 🎨 **Renk Kartelası:** Deri renk seçenekleri
- 🔔 **Satış Koordinatörü:** Otomatik lead yönlendirme
- 🔧 **Teknik Destek:** Sorunları ekibe yönlendirme

---

## 🚀 Hızlı Başlangıç (COMPLETE)

### 1. PostgreSQL + pgvector Setup

Supabase Dashboard → SQL Editor:

```sql
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Chat history (n8n otomatik yönetir)
CREATE TABLE IF NOT EXISTS public.chat_history (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_history_session
ON public.chat_history(session_id, created_at);

-- Documents table (vector store)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  metadata JSONB,
  embedding vector(1536)
);

CREATE INDEX ON public.documents
USING ivfflat (embedding vector_cosine_ops);
```

### 2. n8n'e Import Et

```bash
git clone https://github.com/tascigurur/tascigurur.git
cd tascigurur
```

- n8n'i aç
- "Import from File" → **`rota-reformer-COMPLETE.json`** seç
- Credentials'ları yapılandır:
  - ✅ Postgres account (Supabase)
  - ✅ Supabase API (vector store)
  - ✅ OpenAI API
  - ✅ Header Auth (Evolution API key)

### 3. Ürün Bilgilerini Vector Store'a Ekle

```sql
INSERT INTO public.documents (content, metadata) VALUES
('Combo Cadillac: En kapsamlı Pilates ekipmanımız. Tower ve Reformer özelliklerini birleştirir. 62.000 TL + KDV.',
 '{"product": "Combo Cadillac", "price": 62000}'::jsonb);

-- Diğer ürünler için tekrarla...
```

### 4. Test Et!

```
Müşteri: "Combo Cadillac özellikleri?"
→ Vector Store'dan bilgi çekiliyor
→ AI detaylı cevap veriyor

Müşteri: "3 tane ne kadar?"
AI: "186.000 TL + KDV. Koordinatörümüz arasın mı?"

Müşteri: "Evet"
→ Chat Memory hatırlıyor
→ Koordinatöre mesaj gidiyor ✅
```

---

## 📚 Dokümantasyon

### Ana Rehberler
- **⭐ COMPLETE GUIDE:** [COMPLETE-SETUP-GUIDE.md](./COMPLETE-SETUP-GUIDE.md) - **TAVSİYE EDİLEN**
- **Memory Guide:** [MEMORY-SETUP-GUIDE.md](./MEMORY-SETUP-GUIDE.md)
- **Simple Guide:** [SIMPLE-WORKFLOW-GUIDE.md](./SIMPLE-WORKFLOW-GUIDE.md)

### Ek Dokümantasyon
- [QUICKSTART.md](./QUICKSTART.md) - Hızlı başlangıç
- [FIX-v3-EXPLANATION.md](./FIX-v3-EXPLANATION.md) - v3 analizi

---

## 🛠️ Teknolojiler

- **n8n** - Workflow automation
- **LangChain** - AI Agent framework (n8n native)
- **OpenAI GPT-4o-mini** - AI model
- **PostgreSQL + pgvector** - Chat history + Vector embeddings
- **Supabase** - Managed Postgres + Vector Store
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

---

## 🧪 Test Senaryoları

### Basit Sorgular
```
✅ "Combo Cadillac fiyatı?" → "62.000 TL + KDV"
✅ "Chair görselleri" → 3 fotoğraf
✅ "Fiyat listesi" → Fiyat listesi görseli
✅ "Katalog" → PDF katalog
```

### Kompleks Sorgular (Vector Store)
```
✅ "Combo Cadillac özellikleri?" → Vector Store'dan detaylı bilgi
✅ "Combo Cadillac ile Tower Reformer farkı?" → Karşılaştırmalı analiz
```

### Konuşma Akışı (Chat Memory)
```
✅ "Combo Cadillac 3 tane ne kadar?"
   → "186.000 TL + KDV. Koordinatörümüz arasın mı?"
✅ "Evet"
   → Chat Memory hatırlıyor
   → [SALES] TAG → Koordinatöre mesaj GİDER ✅
```

---

## 🔧 Debugging

### Postgres Chat History Kontrol
```sql
SELECT * FROM public.chat_history
WHERE session_id LIKE '%905368286231%'
ORDER BY created_at DESC
LIMIT 20;
```

### Vector Store Kontrol
```sql
SELECT content, metadata FROM public.documents LIMIT 10;
```

### n8n Execution Log
1. n8n → Executions → En son execution
2. Her node'un input/output'una bak
3. AI Agent → Output'ta TAG var mı?
4. Switch → Hangi dala girdi?

Detaylı troubleshooting: [COMPLETE-SETUP-GUIDE.md](./COMPLETE-SETUP-GUIDE.md)

---

## 🎯 MİMARİ

### COMPLETE (Production)
```
Webhook
  ↓
AI Agent (LangChain)
  ├─ Postgres Chat Memory (otomatik)
  ├─ Supabase Vector Store (RAG)
  └─ OpenAI Chat Model
  ↓
Switch (TAG routing)
  ├─ [SEND_TO_SALES_COORDINATOR] → HTTP Request
  ├─ [SEND_PRODUCT_IMAGES] → HTTP Request (loop)
  ├─ [SEND_CATALOG] → HTTP Request (PDF)
  └─ ...
  ↓
Format Message (remove tags)
  ↓
HTTP Request (customer message)
  ↓
Respond to Webhook
```

### Neden HTTP Request? (Evolution API yerine)
- Evolution API n8n node'u hatalı: "Could not get parameter"
- HTTP Request direkt endpoint çağrısı, daha stabil
- v3'ün başarılı yapısı korundu, sadece API çağrıları değişti

---

## 📝 Lisans

MIT License

## 👨‍💻 Geliştirici

[@tascigurur](https://github.com/tascigurur)

---

**Bu workflow v3'ün profesyonel yapısı + stabil Evolution API çağrıları ile GERÇEKTEN PRODUCTION-READY!** 🎉
