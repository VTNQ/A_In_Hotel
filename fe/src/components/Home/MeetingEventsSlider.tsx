import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const images = [
  "https://cache.marriott.com/content/dam/marriott-renditions/SGNSI/sgnsi-grand-ballroom-8585-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=856px:*",
  "https://cache.marriott.com/content/dam/marriott-renditions/SGNSI/sgnsi-pre-function-8587-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=856px:*",
  "https://cache.marriott.com/content/dam/marriott-renditions/SGNSI/sgnsi-grand-ballroom-8585-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=856px:*",
  "https://cache.marriott.com/content/dam/marriott-renditions/SGNSI/sgnsi-pre-function-8587-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=856px:*",
];

const MeetingEventsSliderModern = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    slides: {
      perView: 1.2,
      spacing: 16,
    },
    breakpoints: {
      "(min-width:640px)": {
        slides: { perView: 2, spacing: 20 },
      },
      "(min-width:1024px)": {
        slides: { perView: 3, spacing: 24 },
      },
    },
  });

  return (
    <section className="bg-white py-16 px-4 lg:px-24">
      {/* Tiêu đề */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
          Meetings & Events
        </p>
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4">
          Be a Successful Host
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Renowned as the leading event destination for over 20 years in Saigon, Sheraton Saigon Grand Opera Hotel is the ideal choice for your next Ho Chi Minh City event.
        </p>
      </div>

      {/* Slider */}
      <div className=" mx-auto">
        <div className="keen-slider" ref={sliderRef}>
          {images.map((src, index) => (
            <div
              key={index}
              className="keen-slider__slide overflow-hidden rounded-xl shadow-lg"
            >
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-72 object-cover"
              />
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
          {images.map((_, index) => (
            <span
              key={index}
              className={`h-0.5 w-20 transition-all ${
                currentSlide === index ? "bg-purple-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Prev / Next buttons */}
        <div className="flex justify-between items-center mt-4 text-gray-700 text-sm">
          <button
            onClick={() => instanceRef.current?.prev()}
            className="flex items-center gap-2"
          >
            <span className="w-8 h-0.5 bg-black"></span>
            Prev
          </button>
          <span className="text-xs text-gray-500">
            {String(currentSlide + 1).padStart(2, "0")}
          </span>
          <button
            onClick={() => instanceRef.current?.next()}
            className="flex items-center gap-2"
          >
            Next
            <span className="w-8 h-0.5 bg-black"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default MeetingEventsSliderModern;
