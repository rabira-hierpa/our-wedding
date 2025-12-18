# 🚀 Coolify Deployment Guide

## Image Upload Fix

The app has been updated to properly serve uploaded images in Docker/Coolify deployments.

### Changes Made

1. **API Route for Images**: Created `/api/uploads/[filename]/route.ts` to serve images
2. **Standalone Output**: Enabled Next.js standalone mode for optimized Docker builds
3. **Dockerfile Updates**: Proper standalone configuration with volume support
4. **URL Generation**: Updated to use `/api/uploads/` instead of direct `/uploads/`

### Deploy to Coolify

#### 1. Environment Variables

Set these in Coolify:

```env
DATABASE_URL=postgresql://user:password@host:5432/wedding_db
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_WEBHOOK_SECRET=your_webhook_secret
WEDDING_GROUP_CHAT_ID=your_chat_id
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NODE_ENV=production
```

#### 2. Volume Mount

In Coolify, add a persistent volume:

- **Mount Path**: `/app/public/uploads`
- **Purpose**: Store uploaded photos

#### 3. Build Configuration

Coolify will automatically:

- Build using the Dockerfile
- Create standalone Next.js server
- Set up database migrations on start

#### 4. Health Check

- **Endpoint**: `/api/health`
- **Expected**: 200 OK response

### Testing Locally

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access at http://localhost:3000
```

### Verify Deployment

1. Upload a photo via Telegram bot
2. Check photo appears in gallery
3. Verify image URL works: `https://your-domain.com/api/uploads/[filename].jpg`
4. Check uploads directory: `docker exec <container> ls /app/public/uploads`

### Troubleshooting

#### Images not showing (404)

**Check uploads directory:**

```bash
docker exec <container-id> ls -la /app/public/uploads
```

**Check environment variable:**

```bash
docker exec <container-id> env | grep NEXT_PUBLIC_BASE_URL
```

Should match your domain!

#### Permission issues

```bash
docker exec <container-id> chown -R nextjs:nodejs /app/public/uploads
```

#### Database connection

```bash
docker exec <container-id> npx prisma db push
```

### File Serving Flow

1. Photo uploaded via Telegram → Saved to `/app/public/uploads/`
2. Public URL generated: `https://domain.com/api/uploads/filename.jpg`
3. Request hits API route `/api/uploads/[filename]/route.ts`
4. Route reads file from disk and serves with proper headers
5. Image displays in gallery ✅

### Migration from Old Setup

If you had photos with `/uploads/` URLs:

Run this SQL to update existing records:

```sql
UPDATE photos
SET "publicUrl" = REPLACE("publicUrl", '/uploads/', '/api/uploads/');
```

### Coolify-Specific Notes

- ✅ Standalone mode optimizes image size
- ✅ Volume persists uploads across deployments
- ✅ Automatic HTTPS handled by Coolify
- ✅ Database migrations run on container start

### Performance

- Images cached with `max-age=31536000` (1 year)
- Standalone output is ~10x smaller than regular build
- Native Node.js server (no npm overhead)

---

**Ready to deploy!** Push to your git repo and Coolify will auto-deploy.
