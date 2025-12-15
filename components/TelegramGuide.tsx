"use client";

import { motion } from "framer-motion";
import { Send, Camera, Heart, Users } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

/**
 * Telegram Bot Guide Section
 * Beautiful step-by-step instructions with icons and animations
 */
export default function TelegramGuide() {
  const steps = [
    {
      icon: Send,
      title: "Find Our Bot",
      description: "Search for @rabnlee_wedding_bot on Telegram",
      action: "Open Telegram",
      link: "https://t.me/rabnlee_wedding_bot",
      color: "from-champagne-400 to-gold-500",
    },
    {
      icon: Heart,
      title: "Register",
      description: "Send /start to introduce yourself to the bot",
      color: "from-gold-400 to-champagne-600",
    },
    {
      icon: Camera,
      title: "Share Moments",
      description: "Upload your favorite photos from the celebration",
      color: "from-champagne-500 to-gold-600",
    },
    {
      icon: Users,
      title: "Join the Gallery",
      description: "Your photos appear here instantly for everyone to enjoy",
      color: "from-gold-500 to-champagne-700",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-champagne-50 via-white to-gold-50">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-champagne-900 mb-4">
              Share Your Memories
            </h2>
            <p className="text-xl text-gold-700 font-light">
              Help us preserve every beautiful moment
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <AnimatedSection key={index} delay={index * 0.15}>
                <motion.div
                  className="relative group"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gradient-to-br from-white to-champagne-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-champagne-200 h-full">
                    {/* Step number */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-champagne-500 to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="font-serif text-2xl font-bold text-champagne-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gold-800 leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Action button for first step */}
                    {step.link && (
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-champagne-600 to-gold-600 text-white rounded-full font-semibold hover:from-champagne-700 hover:to-gold-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        {step.action}
                      </a>
                    )}
                  </div>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Additional CTA */}
        <AnimatedSection delay={0.8}>
          <div className="mt-16 text-center bg-gradient-to-br from-champagne-50 to-gold-50 rounded-3xl p-12 border border-champagne-200">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-16 h-16 text-gold-600 mx-auto mb-6" />
            </motion.div>
            <h3 className="font-serif text-3xl font-bold text-champagne-900 mb-4">
              Every Photo Tells Our Story
            </h3>
            <p className="text-lg text-gold-800 max-w-2xl mx-auto">
              We can&apos;t wait to see the celebration through your eyes. Each
              image you share becomes part of our forever memory.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
