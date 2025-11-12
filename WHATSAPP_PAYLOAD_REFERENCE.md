# 📱 WhatsApp Webhook Payload Reference

## Normal Mesaj (Quote Yok)

```json
{
  "body": {
    "event": "messages.upsert",
    "instance": "rotawp",
    "data": {
      "key": {
        "remoteJid": "905551234567@s.whatsapp.net",
        "fromMe": false,
        "id": "3EB0XXXXXXXXXXXXX"
      },
      "message": {
        "conversation": "3 combo cadillac ne kadar?"
      },
      "messageTimestamp": "1699876543",
      "pushName": "Ahmet Yılmaz"
    }
  }
}
```

**Özellikler:**
- ✅ `conversation` alanı var
- ❌ `extendedTextMessage` yok
- ❌ `contextInfo` yok
- **Sonuç:** Normal mesaj, quote yok

---

## Reply/Quote Mesajı (EN ÖNEMLİ!)

```json
{
  "body": {
    "event": "messages.upsert",
    "instance": "rotawp",
    "data": {
      "key": {
        "remoteJid": "905551234567@s.whatsapp.net",
        "fromMe": false,
        "id": "3EB0YYYYYYYYYYYYYY"
      },
      "message": {
        "extendedTextMessage": {
          "text": "evet arayabilir",
          "contextInfo": {
            "stanzaId": "3EB0XXXXXXXXXXXXX",
            "participant": "905551234567@s.whatsapp.net",
            "quotedMessage": {
              "conversation": "314.000 TL + KDV. Size özel indirimli fiyat için koordinatörümüz sizi arasın mı?"
            }
          }
        }
      },
      "messageTimestamp": "1699876600",
      "pushName": "Ahmet Yılmaz"
    }
  }
}
```

**Özellikler:**
- ✅ `extendedTextMessage` var
- ✅ `contextInfo` var
- ✅ `quotedMessage` var
- ✅ `quotedMessage.conversation` = Alıntılanan mesaj
- **Sonuç:** Müşteri bir mesajı alıntılayarak/reply'layarak cevap veriyor!

---

## Kod'da Parse Etme

### Mevcut Kod (YANLIŞ)
```javascript
// ❌ Sadece mesaj metnini alıyor
const userMessage = webhookData.body.data.message?.conversation ||
                   webhookData.body.data.message?.extendedTextMessage?.text || '';
```

**Sorun:** `quotedMessage` bilgisi hiç alınmıyor!

### Düzeltilmiş Kod (DOĞRU)
```javascript
// ✅ Hem mesajı hem de quote bilgisini alıyor
const messageData = webhookData.body.data.message || {};
const userMessage = messageData.conversation ||
                   messageData.extendedTextMessage?.text || '';

// Extract quoted message
let quotedMessage = null;
let isReplyToMessage = false;

if (messageData.extendedTextMessage?.contextInfo?.quotedMessage) {
  const quotedMsg = messageData.extendedTextMessage.contextInfo.quotedMessage;
  quotedMessage = quotedMsg.conversation ||
                 quotedMsg.extendedTextMessage?.text ||
                 null;
  isReplyToMessage = true;
}

console.log('User message:', userMessage);
console.log('Is reply:', isReplyToMessage);
console.log('Quoted message:', quotedMessage);
```

---

## Mesaj Türleri

### 1. Conversation (Normal Metin)
```json
{
  "message": {
    "conversation": "merhaba"
  }
}
```

### 2. Extended Text (Quote ile Metin)
```json
{
  "message": {
    "extendedTextMessage": {
      "text": "evet",
      "contextInfo": {
        "quotedMessage": { ... }
      }
    }
  }
}
```

### 3. Image (Görsel)
```json
{
  "message": {
    "imageMessage": {
      "url": "...",
      "mimetype": "image/jpeg",
      "caption": "Bu ürünün fiyatı ne kadar?"
    }
  }
}
```

### 4. Document (Dosya)
```json
{
  "message": {
    "documentMessage": {
      "url": "...",
      "mimetype": "application/pdf",
      "fileName": "katalog.pdf"
    }
  }
}
```

---

## Context Info Detayları

### contextInfo Objesinin İçindekiler

```json
{
  "contextInfo": {
    "stanzaId": "3EB0XXXXXXXXXXXXX",        // Alıntılanan mesajın ID'si
    "participant": "905551234567@s.whatsapp.net",  // Gönderen
    "quotedMessage": {
      "conversation": "314.000 TL + KDV..."  // Alıntılanan mesaj içeriği
    },
    "mentionedJid": [],                      // Etiketlenen kişiler (varsa)
    "isForwarded": false,                    // Forward mu?
    "forwardingScore": 0
  }
}
```

---

## Parse Logic Akış Şeması

```
Webhook gelen mesaj
        |
        v
message.conversation var mı?
   |            |
  YES          NO
   |            |
   v            v
NORMAL     message.extendedTextMessage var mı?
MESAJ              |            |
              YES          NO
               |            |
               v            v
        contextInfo var mı?   IMAGE/DOC/AUDIO
          |            |
        YES          NO
         |            |
         v            v
    QUOTE MESAJ   NORMAL TEXT
    (quotedMessage   (text alanı)
     içeriğini al)
```

---

## Log Örnekleri

### Başarılı Quote Detection
```
=== MESSAGE INFO ===
User message: evet arayabilir
Is reply: true
Quoted message: 314.000 TL + KDV. Size özel indirimli fiyat için koordinatörümüz sizi arasın mı?

=== BUILD MESSAGES ===
Messages: 8, History: 5
Enhanced message: YES

=== AI RESPONSE ===
Harika! Talebinizi koordinatörüme ilettim.

[SALES]

En kısa sürede sizi arayacak.
```

