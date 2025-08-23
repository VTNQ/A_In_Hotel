import RoomCard from "../Room/RoomCard"
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";
const rooms = [
    {
        image: 'https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-deluxe-king-19298:Classic-Hor?wid=540&fit=constrain',
        title: 'Guest Room',
        type: 'Guest Room'
    },
    {
        image: 'https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-studio-king-13044:Classic-Hor?wid=540&fit=constrain',
        title: 'Guest Room',
        type: 'Guest Room'
    },
    {
        image: 'https://cache.marriott.com/content/dam/marriott-renditions/SGNSI/sgnsi-sheraton-clublounge-4662-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=540px:*',
        title: 'Studio',
        type: 'Studio',
    }
]
const RoomSection = () => {
    const [currentSLide, setCurrentSlide] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        mode: "snap",
        slides: {
            perView: 3,
            spacing: 16,
        },
        breakpoints: {
            "(max-width: 768px)": {
                slides: {
                    perView: 1,
                    spacing: 12,
                },
            },
        },
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        initial: 0,
    })
    const handlePrev = () => {
        instanceRef.current?.prev();
    };

    const handleNext = () => {
        instanceRef.current?.next();
    };

    const totalSlides = instanceRef.current?.track.details.slides.length || 0;
    return (
        <section className="max-w-7xl mx-auto py-12 px-4">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold">Rooms & Suites</h2>
                <p className="text-gray-600 mt-1">
                    Relax in our 379 stylishly appointed rooms and suites overlooking the stunning city or Saigon River.
                </p>
                <button className="mt-3 border border-gray-400 px-4 py-1 rounded-full text-sm hover:bg-gray-200">Learn More</button>
            </div>
            <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                <span>{String(currentSLide + 1).padStart(2, "0")}</span>
                <div className="flex-1 h-px bg-purple-700 mx-2"></div>
                <span>{String(totalSlides).padStart(2, "0")}</span>

            </div>
            <div ref={sliderRef} className="keen-slider">
                {rooms.map((room, index) => (
                    <div className="keen-slider__slide" key={index}>
                        <RoomCard image={room.image} type={room.type} />
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span className="cursor-pointer hover:text-black" onClick={handlePrev}>
                    Prev
                </span>
                <span className="cursor-pointer hover:text-black" onClick={handleNext}>
                    Next
                </span>
            </div>
        </section>
    )
}
export default RoomSection;