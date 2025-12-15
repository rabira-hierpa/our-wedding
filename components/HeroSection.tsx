"use client";

import { motion } from "framer-motion";
import { Sparkles, Calendar } from "lucide-react";
import Countdown from "./Countdown";

/**
 * Hero Section - Champagne elegance with landscape background and countdown
 */
export default function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Landscape Background with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-champagne-900/70 z-10" />

        {/* Background Image - You can replace this URL with your actual landscape image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519167758481-83f29da8c6b3?q=80&w=2000')`,
            filter: "brightness(0.85) saturate(1.1)",
          }}
        />
      </div>
      {/* Floating sparkles animation */}
      <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x:
                typeof window !== "undefined"
                  ? Math.random() * window.innerWidth
                  : Math.random() * 1000,
              y: typeof window !== "undefined" ? window.innerHeight + 100 : 900,
              opacity: 0,
            }}
            animate={{
              y: -100,
              x:
                typeof window !== "undefined"
                  ? Math.random() * window.innerWidth
                  : Math.random() * 1000,
              opacity: [0, 1, 0.5, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 15,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          >
            <Sparkles className="w-6 h-6 text-champagne-300" />
          </motion.div>
        ))}
      </div>

      {/* Hero content */}
      <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Date Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-champagne-100/90 backdrop-blur-md px-6 py-3 rounded-full mb-8 border-2 border-gold-400/50 shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <Calendar className="w-5 h-5 text-gold-600" />
            <span className="text-gold-700 font-semibold tracking-wide">
              January 10, 2026
            </span>
          </motion.div>

          <motion.h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            A Day to Remember
          </motion.h1>

          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-transparent via-champagne-300 to-transparent mx-auto mb-8"
            initial={{ width: 0 }}
            animate={{ width: "8rem" }}
            transition={{ duration: 1.2, delay: 0.6 }}
          />

          <motion.p
            className="text-xl md:text-3xl text-champagne-100 font-light tracking-wide mb-12 drop-shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Celebrating Love & Unity
          </motion.p>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mb-12"
          >
            <h2 className="text-lg md:text-xl text-champagne-200 font-semibold mb-6 uppercase tracking-widest">
              Counting Down to Forever
            </h2>
            <Countdown />
          </motion.div>

          <motion.p
            className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            Join us in capturing the magic of our special day through shared
            moments
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { delay: 2 },
            y: { duration: 2, repeat: Infinity },
          }}
        >
          <div className="w-6 h-10 border-2 border-champagne-300 rounded-full flex justify-center backdrop-blur-sm bg-white/10">
            <motion.div
              className="w-1.5 h-1.5 bg-champagne-300 rounded-full mt-2"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
