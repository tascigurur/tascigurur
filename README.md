# 🤖 Rota Reformer WhatsApp AI Bot

**Pilates ekipmanları satışı için akıllı WhatsApp asistanı**

## 🚨 v3 - GEREKTİĞİNDE ÇALIŞAN VERSİYON

### Sorunlar ve Çözümler

#### Sorun 1: Gereksiz Koordinatör Mesajları ❌
Müşteri sadece fiyat sorsa bile koordinatöre mesaj gidiyordu.

**Çözüm:** AI prompt'u tamamen yeniden yazıldı. TAG'ler SADECE şu durumlarda:
- Görsel açıkça istendiğinde
- Satış talebi + müşteri "evet" dediğinde
- Teknik destek + müşteri onayı

#### Sorun 2: Görseller Gönderilmiyor ❌
AI "gönderiyorum" diyor ama görseller gitmiyor.

**Çözüm:** "Prepare Data" node'u eklendi:
- AI output'u normalize ediyor
- Debug log ekliyor
- Field adı garantiliyor

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
- "Import from File" → **`rota-reformer-whatsapp-workflow-v3-WORKING.json`** seç
- Credentials'ları yapılandır (OpenAI, Evolution API, Postgres, Supabase)

### 3. Test Et

WhatsApp'tan test mesajı gönder:
```
"Chair görselleri"
```

Başarılı olursa 3 adet Chair fotoğrafı gelecek! 🎉

## 📚 Dokümantasyon

- **v3 Sorun Çözümleri:** [FIX-v3-EXPLANATION.md](./FIX-v3-EXPLANATION.md)
- **Detaylı Workflow Dok:** [WORKFLOW-DOCUMENTATION.md](./WORKFLOW-DOCUMENTATION.md)
- **Hızlı Kurulum:** [QUICKSTART.md](./QUICKSTART.md)

## 🛠️ Teknolojiler

- **n8n** - Workflow automation
- **OpenAI GPT-4o-mini** - AI model
- **Evolution API** - WhatsApp integration
- **Postgres** - Chat memory
- **Supabase** - Vector store
- **Google Drive** - Media hosting

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
✅ "Chair fotoğrafları" → 3 görsel gelir
✅ "Fiyat listesi" → Fiyat listesi görseli gelir
✅ "Katalog" → PDF katalog gelir
✅ "Combo Cadillac 2 adet" → Koordinatöre bildirim
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

- **v3 (CURRENT):** `rota-reformer-whatsapp-workflow-v3-WORKING.json` - Tüm sorunlar giderildi ✅
- **v2:** `rota-reformer-whatsapp-workflow-FIXED.json` - Kısmi çalışıyor ⚠️
- **v1:** `Orijinal workflow` - Çalışmıyor ❌

## 🔧 Debugging

Sorun yaşıyorsan:

1. n8n Execution Log → Her node'un input/output'una bak
2. Prepare Data node → Console log'u kontrol et
3. Switch node → Hangi dala girdiğine bak
4. [FIX-v3-EXPLANATION.md](./FIX-v3-EXPLANATION.md) → Debug rehberini oku

---

**Bu workflow artık GEREKTİĞİNDE ÇALIŞIYOR!** 🎉
