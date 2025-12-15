# Wedding Photo Gallery

A beautiful, serverless wedding photo gallery built with Next.js, where guests upload photos via Telegram bot and they automatically appear on the website.

## Features

- **Telegram Bot Integration**: Guests upload photos by sending them to a Telegram bot
- **Auto-Registration**: Guests register with `/start` command
- **High-Res Photos**: Automatically extracts highest resolution photo from Telegram
- **Serverless Architecture**: Built on Next.js with Supabase for storage and database
- **Responsive Masonry Grid**: Beautiful photo gallery with lightbox view
- **Real-time Updates**: Gallery polls for new photos every 10 seconds
- **Group Chat Integration**: Photos automatically shared in wedding group chat
- **Secure**: Webhook verification with secret token

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Image Optimization**: next/image
- **Deployment**: Vercel (recommended)

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))

### 2. Clone and Install

```bash
npm install
```

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase-schema.sql`
3. This will create:
   - `guests` table
   - `photos` table
   - `wedding-photos` storage bucket
   - Necessary indexes and RLS policies

### 4. Create Telegram Bot

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` and follow instructions
3. Save your bot token
4. (Optional) Create a group chat for wedding photos and add your bot as admin

### 5. Environment Variables

Create a `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_WEBHOOK_SECRET=your-random-secret-string

# Optional: Wedding Group Chat (photos will be forwarded here)
WEDDING_GROUP_CHAT_ID=your-group-chat-id
```

**Getting Supabase Keys:**
- Go to Project Settings > API
- Copy `URL` for `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon/public` key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `service_role` key for `SUPABASE_SERVICE_ROLE_KEY`

**Generating Webhook Secret:**
```bash
openssl rand -base64 32
```

**Getting Group Chat ID:**
1. Add your bot to the group
2. Send a message in the group
3. Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for `"chat":{"id":-XXXXXXXXX}` (negative number is a group)

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 7. Set Up Telegram Webhook

After deploying to production (see below), set your webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/api/telegram/webhook",
    "secret_token": "your-webhook-secret",
    "allowed_updates": ["message"]
  }'
```

**For local development with ngrok:**

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3000

# Set webhook with ngrok URL
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-ngrok-url.ngrok.io/api/telegram/webhook",
    "secret_token": "your-webhook-secret"
  }'
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Deploy
5. Set up webhook with your production URL

### Deploy to Other Platforms

This app works on any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## How Guests Use It

1. **Find the bot**: Share bot link with guests (`https://t.me/your_bot_username`)
2. **Register**: Guest sends `/start` to the bot
3. **Upload photos**: Guest sends photos (one or multiple)
4. **View on website**: Photos appear on the gallery automatically
5. **Group chat**: Photos are also shared in the wedding group chat (if configured)

## Project Structure

```
wedding-photo-gallery/
├── app/
│   ├── api/
│   │   ├── photos/
│   │   │   └── route.ts          # Fetch photos API
│   │   └── telegram/
│   │       └── webhook/
│   │           └── route.ts      # Telegram webhook handler
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Home page
├── components/
│   └── PhotoGallery.tsx          # Masonry gallery component
├── lib/
│   ├── supabase.ts               # Supabase client
│   ├── telegram.ts               # Telegram utilities
│   └── storage.ts                # Storage utilities
├── types/
│   ├── database.ts               # Database types
│   └── telegram.ts               # Telegram types
├── supabase-schema.sql           # Database schema
└── README.md
```

## API Routes

### POST `/api/telegram/webhook`

Receives updates from Telegram bot.

**Security**: Verifies `X-Telegram-Bot-Api-Secret-Token` header

**Handles**:
- `/start` command - Guest registration
- Photo messages - Upload to gallery
- Text messages - Send help text

### GET `/api/photos`

Returns all photos with guest information.

**Response**:
```json
{
  "photos": [
    {
      "id": "uuid",
      "guest_id": "uuid",
      "storage_path": "timestamp-filename.jpg",
      "public_url": "https://...",
      "telegram_file_id": "...",
      "caption": "Beautiful moment!",
      "uploaded_at": "2024-01-01T12:00:00Z",
      "guest": {
        "first_name": "John",
        "last_name": "Doe",
        "telegram_username": "johndoe"
      }
    }
  ]
}
```

## Database Schema

### `guests` Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| telegram_user_id | BIGINT | Telegram user ID (unique) |
| telegram_username | TEXT | Telegram username |
| first_name | TEXT | First name |
| last_name | TEXT | Last name |
| registered_at | TIMESTAMPTZ | When user sent /start |
| created_at | TIMESTAMPTZ | Record creation time |
| updated_at | TIMESTAMPTZ | Last update time |

### `photos` Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| guest_id | UUID | Foreign key to guests |
| storage_path | TEXT | Path in Supabase Storage |
| public_url | TEXT | Public URL |
| telegram_file_id | TEXT | Telegram file ID |
| caption | TEXT | Photo caption (optional) |
| uploaded_at | TIMESTAMPTZ | When photo was sent |
| created_at | TIMESTAMPTZ | Record creation time |

## Security Features

- **Webhook Verification**: Secret token validation
- **Row Level Security**: Supabase RLS policies
- **Service Role Protection**: Backend operations use service role key
- **Public Read Only**: Frontend uses anon key with read-only access
- **HTTPS Only**: All communications encrypted

## Customization

### Update Wedding Group Chat ID

Add to `.env.local`:
```bash
WEDDING_GROUP_CHAT_ID=-1234567890
```

### Customize Gallery Appearance

Edit `components/PhotoGallery.tsx`:
- Change column count: Modify `columns-1 sm:columns-2 md:columns-3 lg:columns-4`
- Update colors: Change Tailwind classes
- Adjust polling interval: Change `10000` (10 seconds) in `setInterval`

### Customize Messages

Edit bot responses in `app/api/telegram/webhook/route.ts`:
- Registration message
- Upload confirmation
- Help text

## Troubleshooting

### Webhook not receiving updates

1. Check webhook status:
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

2. Verify secret token matches in Telegram and `.env.local`

3. Check Vercel logs for errors

### Photos not uploading

1. Verify Supabase storage bucket exists (`wedding-photos`)
2. Check RLS policies in Supabase
3. Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
4. Check logs in Vercel

### Photos not appearing on website

1. Check browser console for errors
2. Verify `/api/photos` endpoint returns data
3. Check Supabase RLS policies allow public read

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!

## Credits

Built with Next.js, Supabase, and Telegram Bot API
