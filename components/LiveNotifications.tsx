"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface Notification {
  id: string;
  type: "photo" | "wish";
  message: string;
  author: string;
  timestamp: Date;
}

export default function LiveNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let lastPhotoCount = 0;
    let lastWishCount = 0;

    const checkForUpdates = async () => {
      try {
        const [photosRes, wishesRes] = await Promise.all([
          fetch("/api/photos", { cache: "no-store" }),
          fetch("/api/wishes", { cache: "no-store" }),
        ]);

        if (photosRes.ok && wishesRes.ok) {
          const photosData = await photosRes.json();
          const wishesData = await wishesRes.json();

          const currentPhotoCount = photosData.photos?.length || 0;
          const currentWishCount = wishesData?.length || 0;

          // New photo notification
          if (currentPhotoCount > lastPhotoCount && lastPhotoCount > 0) {
            const latestPhoto = photosData.photos[0];
            if (latestPhoto) {
              addNotification({
                id: `photo-${Date.now()}`,
                type: "photo",
                message: latestPhoto.caption || "shared a photo",
                author: `${latestPhoto.guest?.firstName || "Someone"} ${
                  latestPhoto.guest?.lastName || ""
                }`.trim(),
                timestamp: new Date(latestPhoto.uploadedAt),
              });
            }
          }

          // New wish notification
          if (currentWishCount > lastWishCount && lastWishCount > 0) {
            const latestWish = wishesData[0];
            if (latestWish) {
              addNotification({
                id: `wish-${Date.now()}`,
                type: "wish",
                message: latestWish.message,
                author: `${latestWish.guest?.firstName || "Someone"} ${
                  latestWish.guest?.lastName || ""
                }`.trim(),
                timestamp: new Date(latestWish.createdAt),
              });
            }
          }

          lastPhotoCount = currentPhotoCount;
          lastWishCount = currentWishCount;
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    };

    // Check every 5 seconds
    const interval = setInterval(checkForUpdates, 5000);
    checkForUpdates(); // Initial check

    return () => clearInterval(interval);
  }, []);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev].slice(0, 5)); // Keep last 5

    // Auto-remove after 8 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 8000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-40 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{
              opacity: 0,
              x: 100,
              scale: 0.8,
              transition: { duration: 0.2 },
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              delay: index * 0.1,
            }}
            className="pointer-events-auto"
          >
            <motion.div
              className="relative overflow-hidden bg-gradient-to-r from-champagne-900/95 to-gold-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Animated background shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <div className="relative p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <motion.div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      notification.type === "photo"
                        ? "bg-gradient-to-br from-pink-500 to-rose-500"
                        : "bg-gradient-to-br from-purple-500 to-indigo-500"
                    }`}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {notification.type === "photo" ? (
                      <Camera className="w-5 h-5 text-white" />
                    ) : (
                      <MessageCircle className="w-5 h-5 text-white" />
                    )}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-white">
                    <p className="font-semibold text-sm mb-0.5">
                      {notification.author}
                    </p>
                    <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-white/60 mt-1">
                      {getTimeAgo(notification.timestamp)}
                    </p>
                  </div>

                  {/* Close button */}
                  <motion.button
                    onClick={() => removeNotification(notification.id)}
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-3 h-3 text-white" />
                  </motion.button>
                </div>

                {/* Progress bar */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 8, ease: "linear" }}
                />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return date.toLocaleDateString();
}
