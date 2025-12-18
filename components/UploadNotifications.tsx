"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, User } from "lucide-react";

interface UploadNotification {
  id: string;
  userName: string;
  photoCount: number;
  timestamp: number;
}

export default function UploadNotifications() {
  const [notifications, setNotifications] = useState<UploadNotification[]>([]);
  const [lastCheckTime, setLastCheckTime] = useState(Date.now());

  useEffect(() => {
    // Check for new uploads every 3 seconds
    const interval = setInterval(checkForNewUploads, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastCheckTime]);

  const checkForNewUploads = async () => {
    try {
      const response = await fetch("/api/photos?cache=" + Date.now());
      if (response.ok) {
        const data = await response.json();
        const photos = data.photos || [];

        // Get photos uploaded in the last 5 minutes
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        const recentPhotos = photos.filter(
          (photo: any) => new Date(photo.uploadedAt).getTime() > fiveMinutesAgo
        );

        if (recentPhotos.length > 0) {
          // Group by user
          const uploadsByUser = recentPhotos.reduce((acc: any, photo: any) => {
            const userId = photo.guestId;
            if (!acc[userId]) {
              acc[userId] = {
                userName: `${photo.guest.firstName} ${photo.guest.lastName || ""}`.trim(),
                photos: [],
              };
            }
            acc[userId].photos.push(photo);
            return acc;
          }, {});

          // Create notifications for new uploads since last check
          const newNotifications: UploadNotification[] = [];
          Object.entries(uploadsByUser).forEach(([userId, data]: [string, any]) => {
            const newPhotos = data.photos.filter(
              (photo: any) => new Date(photo.uploadedAt).getTime() > lastCheckTime
            );
            
            if (newPhotos.length > 0) {
              newNotifications.push({
                id: `${userId}-${Date.now()}`,
                userName: data.userName,
                photoCount: newPhotos.length,
                timestamp: Date.now(),
              });
            }
          });

          if (newNotifications.length > 0) {
            setNotifications((prev) => [...newNotifications, ...prev].slice(0, 5));
            setLastCheckTime(Date.now());

            // Determine how long to show notifications
            const uniqueUsers = new Set(recentPhotos.map((p: any) => p.guestId));
            const displayDuration = uniqueUsers.size === 1 ? 30000 : 3000; // 30s for single user, 3s for multiple

            // Remove notifications after display duration
            newNotifications.forEach((notif) => {
              setTimeout(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
              }, displayDuration);
            });
          }
        }
      }
    } catch (error) {
      console.error("Error checking for uploads:", error);
    }
  };

  return (
    <div className="fixed top-24 right-6 z-40 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: index * 0.1,
            }}
            className="mb-3 pointer-events-auto"
          >
            <motion.div
              className="bg-gradient-to-r from-champagne-100 to-gold-100 border-2 border-champagne-300 rounded-2xl shadow-2xl px-6 py-4 min-w-[280px]"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className="bg-champagne-500 rounded-full p-3"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Upload className="w-5 h-5 text-white" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-champagne-700" />
                    <p className="font-semibold text-champagne-900 text-sm">
                      {notification.userName}
                    </p>
                  </div>
                  <motion.p
                    className="text-gold-700 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    uploaded {notification.photoCount}{" "}
                    {notification.photoCount === 1 ? "photo" : "photos"}
                  </motion.p>
                </div>
                <motion.div
                  className="text-2xl"
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  ✨
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
