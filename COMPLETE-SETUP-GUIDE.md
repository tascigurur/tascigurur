# COMPLETE Workflow - Tam Kurulum Rehberi

## 🎯 EN DOĞRU VE TAM ÇÖZÜM

Bu workflow **v3'ün başarılı yapısını koruyup** sadece hatalı Evolution API node'larını HTTP Request ile değiştiriyor.

---

## ✅ v3'ten KORUNAN YAPILAR

### 1. **AI Agent (LangChain)** ✅
- n8n'nin native AI Agent node'u
- Otomatik conversation management
- Tool calling desteği

### 2. **Postgres Chat Memory** ✅
- n8n otomatik yönetiyor
- `session_id` bazlı chat history
- Önceki konuşmaları hatırlıyor

### 3. **Supabase Vector Store** ✅
- **RAG (Retrieval Augmented Generation)**
- Ürün bilgileri embedding olarak saklı
- "Combo Cadillac özellikleri?" → Vector store'dan ilgili bilgiyi çeker
- Long-term knowledge base

### 4. **OpenAI Chat Model** ✅
- GPT-4o-mini
- n8n credential yönetimi

---

## ❌ v3'ten DEĞİŞTİRİLEN

### Evolution API Node'ları → HTTP Request ✅

**Neden?**
- Evolution API n8n node'u parameter hataları veriyordu
- "Could not get parameter", "Operation not supported" hataları
- HTTP Request ile direkt API çağrısı daha stabil

**7 Node Değiştirildi:**
1. Send to Customer → HTTP Request (sendText)
2. Send Coordinator Sales → HTTP Request (sendText)
3. Send Coordinator Technical → HTTP Request (sendText)
4. Send Product Images → HTTP Request (sendMedia/image)
5. Send Color Card → HTTP Request (sendMedia/image)
6. Send Price List → HTTP Request (sendMedia/image)
7. Send Catalog PDF → HTTP Request (sendMedia/document)

---

## 🗄️ Veritabanı Yapısı

### 1. PostgreSQL (Supabase)

#### Chat History Table
```sql
CREATE TABLE IF NOT EXISTS public.chat_history (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_history_session
ON public.chat_history(session_id, created_at);
```

**n8n Postgres Chat Memory** bu table'ı otomatik kullanıyor!

#### Documents Table (Vector Store için)
```sql
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  metadata JSONB,
  embedding vector(1536)
);

CREATE INDEX ON public.documents
USING ivfflat (embedding vector_cosine_ops);
```

### 2. Supabase Vector Store Setup

**Önemli:** Supabase'de `pgvector` extension aktif olmalı:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## 📊 Mimari

```
Webhook
  ↓
AI Agent (LangChain)
  ├─ Postgres Chat Memory (konuşma geçmişi)
  ├─ Supabase Vector Store (RAG - ürün bilgileri)
  ├─ OpenAI Chat Model (GPT-4o-mini)
  └─ Tools: None (prompt-based tag system)
  ↓
Prepare Data (normalize AI output)
  ↓
Switch (TAG routing)
  ├─ [SEND_TO_SALES_COORDINATOR] → HTTP Request (sales)
  ├─ [SEND_TO_TECHNICAL_SUPPORT] → HTTP Request (technical)
  ├─ [SEND_COLOR_CARD] → HTTP Request (color card)
  ├─ [SEND_CATALOG] → HTTP Request (PDF catalog)
  ├─ [SEND_PRICE_LIST_IMAGE] → HTTP Request (price list)
  └─ [SEND_PRODUCT_IMAGES] → Prepare Images → HTTP Request (images loop)
  ↓
Format Message (remove tags)
  ↓
HTTP Request (send customer message)
  ↓
Respond to Webhook
```

---

## 🚀 Kurulum

### Adım 1: PostgreSQL Setup

Supabase Dashboard → SQL Editor:

```sql
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Chat history (n8n otomatik oluşturabilir ama elle de yapabilirsin)
CREATE TABLE IF NOT EXISTS public.chat_history (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_history_session
ON public.chat_history(session_id, created_at);

-- Documents table (vector store için)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  metadata JSONB,
  embedding vector(1536)
);

CREATE INDEX ON public.documents
USING ivfflat (embedding vector_cosine_ops);
```

### Adım 2: Ürün Bilgilerini Vector Store'a Ekle

