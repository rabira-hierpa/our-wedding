# 🚨 IMPORTANT: Database Connection Setup

## TL;DR - What You Need to Know

When you create a PostgreSQL database in Coolify, it does NOT create a user called `wedding_user`.

**It creates:**
- Username: `postgres` ✅
- Password: Auto-generated random string
- Database: `postgres` ✅
- Host: Your service name (e.g., `wedding-gallery-db`)

## Quick Setup Checklist

### Step 1: Create Database in Coolify
1. Go to Coolify → Resources → Add Resource → Database
2. Select PostgreSQL
3. Name it: `wedding-gallery-db`
4. Click Create

### Step 2: Get Connection String
1. Click on `wedding-gallery-db`
2. Find "Connection Strings" section
3. Copy the **"Internal"** connection string
4. It looks like:
   ```
   postgresql://postgres:xK9mP2nL4vQ7sT1w@wedding-gallery-db:5432
   ```

### Step 3: Add `/postgres` at the End
Your final connection string should be:
```
postgresql://postgres:xK9mP2nL4vQ7sT1w@wedding-gallery-db:5432/postgres
```

### Step 4: Use in Environment Variables
In your Coolify app's environment settings:
```
DATABASE_URL=postgresql://postgres:xK9mP2nL4vQ7sT1w@wedding-gallery-db:5432/postgres
```

## Common Errors & Solutions

### ❌ Error: "password authentication failed for user 'wedding_user'"
**Cause**: You're using `wedding_user` which doesn't exist.
**Fix**: Change username to `postgres`

### ❌ Error: "database 'wedding_gallery' does not exist"
**Cause**: You're trying to connect to a non-existent database.
**Fix**: Change database name to `postgres` (add `/postgres` at the end)

### ❌ Error: "could not translate host name"
**Cause**: Wrong hostname.
**Fix**: Use your Coolify database service name (e.g., `wedding-gallery-db`), not `localhost`

## Example Connection Strings

### ✅ Correct for Coolify:
```
postgresql://postgres:xK9mP2nL4vQ7sT1w@wedding-gallery-db:5432/postgres
```

### ❌ Wrong - using wedding_user:
```
postgresql://wedding_user:password@wedding-gallery-db:5432/wedding_gallery
```

### ❌ Wrong - missing database name:
```
postgresql://postgres:password@wedding-gallery-db:5432
```

### ❌ Wrong - using localhost:
```
postgresql://postgres:password@localhost:5432/postgres
```

## Full Documentation

For detailed explanations and troubleshooting, see:
- [COOLIFY-DATABASE-SETUP.md](./COOLIFY-DATABASE-SETUP.md) - Complete database guide
- [QUICKSTART-VPS.md](./QUICKSTART-VPS.md) - Full deployment guide

## Need Help?

1. Double-check your connection string matches the format above
2. Verify you copied it exactly from Coolify (passwords are case-sensitive!)
3. Make sure you added `/postgres` at the end
4. Check [COOLIFY-DATABASE-SETUP.md](./COOLIFY-DATABASE-SETUP.md) for detailed troubleshooting
