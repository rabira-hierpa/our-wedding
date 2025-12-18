"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Calendar, Heart } from "lucide-react";
import type { PhotoWithGuest } from "@/types/database";
import AnimatedSection from "./AnimatedSection";
import {
  GalleryLoadingSkeleton,
  EmptyGalleryState,
  ErrorState,
} from "./LoadingStates";

// Extended photo type with like count
interface PhotoWithLikes extends PhotoWithGuest {
  likeCount?: number;
  likes?: any[];
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<PhotoWithLikes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoWithLikes | null>(
    null
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPhotos();
    // Poll for new photos every 10 seconds
    const interval = setInterval(fetchPhotos, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/photos", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }

      const data = await response.json();
      setPhotos(data.photos);
      setError(null);
    } catch (err) {
      console.error("Error fetching photos:", err);
      setError("Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Get or create guest ID from localStorage
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

        // Update liked photos set
        setLikedPhotos((prev) => {
          const newSet = new Set(prev);
          if (data.liked) {
            newSet.add(photoId);
          } else {
            newSet.delete(photoId);
          }
          return newSet;
        });

        // Update photo like count in state
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

        // Update selected photo if it's the one being liked
        if (selectedPhoto?.id === photoId) {
          setSelectedPhoto((prev) =>
            prev
              ? {
                  ...prev,
                  likeCount: data.liked
                    ? (prev.likeCount || 0) + 1
                    : Math.max((prev.likeCount || 0) - 1, 0),
                }
              : null
          );
        }
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  if (loading) {
    return <GalleryLoadingSkeleton />;
  }

  if (error) {
    return <ErrorState onRetry={fetchPhotos} />;
  }

  if (photos.length === 0) {
    return <EmptyGalleryState />;
  }

  return (
    <>
      <section className="py-16 px-4 bg-gradient-to-br from-champagne-50 via-white to-gold-50">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="font-serif text-5xl md:text-6xl font-bold text-champagne-900 mb-4">
                Our Gallery
              </h2>
              <p className="text-xl text-gold-700 font-light">
                {photos.length} precious{" "}
                {photos.length === 1 ? "moment" : "moments"} captured
              </p>
            </div>
          </AnimatedSection>

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                className="break-inside-avoid"
              >
                <motion.div
                  className="relative cursor-pointer group overflow-hidden rounded-2xl shadow-lg"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedPhoto(photo)}
                  onHoverStart={() => setHoveredId(photo.id)}
                  onHoverEnd={() => setHoveredId(null)}
                >
                  <Image
                    src={photo.publicUrl}
                    alt={photo.caption || "Wedding photo"}
                    width={600}
                    height={600}
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
                          hoveredId === photo.id
                            ? { y: 0, opacity: 1 }
                            : { y: 20, opacity: 0 }
                        }
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4" />
                          <p className="font-semibold text-sm">
                            {photo.guest?.firstName}{" "}
                            {photo.guest?.lastName || ""}
                          </p>
                        </div>
                        {photo.caption && (
                          <p className="text-sm text-gray-200 line-clamp-2 mb-2">
                            {photo.caption}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                          <Calendar className="w-3 h-3" />
                          {new Date(photo.uploadedAt).toLocaleDateString()}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Like button with count */}
                  <motion.button
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 opacity-0 group-hover:opacity-100 flex items-center gap-2"
                    initial={{ scale: 0 }}
                    animate={
                      hoveredId === photo.id ? { scale: 1 } : { scale: 0 }
                    }
                    transition={{ duration: 0.3, type: "spring" }}
                    onClick={(e) => handleLike(photo.id, e)}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart
                      className={`w-5 h-5 transition-all ${
                        likedPhotos.has(photo.id)
                          ? "text-rose-500 fill-rose-500"
                          : "text-rose-400"
                      }`}
                    />
                    {photo.likeCount && photo.likeCount > 0 && (
                      <span className="text-sm font-semibold text-champagne-900">
                        {photo.likeCount}
                      </span>
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="relative max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                className="absolute -top-12 right-0 text-white hover:text-champagne-300 transition-colors z-10 flex items-center gap-2"
                onClick={() => setSelectedPhoto(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-sm font-semibold">Close</span>
                <X className="w-8 h-8" />
              </motion.button>

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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
