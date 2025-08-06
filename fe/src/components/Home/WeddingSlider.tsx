import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";
const images = [
    "https://cache.marriott.com/content/dam/marriott-renditions/SGNSI/sgnsi-grand-ballroom-wedding-0893-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1920px:*",
    "https://cache.marriott.com/content/dam/marriott-renditions/SGNSI/sgnsi-grand-ballroom-0450-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1920px:*"
]
const WeddingSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        slides: {
            perView: 1,
        },
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel)
        }
    })
    return (
        <div className="w-full flex flex-col lg:flex-row h-[100vh] overflow-hidden">
            <div className="w-full lg:w-1/2 bg-[#333] text-white flex flex-col justify-center px-10 py-16 space-y-6">
                <p className="uppercase text-sm tracking-widest text-gray-400">
                    Tailor-made wedding celebration
                </p>
                <h2 className="text-4xl font-semibold leading-tight">
                    Beyond Happiness by Sheraton
                </h2>
                <p className="text-base text-gray-300">
                    Start your life-long love story and throw a memorable wedding at Sheraton Saigon Grand Opera Hotel. We pride ourselves as one of the most iconic event and wedding venues in Saigon with over 20 years of renowned catering service. Satisfy every taste bud with an array of Asian and Western gastronomies curated by our team of master chefs. Make your wedding an effortless and fulfilling memory supported by our dedicated team of dedicated wedding specialists.
                </p>
                <button className="bg-peach-200 text-black px-6 py-2 rounded-full w-max hover:bg-peach-300 transition">
                    Learn More
                </button>
            </div>
            <div className="w-full lg:w-1/2 relative">
                <div ref={sliderRef} className="keen-slider h-full">
                    {images.map((src, idx) => (
                        <div key={idx} className="keen-slider__slide h-full w-full flex-shrink-0">
                            <img
                                src={src}
                                alt={`Slide ${idx + 1}`}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-white text-sm">
                    <button
                        onClick={() => instanceRef.current?.prev()}
                        className="hover:underline"
                    >
                        Prev
                    </button>
                    <div className="flex items-center space-x-2">
                        <span>{String(currentSlide + 1).padStart(2, "0")}</span>
                        <div className="w-10 h-[1px] bg-white" />
                        <span>{String(images.length).padStart(2, "0")}</span>
                    </div>
                    <button
                        onClick={() => instanceRef.current?.next()}
                        className="hover:underline"
                    >
                        Next
                    </button>
                </div>
            </div>

        </div>
    )
}
export default WeddingSlider;