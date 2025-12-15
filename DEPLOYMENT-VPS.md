# VPS/Coolify Deployment Guide

This guide explains how to deploy the wedding photo gallery on your VPS with Coolify and PostgreSQL.

## Architecture Overview

- **Database**: PostgreSQL on your VPS (managed by Coolify or direct)
- **Storage**: Local file system (persistent volume)
- **App**: Next.js containerized with Docker
- **No cloud costs**: Everything runs on your VPS

## Prerequisites

- VPS with Coolify installed
- PostgreSQL database (can be created in Coolify)
- Domain name pointed to your VPS
- Telegram bot token

## Step 1: Set Up PostgreSQL Database

### Option A: Using Coolify

1. In Coolify dashboard, go to "Databases"
2. Click "Add Database" → PostgreSQL
3. Set database name: `wedding_gallery`
4. Set username/password
5. Deploy the database
6. Note the connection string (usually: `postgresql://username:password@postgres:5432/wedding_gallery`)

### Option B: Existing PostgreSQL

If you already have PostgreSQL installed:

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE wedding_gallery;

# Create user
CREATE USER wedding_user WITH PASSWORD 'your-secure-password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE wedding_gallery TO wedding_user;

\q
```

Connection string: `postgresql://wedding_user:your-secure-password@localhost:5432/wedding_gallery`

## Step 2: Create Dockerfile

The project includes a Dockerfile for containerized deployment:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Create uploads directory
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

Save this as `Dockerfile` in your project root.

## Step 3: Create Docker Compose (Alternative)

If not using Coolify's built-in Docker build:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://wedding_user:password@db:5432/wedding_gallery
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}
      TELEGRAM_WEBHOOK_SECRET: ${TELEGRAM_WEBHOOK_SECRET}
      WEDDING_GROUP_CHAT_ID: ${WEDDING_GROUP_CHAT_ID}
      NEXT_PUBLIC_BASE_URL: https://your-domain.com
      STORAGE_DIR: /app/public/uploads
    volumes:
      - uploads:/app/public/uploads
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: wedding_gallery
      POSTGRES_USER: wedding_user
      POSTGRES_PASSWORD: your-secure-password
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  uploads:
  postgres-data:
```

## Step 4: Deploy with Coolify

1. **Create New Project**
   - Go to Coolify dashboard
   - Click "Add Resource" → "Application"
   - Choose "Docker Compose" or "Dockerfile"

2. **Connect Git Repository**
   - Link your GitHub/GitLab repository
   - Select the branch (e.g., `main`)

3. **Configure Environment Variables**

   Add these in Coolify's environment settings:

   ```bash
   DATABASE_URL=postgresql://username:password@postgres-service:5432/wedding_gallery
   TELEGRAM_BOT_TOKEN=your-telegram-bot-token
   TELEGRAM_WEBHOOK_SECRET=your-random-secret-string
   WEDDING_GROUP_CHAT_ID=-1001234567890
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   STORAGE_DIR=/app/public/uploads
   NODE_ENV=production
   ```

4. **Configure Persistent Storage**

   In Coolify, add a volume mount:
   - Source: `/var/lib/coolify/wedding-photos`
   - Destination: `/app/public/uploads`

5. **Set Up Domain**
   - Add your domain in Coolify
   - Enable SSL/TLS (Let's Encrypt)
   - Configure reverse proxy

6. **Deploy**
   - Click "Deploy"
   - Coolify will build and start your app

## Step 5: Initialize Database

After deployment, run migrations:

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Access the container
docker exec -it <container-name> sh

# Run Prisma migrations
npx prisma db push

# Exit container
exit
```

Or set up a database initialization script:

```bash
# On your VPS, create init-db.sh
cat > init-db.sh << 'EOF'
#!/bin/bash
docker exec -it $(docker ps -qf "name=wedding") npx prisma db push
EOF

chmod +x init-db.sh
./init-db.sh
```

## Step 6: Set Up Telegram Webhook

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/api/telegram/webhook",
    "secret_token": "your-webhook-secret",
    "allowed_updates": ["message"]
  }'
