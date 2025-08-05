import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";
import OfferCard from "../Offer/OfferCard";

const offers = [
  {
    image: "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-discover-saigon-11528-24598:Classic-Hor?output-quality=70&interpolation=progressive-bilinear&downsize=1200px:*",
    title: "Iconic Saigon Getaway",
    date: "February 6, 2025 — September 30, 2025",
  },
  {
    image: "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-outdoor-pool-42298-50672:Classic-Hor?output-quality=70&interpolation=progressive-bilinear&downsize=1200px:*",
    title: "Spa Pampering",
    date: "April 4, 2025 — September 30, 2025",
  },
  {
    image: "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-endless-dim-sum-li-32427-35359:Classic-Hor?output-quality=70&interpolation=progressive-bilinear&downsize=1200px:*",
    title: "Dumplings, Bao & Beyond",
    date: "May 20, 2025 — September 30, 2025",
  },
    {
    image: "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-endless-dim-sum-li-32427-35359:Classic-Hor?output-quality=70&interpolation=progressive-bilinear&downsize=1200px:*",
    title: "Dumplings, Bao & Beyond",
    date: "May 20, 2025 — September 30, 2025",
  },
];

const OfferSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    slides: {
      perView: 1.2,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: {
          perView: 2.2,
          spacing: 20,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 3,
          spacing: 24,
        },
      },
    },
    created() {
      setLoaded(true)
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
  })

   const handlePrev = () => instanceRef.current?.prev()
  const handleNext = () => instanceRef.current?.next()

  const totalSlides =
    instanceRef.current?.track.details?.slides.length ?? offers.length

  const visibleSlides =
    instanceRef.current?.options?.slides &&
    typeof instanceRef.current.options.slides !== "number" &&
    "perView" in instanceRef.current.options.slides
      ? typeof instanceRef.current.options.slides.perView === "number"
        ? instanceRef.current.options.slides.perView
        : 1
      : 1

  const totalDots = Math.max(1, Math.ceil(totalSlides - visibleSlides + 1))
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Offers & Packages</h2>
        <a
          href="#"
          className="text-sm text-purple-700 flex items-center gap-1 hover:underline"
        >
          View All Offers <span>→</span>
        </a>
      </div>

      <div className="relative">
        <div ref={sliderRef} className="keen-slider">
          {offers.map((offer, index) => (
            <OfferCard key={index} {...offer} />
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 -translate-y-1/2 left-0 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
        >
          ←
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 -translate-y-1/2 right-0 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
        >
          →
        </button>
      </div>

      {/* Dots Navigation */}
 {loaded && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalDots }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default OfferSlider;
