"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SearchBar from "./SearchBar";
import type { BannerResponse } from "../type/banner.type";
import { getBanner } from "../service/api/Banner";
import { formatISO } from "date-fns";
import { File_URL } from "../setting/constant/app";
const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [banners,setBanners] =useState<BannerResponse[]>([]);
  const fetchData = async()=>{
    try{
      const now = formatISO(new Date()); 
      const response = await getBanner({
        page:1,
        size:10,
        filter: `startAt<=${now} and endAt>=${now}`,
      });
      setBanners(response.data?.content || [])
    }catch(err){
      console.log(err)
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
<section className="relative h-screen w-full">

      {/* Slider Background */}
      <AnimatePresence>
        <motion.div
          key={current}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${File_URL+banners[current].image.url})` }}
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
        onClick={() =>
          setCurrent((p) => (p - 1 + banners.length) % banners.length)
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-3 rounded-full z-20"
      >
        <FaChevronLeft />
      </button>

      <button
        onClick={() => setCurrent((p) => (p + 1) % banners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-3 rounded-full z-20"
      >
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 ">
        {banners.map((_, i) => (
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
