-- Add indexes for better query performance with 600 concurrent users

-- Photos: Already has index on uploadedAt(desc), add composite index for joins
CREATE INDEX IF NOT EXISTS idx_photos_guest_uploaded ON photos (guest_id, uploaded_at DESC);

-- Wishes: Already has index on createdAt(desc), add composite index for joins
CREATE INDEX IF NOT EXISTS idx_wishes_guest_created ON wishes (guest_id, created_at DESC);

-- Likes: Add covering index for photo likes count
CREATE INDEX IF NOT EXISTS idx_likes_photo_guest ON likes (photo_id, guest_id);

-- Optimize guest lookups by telegram user id (heavily used)
CREATE INDEX IF NOT EXISTS idx_guests_telegram_user ON guests (telegram_user_id)
WHERE
    telegram_user_id != 0;

-- Connection pooling configuration (add to your DATABASE_URL)
-- postgresql://user:password@host:port/database?connection_limit=20&pool_timeout=20