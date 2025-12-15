# Getting Started - Wedding Photo Gallery

Your wedding photo gallery is ready! This guide will get you from zero to deployed in ~30 minutes.

## What You Have

✅ Complete Next.js application with TypeScript
✅ Telegram bot integration
✅ PostgreSQL database with Prisma ORM
✅ Local file storage (VPS-optimized)
✅ Docker deployment ready
✅ Coolify configuration
✅ Responsive photo gallery with masonry layout
✅ Automated photo uploads via Telegram

## Choose Your Deployment Path

### Path 1: VPS with Coolify (Recommended for You)
**Best for**: 1K+ photos, cost savings, full control
**Cost**: $5-10/month (your existing VPS)
**Setup time**: 30 minutes
**Guide**: [QUICKSTART-VPS.md](./QUICKSTART-VPS.md)

### Path 2: Supabase + Vercel
**Best for**: Small galleries (<500 photos), easiest setup
**Cost**: $0-25/month
**Setup time**: 15 minutes
**Guide**: [SETUP.md](./SETUP.md)

**Not sure which to choose?** See [COMPARISON.md](./COMPARISON.md)

## Quick Start (VPS/Coolify)

Since you have:
- ✅ Hostinger VPS
- ✅ Coolify installed
- ✅ Expecting ~1,000 photos

Follow these steps:

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```bash
# Get this from Coolify after creating your database
DATABASE_URL="postgresql://postgres:PASSWORD@wedding-gallery-db:5432/postgres"
TELEGRAM_BOT_TOKEN="get-from-botfather"
TELEGRAM_WEBHOOK_SECRET="$(openssl rand -base64 32)"
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
STORAGE_DIR="/app/public/uploads"
```

**Important**: See [COOLIFY-DATABASE-SETUP.md](./COOLIFY-DATABASE-SETUP.md) for detailed instructions on getting the correct database connection string from Coolify.

### 3. Initialize Database

```bash
./scripts/init-db.sh
```

### 4. Test Locally

```bash
npm run dev
```

Visit http://localhost:3000

### 5. Deploy to Coolify

Follow the detailed guide: [QUICKSTART-VPS.md](./QUICKSTART-VPS.md)

### 6. Set Up Webhook

```bash
./scripts/setup-webhook.sh
```

### 7. Test with Telegram

1. Open your bot in Telegram
2. Send `/start`
3. Send a photo
4. Check your website!

## Project Structure

```
wedding/
├── app/                          # Next.js app directory
│   ├── api/
│   │   ├── photos/              # Fetch photos endpoint
│   │   └── telegram/webhook/    # Telegram webhook handler
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page with gallery
│
├── components/
│   └── PhotoGallery.tsx         # Masonry grid component
│
├── lib/
│   ├── prisma.ts                # Prisma client (VPS)
│   ├── file-storage.ts          # Local file storage (VPS)
│   ├── telegram.ts              # Telegram utilities
│   ├── supabase.ts              # Supabase client (alternative)
│   └── storage.ts               # Supabase storage (alternative)
│
├── prisma/
│   └── schema.prisma            # Database schema
│
├── types/
│   ├── database.ts              # TypeScript types
│   └── telegram.ts              # Telegram types
│
├── scripts/
│   ├── init-db.sh               # Initialize database
│   └── setup-webhook.sh         # Set up Telegram webhook
│
├── Dockerfile                    # Docker container
├── docker-compose.yml            # Local development
│
└── Documentation/
    ├── QUICKSTART-VPS.md         # Quick start guide (VPS)
    ├── DEPLOYMENT-VPS.md         # Detailed deployment (VPS)
    ├── COMPARISON.md             # VPS vs Supabase comparison
    ├── SETUP.md                  # Supabase setup guide
    └── README.md                 # Full documentation
```

## Key Features Explained

### 1. Telegram Bot Integration
- Guests send `/start` to register
- Upload photos by sending to bot
- Bot extracts highest resolution
- Photos auto-uploaded to gallery
- Confirmation sent to guest

### 2. Database (PostgreSQL + Prisma)
- `guests` table: User registration data
- `photos` table: Photo metadata
- Automatic timestamps
- Indexed for performance

### 3. File Storage (VPS)
- Photos stored in `/app/public/uploads`
- Served directly by Next.js
- No cloud storage fees
- Volume-mounted in Docker

### 4. Photo Gallery
- Responsive masonry grid
- Lightbox for full-size view
- Auto-refresh every 10 seconds
- Shows guest name and caption

### 5. Security
- Webhook secret verification
- Database RLS (with Supabase)
- File permissions (VPS)
- HTTPS/SSL required

