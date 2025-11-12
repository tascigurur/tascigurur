// ============================================
// PARSE RESPONSE NODE - V2
// Extracts [TALEP] and [ARIZA] info for coordinator
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

// ✅ NEW: Extract TALEP and ARIZA info
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
  .replace(/\[TALEP:[^\]]+\]/g, '') // ✅ NEW: Remove TALEP tag from customer message
  .replace(/\[SALES\]/g, '')
  .replace(/\[ARIZA:[^\]]+\]/g, '') // ✅ NEW: Remove ARIZA tag from customer message
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

return {
  json: {
    recipient: recipientNumber,
    customerMessage: cleanMessage,
    hasImageTag,
    hasCatalogTag,
    hasPricelistTag,
    hasSalesTag,
    hasIssueTag,
    talepInfo,  // ✅ NEW: Pass to coordinator node
    arizaInfo,  // ✅ NEW: Pass to coordinator node
    productName,
    fullAiResponse: aiMessage
  }
};
