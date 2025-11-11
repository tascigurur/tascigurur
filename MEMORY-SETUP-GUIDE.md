# Chat Memory Kurulum Rehberi

## 🎯 İki Workflow Versiyonu

### 1. **rota-reformer-FINAL-WORKING.json** (Memory YOK)
- ✅ Tüm özellikler çalışıyor (görseller, katalog, fiyat listesi)
- ✅ HTTP Request ile Evolution API
- ❌ Chat geçmişi YOK - her mesaj bağımsız
- ❌ "Combo Cadillac 3 tane?" → "Evet" deyince AI hatırlamıyor

### 2. **rota-reformer-WITH-MEMORY.json** (Memory VAR) ⭐ ÖNERİLEN
- ✅ Tüm özellikler çalışıyor
- ✅ HTTP Request ile Evolution API
- ✅ **PostgreSQL chat geçmişi** - konuşma akışı korunuyor
- ✅ **"Combo Cadillac 3 tane?" → "Evet" akışı çalışıyor!**

---

## 📊 PostgreSQL Table Kurulumu

### Adım 1: Supabase'de SQL Çalıştır

1. **Supabase Dashboard** → **SQL Editor** aç
2. **`chat_history_table.sql`** dosyasını aç
3. Tüm SQL'i kopyala ve çalıştır:

```sql
CREATE TABLE IF NOT EXISTS public.chat_history (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_history_session
ON public.chat_history(session_id, created_at);
```

### Adım 2: Table'ın Oluştuğunu Doğrula

```sql
SELECT * FROM public.chat_history LIMIT 10;
```

Boş sonuç dönmeli (henüz data yok).

---

## 🔧 n8n Kurulum

### Adım 1: Workflow'u Import Et

1. n8n'i aç
2. **Import** → **`rota-reformer-WITH-MEMORY.json`** seç
3. Import et

### Adım 2: Credential'ları Bağla

Import sonrası bu credential'lar gerekli:

1. **Postgres account** (`gLNF0iMifzK0leX1`)
   - Eğer yoksa: **Credentials** → **Add Credential** → **Postgres**
   - Supabase connection string:
     ```
     Host: db.xxx.supabase.co
     Database: postgres
     User: postgres
     Password: [your-password]
     Port: 5432
     SSL: Require
     ```

2. **OpenAi account** (`QHlET4NCnG3Pea5C`)
   - OpenAI API key

3. **Header Auth account** (`hAnQyV038yh6r3vs`)
   - Name: `apikey`
   - Value: [Evolution API key]

### Adım 3: Workflow'u Aktif Et

- **Active** toggle'ı aç
- Webhook URL'i kopyala

---

## 🚀 Yeni Yapı

```
Webhook
  ↓
Load Chat History (Postgres) ← SON 20 mesajı yükle
  ↓
Build Messages (Code) ← History + yeni mesajı birleştir
  ↓
Save User Message (Postgres) ← User mesajını kaydet
  ↓
OpenAI API (HTTP Request) ← DYNAMIC messages array kullan
  ↓
Save Assistant Response (Postgres) ← AI cevabını kaydet
  ↓
Parse Response
  ↓
Send Text HTTP / Send Image HTTP / vb...
```

---

## ✨ Artık Çalışan Akış

### Senaryo: Miktar Hesaplama + Satış

**Mesaj 1:**
```
Müşteri: "Combo Cadillac 3 tane ne kadar?"
AI: "3 adet Combo Cadillac için toplam 186.000 TL + KDV tutuyor.
     Size özel indirimli fiyat için koordinatörümüz sizi arasın mı?"
```

**Mesaj 2:**
```
Müşteri: "Evet"
AI: "Harika! 3 adet Combo Cadillac talebinizi koordinatörüme ilettim.

[SALES]

En kısa sürede sizi arayacak."

→ Koordinatöre mesaj gidiyor! ✅
```

**NEDEN ÇALIŞIYOR?**
- PostgreSQL'de şu history var:
  ```
  {role: 'user', content: 'Combo Cadillac 3 tane ne kadar?'}
  {role: 'assistant', content: '186.000 TL + KDV. Koordinatörümüz arasın mı?'}
  {role: 'user', content: 'Evet'}
  ```
- AI bağlamı biliyor, `[SALES]` TAG'ini gönderiyor!

---

## 🐛 Debug

### Chat History Kontrol

```sql
-- Belirli session'ın geçmişini gör
SELECT session_id, role, content, created_at
FROM public.chat_history
WHERE session_id LIKE '%905368286231%'
ORDER BY created_at DESC
LIMIT 10;
```

### Chat History Temizle (Test İçin)

```sql
-- Belirli session'ı temizle
DELETE FROM public.chat_history
WHERE session_id LIKE '%905368286231%';

-- VEYA tüm history'yi temizle
TRUNCATE TABLE public.chat_history;
```

---

## 📈 Performans Notları

- **LIMIT 20**: Son 20 mesaj yükleniyor (GPT-4o-mini için yeterli, token limiti düşük tutar)
- **Index**: `session_id + created_at` üzerinde index var, sorgular hızlı
- **Retention**: İsterseniz 30 günlük otomatik temizleme ekleyebilirsiniz

---

## 🆚 Karşılaştırma

| Özellik | FINAL-WORKING | WITH-MEMORY |
|---------|---------------|-------------|
| Görseller | ✅ | ✅ |
| Katalog PDF | ✅ | ✅ |
| Fiyat Listesi | ✅ | ✅ |
| Miktar hesaplama | ✅ | ✅ |
| "Evet" → [SALES] | ❌ Çalışmaz | ✅ Çalışır |
| Chat geçmişi | ❌ | ✅ |
| PostgreSQL gerekli | ❌ | ✅ |
| Node sayısı | 14 | 18 |

---

## 🎯 Sonuç

**rota-reformer-WITH-MEMORY.json** kullan!

Artık müşteri:
1. "Combo Cadillac 3 tane?" dediğinde AI toplam hesaplar
2. "Evet arasın" dediğinde AI önceki konuşmayı hatırlar
3. [SALES] TAG gönderi koordinatöre mesaj gider! 🎉
