"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface AdminPhoto {
  id: string;
  publicUrl: string;
  caption: string | null;
  isHidden: boolean;
  likeCount: number;
  groupMessageId: string | null;
  uploadedAt: string;
  guest: {
    firstName: string;
    lastName: string | null;
    telegramUsername: string | null;
  };
}

function PhotosModeration() {
  const searchParams = useSearchParams();
  const initialSort = searchParams.get("sort") === "likes" ? "likes" : "uploadedAt";

  const [photos, setPhotos] = useState<AdminPhoto[]>([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState(initialSort);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ filter, sort });
      const res = await fetch(`/api/admin/photos?${params}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setPhotos(data.photos);
      setError("");
    } catch {
      setError("Could not load photos");
    } finally {
      setLoading(false);
    }
  }, [filter, sort]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleHidden = async (photo: AdminPhoto) => {
    setBusyId(photo.id);
    try {
      const res = await fetch(`/api/admin/photos/${photo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !photo.isHidden }),
      });
      if (!res.ok) throw new Error("Failed");
      await load();
    } catch {
      alert("Failed to update photo visibility");
    } finally {
      setBusyId(null);
    }
  };

  const deletePhoto = async (photo: AdminPhoto) => {
    const name = [photo.guest.firstName, photo.guest.lastName]
      .filter(Boolean)
      .join(" ");
    if (
      !confirm(
        `Permanently delete this photo by ${name}? This cannot be undone.`
      )
    ) {
      return;
    }

    setBusyId(photo.id);
    try {
      const res = await fetch(`/api/admin/photos/${photo.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      await load();
    } catch {
      alert("Failed to delete photo");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-champagne-900">Photos</h2>
        <p className="text-sm text-champagne-600">
          Hide from the public gallery or permanently delete
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-champagne-300 bg-white text-sm"
        >
          <option value="all">All photos</option>
          <option value="visible">Visible only</option>
          <option value="hidden">Hidden only</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded-lg border border-champagne-300 bg-white text-sm"
        >
          <option value="uploadedAt">Newest first</option>
          <option value="likes">Most liked</option>
        </select>
      </div>

      {error ? <p className="text-red-600">{error}</p> : null}

      {loading ? (
        <p className="text-champagne-600">Loading photos…</p>
      ) : photos.length === 0 ? (
        <p className="text-champagne-600">No photos found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => {
            const guestName = [photo.guest.firstName, photo.guest.lastName]
              .filter(Boolean)
              .join(" ");
            const busy = busyId === photo.id;

            return (
              <div
                key={photo.id}
                className={`bg-white border rounded-xl overflow-hidden ${
                  photo.isHidden
                    ? "border-amber-300 opacity-90"
                    : "border-champagne-200"
                }`}
              >
                <div className="relative aspect-[4/5] bg-champagne-100">
                  <Image
                    src={photo.publicUrl}
                    alt={photo.caption || guestName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {photo.isHidden ? (
                    <span className="absolute top-2 left-2 text-xs bg-amber-500 text-white px-2 py-1 rounded">
                      Hidden
                    </span>
                  ) : null}
                </div>
                <div className="p-3 space-y-2">
                  <p className="font-medium text-champagne-900 truncate">
                    {guestName}
                    {photo.guest.telegramUsername
                      ? ` @${photo.guest.telegramUsername}`
                      : ""}
                  </p>
                  <p className="text-sm text-champagne-600 line-clamp-2 min-h-[2.5rem]">
                    {photo.caption || "No caption"}
                  </p>
                  <p className="text-xs text-champagne-500">
                    ♥ {photo.likeCount}
                    {photo.groupMessageId ? " · forwarded" : ""}
                    {" · "}
                    {new Date(photo.uploadedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      disabled={busy}
                      onClick={() => toggleHidden(photo)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-champagne-300 text-xs font-medium hover:bg-champagne-50 disabled:opacity-50"
                    >
                      {photo.isHidden ? (
                        <>
                          <Eye className="w-3.5 h-3.5" /> Unhide
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> Hide
                        </>
                      )}
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => deletePhoto(photo)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminPhotosPage() {
  return (
    <Suspense fallback={<p className="text-champagne-600">Loading…</p>}>
      <PhotosModeration />
    </Suspense>
  );
}
