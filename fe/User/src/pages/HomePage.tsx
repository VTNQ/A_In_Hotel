
import HeroSlider from "../components/HeroSection";
import FacilitiesSection from "../components/Home/FacilitiesSection";
import RoomShowcase from "../components/Home/RoomShowcase";
import OurBlog from "../components/Home/OurBlog";
import AboutOurHotel from "../components/Home/AboutOurHotel";
import BookAppointmentSection from "../components/Home/BookAppointmentSection";
import RoomAndSuites from "../components/Home/RoomAndSuites";
import DecorateSlider from "../components/Home/DecorateSlider";

const HomePage = () => {
  return (
    <div className="relative bg-gradient-to-b from-[#fff7f0] to-[#f9f2e8]">
      
      {/* HERO */}
      <div className="relative z-20">
        <HeroSlider />
      </div>

      {/* CONTENT BELOW */}
      <div className="relative z-0">
        <RoomShowcase />
        <AboutOurHotel />
        <OurBlog />
        <RoomAndSuites />
        <DecorateSlider />
        <FacilitiesSection />
        <BookAppointmentSection />
      </div>

    </div>
  );
};

export default HomePage;
