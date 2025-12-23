"use client";

import { motion } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";

/**
 * Powered By Footer - Clean branding section
 */
export default function PoweredByFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="relative py-12 px-4 bg-gradient-to-br from-theme-dark-surface via-theme-dark-surface-secondary to-theme-dark-surface"
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Made with Love */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 text-theme-dark-text"
          >
            <span className="text-sm font-light">Made with</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart className="w-4 h-4 fill-theme-accent-light text-theme-accent-light" />
            </motion.div>
            <span className="text-sm font-light">and joy</span>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-32 h-px bg-gradient-to-r from-transparent via-theme-primary-light/40 to-transparent"
          />

          {/* Powered By */}
          <motion.a
            href="https://tiedtheknot.cloud"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-2 px-6 py-3 rounded-full bg-theme-secondary-dark/40 backdrop-blur-sm border border-theme-primary-light/30 hover:border-theme-primary-light/60 hover:bg-theme-secondary-dark/60 transition-all duration-300"
          >
            <span className="text-sm text-theme-dark-text font-light">
              Powered by
            </span>
            <span className="text-base font-serif font-semibold text-theme-primary-light">
              TiedTheKnot.cloud
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-theme-primary-light opacity-70 group-hover:opacity-100 transition-opacity" />
          </motion.a>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xs text-ivory-50 font-light"
          >
            © {new Date().getFullYear()} • A celebration of love
          </motion.p>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-theme-primary/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: "50%",
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </motion.footer>
  );
}
