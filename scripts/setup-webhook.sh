#!/bin/bash

# Telegram webhook setup script

echo "📱 Wedding Photo Gallery - Telegram Webhook Setup"
echo "=================================================="
echo ""

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
elif [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check required variables
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ Error: TELEGRAM_BOT_TOKEN not set"
    exit 1
fi

if [ -z "$TELEGRAM_WEBHOOK_SECRET" ]; then
    echo "❌ Error: TELEGRAM_WEBHOOK_SECRET not set"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_BASE_URL" ]; then
    echo "❌ Error: NEXT_PUBLIC_BASE_URL not set"
    exit 1
fi

WEBHOOK_URL="${NEXT_PUBLIC_BASE_URL}/api/telegram/webhook"

echo "🔧 Configuration:"
echo "   Bot Token: ${TELEGRAM_BOT_TOKEN:0:10}..."
echo "   Webhook URL: $WEBHOOK_URL"
echo ""

# Set webhook
echo "📤 Setting webhook..."
RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{
    \"url\": \"${WEBHOOK_URL}\",
    \"secret_token\": \"${TELEGRAM_WEBHOOK_SECRET}\",
    \"allowed_updates\": [\"message\"]
  }")

# Check if successful
if echo "$RESPONSE" | grep -q '"ok":true'; then
    echo "✅ Webhook set successfully!"
else
    echo "❌ Error setting webhook:"
    echo "$RESPONSE"
    exit 1
fi

echo ""

# Get webhook info
echo "📋 Webhook Information:"
curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo" | \
  python3 -m json.tool 2>/dev/null || \
  node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync(0, 'utf-8')), null, 2))"

echo ""
echo "🎉 Webhook setup complete!"
echo ""
echo "Test your bot:"
echo "1. Open Telegram and search for your bot"
echo "2. Send /start"
echo "3. Send a photo"
echo ""
