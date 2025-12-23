import Redis from "ioredis";

let redis: Redis | null = null;

// Initialize Redis only if REDIS_URL is provided
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    // Connection pooling
    lazyConnect: false,
    enableOfflineQueue: true,
  });

  redis.on("error", (err) => {
    console.error("Redis connection error:", err);
  });

  redis.on("connect", () => {
    console.log("✅ Redis connected successfully");
  });
} else {
  console.warn(
    "⚠️  REDIS_URL not set - caching disabled, may struggle with 600+ users"
  );
}

export default redis;

// Custom JSON serializer that handles BigInt
function safeStringify(data: any): string {
  return JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}

// Cache helper functions
export async function getCached<T>(
  key: string,
  fallback: () => Promise<T>,
  ttl: number = 30 // seconds
): Promise<T> {
  if (!redis) {
    return fallback();
  }

  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }

    const data = await fallback();
    await redis.setex(key, ttl, safeStringify(data));
    return data;
  } catch (error) {
    console.error("Redis cache error:", error);
    return fallback();
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  if (!redis) return;

  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error("Redis invalidation error:", error);
  }
}
