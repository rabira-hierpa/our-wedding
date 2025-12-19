# Quick Start Guide - VPS Deployment

Get your wedding photo gallery running on your Hostinger VPS with Coolify in under 30 minutes.

## Prerequisites Checklist

- [ ] Hostinger VPS access
- [ ] Coolify installed and configured
- [ ] Domain name pointed to VPS
- [ ] Telegram bot created (via @BotFather)

## Step-by-Step Setup

### 1. Create PostgreSQL Database (5 minutes)

**In Coolify Dashboard:**

1. Click "Resources" → "Add Resource" → "Database"
2. Select "PostgreSQL"
3. Configure:
   - Name: `wedding-gallery-db`
   - PostgreSQL Version: 16 (or latest)
4. Click "Create"
5. Wait for database to start (status will show "Running")

**Get the Connection String:**

After the database is created, Coolify will show you the connection details:

1. Click on your database (`wedding-gallery-db`)
2. Look for the "Connection Strings" section
3. You'll see something like:
   ```
   Internal: postgresql://postgres:RANDOM_PASSWORD@wedding-gallery-db:5432
   ```
4. **Important**: Coolify automatically creates:
   - Username: `postgres` (default PostgreSQL user)
   - Password: Auto-generated random password
   - Database: `postgres` (default database)
   - Host: `wedding-gallery-db` (internal Docker network name)

5. **Copy the full internal connection string** - you'll need this exact string!

**Example connection string from Coolify:**
```
postgresql://postgres:xK9mP2nL4vQ7sT1w@wedding-gallery-db:5432/postgres
```

Note: The username is `postgres`, NOT `wedding_user`. Coolify uses the default PostgreSQL setup.

### 2. Prepare Your Project (5 minutes)

**On your local machine:**

```bash
# Clone or navigate to your project
cd /path/to/wedding

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

**Edit `.env.local`:**

```bash
# Database (paste the EXACT connection string from Coolify)
DATABASE_URL="postgresql://postgres:xK9mP2nL4vQ7sT1w@wedding-gallery-db:5432/postgres"

# Storage (will be created on VPS)
STORAGE_DIR=/app/public/uploads
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Telegram bot (from @BotFather)
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# Generate this with: openssl rand -base64 32
TELEGRAM_WEBHOOK_SECRET=your-random-secret-here

# Optional: Group chat ID (get from getUpdates)
WEDDING_GROUP_CHAT_ID=-1001234567890
```

**Push to Git:**

```bash
git init
git add .
git commit -m "Initial wedding gallery setup"
git remote add origin https://github.com/yourusername/wedding-gallery.git
git push -u origin main
```

### 3. Deploy to Coolify (10 minutes)

**In Coolify Dashboard:**

1. Click "Resources" → "Add Resource" → "Application"
2. Select "Public Repository" or "Private Repository"
3. Configure:
   - Repository URL: `https://github.com/yourusername/wedding-gallery`
   - Branch: `main`
   - Build Pack: `Dockerfile`
4. Click "Continue"

**Environment Variables:**

Add these in Coolify's environment settings:

**IMPORTANT**: Use the EXACT connection string you copied from your Coolify database!

```
DATABASE_URL=postgresql://postgres:YOUR_AUTO_GENERATED_PASSWORD@wedding-gallery-db:5432/postgres
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_WEBHOOK_SECRET=your-secret
WEDDING_GROUP_CHAT_ID=your-group-id
NEXT_PUBLIC_BASE_URL=https://your-domain.com
STORAGE_DIR=/app/public/uploads
NODE_ENV=production
```

**How to get the correct DATABASE_URL:**
1. Go to your database in Coolify (`wedding-gallery-db`)
2. Look for "Connection Strings" → "Internal"
3. Copy the ENTIRE string (it will have `postgres` as username, not `wedding_user`)
4. Paste it exactly as shown in Coolify

**Storage Volume:**

1. In application settings, go to "Volumes"
2. Add volume:
   - Source: `/var/lib/coolify/wedding-photos`
   - Destination: `/app/public/uploads`

**Domain:**

1. In application settings, go to "Domains"
2. Add your domain: `your-domain.com`
3. Enable SSL (Let's Encrypt)

**Deploy:**

1. Click "Deploy"
2. Watch build logs
3. Wait for deployment to complete (~5 minutes)

### 4. Initialize Database (2 minutes)

**SSH into your VPS:**

```bash
ssh root@your-vps-ip
```

**Run database migration:**

```bash
# Find your container name
docker ps | grep wedding

# Run Prisma migration
docker exec -it <container-name> npx prisma db push
```

Or use Coolify's terminal:
1. In Coolify, go to your app
2. Click "Terminal"
3. Run: `npx prisma db push`

### 5. Set Up Telegram Webhook (5 minutes)

**From your local machine (or VPS):**

```bash
# Set environment variables
export TELEGRAM_BOT_TOKEN="your-bot-token"
export TELEGRAM_WEBHOOK_SECRET="your-secret"
export NEXT_PUBLIC_BASE_URL="https://your-domain.com"

# Run webhook setup script
./scripts/setup-webhook.sh
```

**Or manually with curl:**

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/api/telegram/webhook",
    "secret_token": "your-webhook-secret",
    "allowed_updates": ["message"]
  }'
