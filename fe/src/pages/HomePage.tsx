import BookingFilters from "../components/Home/BookingFilters";
import HeroSection from "../components/Home/HeroSection";
import HotelFeature from "../components/Home/HotelFeature";
import OfferSlider from "../components/Home/OffersSlider";
import RoomSection from "../components/Home/RoomSection";
import RoomSlider from "../components/Home/RoomSlider";
import TextImageSlider from "../components/Home/TextImageSlider";


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
</>
 )
};

export default HomePage;
