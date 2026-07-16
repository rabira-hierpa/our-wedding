"use client";

import { motion } from "framer-motion";
import { Camera, MapPin, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

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
          ? "bg-theme-surface/90 backdrop-blur-lg shadow-lg border-b border-theme-border-accent/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Newlyweds Name */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 group cursor-pointer"
            >
              <h1
                className={`font-script text-3xl md:text-4xl font-bold transition-colors duration-300 ${
                  isScrolled
                    ? "bg-gradient-to-r from-theme-primary to-theme-accent bg-clip-text text-transparent"
                    : "text-champagne-900"
                }`}
              >
                Rab & Lee
              </h1>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <PageNavLink
              icon={<Heart className="w-4 h-4" />}
              label="Our Story"
              href="/our-story"
              isScrolled={isScrolled}
              isActive={pathname === "/our-story"}
            />
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
            <Link href="/our-story">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full transition-colors ${
                  isScrolled
                    ? "text-theme-primary hover:bg-theme-surface-tertiary"
                    : "text-champagne-800 hover:bg-champagne-200/50"
                }`}
              >
                <Heart className="w-5 h-5" />
              </motion.div>
            </Link>
            {isHomePage && (
              <>
                <motion.button
                  onClick={() => scrollToSection("gallery")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-full transition-colors ${
                    isScrolled
                      ? "text-theme-primary hover:bg-theme-surface-tertiary"
                      : "text-champagne-800 hover:bg-champagne-200/50"
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
                      ? "text-theme-primary hover:bg-theme-surface-tertiary"
                      : "text-champagne-800 hover:bg-champagne-200/50"
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </motion.button>
              </>
            )}
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
          ? "text-theme-text-primary hover:text-theme-primary"
          : "text-champagne-800 hover:text-gold-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}

function PageNavLink({
  icon,
  label,
  href,
  isScrolled,
  isActive,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  isScrolled: boolean;
  isActive: boolean;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center space-x-2 font-medium transition-colors duration-300 ${
          isActive
            ? "text-gold-700"
            : isScrolled
              ? "text-theme-text-primary hover:text-theme-primary"
              : "text-champagne-800 hover:text-gold-700"
        }`}
      >
        {icon}
        <span>{label}</span>
      </motion.div>
    </Link>
  );
}
