"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, SkipForward, Camera, MapPin, Heart } from "lucide-react";
import Countdown from "./Countdown";
import Image from "next/image";
import Link from "next/link";

/**
 * Hero Section - Dynamic background with uploaded photos and biblical verses
 */
export default function HeroSection() {
  const [showCountdown, setShowCountdown] = useState(true);
  const [backgroundPhotos, setBackgroundPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Biblical verses about love and marriage
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

  // Fetch background photos
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch("/api/photos");
        if (response.ok) {
          const data = await response.json();
          const photoUrls = data.photos.map((p: any) => p.publicUrl);
          setBackgroundPhotos(photoUrls);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };
    fetchPhotos();
  }, []);

  // Rotate background photos every 5 seconds
  useEffect(() => {
    if (backgroundPhotos.length > 0) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % backgroundPhotos.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [backgroundPhotos]);

  // Rotate verses every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVerseIndex((prev) => (prev + 1) % verses.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [verses.length]);

  const scrollToGallery = () => {
    setShowCountdown(false);
    // Smooth scroll to gallery section
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background with Slideshow */}
      <div className="absolute inset-0 z-0">
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />

        {/* Background Image Slideshow */}
        <AnimatePresence mode="wait">
          {backgroundPhotos.length > 100 ? (
            <motion.div
              key={currentPhotoIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <Image
                src={backgroundPhotos[currentPhotoIndex]}
                alt="Wedding background"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </motion.div>
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000')`,
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Hero content */}
      <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Main Title */}
          <motion.h1
            className="font-script text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 drop-shadow-2xl"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Rab & Lee
          </motion.h1>

          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mb-8"
            initial={{ width: 0 }}
            animate={{ width: "8rem" }}
            transition={{ duration: 1.2, delay: 0.6 }}
          />

          {/* Biblical Verse */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVerseIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <p className="font-script text-2xl md:text-4xl text-gold-200 italic mb-3 leading-relaxed">
                &ldquo;{verses[currentVerseIndex].text}&rdquo;
              </p>
              <p className="text-champagne-300 text-sm md:text-base font-light tracking-wider">
                — {verses[currentVerseIndex].reference}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Countdown Section or Navigation Buttons */}
          <AnimatePresence mode="wait">
            {showCountdown ? (
              <motion.div
                key="countdown"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h2 className="font-script text-2xl md:text-3xl text-gold-300 mb-6">
                  Counting Down to Forever
                </h2>
                <Countdown />

                {/* Skip Button */}
                <motion.button
                  onClick={scrollToGallery}
                  className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-md border-2 border-gold-400/50 rounded-full text-white font-semibold hover:bg-white/20 hover:border-gold-400 transition-all duration-300 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  <SkipForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <span className="font-script text-lg">Skip to Gallery</span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="navigation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                  {/* Gallery Button */}
                  <motion.button
                    onClick={() => scrollToSection("gallery")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-gold-400/50 rounded-full text-white font-semibold hover:bg-white/20 hover:border-gold-400 transition-all duration-300 group min-w-[200px]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-script text-lg">Gallery</span>
                  </motion.button>

                  {/* Our Story Button */}
                  <Link href="/our-story" className="w-full sm:w-auto">
                    <motion.div
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-theme-accent/20 backdrop-blur-md border-2 border-theme-accent/60 rounded-full text-white font-semibold hover:bg-theme-accent/30 hover:border-theme-accent transition-all duration-300 group min-w-[200px] w-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Heart className="w-5 h-5 group-hover:scale-110 transition-transform fill-current" />
                      <span className="font-script text-lg">Our Story</span>
                    </motion.div>
                  </Link>

                  {/* Venue Button */}
                  <motion.button
                    onClick={() => scrollToSection("venue")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-gold-400/50 rounded-full text-white font-semibold hover:bg-white/20 hover:border-gold-400 transition-all duration-300 group min-w-[200px]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-script text-lg">Venue</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtitle */}
          <motion.p
            className="font-script text-xl md:text-2xl text-champagne-200 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            Join us in capturing the magic of our special day
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll indicator - Fixed positioning */}
      <motion.button
        onClick={scrollToGallery}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-champagne-300 hover:text-gold-400 transition-colors"
        >
          <span className="font-script text-sm tracking-widest">Scroll</span>
          <div className="w-8 h-12 border-2 border-current rounded-full flex justify-center backdrop-blur-sm bg-white/5 p-2">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </motion.div>
      </motion.button>
    </section>
  );
}
