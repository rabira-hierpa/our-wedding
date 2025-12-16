'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, Camera, Users, Sparkles } from 'lucide-react';

/**
 * Highlight Moments Component
 * Features:
 * - Cinematic presentation of special moments
 * - Parallax-like effects
 * - Elegant scroll-triggered animations
 * - Category-based organization
 */
export default function HighlightMoments() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const moments = [
    {
      icon: Heart,
      title: 'The Ceremony',
      description: 'Where two hearts became one',
      color: 'from-blush-400 to-blush-600',
      bgColor: 'bg-blush-50',
    },
    {
      icon: Sparkles,
      title: 'The Reception',
      description: 'Celebrating love with family and friends',
      color: 'from-gold-400 to-gold-600',
      bgColor: 'bg-gold-50',
    },
    {
      icon: Camera,
      title: 'Special Portraits',
      description: 'Capturing the beauty of the day',
      color: 'from-champagne-400 to-champagne-600',
      bgColor: 'bg-champagne-50',
    },
    {
      icon: Users,
      title: 'Cherished Moments',
      description: 'Memories that will last forever',
      color: 'from-gold-500 to-champagne-600',
      bgColor: 'bg-ivory-100',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white via-champagne-50 to-white relative overflow-hidden">
      {/* Decorative background orbs */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-gold-200 to-champagne-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-blush-100 to-gold-100 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-20"
        >
          <motion.h2
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-champagne-900 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our Story in Moments
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6"
            initial={{ width: 0 }}
            animate={inView ? { width: '6rem' } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          <motion.p
            className="text-lg md:text-xl text-champagne-700 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Each photograph captures a piece of our hearts, a fragment of our
            joy, and a memory we&apos;ll treasure forever
          </motion.p>
        </motion.div>

        {/* Moments grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-8"
        >
          {moments.map((moment, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -12, scale: 1.02 }}
              className="group relative"
            >
              <div
                className={`relative ${moment.bgColor} rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-white/50 hover:border-gold-300/80 overflow-hidden`}
              >
                {/* Animated gradient background on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${moment.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                {/* Icon with animation */}
                <motion.div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${moment.color} flex items-center justify-center mb-6 shadow-lg relative z-10`}
                  whileHover={{ rotate: [0, -10, 10, -5, 5, 0], scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <moment.icon className="w-10 h-10 text-white" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="font-serif text-3xl font-bold text-champagne-900 mb-3">
                    {moment.title}
                  </h3>
                  <p className="text-lg text-champagne-700 leading-relaxed">
                    {moment.description}
                  </p>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div
                    className={`w-full h-full bg-gradient-to-br ${moment.color} rounded-bl-full`}
                  />
                </div>

                {/* Hover sparkle effect */}
                <motion.div
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    rotate: [0, 180, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Sparkles className="w-6 h-6 text-gold-500" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-20"
        >
          <p className="font-script text-3xl md:text-5xl text-gold-600 mb-4">
            Love is composed of a single soul
          </p>
          <p className="font-script text-3xl md:text-5xl text-gold-600">
            inhabiting two bodies
          </p>
          <p className="text-sm text-champagne-600 mt-4 italic">
            — Aristotle
          </p>
        </motion.div>
      </div>
    </section>
  );
}
