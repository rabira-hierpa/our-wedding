#!/bin/sh
set -e

echo "🚀 Starting wedding photo gallery..."

# Ensure uploads directory exists and has correct permissions
mkdir -p /app/public/uploads
chmod 755 /app/public/uploads

echo "✓ Uploads directory ready: /app/public/uploads"

# Run Prisma migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy || echo "⚠️  Migration failed or no migrations to run"

echo "✓ Database ready"

# Execute the main command (should be "node server.js" for standalone)
echo "🌐 Starting Next.js server..."
exec "$@"
