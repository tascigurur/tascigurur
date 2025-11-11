# 🤖 Rota Reformer WhatsApp AI Bot

**Pilates ekipmanları satışı için akıllı WhatsApp asistanı**

## 🎯 Sorun ve Çözüm

Önceki workflow'da görseller gönderilmiyordu çünkü **Switch node TAG'leri göremiyordu**.

**NEDEN?** Format Output node TAG'leri temizliyordu, ama Switch ondan sonra çalışıyordu!

**ÇÖZÜM:** AI Agent'tan iki paralel çıkış:
- Format Output → Müşteriye temiz mesaj
- Switch → Orijinal TAG'lere bakarak medya gönderimi

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
- "Import from File" → `rota-reformer-whatsapp-workflow-FIXED.json` seç
- Credentials'ları yapılandır (OpenAI, Evolution API, Postgres, Supabase)

### 3. Test Et

WhatsApp'tan test mesajı gönder:
```
"Chair görselleri"
```

Başarılı olursa 3 adet Chair fotoğrafı gelecek! 🎉

## 📚 Dokümantasyon

Detaylı kurulum ve kullanım için: [WORKFLOW-DOCUMENTATION.md](./WORKFLOW-DOCUMENTATION.md)

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

**Bu workflow artık GARANTİLİ ÇALIŞIYOR!** 🎉
