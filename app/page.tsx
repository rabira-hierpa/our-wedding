import PhotoGallery from "@/components/PhotoGallery";
import HeroSection from "@/components/HeroSection";
import TelegramGuide from "@/components/TelegramGuide";
import HighlightMoments from "@/components/HighlightMoments";
import VenueMap from "@/components/VenueMap";
import FooterSection from "@/components/FooterSection";
import LiveNotifications from "@/components/LiveNotifications";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-champagne-50 via-white to-gold-50">
      {/* Fixed Header */}
      <Header />

      {/* Live Notifications - TikTok style */}
      <LiveNotifications />

      {/* Hero Section - Cinematic entrance */}
      <HeroSection />

      {/* Telegram Bot Guide Section */}
      <TelegramGuide />

      {/* Highlight Moments Section */}
      <HighlightMoments />

      {/* Photo Gallery */}
      <PhotoGallery />

      {/* Venue Map Section */}
      <VenueMap />

      {/* Footer Section */}
      <FooterSection />
    </main>
  );
}
