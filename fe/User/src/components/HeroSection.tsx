"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SearchBar from "./SearchBar";

const images = [
  "/image/Royal.jpg",
  "/image/q1.png",
  "/image/Rs.jpg",
  "/image/RSLS.jpg"
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
<section className="relative h-screen w-full">

      {/* Slider Background */}
      <AnimatePresence>
        <motion.div
          key={current}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[current]})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* SEARCH BAR (GỌI RIÊNG) */}
      <div className="absolute bottom-9 left-0 w-full z-20">
        <SearchBar />
      </div>

      {/* Navigation */}
      <button
        onClick={() => setCurrent((p) => (p - 1 + images.length) % images.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-3 rounded-full z-20"
      >
        <FaChevronLeft />
      </button>

      <button
        onClick={() => setCurrent((p) => (p + 1) % images.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-3 rounded-full z-20"
      >
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 ">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-white" : "bg-gray-400/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
