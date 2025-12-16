'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Home, ArrowLeft } from 'lucide-react';

/**
 * Custom 404 Page
 * Features:
 * - Romantic, elegant design matching the wedding theme
 * - Smooth animations with Framer Motion
 * - Clear call-to-action to return home
 * - Emotional messaging
 */
export default function NotFound() {
  // Floating animation for hearts
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne-50 via-ivory-50 to-blush-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-gold-200 to-champagne-200 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2.5, delay: 0.3 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-blush-100 to-gold-100 rounded-full blur-3xl"
        />
      </div>

      {/* Floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * 100 + '%',
              y: '100%',
              opacity: 0,
            }}
            animate={{
              y: '-10%',
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          >
            <Heart className="w-8 h-8 text-blush-300 fill-blush-300" />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* Animated 404 with hearts */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div variants={floatingVariants} animate="animate">
              <Heart className="w-16 h-16 text-blush-400 fill-blush-400" />
            </motion.div>
            <h1 className="font-serif text-9xl md:text-[12rem] font-bold text-champagne-900 leading-none">
              404
            </h1>
            <motion.div
              variants={floatingVariants}
              animate="animate"
              transition={{ delay: 0.5 }}
            >
              <Heart className="w-16 h-16 text-gold-400 fill-gold-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-champagne-900 mb-4">
            Lost in Love
          </h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: '6rem' }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-champagne-700 mb-8 leading-relaxed"
        >
          This page seems to have wandered off to dance at the reception. Let&apos;s
          get you back to where the magic happens.
        </motion.p>

        {/* Call to action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Primary button - Home */}
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <Home className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Return to Gallery</span>
            </motion.button>
          </Link>

          {/* Secondary button - Go back */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-sm text-champagne-900 rounded-full font-semibold border-2 border-champagne-300 hover:border-gold-400 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </motion.button>
        </motion.div>

        {/* Decorative quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12"
        >
          <p className="font-script text-3xl md:text-4xl text-gold-600">
            Love always finds its way
          </p>
        </motion.div>
      </div>
    </div>
  );
}
