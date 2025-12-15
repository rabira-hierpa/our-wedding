"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const weddingDate = new Date("2026-01-10T00:00:00");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-4 justify-center">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-champagne-300/20 rounded-2xl mb-2" />
            <div className="h-4 w-16 bg-champagne-200/20 rounded mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          className="relative group"
        >
          {/* Animated background glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-champagne-400/40 to-gold-400/40 rounded-2xl blur-xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />

          {/* Counter box */}
          <motion.div
            className="relative bg-gradient-to-br from-champagne-50 to-white backdrop-blur-md border-2 border-champagne-300/50 rounded-2xl p-4 md:p-6 shadow-2xl min-w-[80px] md:min-w-[110px]"
            whileHover={{ scale: 1.05, borderColor: "rgb(212, 175, 55)" }}
            transition={{ duration: 0.2 }}
          >
            {/* Animated number */}
            <motion.div
              key={unit.value}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-4xl md:text-6xl font-bold font-serif bg-gradient-to-br from-champagne-700 via-gold-600 to-champagne-800 bg-clip-text text-transparent"
            >
              {String(unit.value).padStart(2, "0")}
            </motion.div>

            {/* Label */}
            <div className="text-xs md:text-sm font-semibold text-champagne-700 mt-2 uppercase tracking-wider">
              {unit.label}
            </div>

            {/* Decorative dots */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold-500 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold-500 rounded-full" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
