"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { galleryThumbUrl } from "@/lib/image-url";

export interface FeaturedPhoto {
  id: string;
  publicUrl: string;
  caption?: string | null;
  guest: {
    firstName: string;
    lastName?: string | null;
  };
  likeCount?: number;
}

function initials(firstName: string, lastName?: string | null) {
  const a = firstName?.[0] || "";
  const b = lastName?.[0] || "";
  return (a + b).toUpperCase() || "?";
}

function guestName(firstName: string, lastName?: string | null) {
  return [firstName, lastName].filter(Boolean).join(" ");
}

interface FeaturedPhotoCardProps {
  photos: FeaturedPhoto[];
  currentIndex: number;
  onSelectIndex?: (index: number) => void;
}

export default function FeaturedPhotoCard({
  photos,
  currentIndex,
  onSelectIndex,
}: FeaturedPhotoCardProps) {
  if (photos.length === 0) {
    return (
      <div className="relative w-full aspect-[3/4] max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-champagne-200 via-gold-100 to-blush-100">
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <p className="text-champagne-900 font-serif text-2xl md:text-3xl leading-snug">
            Moments from our day will appear here
          </p>
          <p className="mt-4 text-champagne-700 text-sm">
            Share photos via Telegram to fill this gallery
          </p>
        </div>
      </div>
    );
  }

  const photo = photos[currentIndex];
  const name = guestName(photo.guest.firstName, photo.guest.lastName);
  const headline =
    photo.caption?.trim() || "A moment from our celebration";

  return (
    <div className="relative w-full aspect-[3/4] max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl bg-champagne-200">
      <AnimatePresence mode="wait">
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={galleryThumbUrl(photo.publicUrl, 900, 80)}
            alt={headline}
            fill
            className="object-cover"
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${photo.id}-meta`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-white font-serif text-xl md:text-2xl lg:text-3xl leading-snug line-clamp-3 drop-shadow-md">
                {headline}
              </h3>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white text-sm font-semibold">
                  {initials(photo.guest.firstName, photo.guest.lastName)}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{name}</p>
                  {typeof photo.likeCount === "number" ? (
                    <p className="text-white/70 text-xs">
                      {photo.likeCount}{" "}
                      {photo.likeCount === 1 ? "like" : "likes"}
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {photos.length > 1 ? (
          <div className="flex items-center gap-1.5 shrink-0 pb-1">
            {photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                aria-label={`Show photo ${i + 1}`}
                onClick={() => onSelectIndex?.(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/45 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