## Architecture

### VPS Deployment
```
Guest → Telegram Bot → Your VPS
                         ├── Next.js App (Docker)
                         ├── PostgreSQL
                         └── Local File Storage
                              ↓
                         Wedding Website
```

### How It Works
1. Guest sends photo to Telegram bot
2. Telegram sends webhook to your server
3. Server verifies webhook secret
4. Server downloads photo from Telegram
5. Server uploads to local storage
6. Server saves metadata to PostgreSQL
7. Photo appears on website immediately
8. (Optional) Photo shared in group chat

## Configuration Files

### `.env.local` (Required)
Environment variables for the application

### `prisma/schema.prisma`
Database schema definition

### `Dockerfile`
Container image for production

### `docker-compose.yml`
Local development with database

### `.gitignore`
Files to exclude from Git

## Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npx prisma studio    # Open database GUI
npx prisma db push   # Push schema changes
npx prisma generate  # Generate Prisma Client

# Deployment
./scripts/init-db.sh       # Initialize database
./scripts/setup-webhook.sh # Set up Telegram webhook
```

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://...` |
| `TELEGRAM_BOT_TOKEN` | Yes | From @BotFather | `123456:ABC...` |
| `TELEGRAM_WEBHOOK_SECRET` | Yes | Random secret for security | `openssl rand -base64 32` |
| `NEXT_PUBLIC_BASE_URL` | Yes | Your website URL | `https://wedding.com` |
| `STORAGE_DIR` | No | Photo storage path | `/app/public/uploads` |
| `WEDDING_GROUP_CHAT_ID` | No | Telegram group chat ID | `-1001234567890` |

## Troubleshooting

### Installation Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Issues
```bash
# Reset database
npx prisma db push --force-reset

# Check connection
npx prisma db pull
```

### Telegram Webhook Issues
```bash
# Check webhook status
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"

# Delete webhook
curl -X POST "https://api.telegram.org/bot<TOKEN>/deleteWebhook"

# Re-set webhook
./scripts/setup-webhook.sh
```

### Build Issues
```bash
# Check for TypeScript errors
npm run build

# Generate Prisma Client
npx prisma generate
```

## Documentation Index

1. **[QUICKSTART-VPS.md](./QUICKSTART-VPS.md)** ⭐ START HERE
   - 30-minute deployment guide for VPS/Coolify

2. **[DEPLOYMENT-VPS.md](./DEPLOYMENT-VPS.md)**
   - Detailed VPS deployment instructions
   - Docker, Coolify, and Nginx setup
   - Backup and monitoring

3. **[COMPARISON.md](./COMPARISON.md)**
   - VPS vs Supabase comparison
   - Cost analysis
   - Feature comparison

4. **[SETUP.md](./SETUP.md)**
   - Alternative Supabase setup
   - Step-by-step guide

5. **[README.md](./README.md)** or **[README-UPDATED.md](./README-UPDATED.md)**
   - Complete project documentation
   - API documentation
   - Customization guide

## Next Steps

1. ✅ You are here - Understanding the project
2. 📖 Read [QUICKSTART-VPS.md](./QUICKSTART-VPS.md)
3. 🔧 Configure `.env.local`
4. 🗄️ Run `./scripts/init-db.sh`
5. 🧪 Test locally with `npm run dev`
6. 🚀 Deploy to Coolify
7. 📱 Set up webhook with `./scripts/setup-webhook.sh`
8. 🎉 Share bot with wedding guests!

## Support & Resources

- **VPS Deployment**: [QUICKSTART-VPS.md](./QUICKSTART-VPS.md)
- **Detailed Docs**: [DEPLOYMENT-VPS.md](./DEPLOYMENT-VPS.md)
- **Comparison**: [COMPARISON.md](./COMPARISON.md)
- **Troubleshooting**: See documentation above

## Success Checklist

Before the wedding:
- [ ] Website is live and accessible
- [ ] SSL/HTTPS is enabled
- [ ] Telegram bot responds to `/start`
- [ ] Test photo uploads successfully
- [ ] Photos appear on website
- [ ] Database backups configured
- [ ] Disk space is sufficient
- [ ] Bot link shared with guests
- [ ] Website link shared with guests

## Wedding Day

1. Monitor the gallery occasionally
2. Check disk space if needed
3. Enjoy your wedding! 🎊

The system runs automatically - photos will appear as guests upload them!

---

**Questions?** Check the documentation or review the troubleshooting sections.

**Ready to deploy?** → [QUICKSTART-VPS.md](./QUICKSTART-VPS.md)
