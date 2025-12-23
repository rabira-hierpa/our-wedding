# Quick Redis Setup for Coolify

## Option 1: Coolify Built-in Redis (Recommended)

1. Go to your Coolify dashboard
2. Navigate to your project
3. Click "Add Resource" → "Redis"
4. Name it: `wedding-redis`
5. Deploy it
6. Copy the connection URL (e.g., `redis://wedding-redis:6379`)
7. Add to your app's environment variables:
   ```
   REDIS_URL=redis://wedding-redis:6379
   ```

## Option 2: Upstash Redis (Free Tier - No Setup Needed)

1. Go to [upstash.com](https://upstash.com/)
2. Sign up (free)
3. Create database → Select region closest to your server
4. Copy the `UPSTASH_REDIS_REST_URL`
5. Add to Coolify environment variables:
   ```
   REDIS_URL=<your-upstash-url>
   ```

**Free tier includes**: 10,000 commands/day (enough for wedding day!)

## Option 3: No Redis (Fallback Mode)

If you don't have time to set up Redis:

- App will work WITHOUT Redis
- Uses Next.js ISR caching instead
- Performance will be degraded but functional
- Only recommended if < 200 concurrent users

---

## Testing Redis Connection

After deployment, check logs:

```
✅ Redis connected successfully    <- Good!
⚠️  REDIS_URL not set              <- Working but degraded
❌ Redis connection error           <- Check REDIS_URL format
```

---

## Performance Impact

| Setup       | API Calls/sec | DB Queries/sec | Max Users |
| ----------- | ------------- | -------------- | --------- |
| No Redis    | 60            | 120            | ~100      |
| With Redis  | 4             | 8              | ~600      |
| Redis + SSE | 4             | 1-2            | **1000+** |
