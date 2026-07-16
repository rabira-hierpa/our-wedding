"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Camera,
  Heart,
  MessageCircle,
  Upload,
  RefreshCw,
  Clock,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";

interface StatsResponse {
  generatedAt: string;
  overview: {
    telegramGuests: number;
    webGuests: number;
    uploaders: number;
    photos: number;
    photosVisible: number;
    photosHidden: number;
    wishes: number;
    likes: number;
    inWeddingGroup: number;
    photosForwardedToGroup: number;
    photosLastHour: number;
    photosToday: number;
  };
  photosPerUploader: { avg: number; median: number; max: number };
  topUploaders: {
    guestId: string;
    name: string;
    username: string | null;
    photoCount: number;
  }[];
  topLiked: {
    photoId: string;
    publicUrl: string;
    likeCount: number;
    guestName: string;
    isHidden: boolean;
  }[];
  uploadsByHour: { hour: string; count: number }[];
  breakdown: {
    likesFromTelegram: number;
    likesFromWeb: number;
  };
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to load stats");
      const data = await res.json();
      setStats(data);
      setError("");
    } catch {
      setError("Could not load dashboard stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 45000);
    return () => clearInterval(id);
  }, [load]);

  if (loading && !stats) {
    return <p className="text-champagne-600">Loading overview…</p>;
  }

  if (error && !stats) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!stats) return null;

  const { overview } = stats;
  const groupPct =
    overview.telegramGuests > 0
      ? Math.round((overview.inWeddingGroup / overview.telegramGuests) * 100)
      : 0;
  const forwardedPct =
    overview.photos > 0
      ? Math.round((overview.photosForwardedToGroup / overview.photos) * 100)
      : 0;
  const maxHour = Math.max(1, ...stats.uploadsByHour.map((h) => h.count));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-champagne-900">Overview</h2>
          <p className="text-sm text-champagne-600">
            Updated {new Date(stats.generatedAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            load();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-champagne-300 text-sm text-champagne-800 hover:bg-white transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Telegram guests"
          value={overview.telegramGuests}
          subtitle="Unique wedding guests"
          icon={Users}
        />
        <StatCard
          label="Photos uploaded"
          value={overview.photos}
          subtitle={`${overview.photosVisible} visible · ${overview.photosHidden} hidden`}
          icon={Camera}
        />
        <StatCard
          label="Wishes sent"
          value={overview.wishes}
          icon={MessageCircle}
        />
        <StatCard
          label="Total likes"
          value={overview.likes}
          subtitle={`${stats.breakdown.likesFromWeb} from web`}
          icon={Heart}
        />
        <StatCard
          label="Uploaders"
          value={overview.uploaders}
          subtitle={`avg ${stats.photosPerUploader.avg} / max ${stats.photosPerUploader.max}`}
          icon={Upload}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Photos last hour"
          value={overview.photosLastHour}
          subtitle={`${overview.photosToday} today`}
          icon={Clock}
        />
        <StatCard
          label="In wedding group"
          value={overview.inWeddingGroup}
          subtitle={`${groupPct}% of telegram guests`}
        />
        <StatCard
          label="Forwarded to group"
          value={overview.photosForwardedToGroup}
          subtitle={`${forwardedPct}% of photos`}
        />
        <StatCard
          label="Web visitors"
          value={overview.webGuests}
          subtitle="Anonymous likers (not guests)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-champagne-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-champagne-900">
              Uploads (48h)
            </h3>
          </div>
          {stats.uploadsByHour.length === 0 ? (
            <p className="text-sm text-champagne-600">No recent uploads</p>
          ) : (
            <div className="flex items-end gap-1 h-32">
              {stats.uploadsByHour.map((bucket) => (
                <div
                  key={bucket.hour}
                  className="flex-1 min-w-0 bg-gold-200 rounded-t hover:bg-gold-400 transition-colors"
                  style={{
                    height: `${Math.max(8, (bucket.count / maxHour) * 100)}%`,
                  }}
                  title={`${new Date(bucket.hour).toLocaleString()}: ${bucket.count}`}
                />
              ))}
            </div>
          )}
        </section>

        <section className="bg-white border border-champagne-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-champagne-900">
              Top uploaders
            </h3>
            <Link
              href="/admin/guests"
              className="text-sm text-gold-700 hover:underline"
            >
              View all
            </Link>
          </div>
          {stats.topUploaders.length === 0 ? (
            <p className="text-sm text-champagne-600">No uploaders yet</p>
          ) : (
            <ul className="space-y-2">
              {stats.topUploaders.map((u) => (
                <li
                  key={u.guestId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-champagne-900">
                    {u.name}
                    {u.username ? (
                      <span className="text-champagne-500"> @{u.username}</span>
                    ) : null}
                  </span>
                  <span className="font-medium text-gold-800">
                    {u.photoCount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="bg-white border border-champagne-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl text-champagne-900">
            Top liked photos
          </h3>
          <Link
            href="/admin/photos?sort=likes"
            className="text-sm text-gold-700 hover:underline"
          >
            Manage photos
          </Link>
        </div>
        {stats.topLiked.length === 0 ? (
          <p className="text-sm text-champagne-600">No liked photos yet</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {stats.topLiked.map((p) => (
              <div key={p.photoId} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-champagne-100">
                <Image
                  src={p.publicUrl}
                  alt={p.guestName}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-xs">
                  <p className="font-medium truncate">{p.guestName}</p>
                  <p>♥ {p.likeCount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
