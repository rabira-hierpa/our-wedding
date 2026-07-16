"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Calendar,
  Heart,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { PhotoWithGuest } from "@/types/database";
import { galleryThumbUrl } from "@/lib/image-url";
import AnimatedSection from "./AnimatedSection";
import QuoteCard from "./QuoteCard";
import {
  GalleryLoadingSkeleton,
  EmptyGalleryState,
  ErrorState,
} from "./LoadingStates";

const PAGE_SIZE = 24;

// Extended photo type with like count
interface PhotoWithLikes extends PhotoWithGuest {
  likeCount?: number;
  likes?: any[];
}

interface Wish {
  id: string;
  message: string;
  createdAt: string;
  guest: {
    firstName: string;
    lastName: string | null;
    telegramUsername: string | null;
  };
}

// Union type for gallery items
type GalleryItem =
  | { type: "photo"; data: PhotoWithLikes }
  | { type: "wish"; data: Wish };

function mergePhotosById(
  existing: PhotoWithLikes[],
  incoming: PhotoWithLikes[]
): PhotoWithLikes[] {
  const byId = new Map<string, PhotoWithLikes>();
  for (const photo of existing) {
    byId.set(photo.id, photo);
  }
  for (const photo of incoming) {
    byId.set(photo.id, { ...byId.get(photo.id), ...photo });
  }
  return Array.from(byId.values()).sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<PhotoWithLikes[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = useRef(false);
  const nextCursorRef = useRef<string | null>(null);

  const selectedPhoto =
    selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  const fetchPage = useCallback(
    async (cursor: string | null, mode: "replace" | "append" | "merge") => {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
      if (cursor) params.set("cursor", cursor);

      const [photosRes, wishesRes] = await Promise.all([
        fetch(`/api/photos?${params.toString()}`, { cache: "no-store" }),
        mode === "append"
          ? Promise.resolve(null)
          : fetch("/api/wishes", { cache: "no-store" }),
      ]);

      if (!photosRes.ok) {
        throw new Error("Failed to fetch photos");
      }

      const photosData = await photosRes.json();
      const pagePhotos: PhotoWithLikes[] = photosData.photos || [];

      if (typeof photosData.total === "number") {
        setTotalPhotos(photosData.total);
      }

      setNextCursor(photosData.nextCursor ?? null);
      nextCursorRef.current = photosData.nextCursor ?? null;

      if (mode === "replace") {
        setPhotos(pagePhotos);
      } else if (mode === "append") {
        setPhotos((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const fresh = pagePhotos.filter((p) => !existingIds.has(p.id));
          return [...prev, ...fresh];
        });
      } else {
        setPhotos((prev) => mergePhotosById(prev, pagePhotos));
      }

      if (wishesRes) {
        if (!wishesRes.ok) {
          throw new Error("Failed to fetch wishes");
        }
        const wishesData = await wishesRes.json();
        setWishes(wishesData);
      }

      setError(null);
    },
    []
  );

  const loadInitial = useCallback(async () => {
    try {
      setLoading(true);
      await fetchPage(null, "replace");
    } catch (err) {
      console.error("Error fetching gallery data:", err);
      setError("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  const softRefresh = useCallback(async () => {
    try {
      await fetchPage(null, "merge");
    } catch (err) {
      console.error("Error refreshing gallery:", err);
    }
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !nextCursorRef.current) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      await fetchPage(nextCursorRef.current, "append");
    } catch (err) {
      console.error("Error loading more photos:", err);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [fetchPage]);

  useEffect(() => {
    loadInitial();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        softRefresh();
      }
    };

    const handleGalleryRefresh = () => {
      softRefresh();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("galleryRefresh", handleGalleryRefresh);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("galleryRefresh", handleGalleryRefresh);
    };
  }, [loadInitial, softRefresh]);

  // Infinite scroll sentinel
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, galleryItems.length, nextCursor]);

  // Combine and sort photos and wishes by date (newest first)
  useEffect(() => {
    const combined: GalleryItem[] = [
      ...photos.map((photo) => ({ type: "photo" as const, data: photo })),
      ...wishes.map((wish) => ({ type: "wish" as const, data: wish })),
    ];

    const sorted = combined.sort((a, b) => {
      const dateA = new Date(
        a.type === "photo" ? a.data.uploadedAt : a.data.createdAt
      ).getTime();
      const dateB = new Date(
        b.type === "photo" ? b.data.uploadedAt : b.data.createdAt
      ).getTime();
      return dateB - dateA;
    });
    setGalleryItems(sorted);
  }, [photos, wishes]);

  // Keyboard navigation
  const navigatePhoto = useCallback(
    (direction: "prev" | "next") => {
      if (selectedPhotoIndex === null || photos.length === 0) return;

      if (direction === "prev") {
        setSelectedPhotoIndex((prev) =>
          prev === null || prev === 0 ? photos.length - 1 : prev - 1
        );
      } else {
        setSelectedPhotoIndex((prev) =>
          prev === null || prev === photos.length - 1 ? 0 : prev + 1
        );
      }
    },
    [selectedPhotoIndex, photos.length]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhoto) {
        if (e.key === "Escape") {
          setSelectedPhotoIndex(null);
        } else if (e.key === "ArrowLeft") {
          navigatePhoto("prev");
        } else if (e.key === "ArrowRight") {
          navigatePhoto("next");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, navigatePhoto]);

  const handleLike = async (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = `web-guest-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      localStorage.setItem("guestId", guestId);
    }

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photoId, guestId }),
      });

      if (response.ok) {
        const data = await response.json();

        setLikedPhotos((prev) => {
          const newSet = new Set(prev);
          if (data.liked) {
            newSet.add(photoId);
          } else {
            newSet.delete(photoId);
          }
          return newSet;
        });

        setPhotos((prev) =>
          prev.map((photo) => {
            if (photo.id === photoId) {
              return {
                ...photo,
                likeCount: data.liked
                  ? (photo.likeCount || 0) + 1
                  : Math.max((photo.likeCount || 0) - 1, 0),
              };
            }
            return photo;
          })
        );
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleDownload = async (photo: PhotoWithLikes) => {
    try {
      const response = await fetch(photo.publicUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wedding-photo-${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading photo:", error);
    }
  };

  const openPhotoModal = (photo: PhotoWithLikes) => {
    const index = photos.findIndex((p) => p.id === photo.id);
    setSelectedPhotoIndex(index);
  };

  if (loading) {
    return <GalleryLoadingSkeleton />;
  }

  if (error) {
    return <ErrorState onRetry={loadInitial} />;
  }

  if (galleryItems.length === 0) {
    return <EmptyGalleryState />;
  }

  const displayPhotoCount = totalPhotos || photos.length;

  return (
    <>
      <section
        id="gallery"
        className="py-16 px-4 bg-gradient-to-br from-champagne-50 via-white to-gold-50"
      >
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-serif text-5xl md:text-6xl font-bold text-champagne-900 mb-4">
                Our Gallery
              </h2>
              <p className="text-xl text-gold-700 font-light">
                {displayPhotoCount} precious{" "}
                {displayPhotoCount === 1 ? "moment" : "moments"} &{" "}
                {wishes.length} heartfelt{" "}
                {wishes.length === 1 ? "wish" : "wishes"}
              </p>
            </div>
          </AnimatedSection>

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {galleryItems.map((item, index) => (
              <motion.div
                key={
                  item.type === "photo"
                    ? `photo-${item.data.id}`
                    : `wish-${item.data.id}`
                }
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(index, 12) * 0.05,
                  ease: "easeOut",
                }}
                className="break-inside-avoid"
              >
                {item.type === "photo" ? (
                  <motion.div
                    className="relative cursor-pointer group overflow-hidden rounded-2xl shadow-lg"
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => openPhotoModal(item.data)}
                    onMouseEnter={() => setHoveredId(item.data.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <Image
                      src={galleryThumbUrl(item.data.publicUrl)}
                      alt={item.data.caption || "Wedding photo"}
                      width={600}
                      height={600}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="w-full h-auto object-cover"
                      unoptimized
                    />

                    {/* Overlay with gradient and info */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    >
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={
                            hoveredId === item.data.id
                              ? { y: 0, opacity: 1 }
                              : { y: 20, opacity: 0 }
                          }
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4" />
                            <p className="font-semibold text-sm">
                              {item.data.guest?.firstName}{" "}
                              {item.data.guest?.lastName || ""}
                            </p>
                          </div>
                          {item.data.caption && (
                            <p className="text-sm text-gray-200 line-clamp-2 mb-2">
                              {item.data.caption}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-300">
                            <Calendar className="w-3 h-3" />
                            {new Date(
                              item.data.uploadedAt
                            ).toLocaleDateString()}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Like button with count */}
                    <motion.button
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 opacity-0 group-hover:opacity-100 flex items-center gap-2"
                      initial={{ scale: 0 }}
                      animate={
                        hoveredId === item.data.id ? { scale: 1 } : { scale: 0 }
                      }
                      transition={{ duration: 0.3, type: "spring" }}
                      onClick={(e) => handleLike(item.data.id, e)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          likedPhotos.has(item.data.id)
                            ? "text-rose-500 fill-rose-500"
                            : "text-rose-400"
                        }`}
                      />
                      {item.data.likeCount && item.data.likeCount > 0 && (
                        <span className="text-sm font-semibold text-champagne-900">
                          {item.data.likeCount}
                        </span>
                      )}
                    </motion.button>
                  </motion.div>
                ) : (
                  <QuoteCard
                    message={item.data.message}
                    author={`${item.data.guest.firstName} ${
                      item.data.guest.lastName || ""
                    }`.trim()}
                    createdAt={item.data.createdAt}
                    onClick={() => setSelectedWish(item.data)}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-8 w-full" aria-hidden />

          {loadingMore && (
            <div className="flex justify-center items-center gap-2 py-8 text-champagne-700">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-script text-lg">Loading more moments…</span>
            </div>
          )}

          {!nextCursor && photos.length > 0 && (
            <p className="text-center text-champagne-600 text-sm py-6">
              You&apos;ve reached the end of the gallery
            </p>
          )}
        </div>
      </section>

      {/* Enhanced Lightbox Modal with Navigation */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="relative max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Navigation Buttons */}
              {photos.length > 1 && (
                <>
                  <motion.button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-colors z-10"
                    onClick={() => navigatePhoto("prev")}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </motion.button>
                  <motion.button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-colors z-10"
                    onClick={() => navigatePhoto("next")}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="w-8 h-8" />
                  </motion.button>
                </>
              )}

              {/* Close and Download buttons */}
              <div className="absolute -top-12 right-0 flex items-center gap-4">
                <motion.button
                  className="text-white hover:text-champagne-300 transition-colors flex items-center gap-2"
                  onClick={() => handleDownload(selectedPhoto)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Download className="w-6 h-6" />
                  <span className="text-sm font-semibold">Download</span>
                </motion.button>
                <motion.button
                  className="text-white hover:text-champagne-300 transition-colors flex items-center gap-2"
                  onClick={() => setSelectedPhotoIndex(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-sm font-semibold">Close</span>
                  <X className="w-8 h-8" />
                </motion.button>
              </div>

              {/* Photo counter */}
              {photos.length > 1 && (
                <div className="absolute -top-12 left-0 text-white text-sm font-semibold">
                  {(selectedPhotoIndex ?? 0) + 1} / {photos.length}
                  {totalPhotos > photos.length ? ` of ${totalPhotos}` : ""}
                </div>
              )}

              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative">
                  <Image
                    src={selectedPhoto.publicUrl}
                    alt={selectedPhoto.caption || "Wedding photo"}
                    width={1400}
                    height={1400}
                    className="w-full h-auto max-h-[70vh] object-contain bg-gray-50"
                    unoptimized
                  />
                </div>

                {/* Photo details */}
                <div className="p-8 bg-gradient-to-br from-champagne-50 to-gold-50">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-champagne-500 to-gold-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-serif text-2xl font-bold text-champagne-900">
                            {selectedPhoto.guest?.firstName}{" "}
                            {selectedPhoto.guest?.lastName || ""}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gold-700">
                            <Calendar className="w-4 h-4" />
                            {new Date(
                              selectedPhoto.uploadedAt
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                      {selectedPhoto.caption && (
                        <div className="mt-4 p-4 bg-white/60 rounded-xl">
                          <p className="text-gold-900 leading-relaxed italic">
                            &ldquo;{selectedPhoto.caption}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                    <motion.button
                      onClick={(e) => handleLike(selectedPhoto.id, e)}
                      className="flex flex-col items-center gap-2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div
                        animate={
                          likedPhotos.has(selectedPhoto.id)
                            ? { scale: [1, 1.3, 1] }
                            : { scale: 1 }
                        }
                        transition={{ duration: 0.3 }}
                      >
                        <Heart
                          className={`w-12 h-12 transition-all ${
                            likedPhotos.has(selectedPhoto.id)
                              ? "text-rose-500 fill-rose-500"
                              : "text-gold-600"
                          }`}
                        />
                      </motion.div>
                      {selectedPhoto.likeCount &&
                        selectedPhoto.likeCount > 0 && (
                          <span className="text-sm font-semibold text-champagne-900">
                            {selectedPhoto.likeCount}{" "}
                            {selectedPhoto.likeCount === 1 ? "like" : "likes"}
                          </span>
                        )}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Keyboard hints */}
              {photos.length > 1 && (
                <div className="absolute -bottom-12 left-0 right-0 text-center text-white/60 text-sm">
                  Use arrow keys ← → to navigate, ESC to close
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wish Modal */}
      <AnimatePresence>
        {selectedWish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedWish(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                className="absolute -top-14 right-0 text-white hover:text-pink-300 transition-colors flex items-center gap-2"
                onClick={() => setSelectedWish(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-sm font-semibold">Close</span>
                <X className="w-8 h-8" />
              </motion.button>

              <div className="bg-gradient-to-br from-pink-50 via-white to-purple-50 rounded-3xl p-12 shadow-2xl">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-pink-400 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                  {/* Quotation mark */}
                  <div className="mb-8 flex justify-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500">
                      <span className="text-6xl text-white font-serif">
                        &ldquo;
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-2xl md:text-3xl font-serif text-gray-800 leading-relaxed text-center mb-8 italic">
                    {selectedWish.message}
                  </p>

                  {/* Author and date */}
                  <div className="flex flex-col items-center space-y-3 pt-6 border-t border-pink-200">
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                      <p className="text-xl font-semibold text-gray-900">
                        {selectedWish.guest.firstName}{" "}
                        {selectedWish.guest.lastName || ""}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <p className="text-sm text-gray-600">
                        {new Date(selectedWish.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
