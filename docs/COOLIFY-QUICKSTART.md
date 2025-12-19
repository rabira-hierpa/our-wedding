# 📋 Quick Deploy Checklist

## For Coolify Deployment

### ✅ Pre-Deploy

- [ ] Set `NEXT_PUBLIC_BASE_URL` to your domain (e.g., `https://wedding.example.com`)
- [ ] Set `DATABASE_URL` with your PostgreSQL connection string
- [ ] Set `TELEGRAM_BOT_TOKEN` from @BotFather
- [ ] Set `TELEGRAM_WEBHOOK_SECRET` (any random string)
- [ ] Set `WEDDING_GROUP_CHAT_ID` (your Telegram group ID)

### ✅ Coolify Configuration

- [ ] Repository: Connected to your Git repo
- [ ] Branch: `main` or `dev`
- [ ] Build Method: Dockerfile
- [ ] Port: 3000
- [ ] Persistent Volume: `/app/public/uploads` (for photo storage)
- [ ] Health Check: `/api/health`

### ✅ Post-Deploy

1. **Test Telegram Bot**

   ```
   Send /start to your bot
   Upload a photo
   ```

2. **Check Gallery**

   ```
   Visit https://your-domain.com
   Photos should appear in gallery
   ```

3. **Verify Image URLs**
   ```
   Image URLs should be: https://your-domain.com/api/uploads/[filename].jpg
   ```

## 🔧 If Images Don't Load

### Fix existing photo URLs in database:

```bash
# SSH into container
docker exec -it <container-name> sh

# Run SQL update
npx prisma db execute --stdin <<EOF
UPDATE photos
SET "publicUrl" = REPLACE("publicUrl", '/uploads/', '/api/uploads/');
EOF
```

Or connect to database and run:

```sql
UPDATE photos
SET "publicUrl" = REPLACE("publicUrl", '/uploads/', '/api/uploads/');
```

## 🐛 Debugging

### Check uploads directory:

```bash
docker exec <container> ls -la /app/public/uploads
```

### Check environment:

```bash
docker exec <container> env | grep NEXT_PUBLIC_BASE_URL
```

### Check logs:

```bash
docker logs <container> -f
```

### Test API route:

```bash
curl https://your-domain.com/api/uploads/filename.jpg
```

## 🚀 Push to Deploy

```bash
git push origin dev
```

Coolify will automatically:

1. Pull latest code
2. Build Docker image (with standalone Next.js)
3. Run database migrations
4. Start the server
5. Images now work! ✅
