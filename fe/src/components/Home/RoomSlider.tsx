import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const RoomSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

    const images = [
        "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-deluxe-king-30418:Classic-Hor?wid=856&fit=constrain",
        "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-deluxe-king-13946:Classic-Hor?wid=856&fit=constrain",
        "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-hotel-guestroom-1-36466:Classic-Hor?wid=856&fit=constrain"
    ]

  return (
    <div className="w-full px-4 py-8 max-w-7xl mx-auto">
      {/* Slider */}
      <div ref={sliderRef} className="keen-slider">
        {images.map((img, index) => (
          <div
            key={index}
            className="keen-slider__slide flex justify-center items-center"
          >
            <img
              src={img}
              alt={`Room ${index + 1}`}
              className="rounded-xl object-cover w-full h-[500px]"
            />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-600 px-2">
        <span>{String(currentSlide + 1).padStart(2, "0")}</span>
        <div className="flex gap-6 items-center">
          <button
            onClick={() => instanceRef.current?.prev()}
            className="hover:opacity-70 transition-all"
          >
            Prev
          </button>
          <span className="w-16 h-[2px] bg-gray-200 relative">
            <span
              className="absolute top-0 left-0 h-full bg-purple-500 transition-all"
              style={{ width: `${((currentSlide + 1) / images.length) * 100}%` }}
            />
          </span>
          <button
            onClick={() => instanceRef.current?.next()}
            className="hover:opacity-70 transition-all"
          >
            Next
          </button>
        </div>
        <span>{String(images.length).padStart(2, "0")}</span>
      </div>
    </div>
  );
};

export default RoomSlider;
