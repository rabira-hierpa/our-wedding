"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, SkipForward, Camera, MapPin, Heart } from "lucide-react";
import Countdown, { isWeddingCountdownOver } from "./Countdown";
import FeaturedPhotoCard, { FeaturedPhoto } from "./FeaturedPhotoCard";
import Link from "next/link";

/**
 * Hero Section - Split layout: copy on the left, top-liked photo card on the right
 */
export default function HeroSection() {
  // null until client check — avoids flashing 00:00 after the wedding date
  const [countdownOver, setCountdownOver] = useState<boolean | null>(null);
  const [showCountdown, setShowCountdown] = useState(true);
  const [featuredPhotos, setFeaturedPhotos] = useState<FeaturedPhoto[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    setCountdownOver(isWeddingCountdownOver());
  }, []);

  const verses = [
    {
      text: "Give thanks to the LORD, for he is good. His love endures forever.",
      reference: "Psalm 136:1",
    },
    {
      text: "Love is patient, love is kind. It does not envy, it does not boast.",
      reference: "1 Corinthians 13:4",
    },
    {
      text: "Two are better than one, because they have a good return for their labor.",
      reference: "Ecclesiastes 4:9",
    },
    {
      text: "I have loved you with an everlasting love; I have drawn you with unfailing kindness.",
      reference: "Jeremiah 31:3",
    },
    {
      text: "Place me like a seal over your heart, like a seal on your arm; for love is as strong as death, its jealousy unyielding as the grave.",
      reference: "Song of Solomon 8:6",
    },
  ];

  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch("/api/photos?featured=1&limit=5");
        if (!response.ok) return;
        const data = await response.json();
        const featured = (data.photos || []).map(
          (p: FeaturedPhoto & { id: string }) => ({
            id: p.id,
            publicUrl: p.publicUrl,
            caption: p.caption,
            guest: p.guest,
            likeCount: p.likeCount,
          })
        );
        setFeaturedPhotos(featured);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (featuredPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % featuredPhotos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredPhotos]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVerseIndex((prev) => (prev + 1) % verses.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [verses.length]);

  const scrollToGallery = () => {
    setShowCountdown(false);
    setTimeout(() => {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }, 100);
  };

  const scrollToSection = (sectionId: string) => {
    setShowCountdown(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-champagne-100 via-ivory-50 to-gold-100" />
      <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-200/60 via-transparent to-blush-100/40" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: brand + copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <motion.h1
              className="font-script text-6xl md:text-7xl lg:text-8xl font-bold text-champagne-900 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
            >
              Rab & Lee
            </motion.h1>

            <motion.div
              className="w-28 h-1 bg-gradient-to-r from-gold-400 to-transparent mb-8"
              initial={{ width: 0 }}
              animate={{ width: "7rem" }}
              transition={{ duration: 1, delay: 0.4 }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentVerseIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6 }}
                className="mb-10 max-w-xl"
              >
                <p className="font-script text-2xl md:text-3xl text-gold-800 italic leading-relaxed">
                  &ldquo;{verses[currentVerseIndex].text}&rdquo;
                </p>
                <p className="text-champagne-600 text-sm md:text-base font-light tracking-wider mt-3">
                  — {verses[currentVerseIndex].reference}
                </p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {showCountdown ? (
                <motion.div
                  key={countdownOver === false ? "countdown" : "gallery-cta"}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  {countdownOver === false && (
                    <>
                      <h2 className="font-script text-2xl md:text-3xl text-gold-700 mb-5">
                        Counting Down to Forever
                      </h2>
                      <Countdown onComplete={() => setCountdownOver(true)} />
                    </>
                  )}

                  {countdownOver !== null && (
                    <motion.button
                      onClick={scrollToGallery}
                      className={`inline-flex items-center gap-2 px-7 py-3 bg-white/70 backdrop-blur-md border border-gold-400/60 rounded-full text-champagne-900 font-semibold hover:bg-white hover:border-gold-500 transition-all duration-300 group shadow-sm ${
                        countdownOver ? "" : "mt-8"
                      }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: countdownOver ? 0.2 : 1.2 }}
                    >
                      <SkipForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      <span className="font-script text-lg">
                        {countdownOver ? "Go to Gallery" : "Skip to Gallery"}
                      </span>
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="navigation"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                    <motion.button
                      onClick={() => scrollToSection("gallery")}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-md border border-gold-400/60 rounded-full text-champagne-900 font-semibold hover:bg-white transition-all group"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Camera className="w-5 h-5" />
                      <span className="font-script text-lg">Gallery</span>
                    </motion.button>

                    <Link href="/our-story">
                      <motion.div
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blush-100/80 border border-blush-300 rounded-full text-champagne-900 font-semibold hover:bg-blush-100 transition-all w-full sm:w-auto"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Heart className="w-5 h-5 fill-current text-blush-600" />
                        <span className="font-script text-lg">Our Story</span>
                      </motion.div>
                    </Link>

                    <motion.button
                      onClick={() => scrollToSection("venue")}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-md border border-gold-400/60 rounded-full text-champagne-900 font-semibold hover:bg-white transition-all"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <MapPin className="w-5 h-5" />
                      <span className="font-script text-lg">Venue</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.p
              className="font-script text-xl md:text-2xl text-champagne-700 max-w-md leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Join us in capturing the magic of our special day
            </motion.p>
          </motion.div>

          {/* Right: featured photo card */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
            className="w-full max-w-md mx-auto lg:max-w-none lg:ml-auto"
          >
            <FeaturedPhotoCard
              photos={featuredPhotos}
              currentIndex={
                featuredPhotos.length
                  ? currentPhotoIndex % featuredPhotos.length
                  : 0
              }
              onSelectIndex={setCurrentPhotoIndex}
            />
          </motion.div>
        </div>
      </div>

      <motion.button
        onClick={scrollToGallery}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.08 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-champagne-600 hover:text-gold-700 transition-colors"
        >
          <span className="font-script text-sm tracking-widest">Scroll</span>
          <div className="w-8 h-12 border-2 border-current rounded-full flex justify-center bg-white/40 p-2">
            <ChevronDown className="w-4 h-4" />
          </div>
        </motion.div>
      </motion.button>
    </section>
  );
}
