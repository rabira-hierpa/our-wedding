"use client";

import { motion } from "framer-motion";
import { Camera, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-lg shadow-lg border-b border-gold-200/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Newlyweds Name */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 group cursor-pointer"
          >
            <h1
              className={`font-script text-3xl md:text-4xl font-bold transition-colors duration-300 ${
                isScrolled
                  ? "bg-gradient-to-r from-gold-600 to-rose-600 bg-clip-text text-transparent"
                  : "text-white drop-shadow-lg"
              }`}
            >
              Rab & Lee
            </h1>
          </motion.button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              icon={<Camera className="w-4 h-4" />}
              label="Gallery"
              onClick={() => scrollToSection("gallery")}
              isScrolled={isScrolled}
            />
            <NavLink
              icon={<MapPin className="w-4 h-4" />}
              label="Venue"
              onClick={() => scrollToSection("venue")}
              isScrolled={isScrolled}
            />
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-4">
            <motion.button
              onClick={() => scrollToSection("gallery")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-colors ${
                isScrolled
                  ? "text-gold-600 hover:bg-gold-50"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Camera className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => scrollToSection("venue")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-colors ${
                isScrolled
                  ? "text-gold-600 hover:bg-gold-50"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <MapPin className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function NavLink({
  icon,
  label,
  onClick,
  isScrolled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isScrolled: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center space-x-2 font-medium transition-colors duration-300 ${
        isScrolled
          ? "text-gray-700 hover:text-gold-600"
          : "text-white hover:text-gold-200"
      }`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}
