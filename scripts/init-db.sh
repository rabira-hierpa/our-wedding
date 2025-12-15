#!/bin/bash

# Database initialization script for VPS deployment

echo "🗄️  Wedding Photo Gallery - Database Initialization"
echo "=================================================="
echo ""

# Check if .env file exists
if [ ! -f .env.local ] && [ ! -f .env ]; then
    echo "❌ Error: No .env.local or .env file found"
    echo "Please copy .env.example to .env.local and configure it"
    exit 1
fi

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
elif [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL not set in environment"
    exit 1
fi

echo "✅ Environment variables loaded"
echo ""

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"
echo ""

# Push schema to database
echo "🔄 Pushing schema to database..."
npx prisma db push
echo "✅ Database schema created"
echo ""

# Check if database is accessible
echo "🔍 Verifying database connection..."
if npx prisma db pull > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Error: Could not connect to database"
    exit 1
fi

echo ""
echo "🎉 Database initialization complete!"
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Or build for production: npm run build"
echo "3. Set up your Telegram webhook"
echo ""
