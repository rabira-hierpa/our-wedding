# Quick Setup Guide

Follow these steps to get your wedding photo gallery up and running.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for database to provision

## Step 3: Run Database Schema

1. In Supabase dashboard, go to SQL Editor
2. Click "New Query"
3. Copy all contents from `supabase-schema.sql`
4. Paste and click "Run"
5. Verify tables were created in Table Editor

## Step 4: Create Telegram Bot

1. Open Telegram and message [@BotFather](https://t.me/botfather)
2. Send `/newbot`
3. Choose a name: "YourName's Wedding Gallery"
4. Choose a username: "yourname_wedding_bot"
5. Copy the bot token (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
6. **Important**: Save this token securely!

## Step 5: Create Environment File

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

### Get Supabase Values:

1. In Supabase dashboard → Settings → API
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### Generate Webhook Secret:

```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Copy output → `TELEGRAM_WEBHOOK_SECRET`

### Add Bot Token:

Paste your bot token from Step 4 → `TELEGRAM_BOT_TOKEN`

Your `.env.local` should look like:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_WEBHOOK_SECRET=abc123xyz789...
```

## Step 6: Test Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see the wedding gallery page!

## Step 7: Set Up Local Webhook (Optional)

To test Telegram bot locally, use ngrok:

### Install ngrok:

```bash
# Mac
brew install ngrok

# Windows
choco install ngrok

# Or download from: https://ngrok.com/download
```

### Start ngrok tunnel:

```bash
ngrok http 3000
```

Copy the HTTPS URL (looks like `https://abc123.ngrok.io`)

### Set webhook:

Replace placeholders and run:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://abc123.ngrok.io/api/telegram/webhook",
    "secret_token": "<YOUR_WEBHOOK_SECRET>",
    "allowed_updates": ["message"]
  }'
```

Success response:
```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

### Test the bot:

1. Open Telegram
2. Search for your bot username
3. Send `/start`
4. Send a photo
5. Check your local website - photo should appear!

## Step 8: Deploy to Production

### Using Vercel (Recommended):

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables (same as `.env.local`)
6. Click "Deploy"
7. Copy your production URL

### Set Production Webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.vercel.app/api/telegram/webhook",
    "secret_token": "<YOUR_WEBHOOK_SECRET>",
    "allowed_updates": ["message"]
  }'
```

## Step 9: Optional - Create Wedding Group Chat

1. Create a new Telegram group
2. Add your bot to the group (as admin)
3. Send a message in the group
4. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Find the chat ID (negative number like `-1001234567890`)
6. Add to `.env.local` (and Vercel environment):
   ```bash
   WEDDING_GROUP_CHAT_ID=-1001234567890
   ```
7. Redeploy

Now when guests upload photos, they'll also be posted to the group!

## Step 10: Share with Guests

Share your bot with guests:

**Bot Link**: `https://t.me/yourbot_username`

**Instructions for guests**:
1. Click the bot link
2. Send `/start` to register
3. Send wedding photos
4. Photos appear on the website automatically!

## Verification Checklist

- [ ] Website loads at localhost:3000
- [ ] Supabase tables created (guests, photos)
- [ ] Supabase storage bucket created (wedding-photos)
- [ ] Bot responds to `/start` command
- [ ] Bot accepts photo uploads
- [ ] Photos appear in Supabase Storage
- [ ] Photos appear in database
- [ ] Photos display on website
- [ ] (Optional) Photos posted to group chat

## Troubleshooting

### "Missing Supabase environment variables"

Check `.env.local` has all Supabase variables set.

### "Webhook verification failed"

Webhook secret doesn't match. Check:
1. `.env.local` has `TELEGRAM_WEBHOOK_SECRET`
2. Same secret used when setting webhook
3. Restart dev server after changing `.env.local`

### "Bot doesn't respond"

1. Check webhook is set: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
2. Verify ngrok is running (for local dev)
3. Check webhook URL is correct
4. Check Vercel logs for errors (production)

### "Photos not uploading to Supabase"

1. Run `supabase-schema.sql` again
2. Check bucket exists in Supabase Storage
3. Verify service role key is correct
4. Check RLS policies are created

### "Photos not showing on website"

1. Open browser console
2. Check `/api/photos` returns data
3. Verify RLS policies allow public read

## Next Steps

- Customize the gallery colors and layout
- Add your wedding date to the header
- Update bot messages with your names
- Share the bot link with wedding guests!

## Support

If you encounter issues:
1. Check Vercel/Supabase logs
2. Review this setup guide
3. Check the main README.md
4. Open an issue on GitHub

Enjoy your wedding photo gallery! 💒📸
