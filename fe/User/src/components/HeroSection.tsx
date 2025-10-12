"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const images = [
  "/image/35f6660240b73115e02c8ff7f3435646d2446209.jpg",
  "/image/35f6660240b73115e02c8ff7f3435646d2446209.jpg",
  "/image/35f6660240b73115e02c8ff7f3435646d2446209.jpg",
  "/image/35f6660240b73115e02c8ff7f3435646d2446209.jpg",
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Slider Background */}
      <AnimatePresence>
        <motion.div
          key={current}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${images[current]})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Text Content */}
      {/* <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          Welcome to A-IN HOTEL
        </h1>
        <p className="text-lg md:text-2xl max-w-3xl">
          Trải nghiệm không gian sang trọng và đẳng cấp với dịch vụ hoàn hảo.
        </p>
      </div> */}

      {/* Full-width Filter */}
      <div className="absolute bottom-9 left-0 w-full bg-[#F6F3F0] backdrop-blur-md py-4 md:py-6 shadow-md z-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Destination */}
          <div className="flex flex-col w-full md:w-1/4">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Destination
            </label>
            <select className="border border-gray-300 rounded-lg p-2 text-gray-700 w-full">
              <option>A In Hotel Del Luna</option>
              <option>A In Hotel Seoul</option>
              <option>A In Hotel Ha Noi</option>
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col w-full md:w-1/4">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Select date
            </label>
            <input
              type="text"
              placeholder="Tue, 21 Oct → Thu, 23 Oct"
              className="border border-gray-300 rounded-lg p-2 text-gray-700 w-full"
            />
          </div>

          {/* Room & Guests */}
          <div className="flex flex-col w-full md:w-1/4">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Rooms & guests
            </label>
            <input
              type="text"
              placeholder="1 Room, 2 Guests"
              className="border border-gray-300 rounded-lg p-2 text-gray-700 w-full"
            />
          </div>

          {/* Promo & Search */}
          {/* Promo & Search */}
          <div className="flex flex-col justify-end w-full md:w-1/4">
            <div className="flex items-center mb-2">
              <img src="image/faciliti managerment.png" className="mr-2" />

              <span className="text-sm font-semibold text-[#3A3125]">

                Have a promo code ?
              </span>
            </div>
            <button className="bg-[#b38a58] text-white font-semibold rounded-lg py-3 w-full hover:bg-[#9a7748] transition">
              Search
            </button>
          </div>

        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 p-3 rounded-full z-20"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 p-3 rounded-full z-20"
      >
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${i === current ? "bg-white" : "bg-gray-400/70"
              }`}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
