# Fixing Telegram User ID Unique Constraint Error

## Problem

Getting error: `Unique constraint failed on the fields: (telegram_user_id)` when users try to like photos.

## Root Cause

The migration `20251218221912_allow_web_guests` that drops the unique constraint on `telegram_user_id` has not been applied to the production database.

## Solution

### Option 1: Run Pending Migrations (Recommended)

SSH into your Coolify container and run:

```bash
npx prisma migrate deploy
```

This will apply all pending migrations, including the one that drops the unique constraint.

### Option 2: Manual SQL Fix

If migrations don't work, manually drop the constraint:

```bash
# SSH into Coolify container
docker exec -it <container-name> sh

# Connect to database
psql $DATABASE_URL

# Drop the unique constraint
DROP INDEX IF EXISTS "guests_telegram_user_id_key";

# Exit
\q
```

### Option 3: Direct Database Connection

If you have direct access to your PostgreSQL database:

```sql
-- Connect to your database and run:
DROP INDEX IF EXISTS "guests_telegram_user_id_key";
```

## Verification

After applying the fix, verify the constraint is gone:

```sql
-- List all constraints on the guests table
SELECT
    con.conname as constraint_name,
    con.contype as constraint_type
FROM
    pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
WHERE
    rel.relname = 'guests';
```

You should NOT see `guests_telegram_user_id_key` in the list.

## Code Fix Applied

I've also updated the `/app/api/likes/route.ts` to use `upsert` instead of separate `findUnique` + `create` operations. This prevents race conditions and handles existing guests more gracefully.

## Testing

After applying the database fix:

1. Try liking a photo from the web interface
2. Try liking from another browser/device
3. Verify no "unique constraint" errors appear

## Why This Happened

The migration was created but never applied to production. This typically happens when:

- Database migrations weren't run during deployment
- The `docker-entrypoint.sh` script didn't execute properly
- Migrations were skipped manually

## Prevention

Ensure your deployment process always runs migrations. Check your `docker-entrypoint.sh`:

```bash
# Should include:
npx prisma migrate deploy
```
