import BookingFilters from "../components/Home/BookingFilters";
import FeaturedAmenities from "../components/Home/FeaturedAmenities";
import GreenGlobeSection from "../components/Home/GreenGlobeSection";
import Hero360VirtualTour from "../components/Home/Hero360VirtualTour";
import HeroSection from "../components/Home/HeroSection";
import HotelFeature from "../components/Home/HotelFeature";
import HotelHighlightSection from "../components/Home/HotelHighlightSection";
import ImageSlider from "../components/Home/ImageSlider";
import InfoCards from "../components/Home/InfoCards";
import LocationSection from "../components/Home/LocationSection";
import MeetingEventsSlider from "../components/Home/MeetingEventsSlider";
import OfferSlider from "../components/Home/OffersSlider";
import RoomSection from "../components/Home/RoomSection";
import RoomSlider from "../components/Home/RoomSlider";
import SheratonClubCard from "../components/Home/SheratonClubCard";
import TextImageSlider from "../components/Home/TextImageSlider";
import WeddingSlider from "../components/Home/WeddingSlider";


const HomePage = () => {
 return(
  <>
  <BookingFilters />
  <HeroSection/>
  <HotelFeature/>
  <RoomSlider/>
  <RoomSection/>
  <OfferSlider/>
  <TextImageSlider/>
  <SheratonClubCard/>
  <MeetingEventsSlider/>
  <HotelHighlightSection/>
  <ImageSlider/>
  <WeddingSlider/>
  <GreenGlobeSection/>
  <Hero360VirtualTour/>
  <FeaturedAmenities/>
  <LocationSection/>
  <InfoCards/>
  
</>
 )
};

export default HomePage;
