import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { useState } from "react"

const slides = [
  {
    title: "Saigon Café Restaurant",
    subtitle: "Endless Dining Choices",
    description:
      "Saigon Café excites gastronomes with lavish buffet feasts boasting a vast furbished space, accompanied by professional service. Revel in sumptuous assortments featuring local freshest ingredients and international highlights from seven live stations.",
   image: "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-discover-saigon-11528-24598:Classic-Hor?output-quality=70&interpolation=progressive-bilinear&downsize=1200px:*",
    button: "Explore",
  },
  {
    title: "Luxury Poolside Bar",
    subtitle: "Chic Vibes & Cocktails",
    description:
      "Relax in a tropical paradise with crafted cocktails, sunset views, and poolside ambiance. Our bar is the perfect evening unwind experience.",
   image: "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-discover-saigon-11528-24598:Classic-Hor?output-quality=70&interpolation=progressive-bilinear&downsize=1200px:*",
    button: "Discover More",
  },
  {
    title: "Crystal Ballroom",
    subtitle: "Elegant Celebrations",
    description:
      "Host unforgettable weddings or business conferences in our state-of-the-art Crystal Ballroom with customizable layouts and high-end AV setup.",
   image: "https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-discover-saigon-11528-24598:Classic-Hor?output-quality=70&interpolation=progressive-bilinear&downsize=1200px:*",
    button: "Plan Your Event",
  },
]

const TextImageSlider = () => {
  const [current, setCurrent] = useState(0)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      origin: "center",
      perView: 1,
    },
    slideChanged(slider) {
      setCurrent(slider.track.details.rel)
    },
  })

  const handlePrev = () => instanceRef.current?.prev()
  const handleNext = () => instanceRef.current?.next()

  return (
    <section className="bg-neutral-900 text-white w-full">
      <div ref={sliderRef} className="keen-slider">
        {slides.map((item, idx) => (
          <div key={idx} className="keen-slider__slide flex flex-col md:flex-row items-center min-h-[500px]">
            {/* Left: Text Content */}
            <div className="w-full md:w-1/2 px-8 md:px-16 py-12">
              <p className="uppercase tracking-widest text-sm text-gray-400 mb-2">
                {item.subtitle}
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">{item.title}</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">{item.description}</p>
              <button className="bg-[#f0d6b5] text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-[#e6caa3] transition">
                {item.button}
              </button>

              {/* Navigation Controls */}
              <div className="mt-10 flex items-center gap-6 text-sm">
                <button onClick={handlePrev} className="hover:underline">
                  Prev
                </button>
                <span className="text-gray-400">
                  {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                </span>
                <button onClick={handleNext} className="hover:underline">
                  Next →
                </button>
              </div>
            </div>

            {/* Right: Image */}
            <div className="w-full md:w-1/2 h-[300px] md:h-[500px]">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TextImageSlider
