# Coolify Database Setup - Important Notes

## Understanding Coolify's Database Defaults

When you create a PostgreSQL database in Coolify, it **automatically** sets up:

- **Username**: `postgres` (NOT `wedding_user` or any custom name)
- **Password**: Randomly generated strong password
- **Database**: `postgres` (default PostgreSQL database)
- **Port**: `5432` (standard PostgreSQL port)
- **Host**: Your database service name (e.g., `wedding-gallery-db`)

## Getting Your Connection String

### Step 1: Create Database in Coolify

1. Go to Coolify Dashboard
2. Click "Resources" → "Add Resource" → "Database"
3. Select "PostgreSQL"
4. Enter a name (e.g., `wedding-gallery-db`)
5. Click "Create"
6. Wait for it to deploy (status: "Running")

### Step 2: Get Connection String

After the database is running:

1. Click on your database name (`wedding-gallery-db`)
2. Look for the **"Connection Strings"** section
3. You'll see two options:
   - **Internal** (for services within Coolify)
   - **Public** (for external access)

4. **For your app, use INTERNAL**

Example of what you'll see:

```
Internal:
postgresql://postgres:xK9mP2nL4vQ7sT1w@wedding-gallery-db:5432

Public:
postgresql://postgres:xK9mP2nL4vQ7sT1w@your-vps-ip:5432
```

### Step 3: Format the Connection String

Coolify might show just:
```
postgresql://postgres:PASSWORD@wedding-gallery-db:5432
```

You need to add `/postgres` at the end:
```
postgresql://postgres:PASSWORD@wedding-gallery-db:5432/postgres
```

This tells PostgreSQL which database to connect to (the default `postgres` database).

## Copy to Your Environment

**For your app in Coolify:**

In your application's environment variables, set:
```
DATABASE_URL=postgresql://postgres:THE_PASSWORD_FROM_COOLIFY@wedding-gallery-db:5432/postgres
```

**For local development:**

If you want to test locally, you need to:
1. Expose the database port in Coolify (optional)
2. Or run a local PostgreSQL instance
3. Use: `postgresql://postgres:yourpassword@localhost:5432/postgres`

## Common Mistakes

### ❌ Wrong: Using `wedding_user`
```
DATABASE_URL=postgresql://wedding_user:password@wedding-gallery-db:5432/wedding_gallery
```

### ✅ Correct: Using `postgres`
```
DATABASE_URL=postgresql://postgres:xK9mP2nL4vQ7sT1w@wedding-gallery-db:5432/postgres
```

---

### ❌ Wrong: Missing database name
```
DATABASE_URL=postgresql://postgres:password@wedding-gallery-db:5432
```

### ✅ Correct: Including `/postgres`
```
DATABASE_URL=postgresql://postgres:password@wedding-gallery-db:5432/postgres
```

---

### ❌ Wrong: Using `localhost` in Coolify
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
```

### ✅ Correct: Using service name
```
DATABASE_URL=postgresql://postgres:password@wedding-gallery-db:5432/postgres
```

## Verifying Your Connection

### Method 1: In Coolify Terminal

1. Go to your application in Coolify
2. Click "Terminal"
3. Run:
   ```bash
   npx prisma db pull
   ```
4. If successful, it will show: "Introspected X models and wrote them into prisma/schema.prisma"

### Method 2: Via Docker

SSH into your VPS:
```bash
ssh root@your-vps-ip

# Find your app container
docker ps | grep wedding

# Test connection
docker exec -it <container-name> npx prisma db pull
```

### Method 3: Check Environment Variable

```bash
docker exec -it <container-name> env | grep DATABASE_URL
```

Should show:
```
DATABASE_URL=postgresql://postgres:PASSWORD@wedding-gallery-db:5432/postgres
```

## Creating Custom Database/User (Optional)

If you want to create a custom database called `wedding_gallery` with a custom user:

### Option 1: Via Coolify Database Terminal

1. Go to your database in Coolify
2. Click "Terminal"
3. Run:
   ```bash
   psql -U postgres
   ```
4. In the PostgreSQL prompt:
   ```sql
   CREATE DATABASE wedding_gallery;
   CREATE USER wedding_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE wedding_gallery TO wedding_user;
   \q
   ```

5. Update your connection string:
   ```
   DATABASE_URL=postgresql://wedding_user:your_secure_password@wedding-gallery-db:5432/wedding_gallery
   ```

### Option 2: Use Default (Recommended)

Just use the default `postgres` user and database. It's simpler and works perfectly fine for this application.

## Troubleshooting

### Error: "password authentication failed for user 'wedding_user'"

**Problem**: You're using a username that doesn't exist.

**Solution**: Use `postgres` as the username (Coolify's default).

---

### Error: "database 'wedding_gallery' does not exist"

**Problem**: You're trying to connect to a database that wasn't created.

**Solution**: Use `postgres` as the database name, or create the database manually.

---

### Error: "could not translate host name 'wedding-gallery-db'"

**Problem**: The app can't find the database service.

**Solutions**:
1. Verify both app and database are in Coolify
2. Check the database service name is correct
3. Ensure both are on the same Docker network (Coolify handles this automatically)

---

### Error: "connection refused"

**Problem**: Database isn't running or accessible.

**Solutions**:
1. Check database status in Coolify (should be "Running")
2. Restart the database
3. Check database logs for errors

## Quick Reference

| What | Coolify Default | Custom (if created) |
|------|----------------|---------------------|
| **Username** | `postgres` | `wedding_user` |
| **Password** | Auto-generated | Your choice |
| **Database** | `postgres` | `wedding_gallery` |
| **Host** | `wedding-gallery-db` | `wedding-gallery-db` |
| **Port** | `5432` | `5432` |

**Recommended Connection String Format:**
```
postgresql://postgres:COOLIFY_PASSWORD@wedding-gallery-db:5432/postgres
```

Replace `COOLIFY_PASSWORD` with the actual password shown in Coolify.

## Summary

1. ✅ Use the connection string EXACTLY as Coolify provides it
2. ✅ Add `/postgres` at the end if missing
3. ✅ Username is `postgres`, not `wedding_user`
4. ✅ Use the internal hostname (`wedding-gallery-db`), not `localhost`
5. ✅ Copy the password exactly (it's case-sensitive)

When in doubt, copy the "Internal" connection string from Coolify and just append `/postgres` at the end!
