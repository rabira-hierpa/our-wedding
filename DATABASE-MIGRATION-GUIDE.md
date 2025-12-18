# 📦 Database Migration Guide

## Overview

This guide covers all aspects of database migrations for the Wedding Photo Gallery application, including automatic migrations, manual operations, and troubleshooting.

## Table of Contents

- [Automatic Migrations](#automatic-migrations)
- [Development Workflow](#development-workflow)
- [Production Deployment](#production-deployment)
- [Common Migration Commands](#common-migration-commands)
- [Troubleshooting](#troubleshooting)
- [Migration Best Practices](#migration-best-practices)

---

## Automatic Migrations

### Docker/Production Environment

The application **automatically runs migrations on startup** via the `docker-entrypoint.sh` script:

```bash
#!/bin/sh
set -e

echo "🚀 Starting wedding photo gallery..."
echo "📦 Running database migrations..."
npx prisma migrate deploy || echo "⚠️  Migration failed or no migrations to run"
echo "✓ Database ready"
echo "🌐 Starting Next.js server..."
exec "$@"
```

**What happens:**
1. Container starts
2. Runs `npx prisma migrate deploy`
3. Applies all pending migrations from `prisma/migrations/`
4. Starts the Next.js application

**Check logs:**
```bash
docker logs <container-name>
```

You should see:
```
🚀 Starting wedding photo gallery...
📦 Running database migrations...
✓ Database ready
🌐 Starting Next.js server...
```

---

## Development Workflow

### Creating a New Migration

When you modify the Prisma schema:

```bash
# 1. Update prisma/schema.prisma
# 2. Create and apply migration
npx prisma migrate dev --name descriptive_migration_name
```

This command will:
- Generate a new migration file in `prisma/migrations/`
- Apply the migration to your development database
- Regenerate Prisma Client

### Example: Adding a New Field

1. Edit `prisma/schema.prisma`:
   ```prisma
   model Photo {
     id          String   @id @default(cuid())
     // ... existing fields
     description String?  // New field
   }
   ```

2. Create migration:
   ```bash
   npx prisma migrate dev --name add_photo_description
   ```

3. Prisma generates:
   - `prisma/migrations/YYYYMMDDHHMMSS_add_photo_description/migration.sql`
   - Updated Prisma Client

### Handling Schema Drift

If your database schema is out of sync with migrations:

```bash
# Check migration status
npx prisma migrate status

# If drift is detected, reset and reapply migrations
npx prisma migrate reset
```

⚠️ **WARNING**: `migrate reset` will delete all data!

---

## Production Deployment

### First-Time Deployment

1. **Set DATABASE_URL environment variable**
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/wedding_db
   ```

2. **Deploy the application**
   
   Migrations run automatically on container start. No manual intervention needed!

3. **Verify migrations**
   ```bash
   docker exec -it <container-name> npx prisma migrate status
   ```

### Updating Existing Deployment

When you push code with new migrations:

1. Push code to repository
2. Container rebuilds and restarts
3. `docker-entrypoint.sh` runs `prisma migrate deploy`
4. New migrations are applied automatically
5. Application starts with updated schema

### Zero-Downtime Deployments

For production systems that can't have downtime:

1. **Backward-compatible migrations first**
   - Add new columns as optional (`String?`)
   - Don't drop columns yet

2. **Deploy application code**
   - Update application to use new fields
   - Keep compatibility with old schema

3. **Remove old columns later**
   - After verifying everything works
   - Create another migration to clean up

---

## Common Migration Commands

### Check Migration Status

```bash
# See which migrations are applied
npx prisma migrate status

# In Docker
docker exec -it <container-name> npx prisma migrate status
```

### Apply Migrations (Production)

```bash
# Apply all pending migrations
npx prisma migrate deploy

# In Docker
docker exec -it <container-name> npx prisma migrate deploy
```

### Create Migration (Development)

```bash
# Create and apply migration
npx prisma migrate dev --name migration_name

# Create migration without applying
npx prisma migrate dev --create-only --name migration_name
```

### Reset Database (Development Only!)

```bash
# ⚠️  WARNING: Deletes all data!
npx prisma migrate reset

# Force reset without confirmation
npx prisma migrate reset --force
```

### Generate Prisma Client

```bash
# Regenerate Prisma Client after schema changes
npx prisma generate
```

### Resolve Failed Migrations

```bash
# Mark a failed migration as rolled back
npx prisma migrate resolve --rolled-back "20241217000000_migration_name"

# Mark a migration as applied
npx prisma migrate resolve --applied "20241217000000_migration_name"
```

---

## Troubleshooting

### Issue: Foreign Key Constraint Violation

**Error:**
```
Invalid `prisma.like.create()` invocation:
Foreign key constraint violated: `likes_guest_id_fkey (index)`
```

**Cause:** Trying to create a record with a foreign key that doesn't exist.

**Solution:**
1. Verify the related record exists:
   ```typescript
   const guest = await prisma.guest.findUnique({
     where: { id: guestId }
   });
   
   if (!guest) {
     throw new Error("Guest not found");
   }
   ```

2. The likes API has been updated to check for guest existence before creating likes.

### Issue: Migration Fails on Startup

**Symptoms:**
- Container starts but migrations fail
- Application doesn't start properly

**Debugging:**

1. **Check container logs:**
   ```bash
   docker logs <container-name>
   ```

2. **Test database connection:**
   ```bash
   docker exec -it <container-name> sh
   npx prisma db execute --stdin <<< "SELECT 1;"
   ```

3. **Check migration status:**
   ```bash
   docker exec -it <container-name> npx prisma migrate status
   ```

4. **Verify DATABASE_URL:**
   ```bash
   docker exec -it <container-name> env | grep DATABASE_URL
   ```

### Issue: Schema Drift Detected

**Error:**
```
Drift detected: Your database schema is not in sync with your migration history.
```

**Cause:** Database was modified outside of Prisma migrations.

**Solution (Development):**
```bash
# Reset and reapply all migrations
npx prisma migrate reset
```

**Solution (Production):**
```bash
# Create a new migration to reconcile differences
npx prisma migrate dev --name reconcile_drift

# Or manually fix the database to match expected schema
```

### Issue: Migration Files Missing

**Symptoms:**
- Migrations folder is empty
- Database has tables but no migration history

**Solution:**
```bash
# Generate a baseline migration
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql

# Mark as applied
npx prisma migrate resolve --applied "0_init"
```

### Issue: Conflicting Migrations

**Symptoms:**
- Multiple developers created migrations simultaneously
- Git merge conflicts in migration files

**Solution:**
1. Keep all migration files
2. Ensure they're applied in chronological order (by timestamp in filename)
3. If conflicts exist in the same migration, create a new migration to reconcile

---

## Migration Best Practices

### 1. Always Use Descriptive Names

✅ Good:
```bash
npx prisma migrate dev --name add_wishes_likes_and_group_features
npx prisma migrate dev --name add_photo_description_field
```

❌ Bad:
```bash
npx prisma migrate dev --name update
npx prisma migrate dev --name fix
```

### 2. Never Modify Existing Migrations

Once a migration is applied to production:
- Never edit the migration file
- Create a new migration to make changes
- Use `prisma migrate resolve` only for fixing failed states

### 3. Test Migrations Before Deploying

```bash
# Create migration without applying
npx prisma migrate dev --create-only --name new_feature

# Review the generated SQL
cat prisma/migrations/YYYYMMDDHHMMSS_new_feature/migration.sql

# Apply and test
npx prisma migrate dev
```

### 4. Backup Before Major Migrations

```bash
# Backup PostgreSQL database
pg_dump -U username -d database_name > backup_$(date +%Y%m%d).sql

# In Docker
docker exec <postgres-container> pg_dump -U username database_name > backup.sql
```

### 5. Use Transactions

Migrations are automatically wrapped in transactions by Prisma. If a migration fails, all changes are rolled back.

### 6. Keep Migrations Small

Instead of one large migration:
```sql
-- Too much in one migration
ALTER TABLE photos ADD COLUMN description TEXT;
ALTER TABLE photos ADD COLUMN rating INT;
CREATE TABLE comments (...);
ALTER TABLE users ADD COLUMN verified BOOLEAN;
```

Break into smaller migrations:
- Migration 1: Add photo description
- Migration 2: Add photo rating
- Migration 3: Create comments table
- Migration 4: Add user verification

### 7. Handle Production Data Carefully

When dropping columns with data:

```sql
-- Step 1: Make column optional first
ALTER TABLE photos ALTER COLUMN old_field DROP NOT NULL;

-- Step 2: Migrate data
UPDATE photos SET new_field = old_field WHERE new_field IS NULL;

-- Step 3: Drop old column (in a later migration)
ALTER TABLE photos DROP COLUMN old_field;
```

---

## Migration File Structure

```
prisma/
├── schema.prisma
└── migrations/
    ├── migration_lock.toml          # Locks to PostgreSQL
    ├── 20241217000000_init/
    │   └── migration.sql            # Initial schema
    └── 20251218215531_add_wishes_likes_and_group_features/
        └── migration.sql            # Latest migration
```

### migration.sql Example

```sql
-- CreateTable
CREATE TABLE "wishes" (
    "id" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wishes_guestId_idx" ON "wishes"("guestId");

-- AddForeignKey
ALTER TABLE "wishes" ADD CONSTRAINT "wishes_guestId_fkey" 
    FOREIGN KEY ("guestId") REFERENCES "guests"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Create migration (dev) | `npx prisma migrate dev --name NAME` |
| Apply migrations (prod) | `npx prisma migrate deploy` |
| Check status | `npx prisma migrate status` |
| Reset database | `npx prisma migrate reset` |
| Generate Prisma Client | `npx prisma generate` |
| View in Prisma Studio | `npx prisma studio` |

---

## Support

If you encounter migration issues not covered here:

1. Check Prisma documentation: https://www.prisma.io/docs/concepts/components/prisma-migrate
2. View migration logs: `docker logs <container-name>`
3. Check database state: `npx prisma migrate status`
4. Review migration files in `prisma/migrations/`

---

**Last Updated:** December 19, 2024
