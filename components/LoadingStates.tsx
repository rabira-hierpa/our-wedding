/*
 * Enhanced Loading Component
 * Beautiful skeleton loader for the photo gallery
 */

"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function GalleryLoadingSkeleton() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-champagne-50 via-white to-gold-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-12 bg-gradient-to-r from-champagne-200 to-gold-200 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-gradient-to-r from-champagne-100 to-gold-100 rounded-lg w-48 mx-auto animate-pulse" />
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="break-inside-avoid"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-champagne-100 to-gold-100">
                <div
                  className="w-full animate-pulse bg-gradient-to-r from-champagne-200 via-gold-200 to-champagne-200"
                  style={{ height: `${200 + Math.random() * 200}px` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EmptyGalleryState() {
  return (
    <div
      id="gallery"
      className="flex items-center justify-center min-h-[400px] py-20"
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart className="w-20 h-20 text-gold-400 mx-auto mb-6" />
        </motion.div>
        <h3 className="font-serif text-3xl font-bold text-champagne-900 mb-3">
          The Gallery Awaits
        </h3>
        <p className="text-xl text-gold-800 mb-2">
          Be the first to share a beautiful moment
        </p>
        <p className="text-sm text-champagne-600">
          Upload photos via our Telegram bot to see them appear here
        </p>
      </motion.div>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[400px] py-20">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-20 h-20 bg-champagne-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-gold-600" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-champagne-900 mb-3">
          Oops! Something went wrong
        </h3>
        <p className="text-gold-800 mb-6">
          We couldn&apos;t load the photos. Please try again.
        </p>
        <motion.button
          onClick={onRetry}
          className="px-8 py-4 bg-gradient-to-r from-champagne-600 to-gold-600 text-white rounded-full font-semibold shadow-lg text-lg"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 20px 25px -5px rgba(212, 175, 55, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );
}
