"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

/**
 * Footer Section - Champagne elegance with sophisticated closing
 */
export default function FooterSection() {
  return (
    <footer className="relative py-20 px-4 bg-gradient-to-br from-champagne-100 via-gold-100 to-champagne-200 overflow-hidden">
      {/* Decorative sparkles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Sparkles className="w-4 h-4 text-gold-500" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <AnimatedSection>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-16 h-16 text-gold-600 mx-auto" />
          </motion.div>

          <h3 className="font-serif text-4xl md:text-5xl font-bold text-champagne-900 mb-6">
            Forever Grateful
          </h3>

          <p className="text-lg md:text-xl text-gold-800 leading-relaxed mb-8 max-w-2xl mx-auto">
            Thank you for being part of our story and for helping us preserve
            these precious moments. Your presence made our day truly magical.
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-8" />

          <div className="space-y-2">
            <p className="text-sm text-champagne-700 font-light">
              Made with love and joy
            </p>
            <p className="text-xs text-gold-700">
              © {new Date().getFullYear()} • A celebration of love
            </p>
          </div>

          {/* Animated sparkles */}
          <motion.div
            className="flex justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                <Sparkles className="w-6 h-6 text-gold-500" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>
      </div>
    </footer>
  );
}
