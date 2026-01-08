# Fixing Persistent File Storage in Coolify

## Problem

Files uploaded to `/public/uploads` are lost on new deployments because the storage directory is not properly mapped to the persistent volume.

## Root Cause

- **Coolify persistent volume**: Mounted at `/uploads`
- **App default storage**: `/app/public/uploads`
- **Mismatch result**: Files are written inside the container (non-persistent) instead of the persistent volume

## Solution

### Step 1: Configure Coolify Persistent Storage

In your Coolify application settings:

1. Go to **Storage** section
2. Ensure you have a persistent volume with:
   - **Name**: Any name (e.g., `uploads`)
   - **Destination Path**: `/uploads`
   - **Source**: Coolify will auto-create this

### Step 2: Set Environment Variable

In Coolify, go to **Environment Variables** and add/update:

```
STORAGE_DIR=/uploads
```

This tells the application to store files in the persistent volume instead of the default location.

### Step 3: Redeploy

After making these changes:

1. Commit the updated Dockerfile
2. Push to your repository
3. Redeploy in Coolify

## Verifying the Fix

After deployment, check that files are being stored correctly:

```bash
# SSH into your Coolify container
# Check that /uploads directory exists and has correct permissions
ls -la /uploads

# Upload a test photo via your app
# Verify the file appears in /uploads
ls -la /uploads
```

## Migration: Recovering Lost Files

If you had files before the domain change, they might still be in the old deployment. To recover them:

### Option A: Manual Recovery (if old container still exists)

```bash
# Find the old container
docker ps -a | grep wedding

# Copy files from old container to host
docker cp <old-container-id>:/app/public/uploads/. /path/to/backup/

# Copy to new persistent volume
docker cp /path/to/backup/. <new-container-id>:/uploads/
```

### Option B: Database Records Still Valid

If you still have database records pointing to the old URLs but files are gone:

1. Users will need to re-upload photos
2. Or, if you have backups, restore them to the `/uploads` directory

## Architecture Overview

### Before Fix

```
Container (ephemeral)
├── /app/public/uploads/  ← Files stored here (LOST on redeploy)
└── /uploads/             ← Volume mounted but unused
```

### After Fix

```
Container (ephemeral)
├── /app/public/uploads/  ← Empty/unused
└── /uploads/             ← Files stored here (PERSISTENT)
    └── [your files]
```

## How Files Are Served

Files are served via the API route at `/api/uploads/[filename]`:

```typescript
// app/api/uploads/[filename]/route.ts
// This reads from STORAGE_DIR environment variable
```

No changes needed to the serving logic - it automatically uses the `STORAGE_DIR` environment variable.

## Environment Variables Summary

| Variable               | Development             | Production (Coolify) |
| ---------------------- | ----------------------- | -------------------- |
| `STORAGE_DIR`          | `./public/uploads`      | `/uploads`           |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | Your domain          |

## Testing Checklist

- [ ] Persistent volume created in Coolify at `/uploads`
- [ ] `STORAGE_DIR=/uploads` environment variable set
- [ ] Application redeployed
- [ ] Upload a test photo
- [ ] Redeploy again (to simulate a deployment)
- [ ] Verify test photo still accessible after redeploy

## Troubleshooting

### Files still disappear after deployment

- Check that `STORAGE_DIR` environment variable is set correctly in Coolify
- Verify the persistent volume is mounted at `/uploads`
- Check container logs: `docker logs <container-name>`

### Permission errors

```bash
# SSH into container
# Check permissions
ls -la /uploads

# Should show: nextjs:nodejs as owner
# If not, the Dockerfile creates this correctly on build
```

### Old files missing

- If you changed domains, files from the old deployment are likely gone unless:
  - The old container still exists
  - You have backups
  - The persistent volume was correctly configured before the change

## Best Practices

1. **Always test persistent storage** after initial setup by uploading, redeploying, and verifying
2. **Set up backups**: Consider backing up the `/uploads` directory regularly
3. **Monitor disk space**: Persistent volumes have size limits in Coolify
4. **Use object storage for production**: For larger deployments, consider AWS S3, Cloudflare R2, or similar

## Future: Object Storage Migration

For better scalability and reliability, consider migrating to object storage:

- **AWS S3**: Industry standard
- **Cloudflare R2**: S3-compatible, zero egress fees
- **DigitalOcean Spaces**: Simple and affordable
- **Supabase Storage**: If already using Supabase for DB

The `lib/file-storage.ts` module can be extended to support object storage while keeping the same interface.
