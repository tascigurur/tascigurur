# Google Sheets Sorun Giderme

## ❌ Hata: "Sheet with ID Urun Bilgi not found"

Bu hata genellikle 3 nedenden kaynaklanır:

### 1. Tab İsimleri Tam Eşleşmiyor ⭐ EN YAGIN

**Kontrol Et:**

Google Sheets'i aç ve tab isimlerini **TAM OLARAK** kontrol et:
- İsim: `Urun Bilgi` (büyük U, boşluk var)
- İsim: `S.S.S` (noktalarla)

**Düzelt:**

**A) Sheet'teki tab isimlerini değiştir (Önerilen):**
1. Google Sheets'i aç
2. Tab'a sağ tık → "Rename"
3. Tam olarak `Urun Bilgi` yaz (büyük/küçük harf önemli!)
4. Diğer tab için: `S.S.S`

**B) VEYA workflow'daki isimleri değiştir:**
- n8n'de workflow'u aç
- "Read Products" node → sheetName → Sheet'teki tam ismi yaz
- "Read FAQ" node → sheetName → Sheet'teki tam ismi yaz

### 2. Google Sheets Public Değil

**Kontrol Et:**
https://docs.google.com/spreadsheets/d/1cCXNnB7t8m32LQvhrcPxgxM4lHE-NfzlCtISbr7_EyQ/edit

**Düzelt:**
1. Google Sheets → Share (sağ üst)
2. "Anyone with the link" → **Viewer**
3. Copy link → Aynı olmalı

### 3. Google Sheets Credential Hatalı

**Kontrol Et:**
- n8n → Credentials → Google Sheets OAuth2
- Test connection çalışıyor mu?

**Düzelt:**
- Yeniden OAuth2 yap
- Google account ile authorize et

---

## ✅ Doğru Çalışması İçin

### Google Sheets Yapısı

**Urun Bilgi tab'ı (sütunlar):**
```
Ürün | Açıklama | Özellikler | Fiyat | Teslimat | Garanti
```

**S.S.S tab'ı (sütunlar):**
```
Soru | Cevap | Kategori
```

### Test Et

1. **Manuel test:**
   - n8n → google-sheets-loader workflow
   - "Execute workflow" button
   - Hatayı göreceksin veya başarılı olacak

2. **Log kontrol:**
   - n8n → Executions → En son execution
   - "Read Products" node → Error mesajı ne diyor?
   - Tam hata mesajını oku

### Hata Mesajları ve Çözümleri

| Hata | Çözüm |
|------|-------|
| "Sheet with ID ... not found" | Tab ismi yanlış - düzelt |
| "403 Forbidden" | Sheet public değil - share yap |
| "401 Unauthorized" | Credential hatalı - yeniden OAuth |
| "Invalid credentials" | Google Sheets credential ekle |

---

## 🔧 Debug Adımları

### 1. Tab İsimlerini Kontrol Et
```
Google Sheets → Tab isimleri:
- Tam: "Urun Bilgi" (boşlukla)
- Tam: "S.S.S" (noktalarla)
```

### 2. Manuel Test
```
n8n → google-sheets-loader → Execute workflow
→ Hangi node'da hata veriyor?
→ Hata mesajı tam olarak ne?
```

### 3. Credential Test
```
n8n → Credentials → Google Sheets OAuth2
→ Test connection
→ Başarılı mı?
```

---

## ✅ Çalışır Duruma Getirme

1. **Google Sheets'i kontrol et:**
   - Tab isimleri: `Urun Bilgi` ve `S.S.S`
   - Public: "Anyone with link can view"
   - Sütunlar doğru mu?

2. **n8n'de workflow'u import et:**
   - Yeni `google-sheets-loader.json` (düzeltilmiş)
   - Google Sheets credential ekle
   - Manuel çalıştır

3. **Başarılı olursa:**
   - Schedule aktif et (her 1 saat)
   - PostgreSQL'de kontrol et:
     ```sql
     SELECT COUNT(*) FROM product_knowledge;
     -- 0'dan fazla olmalı
     ```

4. **v4 workflow'u test et:**
   - "Combo Cadillac özellikleri?"
   - Google Sheets'ten bilgi veriyor mu?
