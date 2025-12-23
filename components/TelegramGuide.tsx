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
      color: "from-theme-secondary-light to-theme-primary",
    },
    {
      icon: Heart,
      title: "Register",
      description: "Send /start to introduce yourself to the bot",
      color: "from-theme-primary-light to-theme-secondary",
    },
    {
      icon: Camera,
      title: "Share Moments",
      description: "Upload your favorite photos from the celebration",
      color: "from-theme-secondary to-theme-primary",
    },
    {
      icon: Users,
      title: "Join the Gallery",
      description: "Your photos appear here instantly for everyone to enjoy",
      color: "from-theme-primary to-theme-secondary-dark",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-theme-gradient-start via-theme-gradient-mid to-theme-gradient-end">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-theme-text-primary mb-4">
              Share Your Memories
            </h2>
            <p className="text-xl text-theme-text-secondary font-light">
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
                  <div className="bg-gradient-to-br from-theme-surface to-theme-surface-secondary rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-theme-border h-full">
                    {/* Step number */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-theme-secondary to-theme-primary rounded-full flex items-center justify-center text-theme-text-inverse font-bold text-xl shadow-lg">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-theme-text-inverse" />
                    </div>

                    {/* Content */}
                    <h3 className="font-serif text-2xl font-bold text-theme-text-primary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-theme-text-secondary leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Action button for first step */}
                    {step.link && (
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-theme-secondary to-theme-primary text-theme-text-inverse rounded-full font-semibold hover:from-theme-secondary-dark hover:to-theme-primary-dark transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
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
          <div className="mt-16 text-center bg-gradient-to-br from-theme-surface-secondary to-theme-gradient-end rounded-3xl p-12 border border-theme-border">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-16 h-16 text-theme-primary mx-auto mb-6" />
            </motion.div>
            <h3 className="font-serif text-3xl font-bold text-theme-text-primary mb-4">
              Every Photo Tells Our Story
            </h3>
            <p className="text-lg text-theme-text-secondary max-w-2xl mx-auto">
              We can&apos;t wait to see the celebration through your eyes. Each
              image you share becomes part of our forever memory.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
