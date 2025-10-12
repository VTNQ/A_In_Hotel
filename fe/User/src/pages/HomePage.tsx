
import HeroSlider from "../components/HeroSection";
import AboutSection from "../components/Home/AboutSection";
import RatingSection from "../components/Home/RatingSection";
import FacilitiesSection from "../components/Home/FacilitiesSection";
import RoomShowcase from "../components/Home/RoomShowcase";

const HomePage = () => {
 return(
  <>
  <HeroSlider/>
  <RoomShowcase /> 
  <AboutSection/>
  <RatingSection/>
  <FacilitiesSection/>  
</>
 )
};

export default HomePage;