```

**Verify webhook:**

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

Should return: `"url": "https://your-domain.com/api/telegram/webhook"`

### 6. Test Everything (5 minutes)

**Test the website:**

1. Visit `https://your-domain.com`
2. Should see the wedding gallery page

**Test the bot:**

1. Open Telegram
2. Search for your bot username
3. Send `/start`
   - Should receive welcome message
4. Send a test photo
   - Should receive confirmation
5. Refresh website
   - Photo should appear!

## Troubleshooting

### Website not loading

**Check deployment logs in Coolify:**
- Look for build errors
- Verify all environment variables are set

**Check if container is running:**
```bash
docker ps | grep wedding
```

### Database connection error

**Verify connection string:**
```bash
docker exec -it <container-name> env | grep DATABASE_URL
```

**Test connection:**
```bash
docker exec -it <container-name> npx prisma db pull
```

### Photos not uploading

**Check volume mount:**
```bash
docker inspect <container-name> | grep -A 10 Mounts
```

**Check permissions:**
```bash
ls -la /var/lib/coolify/wedding-photos
```

**Fix permissions:**
```bash
sudo chown -R 1001:1001 /var/lib/coolify/wedding-photos
```

### Webhook not working

**Check webhook status:**
```bash
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
```

**Common issues:**
- Secret token mismatch
- HTTPS not enabled
- Wrong webhook URL

**Fix:**
1. Verify SSL is enabled in Coolify
2. Check TELEGRAM_WEBHOOK_SECRET matches
3. Re-run webhook setup script

## Useful Commands

### View logs
```bash
# In Coolify UI
Go to Application → Logs

# Or via Docker
docker logs -f <container-name>
```

### Restart application
```bash
# In Coolify UI
Click "Restart"

# Or via Docker
docker restart <container-name>
```

### Access database
```bash
# Via Prisma Studio (on local machine)
npx prisma studio

# Or via psql in container
docker exec -it wedding-gallery-db psql -U wedding_user -d wedding_gallery
```

### Check disk space
```bash
df -h /var/lib/coolify/wedding-photos
```

### Backup database
```bash
docker exec wedding-gallery-db pg_dump -U wedding_user wedding_gallery > backup.sql
```

### Restore database
```bash
cat backup.sql | docker exec -i wedding-gallery-db psql -U wedding_user -d wedding_gallery
```

## Post-Deployment Checklist

- [ ] Website loads at your domain
- [ ] SSL/HTTPS is enabled
- [ ] Bot responds to /start
- [ ] Photos upload successfully
- [ ] Photos appear on website
- [ ] Database is accessible
- [ ] Backups configured (optional)

## Optional Enhancements

### Set up automatic backups

```bash
# On your VPS
cat > /root/backup-wedding.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec wedding-gallery-db pg_dump -U wedding_user wedding_gallery > /backups/wedding_$DATE.sql
find /backups -name "wedding_*.sql" -mtime +7 -delete
EOF

chmod +x /root/backup-wedding.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /root/backup-wedding.sh
```

### Monitor with uptime monitoring

- Use UptimeRobot (free)
- Monitor: `https://your-domain.com`
- Get alerts if site goes down

### Add analytics (optional)

Add Google Analytics or Plausible to track:
- How many visitors
- How many photos uploaded
- Peak usage times

## Costs Breakdown

| Item | Cost | Notes |
|------|------|-------|
| Hostinger VPS | $5-10/month | You already have this |
| Domain | $10-15/year | One-time annual |
| SSL Certificate | Free | Via Let's Encrypt |
| **Total** | **$6-11/month** | vs $25/month with Supabase |

## Support

If you run into issues:

1. Check logs in Coolify
2. Review [DEPLOYMENT-VPS.md](./DEPLOYMENT-VPS.md)
3. Check [COMPARISON.md](./COMPARISON.md)
4. Check troubleshooting section above

## Success!

Once everything is working:

1. **Share bot link** with wedding guests:
   ```
   https://t.me/your_bot_username
   ```

2. **Share website** with everyone:
   ```
   https://your-domain.com
   ```

3. **Enjoy** your wedding with automated photo collection!

Your wedding photo gallery is now live and ready to capture memories! 🎉📸