### Normal Mesaj (Quote Yok)
```
=== MESSAGE INFO ===
User message: katalog var mı
Is reply: false
Quoted message: null

=== BUILD MESSAGES ===
Messages: 7, History: 5
Enhanced message: NO

=== AI RESPONSE ===
Katalog PDF'ini gönderiyorum.

[CATALOG]
```

---

## Debugging WhatsApp Payload

### n8n'de Full Payload Görmek

**Build Messages node'una ekle:**
```javascript
// En üste ekle
console.log('=== FULL WEBHOOK PAYLOAD ===');
console.log(JSON.stringify(webhookData, null, 2));
```

**n8n Execution Log'da göreceksin:**
```json
{
  "body": {
    "event": "messages.upsert",
    "instance": "rotawp",
    "data": {
      "key": { ... },
      "message": { ... },
      ...
    }
  }
}
```

### Specific Field Debug

```javascript
const msg = webhookData.body.data.message;

console.log('=== MESSAGE STRUCTURE ===');
console.log('Has conversation:', !!msg?.conversation);
console.log('Has extendedTextMessage:', !!msg?.extendedTextMessage);
console.log('Has contextInfo:', !!msg?.extendedTextMessage?.contextInfo);
console.log('Has quotedMessage:', !!msg?.extendedTextMessage?.contextInfo?.quotedMessage);

if (msg?.extendedTextMessage?.contextInfo?.quotedMessage) {
  console.log('=== QUOTED MESSAGE CONTENT ===');
  console.log(msg.extendedTextMessage.contextInfo.quotedMessage);
}
```

---

## Evolution API Ayarları

### Webhook URL
```
https://your-n8n-instance.com/webhook/whatsapp-final
```

### Events to Listen
```json
{
  "events": [
    "messages.upsert",
    "messages.update",
    "send.message"
  ]
}
```

### Headers
```
apikey: YOUR_EVOLUTION_API_KEY
```

---

## Testler için cURL Örnekleri

### Test 1: Normal Mesaj
```bash
curl -X POST https://your-n8n.com/webhook/whatsapp-final \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "event": "messages.upsert",
      "instance": "rotawp",
      "data": {
        "key": {
          "remoteJid": "905551234567@s.whatsapp.net",
          "fromMe": false
        },
        "message": {
          "conversation": "3 combo ne kadar?"
        }
      }
    }
  }'
```

### Test 2: Quote Mesajı
```bash
curl -X POST https://your-n8n.com/webhook/whatsapp-final \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "event": "messages.upsert",
      "instance": "rotawp",
      "data": {
        "key": {
          "remoteJid": "905551234567@s.whatsapp.net",
          "fromMe": false
        },
        "message": {
          "extendedTextMessage": {
            "text": "evet arayabilir",
            "contextInfo": {
              "quotedMessage": {
                "conversation": "314.000 TL + KDV. Koordinatörümüz arasın mı?"
              }
            }
          }
        }
      }
    }
  }'
```

---

## Olası Sorunlar ve Çözümler

### Sorun 1: quotedMessage Her Zaman null

**Olası nedenler:**
1. Evolution API ayarları eksik
2. WhatsApp Business API quota aşılmış
3. Webhook version eski

**Çözüm:**
```bash
# Evolution API ayarlarını kontrol et
curl https://evolution.qotomasyon.com/instance/settings/rotawp \
  -H "apikey: YOUR_API_KEY"

# Webhook version'ı güncelle
curl -X PUT https://evolution.qotomasyon.com/webhook/set/rotawp \
  -H "apikey: YOUR_API_KEY" \
  -d '{
    "enabled": true,
    "url": "https://your-n8n.com/webhook/whatsapp-final",
    "events": ["messages.upsert"]
  }'
```

### Sorun 2: extendedTextMessage Gelmiyor

**Neden:** WhatsApp bazı durumlarda sadece `conversation` gönderiyor.

**Çözüm:**
```javascript
// Her iki durumu handle et
const userMessage = messageData.conversation ||
                   messageData.extendedTextMessage?.text || '';
```

### Sorun 3: contextInfo Var Ama quotedMessage Yok

**Neden:** Müşteri bir mesajı forward etmiş veya mention kullanmış.

**Çözüm:**
```javascript
// Guard check ekle
if (messageData.extendedTextMessage?.contextInfo?.quotedMessage) {
  // Sadece quotedMessage varsa işle
  quotedMessage = extractQuotedMessage();
}
```

---

## Best Practices

### 1. Always Check Nested Objects
```javascript
// ❌ YANLIŞ - Crash riski
const quoted = msg.extendedTextMessage.contextInfo.quotedMessage.conversation;

// ✅ DOĞRU - Safe
const quoted = msg?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation || null;
```

### 2. Log Everything During Development
```javascript
if (process.env.NODE_ENV === 'development') {
  console.log('=== DEBUG ===');
  console.log(JSON.stringify(webhookData, null, 2));
}
```

### 3. Fallback Messages
```javascript
const quotedText = quotedMsg?.conversation ||
                  quotedMsg?.extendedTextMessage?.text ||
                  quotedMsg?.imageMessage?.caption ||
                  'media message';
```

### 4. Type Checking
```javascript
if (typeof quotedMessage === 'string' && quotedMessage.length > 0) {
  // Process quoted message
}
```

---

## Kaynaklar

- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)
- [Evolution API Docs](https://doc.evolution-api.com/)
- [n8n Webhook Docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)

---

**Son güncelleme:** 2025-11-12