```sql
-- Örnek: Combo Cadillac bilgisi
-- (Embedding'i OpenAI'dan alman gerekir, bu örnek)
INSERT INTO public.documents (content, metadata)
VALUES (
  'Combo Cadillac: En kapsamlı Pilates ekipmanımız. Tower ve Reformer özelliklerini birleştirir. 62.000 TL + KDV. Teslimat 2-3 hafta.',
  '{"product": "Combo Cadillac", "category": "equipment", "price": 62000}'::jsonb
);

-- Diğer ürünler için tekrarla...
```

**VEYA** n8n ile bulk upload workflow'u oluştur.

### Adım 3: n8n Import

1. **Import** → `rota-reformer-COMPLETE.json`
2. **Credentials bağla:**
   - Postgres account (Supabase)
   - Supabase API (vector store için)
   - OpenAI account
   - Header Auth (Evolution API key)

### Adım 4: Workflow'u Aktif Et

- Active toggle
- Webhook URL kopyala
- Evolution API'ye webhook ayarla

---

## ✨ Yeni Yetenekler (Vector Store ile)

### Senaryo 1: Ürün Detayları
```
Müşteri: "Combo Cadillac'ın özellikleri neler?"
→ Vector Store'dan ilgili döküman çekiliyor
→ AI detaylı bilgi veriyor (RAG sayesinde)
```

### Senaryo 2: Karşılaştırma
```
Müşteri: "Combo Cadillac ile Tower Reformer arasındaki fark?"
→ Vector Store'dan her iki ürünü çekiyor
→ AI karşılaştırmalı analiz yapıyor
```

### Senaryo 3: Konuşma Geçmişi
```
Müşteri: "Combo Cadillac 3 tane?"
AI: "186.000 TL + KDV. Koordinatörümüz arasın mı?"

Müşteri: "Evet"
→ Postgres Chat Memory sayesinde AI hatırlıyor
→ [SEND_TO_SALES_COORDINATOR] TAG gönderiyor ✅
```

---

## 🆚 Versiyon Karşılaştırması

| Özellik | FINAL-WORKING | WITH-MEMORY | **COMPLETE** |
|---------|---------------|-------------|--------------|
| Chat Memory | ❌ | ✅ Manuel | ✅ **Otomatik** |
| Vector Store (RAG) | ❌ | ❌ | ✅ **VAR** |
| Ürün Bilgisi | Prompt'ta hardcoded | Prompt'ta hardcoded | **Dinamik (RAG)** |
| "Evet" → [SALES] | ❌ | ✅ | ✅ |
| Evolution API | HTTP Request | HTTP Request | HTTP Request |
| AI Engine | HTTP Request | HTTP Request | **AI Agent** |
| Yönetim | Manuel | Manuel | **n8n Otomatik** |
| Karmaşıklık | Basit | Orta | **Profesyonel** |

---

## 🎯 Hangi Workflow'u Kullanmalıyım?

### 🥉 `rota-reformer-FINAL-WORKING.json`
- Chat memory YOK
- Her mesaj bağımsız
- Hızlı test için

### 🥈 `rota-reformer-WITH-MEMORY.json`
- Chat memory VAR (manuel)
- Vector store YOK
- Orta seviye

### 🥇 `rota-reformer-COMPLETE.json` ⭐ **ÖNERİLEN**
- Chat memory (otomatik)
- Vector Store (RAG)
- Tam özellikli
- **Production için**

---

## 🐛 Debug

### Postgres Chat History Kontrol
```sql
SELECT * FROM public.chat_history
WHERE session_id LIKE '%905368286231%'
ORDER BY created_at DESC
LIMIT 20;
```

### Vector Store Kontrol
```sql
SELECT content, metadata
FROM public.documents
LIMIT 10;
```

### Vector Search Test
```sql
-- Similarity search örneği
-- (pgvector extension gerekli)
SELECT content, metadata,
       1 - (embedding <=> '[0.1, 0.2, ...]'::vector) as similarity
FROM public.documents
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 5;
```

---

## 📈 Performans

- **Chat Memory**: n8n otomatik yönetiyor, cache kullanıyor
- **Vector Store**: pgvector IVFFlat index ile hızlı similarity search
- **HTTP Request**: Evolution API node'undan daha stabil

---

## 🎉 Sonuç

**`rota-reformer-COMPLETE.json`** = v3'ün başarılı yapısı + stabil Evolution API çağrıları

✅ AI Agent (LangChain)
✅ Postgres Chat Memory (otomatik)
✅ Supabase Vector Store (RAG)
✅ HTTP Request (stabil Evolution API)
✅ Full production-ready!
