
import HeroSlider from "../components/HeroSection";

import RatingSection from "../components/Home/RatingSection";
import FacilitiesSection from "../components/Home/FacilitiesSection";
import RoomShowcase from "../components/Home/RoomShowcase";
import OurBlog from "../components/Home/OurBlog";
import AboutOurHotel from "../components/Home/AboutOurHotel";

const HomePage = () => {
 return(
  <>
  <HeroSlider/>
  <RoomShowcase />
  <AboutOurHotel/>
  <OurBlog/> 
  <RatingSection/>
  <FacilitiesSection/>  
</>
 )
};

export default HomePage;
