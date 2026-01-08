import OurStory from "@/components/OurStory";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import PoweredByFooter from "@/components/PoweredByFooter";

export const metadata = {
  title: "Our Story - Rab & Lee",
  description: "Discover the beautiful love story of Rab and Lee",
};

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-theme-gradient-start via-theme-gradient-mid to-theme-gradient-end">
      {/* Fixed Header */}
      <Header />

      {/* Our Story Section */}
      <OurStory />

      {/* Footer Section */}
      <FooterSection />

      {/* Powered By Footer */}
      <PoweredByFooter />
    </main>
  );
}

