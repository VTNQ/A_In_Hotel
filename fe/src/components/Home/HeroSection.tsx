import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

const slides = [
  "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-saigon-opera-house-23848:Feature-Hor?wid=1920&fit=constrain",
  "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-saigon-opera-house-23848:Feature-Hor?wid=1920&fit=constrain",
  "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-saigon-opera-house-23848:Feature-Hor?wid=1920&fit=constrain",
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full bg-[#f4f1ed]">
      {/* Image Slider */}
      <div className="relative w-full h-[500px] overflow-hidden">
        {slides.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}

        {/* Controls + Dot + Gallery */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-4">
            {/* Prev */}
            <button onClick={prevSlide} className="text-white hover:opacity-90">
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center space-x-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-white scale-110" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Next */}
            <button onClick={nextSlide} className="text-white hover:opacity-90">
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Gallery */}
            <button className="flex items-center gap-1 bg-black/50 text-white text-sm px-4 py-1.5 rounded-full hover:bg-black/80 ml-3">
              <ImageIcon className="w-4 h-4" />
              Gallery
            </button>
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center py-10 px-4 max-w-3xl mx-auto">
        <p className="uppercase text-xs tracking-widest text-gray-700 mb-2">
          Welcome to Sheraton Saigon Grand Opera Hotel
        </p>
        <h2 className="text-2xl md:text-4xl font-light text-gray-900 mb-4 leading-tight">
          Embrace Saigon at our 5-star hotel in Ho Chi Minh District 1
        </h2>
        <p className="text-gray-700 text-base md:text-lg">
          Soak up the vibrant energy of Ho Chi Minh City at Sheraton Saigon Grand Opera Hotel,
          the international hotel with a prime location, elegant accommodations, contemporary
          facilities, and warm hospitality...
          <a href="#" className="ml-1 underline hover:text-black">See More</a>
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
