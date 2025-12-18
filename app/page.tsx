import PhotoGallery from "@/components/PhotoGallery";
import HeroSection from "@/components/HeroSection";
import TelegramGuide from "@/components/TelegramGuide";
import HighlightMoments from "@/components/HighlightMoments";
import FooterSection from "@/components/FooterSection";
import UploadNotifications from "@/components/UploadNotifications";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-champagne-50 via-white to-gold-50">
      {/* Upload Notifications - fixed position */}
      <UploadNotifications />

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
