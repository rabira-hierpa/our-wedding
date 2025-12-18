"use client";

import { motion } from "framer-motion";
import { Quote, Heart, Calendar } from "lucide-react";

interface QuoteCardProps {
  message: string;
  author: string;
  createdAt: string;
  onClick?: () => void;
}

export default function QuoteCard({
  message,
  author,
  createdAt,
  onClick,
}: QuoteCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="relative group cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 via-white to-purple-50 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full"
      onClick={onClick}
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Quote Icon */}
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500">
            <Quote className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Message */}
        <div className="flex-1 mb-6">
          <p className="text-lg md:text-xl font-serif text-gray-800 leading-relaxed italic">
            &ldquo;{message}&rdquo;
          </p>
        </div>

        {/* Footer */}
        <div className="space-y-2">
          {/* Author */}
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <p className="text-sm font-semibold text-gray-900">{author}</p>
          </div>

          {/* Date */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </motion.div>
  );
}
