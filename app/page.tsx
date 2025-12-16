import PhotoGallery from "@/components/PhotoGallery";
import HeroSection from "@/components/HeroSection";
import TelegramGuide from "@/components/TelegramGuide";
import HighlightMoments from "@/components/HighlightMoments";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-champagne-50 via-white to-gold-50">
      {/* Hero Section - Cinematic entrance */}
      <HeroSection />

      {/* Telegram Bot Guide Section */}
      <TelegramGuide />

      {/* Highlight Moments Section */}
      <HighlightMoments />

      {/* Photo Gallery */}
      <PhotoGallery />

      {/* Footer Section */}
      <FooterSection />
    </main>
  );
}
