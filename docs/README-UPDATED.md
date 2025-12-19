# Wedding Photo Gallery

A beautiful wedding photo gallery where guests upload photos via Telegram bot and they automatically appear on the website.

## Features

- **Telegram Bot Integration**: Guests upload photos by sending them to a Telegram bot
- **Auto-Registration**: Guests register with `/start` command
- **High-Res Photos**: Automatically extracts highest resolution photo from Telegram
- **Self-Hosted**: Run on your own VPS with PostgreSQL - no cloud storage fees
- **Responsive Masonry Grid**: Beautiful photo gallery with lightbox view
- **Real-time Updates**: Gallery polls for new photos every 10 seconds
- **Group Chat Integration**: Photos automatically shared in wedding group chat
- **Secure**: Webhook verification with secret token

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Local file system (VPS) or Supabase Storage
- **Image Optimization**: next/image
- **Deployment**: VPS with Coolify, Docker, or Vercel

## Deployment Options

### Option 1: VPS/Coolify (Recommended - FREE)

Use your own VPS for completely free hosting:
- No monthly storage costs
- Handle 1K+ photos easily
- Full control over your data

See **[DEPLOYMENT-VPS.md](./DEPLOYMENT-VPS.md)** for complete setup guide.

**Cost**: ~$5-10/month VPS (Hostinger, DigitalOcean, etc.)

### Option 2: Supabase + Vercel

Use cloud services (paid for larger galleries):
- Easier setup
- Managed database and storage
- Auto-scaling

See **[SETUP-SUPABASE.md](./SETUP-SUPABASE.md)** for Supabase setup.

**Cost**: Free for small galleries (<500 photos), $25/month for larger

## Quick Start (VPS/Coolify)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL**
   ```bash
   # Create database
   createdb wedding_gallery
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Initialize database**
   ```bash
   npx prisma db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Deploy to production**
   See [DEPLOYMENT-VPS.md](./DEPLOYMENT-VPS.md) for detailed instructions.

## Environment Variables

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/wedding_gallery?schema=public"

# Storage Configuration
STORAGE_DIR=/var/www/wedding-photos
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_WEBHOOK_SECRET=your-random-secret-string

# Optional: Wedding Group Chat
WEDDING_GROUP_CHAT_ID=your-group-chat-id
```

## Project Structure

```
wedding-photo-gallery/
├── app/
│   ├── api/
│   │   ├── photos/route.ts          # Fetch photos API
│   │   └── telegram/webhook/route.ts # Telegram webhook
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                     # Home page
├── components/
│   └── PhotoGallery.tsx             # Masonry gallery
├── lib/
│   ├── prisma.ts                    # Prisma client
│   ├── telegram.ts                  # Telegram utilities
│   └── file-storage.ts              # File storage
├── prisma/
│   └── schema.prisma                # Database schema
├── types/
│   ├── database.ts                  # Database types
│   └── telegram.ts                  # Telegram types
├── Dockerfile                       # Docker container
├── docker-compose.yml               # Local development
└── README.md
```

## Database Schema

### Guests Table
- `id` - UUID primary key
- `telegramUserId` - BigInt unique
- `telegramUsername` - String (optional)
- `firstName` - String
- `lastName` - String (optional)
- `registeredAt` - DateTime
- `createdAt` - DateTime
- `updatedAt` - DateTime

### Photos Table
- `id` - UUID primary key
- `guestId` - Foreign key to guests
- `storagePath` - String (file path)
- `publicUrl` - String (public URL)
- `telegramFileId` - String
- `caption` - String (optional)
- `uploadedAt` - DateTime
- `createdAt` - DateTime

## API Routes

### POST `/api/telegram/webhook`
Receives updates from Telegram bot.

**Security**: Verifies `X-Telegram-Bot-Api-Secret-Token` header

**Handles**:
- `/start` - Guest registration
- Photos - Upload to gallery
- Text - Send help message

### GET `/api/photos`
Returns all photos with guest information, ordered by upload date.

## How Guests Use It

1. Find the bot on Telegram
2. Send `/start` to register
3. Send photos (one or multiple)
4. Photos appear on website automatically
5. Photos also shared in wedding group chat

## Storage Estimates

For 1K photos (~2 MB each):
- **Photos**: ~2 GB
- **Database**: ~20 MB
- **Total**: ~2.5 GB

**VPS Requirements**:
- Minimum: 1 GB RAM, 10 GB storage
- Recommended: 2 GB RAM, 20 GB storage

## Cost Comparison

| Solution | Monthly Cost | Storage | Notes |
|----------|-------------|---------|-------|
| **VPS (Hostinger)** | $5-10 | 50-100 GB | Recommended |
| **DigitalOcean VPS** | $6-12 | 25-50 GB | Good alternative |
| **Supabase Free** | $0 | 1 GB | Too small for wedding |
| **Supabase Pro** | $25 | Unlimited* | Expensive for photos |

\* Fair use policy applies

## Security Features

- Webhook secret token verification
- Database Row Level Security (with Supabase)
- Secure file permissions (VPS)
- HTTPS/TLS encryption
- Input validation and sanitization

## Performance

- Next.js App Router for optimal performance
- Image optimization with next/image
- Database indexing for fast queries
- Efficient masonry layout
- Lazy loading images

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio (database GUI)
npx prisma studio
```

## Troubleshooting

### Photos not uploading
- Check STORAGE_DIR permissions
- Verify DATABASE_URL is correct
- Check Telegram bot token

### Webhook not receiving updates
- Verify webhook URL is set correctly
- Check TELEGRAM_WEBHOOK_SECRET matches
- Ensure HTTPS is enabled

### Database connection errors
- Check DATABASE_URL format
- Verify PostgreSQL is running
- Run `npx prisma db push`

## Contributing

Issues and pull requests welcome!

## License

MIT

## Support

- **VPS Deployment**: See [DEPLOYMENT-VPS.md](./DEPLOYMENT-VPS.md)
- **Supabase Setup**: See [SETUP-SUPABASE.md](./SETUP-SUPABASE.md)
- **Issues**: Open a GitHub issue

Built with Next.js, Prisma, PostgreSQL, and Telegram Bot API.
