#!/usr/bin/env python3
import json

# Read the build messages v2 code
with open('/home/user/tascigurur/build-messages-fixed-v2.js', 'r') as f:
    build_messages_v2_code = f.read()

# Read the parse response v2 code
with open('/home/user/tascigurur/parse-response-fixed-v2.js', 'r') as f:
    parse_response_v2_code = f.read()

# Read the original workflow
with open('/home/user/tascigurur/workflow-improved.json', 'r') as f:
    workflow = json.load(f)

# Update workflow name
workflow['name'] = "Rota Reformer WhatsApp - v6 (COMPLETE: Quote + TALEP/ARIZA)"
workflow['versionId'] = "v6-COMPLETE"

# Find and update nodes
for node in workflow['nodes']:
    # Update Build Messages node
    if node['id'] == 'build-messages':
        node['parameters']['jsCode'] = build_messages_v2_code
        node['notes'] = "V2: Quote detection + TALEP/ARIZA tags in system prompt"

    # Update Parse Response node
    elif node['id'] == 'parse-response':
        node['parameters']['jsCode'] = parse_response_v2_code
        node['notes'] = "V2: Extracts TALEP and ARIZA info for coordinator"

    # Update Send Coordinator HTTP node
    elif node['id'] == 'send-coordinator-http':
        node['parameters']['jsonBody'] = "={{ {\\n  number: '905539644020',\\n  text: `🔔 YENI SATIS TALEBI\\n\\nMusteri: ${$json.recipient}\\n\\n📦 TALEP:\\n${$json.talepInfo || 'Bilgi mevcut değil'}\\n\\n💬 Mesaj:\\n${$json.customerMessage}\\n\\nLutfen musteriyi arayin.`\\n} }}"
        node['notes'] = "V2: Shows detailed TALEP info to coordinator"

    # Update Send Issue Coordinator HTTP node
    elif node['id'] == 'send-issue-coordinator-http':
        node['parameters']['jsonBody'] = "={{ {\\n  number: '905539644020',\\n  text: `🔧 ARIZA KAYDI\\n\\nMusteri: ${$json.recipient}\\n\\n⚠️ ARIZA:\\n${$json.arizaInfo || 'Bilgi mevcut değil'}\\n\\n💬 Mesaj:\\n${$json.customerMessage}\\n\\nLutfen musteriyi arayin.`\\n} }}"
        node['notes'] = "V2: Shows detailed ARIZA info to coordinator"

# Save the complete workflow
with open('/home/user/tascigurur/workflow-complete-v6.json', 'w') as f:
    json.dump(workflow, f, ensure_ascii=False, indent=2)

print("✅ Complete workflow created: workflow-complete-v6.json")
print("📦 Ready to import to n8n!")
print("")
print("Changes applied:")
print("  1. Build Messages → V2 (with [TALEP] and [ARIZA] tags)")
print("  2. Parse Response → V2 (extracts TALEP and ARIZA info)")
print("  3. Send Coordinator HTTP → Shows detailed TALEP")
print("  4. Send Issue Coordinator HTTP → Shows detailed ARIZA")
