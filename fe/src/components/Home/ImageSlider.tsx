import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import  { useState } from "react";
const images = [
    "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-banh-mi-88-23335:Classic-Hor?wid=856&fit=constrain",
    "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-lifestyle-photo-hcmc-1-16184:Classic-Hor?wid=856&fit=constrain",
    "https://cache.marriott.com/content/dam/marriott-renditions/dm-static-renditions/si/apec/hws/s/sgnsi/es_es/photo/limited/assets/sgnsi-chinatown-3302-classic-hor.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=856px:*"
]
const ImageSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        slides: {
            perView: 3,
            spacing: 16
        },
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        }
    })
    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            <div ref={sliderRef} className="keen-slider">
                {images.map((src, idx) => (
                    <div
                        className="keen-slider__slide rounded-xl overflow-hidden"
                        key={idx}
                    >
                        <img
                            src={src}
                            alt={`Slide ${idx + 1}`}
                            className="w-full h-[400px] object-cover"
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                <span>{String(currentSlide + 1).padStart(2, "0")}</span>
                <div className="w-full mx-4 h-[2px] bg-gray-200 relative">
                    <div
                        className="h-[2px] bg-purple-500 absolute top-0 left-0 transition-all duration-500"
                        style={{
                            width: `${((currentSlide + 1) / images.length) * 100}%`,
                        }}
                    />
                </div>
                <span>{String(images.length).padStart(2, "0")}</span>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-700">
                <button onClick={() => instanceRef.current?.prev()}
                    className="hover:underline"
                >
                    Prev
                </button>
                <button onClick={() => instanceRef.current?.next()}
                    className="hover:underline"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
export default ImageSlider;