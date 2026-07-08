#!/usr/bin/env bash
# Create (or update) a Vapi assistant from assistant.json.
#
# Usage:
#   VAPI_API_KEY=sk-... ./create-assistant.sh                # create
#   VAPI_API_KEY=sk-... ./create-assistant.sh <assistant-id> # update existing
#
# Before running:
#   1. Render prompts/system-prompt.md with the client's intake answers and
#      paste it into assistant.json -> model.messages[0].content
#   2. Replace YOUR-WEBHOOK-HOST and the transferCall number
#   3. Sanity-check fields against https://docs.vapi.ai/api-reference/assistants/create

set -euo pipefail
cd "$(dirname "$0")"

: "${VAPI_API_KEY:?Set VAPI_API_KEY to your Vapi private API key}"

if grep -q "PASTE_RENDERED_SYSTEM_PROMPT_HERE" assistant.json; then
  echo "ERROR: assistant.json still has the placeholder system prompt." >&2
  echo "Render prompts/system-prompt.md and paste it into model.messages[0].content first." >&2
  exit 1
fi

if grep -q "YOUR-WEBHOOK-HOST" assistant.json; then
  echo "WARNING: webhook URLs still point at YOUR-WEBHOOK-HOST — tools won't work until you replace them." >&2
fi

if [ $# -ge 1 ]; then
  echo "Updating assistant $1 ..."
  curl -fsS -X PATCH "https://api.vapi.ai/assistant/$1" \
    -H "Authorization: Bearer $VAPI_API_KEY" \
    -H "Content-Type: application/json" \
    -d @assistant.json
else
  echo "Creating assistant ..."
  curl -fsS -X POST "https://api.vapi.ai/assistant" \
    -H "Authorization: Bearer $VAPI_API_KEY" \
    -H "Content-Type: application/json" \
    -d @assistant.json
fi

echo
echo "Done. Next: buy a phone number in the Vapi dashboard and attach this assistant to it."