```

## Step 7: Configure Nginx (If Not Using Coolify's Proxy)

If you're managing Nginx separately:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve uploaded photos
    location /uploads/ {
        alias /var/www/wedding-photos/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Storage Estimates

For 1K photos at ~2 MB each:
- **Storage needed**: ~2 GB for photos
- **Database size**: ~10-20 MB for metadata
- **Total**: ~2.5 GB (plenty of room on most VPS)

**VPS Requirements:**
- **Minimum**: 1 GB RAM, 1 CPU, 10 GB storage
- **Recommended**: 2 GB RAM, 2 CPU, 20 GB storage

## Backup Strategy

### 1. Database Backup

```bash
# Create backup script
cat > /root/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec postgres pg_dump -U wedding_user wedding_gallery > /backups/db_$DATE.sql
# Keep only last 7 days
find /backups -name "db_*.sql" -mtime +7 -delete
EOF

chmod +x /root/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /root/backup-db.sh
```

### 2. Photo Backup

```bash
# Sync to another location
rsync -avz /var/lib/coolify/wedding-photos /backup/wedding-photos

# Or use S3-compatible storage
rclone sync /var/lib/coolify/wedding-photos remote:wedding-backup
```

## Monitoring

### Check Application Logs

```bash
# Coolify UI: Check logs in dashboard

# Or via Docker
docker logs -f <container-name>
```

### Check Disk Space

```bash
df -h /var/lib/coolify/wedding-photos
```

### Database Size

```bash
docker exec postgres psql -U wedding_user -d wedding_gallery -c "
SELECT pg_size_pretty(pg_database_size('wedding_gallery'));
"
```

## Troubleshooting

### Photos Not Uploading

1. Check volume mount:
   ```bash
   docker inspect <container-name> | grep Mounts -A 20
   ```

2. Check permissions:
   ```bash
   ls -la /var/lib/coolify/wedding-photos
   ```

3. Fix permissions if needed:
   ```bash
   sudo chown -R 1001:1001 /var/lib/coolify/wedding-photos
   ```

### Database Connection Issues

1. Check DATABASE_URL format
2. Verify PostgreSQL is running:
   ```bash
   docker ps | grep postgres
   ```

3. Test connection:
   ```bash
   docker exec app npx prisma db pull
   ```

### Out of Disk Space

1. Check photo directory size:
   ```bash
   du -sh /var/lib/coolify/wedding-photos
   ```

2. Clean old backups:
   ```bash
   find /backups -name "db_*.sql" -mtime +30 -delete
   ```

3. Compress old photos (optional):
   ```bash
   find /var/lib/coolify/wedding-photos -name "*.jpg" -mtime +30 -exec mogrify -quality 85 {} \;
   ```

## Cost Comparison

### VPS (Hostinger or Similar)
- **Cost**: $5-10/month
- **Storage**: 50-100 GB
- **1K photos**: No problem
- **10K photos**: Still fine

### Supabase
- **Free tier**: 1 GB storage (not enough)
- **Pro tier**: $25/month
- **For 3 GB photos**: $25/month

**Savings with VPS**: ~$15-20/month

## Updates and Maintenance

### Update Application

```bash
# Coolify auto-deploys on git push
git push origin main

# Or manually trigger in Coolify UI
```

### Update Dependencies

```bash
# On your local machine
npm update
git commit -am "Update dependencies"
git push
```

### Prisma Schema Changes

```bash
# Edit prisma/schema.prisma
# Then deploy - migrations run automatically

# Or manually
docker exec app npx prisma db push
```

## Security Checklist

- [ ] Change default PostgreSQL password
- [ ] Use strong TELEGRAM_WEBHOOK_SECRET
- [ ] Enable firewall (ufw or similar)
- [ ] Keep VPS and packages updated
- [ ] Regular backups configured
- [ ] SSL/TLS enabled
- [ ] Restrict PostgreSQL to localhost
- [ ] Monitor logs for suspicious activity

## Performance Optimization

### 1. Image Compression (Optional)

Add image compression to reduce storage:

```typescript
// In lib/file-storage.ts
import sharp from 'sharp';

export async function uploadPhotoToStorage(
  fileBuffer: Buffer,
  fileName: string
): Promise<{ path: string; publicUrl: string } | null> {
  // Compress image
  const compressedBuffer = await sharp(fileBuffer)
    .jpeg({ quality: 85 })
    .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
    .toBuffer();

  // ... rest of upload logic
}
```

### 2. Enable Nginx Caching

Already included in the Nginx config above.

### 3. Database Indexing

Already optimized in Prisma schema.

## Next Steps

1. Deploy to your VPS
2. Test photo uploads
3. Set up backups
4. Monitor for a few days
5. Share bot link with guests

Your wedding photo gallery is now running 100% on your own infrastructure with no monthly cloud costs!
