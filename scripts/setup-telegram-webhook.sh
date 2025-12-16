#!/bin/bash

# Telegram Webhook Setup Script
# This script helps you set up the Telegram webhook for your bot

echo "🤖 Telegram Webhook Setup"
echo "=========================="
echo ""

# Check if TELEGRAM_BOT_TOKEN is provided
if [ -z "$1" ]; then
  echo "Usage: ./scripts/setup-telegram-webhook.sh <BOT_TOKEN> [WEBHOOK_SECRET]"
  echo ""
  echo "Example:"
  echo "  ./scripts/setup-telegram-webhook.sh 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11 my-secret-token"
  echo ""
  exit 1
fi

BOT_TOKEN="$1"
WEBHOOK_SECRET="${2:-$(openssl rand -hex 32)}"
WEBHOOK_URL="https://wedding.rz-codes.com/api/telegram/webhook"

echo "📋 Configuration:"
echo "  Webhook URL: $WEBHOOK_URL"
echo "  Secret Token: $WEBHOOK_SECRET"
echo ""

# Get current webhook info
echo "🔍 Checking current webhook status..."
CURRENT_WEBHOOK=$(curl -s "https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo")
echo "$CURRENT_WEBHOOK" | jq .

echo ""
echo "🔧 Setting up new webhook..."

# Set the webhook
RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot$BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{
    \"url\": \"$WEBHOOK_URL\",
    \"secret_token\": \"$WEBHOOK_SECRET\",
    \"max_connections\": 40,
    \"allowed_updates\": [\"message\", \"callback_query\"]
  }")

echo "$RESPONSE" | jq .

# Check if successful
if echo "$RESPONSE" | jq -e '.ok == true' > /dev/null; then
  echo ""
  echo "✅ Webhook set successfully!"
  echo ""
  echo "📝 Add these environment variables to Coolify:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "TELEGRAM_BOT_TOKEN=$BOT_TOKEN"
  echo "TELEGRAM_WEBHOOK_SECRET=$WEBHOOK_SECRET"
  echo "NEXT_PUBLIC_BASE_URL=https://wedding.rz-codes.com"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "🧪 Test your bot by sending a message to it on Telegram!"
else
  echo ""
  echo "❌ Failed to set webhook. Check the error above."
  exit 1
fi
