// ============================================
// PARSE RESPONSE NODE - FINAL
// Extracts [TALEP] and [ARIZA] + Prepares coordinator messages
// ============================================

const buildData = $('Build Messages').first().json;
const openaiResponse = $json;

const aiMessage = openaiResponse.choices[0].message.content;
const recipientNumber = buildData.recipientNumber;

console.log('=== AI RESPONSE ===');
console.log(aiMessage);

const hasImageTag = aiMessage.includes('[IMAGE:');
const hasCatalogTag = aiMessage.includes('[CATALOG]');
const hasPricelistTag = aiMessage.includes('[PRICELIST]');
const hasSalesTag = aiMessage.includes('[SALES]');
const hasIssueTag = aiMessage.includes('[ISSUE]');

// ✅ Extract TALEP and ARIZA info
let talepInfo = null;
let arizaInfo = null;

if (hasSalesTag) {
  const talepMatch = aiMessage.match(/\[TALEP:([^\]]+)\]/);
  if (talepMatch) {
    talepInfo = talepMatch[1].trim();
  }
}

if (hasIssueTag) {
  const arizaMatch = aiMessage.match(/\[ARIZA:([^\]]+)\]/);
  if (arizaMatch) {
    arizaInfo = arizaMatch[1].trim();
  }
}

console.log('=== EXTRACTED INFO ===');
console.log(`TALEP: ${talepInfo}`);
console.log(`ARIZA: ${arizaInfo}`);

let productName = 'Chair';
if (hasImageTag) {
  const match = aiMessage.match(/\[IMAGE:([^\]]+)\]/);
  if (match) productName = match[1].trim();
}

let cleanMessage = aiMessage
  .replace(/\[IMAGE:[^\]]+\]/g, '')
  .replace(/\[CATALOG\]/g, '')
  .replace(/\[PRICELIST\]/g, '')
  .replace(/\[TALEP:[^\]]+\]/g, '')
  .replace(/\[SALES\]/g, '')
  .replace(/\[ARIZA:[^\]]+\]/g, '')
  .replace(/\[ISSUE\]/g, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

if (!cleanMessage || cleanMessage.length === 0) {
  if (hasCatalogTag) cleanMessage = 'Katalogumuz aşağıda.';
  else if (hasPricelistTag) cleanMessage = 'Fiyat listemiz aşağıda.';
  else if (hasImageTag) cleanMessage = `${productName} görsellerini gönderiyorum.`;
  else if (hasSalesTag) cleanMessage = 'Koordinatörümüze ilettim, en kısa sürede arayacak.';
  else if (hasIssueTag) cleanMessage = 'Arıza kaydınızı ilettim, en kısa sürede arayacak.';
  else cleanMessage = 'Teşekkür ederim!';
}

// ✅ Prepare coordinator messages
const coordinatorSalesMessage = `🔔 YENI SATIS TALEBI

Musteri: ${recipientNumber}

📦 TALEP:
${talepInfo || 'Bilgi mevcut değil'}

💬 Mesaj:
${cleanMessage}

Lutfen musteriyi arayin.`;

const coordinatorIssueMessage = `🔧 ARIZA KAYDI

Musteri: ${recipientNumber}

⚠️ ARIZA:
${arizaInfo || 'Bilgi mevcut değil'}

💬 Mesaj:
${cleanMessage}

Lutfen musteriyi arayin.`;

return {
  json: {
    recipient: recipientNumber,
    customerMessage: cleanMessage,
    hasImageTag,
    hasCatalogTag,
    hasPricelistTag,
    hasSalesTag,
    hasIssueTag,
    talepInfo,
    arizaInfo,
    productName,
    fullAiResponse: aiMessage,
    coordinatorSalesMessage,
    coordinatorIssueMessage
  }
};
