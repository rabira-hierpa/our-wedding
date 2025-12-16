#!/bin/bash

# Telegram Webhook Status Checker
# This script checks the current webhook status

if [ -z "$1" ]; then
  echo "Usage: ./scripts/check-telegram-webhook.sh <BOT_TOKEN>"
  echo ""
  echo "Example:"
  echo "  ./scripts/check-telegram-webhook.sh 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
  echo ""
  exit 1
fi

BOT_TOKEN="$1"

echo "🔍 Checking Telegram Webhook Status..."
echo "======================================"
echo ""

curl -s "https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo" | jq .

echo ""
echo "💡 Tip: If webhook URL is empty or incorrect, run:"
echo "  ./scripts/setup-telegram-webhook.sh <BOT_TOKEN> [SECRET]"
