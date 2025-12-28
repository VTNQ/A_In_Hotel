import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
    "/image/681c2aef645b1d29de59b460ef0aab4e841d4b59.png",
    "/image/adebce12c8df31ba5195866575485f5477394655.jpg",
    "/image/adebce12c8df31ba5195866575485f5477394655.jpg",
    "/image/adebce12c8df31ba5195866575485f5477394655.jpg",
    "/image/adebce12c8df31ba5195866575485f5477394655.jpg",
];

// 👉 clone 3 lần để tạo buffer
const SLIDES = [...images, ...images, ...images];
const OFFSET = images.length;

const DecorateSlider = () => {
    const [current, setCurrent] = useState(OFFSET + 2);
    const autoTimer = useRef<number | null>(null);
    const isHovering = useRef(false);

    const startAuto = () => {
        if (autoTimer.current !== null) return;
        autoTimer.current = window.setInterval(() => {
            if (!isHovering.current) {
                next();
            }
        }, 3000);
    };

    const stopAuto = () => {
        if (autoTimer.current !== null) {
            clearInterval(autoTimer.current);
            autoTimer.current = null;
        }
    };

    useEffect(() => {
        startAuto();
        return stopAuto;
    }, []);

    const [animate, setAnimate] = useState(true);

    const prev = () => setCurrent((c) => c - 1);
    const next = () => setCurrent((c) => c + 1);

    // 👉 reset âm thầm khi đi quá biên
    useEffect(() => {
        if (current < OFFSET) {
            setTimeout(() => {
                setAnimate(false);
                setCurrent((c) => c + OFFSET);
                requestAnimationFrame(() => setAnimate(true));
            }, 500);
        }

        if (current >= OFFSET * 2) {
            setTimeout(() => {
                setAnimate(false);
                setCurrent((c) => c - OFFSET);
                requestAnimationFrame(() => setAnimate(true));
            }, 500);
        }
    }, [current]);


    return (
        <section className="py-20 bg-[#fff7f0] overflow-hidden">
            <h2 className="text-center text-3xl md:text-4xl font-dmserif font-medium text-[#4B3F30] mb-12">
                Decorate
            </h2>

            {/* SLIDER */}
            <div className="relative h-[560px] flex justify-center items-center">
                {SLIDES.map((img, i) => {
                    const pos = i - current;

                    // chỉ render 5 slide quanh tâm
                    if (Math.abs(pos) > 2) return null;

                    const isCenter = pos === 0;
                    const isNear = Math.abs(pos) === 1;

                    return (
                        <img
                            key={i}
                            src={img}
                            className={`
                absolute rounded-xl object-cover will-change-transform
                ${animate
                                    ? "transition-all duration-500 ease-out"
                                    : "transition-none"}
              `}
                            style={{
                                width: 420,
                                height: 560,
                                transform: `
                  translateX(${pos * 350}px)
                  scale(${isCenter ? 1 : isNear ? 0.9 : 0.75})
                `,
                                opacity: isCenter ? 1 : isNear ? 0.9 : 0.6,
                                zIndex: isCenter ? 20 : isNear ? 10 : 0,
                            }}
                        />
                    );
                })}
            </div>

            {/* CONTROLS */}
            <div className="flex justify-center items-center gap-6 mt-10">
                <button
                    onClick={prev}
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                >
                    <ChevronLeft />
                </button>

                {/* DOTS */}
                <div className="flex gap-2">
                    {images.map((_, i) => {
                        const realIndex = (current - OFFSET + images.length) % images.length;
                        return (
                            <button
                                key={i}
                                onClick={() => setCurrent(OFFSET + i)}
                                className={`
                  w-2.5 h-2.5 rounded-full transition-all
                  ${realIndex === i
                                        ? "bg-black scale-110"
                                        : "bg-gray-400 opacity-50 hover:opacity-80"}
                `}
                            />
                        );
                    })}
                </div>

                <button
                    onClick={next}
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                >
                    <ChevronRight />
                </button>
            </div>
        </section>
    );
};

export default DecorateSlider;
