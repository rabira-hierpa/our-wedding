"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

export default function VenueMap() {
  const venueUrl = "https://maps.app.goo.gl/AvFG44evk6f4GQx36";
  const embedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.0475867589!2d38.809267841171554!3d8.99824429624908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b852591400001%3A0x6fe6f11d74e3d0a7!2sGood%20News%20Church!5e0!3m2!1sen!2sus!4v1734649200000!5m2!1sen!2sus";

  return (
    <section
      id="venue"
      className="py-24 px-4 bg-gradient-to-b from-theme-gradient-start via-theme-gradient-mid to-theme-gradient-end"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-theme-primary to-theme-accent bg-clip-text text-transparent">
            Wedding Venue
          </h2>
          <p className="text-theme-text-secondary text-lg max-w-2xl mx-auto font-serif italic">
            Join us at Good News Church for this beautiful celebration
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-theme-surface rounded-3xl shadow-2xl overflow-hidden border border-theme-border-accent/20"
        >
          {/* Map Container */}
          <div className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-br from-theme-surface-tertiary to-theme-gradient-end">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          {/* Venue Details */}
          <div className="p-8 bg-gradient-to-br from-theme-surface-secondary/50 via-theme-gradient-mid to-theme-gradient-end/30 border-t border-theme-border-accent/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4 text-left">
                <div className="p-3 bg-gradient-to-br from-theme-primary-light to-theme-accent-light rounded-full shadow-lg">
                  <MapPin className="w-6 h-6 text-theme-text-inverse" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-theme-text-primary mb-2">
                    Good News Church
                  </h3>
                  <p className="text-theme-text-secondary font-serif italic">
                    Coordinates: 8.99824°N, 38.80927°E
                  </p>
                </div>
              </div>

              <motion.a
                href={venueUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(212, 175, 55, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-theme-primary to-theme-accent text-theme-text-inverse font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Navigation className="w-5 h-5" />
                Get Directions
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center text-theme-text-secondary font-serif italic"
        >
          <p className="text-sm">
            Tap "Get Directions" to open in Google Maps for turn-by-turn
            navigation
          </p>
        </motion.div>
      </div>
    </section>
  );
}
