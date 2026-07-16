#!/bin/bash
set -e

echo "🔧 Production Database Migration Fix"
echo "====================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo ""
    echo "Please set your production database URL:"
    echo "  export DATABASE_URL='postgresql://user:password@host:port/database'"
    echo ""
    exit 1
fi

echo "✓ DATABASE_URL is set"
echo ""

# Show current migration status
echo "📊 Current migration status:"
echo "----------------------------"
npx prisma migrate status || true
echo ""

# Apply pending migrations
echo "🚀 Applying pending migrations..."
echo "----------------------------"
npx prisma migrate deploy

echo ""
echo "✓ Migrations applied successfully!"
echo ""

# Show updated migration status
echo "📊 Updated migration status:"
echo "----------------------------"
npx prisma migrate status

echo ""
echo "✅ Done! Your production database is now up to date."
echo ""
echo "Next steps:"
echo "  1. Restart your application if needed"
echo "  2. Test the /api/photos endpoint"
echo "  3. Monitor your application logs"


