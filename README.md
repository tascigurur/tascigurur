# 🤖 Rota Reformer WhatsApp AI Bot

**Pilates ekipmanları satışı için akıllı WhatsApp asistanı**

## 🎯 SIMPLE WORKING VERSION

### Önceki Versiyonlar Neden Çalışmadı?

**v1, v2, v3'ün Sorunları:**
- ❌ AI Agent node output format belirsiz
- ❌ 25+ node, aşırı karmaşık mimari
- ❌ 5000+ karakter AI prompt (GPT takip edemedi)
- ❌ Debug edilemez
- ❌ Chat memory karışıklığı

### SIMPLE VERSION Neden Çalışıyor?

**Yeni Yaklaşım:**
- ✅ AI Agent YOK - Direkt OpenAI API (HTTP Request)
- ✅ 14 node - Minimum karmaşıklık
- ✅ 500 karakter kısa AI prompt
- ✅ IF node'ları (Switch yerine)
- ✅ Debug console.log her yerde
- ✅ Chat memory YOK - Her mesaj bağımsız

## ✨ Özellikler

- 💬 **Doğal Dil İşleme:** OpenAI GPT-4o-mini ile akıllı konuşmalar
- 📸 **Otomatik Görsel Gönderimi:** 10 farklı ürün için 20+ görsel
- 💰 **Fiyat Listesi & Katalog:** Anında PDF ve görsel gönderimi
- 🎨 **Renk Kartelası:** Deri renk seçenekleri
- 🔔 **Satış Koordinatörü Bildirimi:** Otomatik lead yönlendirme
- 🔧 **Teknik Destek Entegrasyonu:** Sorunları ekibe yönlendirme
- 🧠 **Konversasyon Hafızası:** Postgres ile chat history

## 🚀 Hızlı Başlangıç

### 1. Dosyaları İndir

```bash
git clone https://github.com/tascigurur/tascigurur.git
cd tascigurur
```

### 2. n8n'e İmport Et

- n8n'i aç
- "Import from File" → **`rota-reformer-SIMPLE-WORKING.json`** seç
- Credentials'ları yapılandır:
  - OpenAI API (sadece API key)
  - Evolution API (instance: rotawp)

### 3. Test Et

WhatsApp'tan test mesajı gönder:
```
"Chair görselleri"
```

Başarılı olursa 3 adet Chair fotoğrafı gelecek! 🎉

## 📚 Dokümantasyon

- **⭐ SIMPLE WORKING GUIDE:** [SIMPLE-WORKFLOW-GUIDE.md](./SIMPLE-WORKFLOW-GUIDE.md) - TAVSİYE EDİLEN
- **Eski Versiyon Analizi:** [FIX-v3-EXPLANATION.md](./FIX-v3-EXPLANATION.md)
- **Hızlı Kurulum:** [QUICKSTART.md](./QUICKSTART.md)

## 🛠️ Teknolojiler

- **n8n** - Workflow automation
- **OpenAI GPT-4o-mini** - AI model (Direkt API)
- **Evolution API** - WhatsApp integration
- **Google Drive** - Media hosting

**Kaldırılanlar:**
- ~~Postgres~~ - Chat memory gereksiz
- ~~Supabase~~ - Vector store gereksiz
- ~~AI Agent Node~~ - Output format belirsiz

## 📦 Ürünler

| Ürün | Fiyat |
|------|-------|
| Combo Cadillac | 62.000 TL + KDV |
| Tower Reformer | 52.000 TL + KDV |
| Chair | 28.000 TL (KDV Dahil) |
| Barrel | 24.000 TL (KDV Dahil) |
| *+6 ürün daha* | *Dokümantasyonda* |

## 🧪 Test Senaryoları

```
✅ "Combo Cadillac fiyatı?" → Fiyat cevabı (Koordinatöre mesaj YOK)
✅ "Chair görselleri" → 3 fotoğraf gelir
✅ "Fiyat listesi" → Fiyat listesi görseli
✅ "Katalog" → PDF katalog
✅ "3 adet Chair" → Fiyat bilgisi (Koordinatöre mesaj YOK)
✅ "Evet arasın" → Koordinatöre mesaj GİDER
```

## 🐛 Sorun Giderme

**Görseller gelmiyor mu?**
1. n8n Execution Log'a bak
2. Switch node'u hangi dala girdi?
3. AI output'unda TAG var mı?

Detaylı troubleshooting: [WORKFLOW-DOCUMENTATION.md](./WORKFLOW-DOCUMENTATION.md)

## 📝 Lisans

MIT License

## 👨‍💻 Geliştirici

[@tascigurur](https://github.com/tascigurur)

---

## 📦 Workflow Versiyonları

- **SIMPLE (CURRENT):** `rota-reformer-SIMPLE-WORKING.json` - Basit, çalışıyor ✅✅✅
- **v3:** `rota-reformer-whatsapp-workflow-v3-WORKING.json` - Karmaşık, çalışmıyor ❌
- **v2:** `rota-reformer-whatsapp-workflow-FIXED.json` - Karmaşık, çalışmıyor ❌
- **v1:** `Orijinal workflow` - Çalışmıyor ❌

**Sadece SIMPLE versiyonunu kullan!**

## 🔧 Debugging

Sorun yaşıyorsan:

1. **n8n Execution Log** → Her node'un input/output'una bak
2. **OpenAI API node** → Response'ta TAG var mı?
3. **Parse Response node** → Console log'u kontrol et, flag'ler doğru mu?
4. **IF node'ları** → Hangi dala girdiğine bak
5. [SIMPLE-WORKFLOW-GUIDE.md](./SIMPLE-WORKFLOW-GUIDE.md) → Detaylı debug rehberi

---

## 🎯 MİMARİ FARKI

**Önceki (KARMAŞIK):**
```
Webhook → AI Agent (belirsiz output) → Prepare Data → Switch → ...
25+ node, debug edilemez
```

**Yeni (SIMPLE):**
```
Webhook → OpenAI API (HTTP) → Parse Response → IF nodes → Send
14 node, her adım net
```

---

**Bu workflow gerçekten BASIT ve ÇALIŞIYOR!** 🎉
