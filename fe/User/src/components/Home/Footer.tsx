"use client";

import { useEffect, useState } from "react";
import { type HotelResponse } from "../../type/hotel.types";
import { getHotel } from "../../service/api/Hotel";

export default function Footer() {
  const [hotels, setHotels] = useState<HotelResponse[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getHotel({ all: true, filter: "status==1" });
        setHotels(data?.content || []);
      } catch (err) {
        console.log("Fail to load error:", err);
      }
    };
    fetchHotels();
  }, []);

  const mid = Math.ceil(hotels.length / 2);
  const leftHotels = hotels.slice(0, mid);
  const rightHotels = hotels.slice(mid);

  return (
    <footer className="bg-[#f9f6f2] text-[#3A3125] border-t border-[#e3ddd6]">
      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* LOGO */}
          <div className="flex justify-center lg:justify-start">
            <img
              src="/image/logo.png"
              alt="A In Hotel Logo"
              className="w-40 sm:w-48 object-contain"
            />
          </div>

          {/* DESTINATION */}
          <div className="lg:col-span-3">
            <p className="font-semibold tracking-[0.2em] mb-6 text-xs text-[#866F56]">
              DESTINATION
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-8 text-sm text-[#2B2B2B]">
              {/* LEFT */}
              <div className="space-y-6">
                {leftHotels.map((hotel) => (
                  <div key={hotel.id}>
                    <p className="font-semibold uppercase text-xs tracking-wide">
                      {hotel.name}
                    </p>
                    <p className="mt-1 text-[#6b5f4f]">{hotel.address}</p>
                    <p className="mt-1 text-[#6b5f4f]">
                      {hotel.hotlines?.map((h) => h.phone).join(" · ")}
                    </p>
                  </div>
                ))}
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                {rightHotels.map((hotel) => (
                  <div key={hotel.id}>
                    <p className="font-semibold uppercase text-xs tracking-wide">
                      {hotel.name}
                    </p>
                    <p className="mt-1 text-[#6b5f4f]">{hotel.address}</p>
                    <p className="mt-1 text-[#6b5f4f]">
                      {hotel.hotlines?.map((h) => h.phone).join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CONTACT */}
          <div
            className="col-span-1 
  sm:col-span-2 
  lg:col-span-1
  flex flex-col items-center lg:items-start gap-6"
          >
            <p className="font-semibold tracking-[0.2em] text-xs text-[#866F56]">
              CONTACT
            </p>

            <div className="flex gap-4">
              {["fb", "ig", "in"].map((item) => (
                <span
                  key={item}
                  className="
                    w-9 h-9 
                    border border-[#d8cec4]
                    rounded-full 
                    flex items-center justify-center 
                    text-xs
                    hover:bg-[#3A3125]
                    hover:text-white
                    transition-all duration-300
                    cursor-pointer
                  "
                >
                  {item}
                </span>
              ))}
            </div>

         
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="bg-[#3A3125] text-white text-center py-4 text-xs tracking-wide">
        © 2025 A In Hotel
      </div>
    </footer>
  );
}
