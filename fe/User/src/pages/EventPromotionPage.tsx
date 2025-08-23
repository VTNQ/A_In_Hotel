import HeroHeader from "../components/EventPromotion/HeroHeader";
import EventSummary from "../components/EventPromotion/EventSummary";
import StartPlanningCTA from "../components/EventPromotion/StartPlanningCTA";
import GatheringPlace from "../components/EventPromotion/GatheringPlace";
import VirtualTour from "../components/EventPromotion/VirtualTour";
import Commitment from "../components/EventPromotion/Commitment";
import WorldClassEvents from "../components/EventPromotion/WorldClassEvents";
import EventGalleryCarousel from "../components/EventPromotion/EventGalleryCarousel";
import LegacyConvention, {
  LegacyBallroom,
  MeetingsAndEvents,
} from "../components/EventPromotion/LegacyConvention";
import ExquisiteEvents from "../components/EventPromotion/ExquisiteEvents";
import WeddingIntro from "../components/EventPromotion/WeddingIntro";
import WeddingShowcase from "../components/EventPromotion/WeddingShowcase";
import WeddingTriadSection from "../components/EventPromotion/WeddingTriadSection";
import FullWidthImage from "../components/EventPromotion/FullWidthImage";
import WeddingsOccasions from "../components/EventPromotion/WeddingsOccasions";

export default function EventPromotionPage() {
  return (
    <div className="min-h-screen">
      <HeroHeader />
      <EventSummary />
      <StartPlanningCTA />
      <GatheringPlace />
      <VirtualTour />
      <Commitment />
      <WorldClassEvents />
      <EventGalleryCarousel
        className="py-10"
        images={[
          { src: "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-sgnsi-pre-function-area-35666:Wide-Hor?wid=1920&fit=constrain", alt: "Pre-function area" },
          { src: "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-sgnsi-grand-ballroom-13696:Feature-Hor?wid=1920&fit=constrain", alt: "Grand Ballroom classroom" },
          { src: "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-sgnsi-grand-ballroom-2-35663:Wide-Hor?wid=1920&fit=constrain", alt: "Ballroom banquet" },
          // thêm ảnh nếu thích
        ]}
      />
      <LegacyConvention />
      <LegacyBallroom />
      <MeetingsAndEvents />
      <ExquisiteEvents />
      <WeddingIntro />
      <WeddingShowcase
        slides={[
          { src: "https://cache.marriott.com/content/dam/marriott-renditions/SGNSI/sgnsi-grand-ballroom-wedding-0893-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1920px:*" },
          { src: "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-ballroom-22245:Wide-Hor?wid=2880&fit=constrain" },
        ]}
      />
      <WeddingTriadSection />
      <FullWidthImage
        src="https://cache.marriott.com/content/dam/marriott-renditions/SGNSI/sgnsi-grand-ballroom-0450-hor-wide.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1920px:*"
        alt="Grand Ballroom Wide"
      />
      <WeddingsOccasions />
    </div>
  );
}
