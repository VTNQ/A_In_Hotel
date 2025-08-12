import HeroHeader from "../components/EventPromotion/HeroHeader";
import EventSummary from "../components/EventPromotion/EventSummary";
import StartPlanningCTA from "../components/EventPromotion/StartPlanningCTA";
import GatheringPlace from "../components/EventPromotion/GatheringPlace";

export default function EventPromotionPage() {
  return (
    <div className="min-h-screen">
      <HeroHeader />
      <EventSummary />

   
      <StartPlanningCTA />


      <GatheringPlace
        />
    </div>
  );
}
