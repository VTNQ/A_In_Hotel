"use client";

import { useEffect, useState } from "react";
import { type HotelResponse } from "../../type/hotel.types";
import { getHotel } from "../../service/api/Hotel";

export default function Footer() {
  const [hotels, setHotels] = useState<HotelResponse[]>([]);
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getHotel({ all: true });
        setHotels(data?.content || []);
      } catch (err) {
        console.log("Fail to load error:", err);
      }
    };
    fetchHotels();
  }, []);
  const mid = Math.ceil(hotels.length/2);
  const leftHotels = hotels.slice(0,mid);
  const rightHotels = hotels.slice(mid);
  return (
    <footer className="bg-[#f9f6f2] text-[#3A3125] border-t border-[#707070]">
      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          {/* LOGO */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {/* Logo placeholder */}
              <img
                src="/image/logo.png"
                alt="A In Hotel Logo"
                width={250}
                height={250}
                className="object-contain"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="font-semibold tracking-widest mb-3 text-sm text-[#866F56]">
              DESTINATION
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#2B2B2B]">
              <div className="space-y-3">
                {leftHotels.map((hotel)=>(
                  <div key={hotel.id}>
                       <p className="font-semibold uppercase">
                      {hotel.name}
                    </p>
                    <p>{hotel.address}</p>
                    <p className="mt-1">
                      {hotel.hotlines?.map(h => h.phone).join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {rightHotels.map((hotel)=>(
                  <div key={hotel.id}>
                       <p className="font-semibold uppercase">
                      {hotel.name}
                    </p>
                    <p>{hotel.address}</p>
                    <p className="mt-1">
                      {hotel.hotlines?.map(h => h.phone).join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
              
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <p className="font-semibold tracking-widest mb-3 text-sm text-[#866F56]">
              CONTACT
            </p>
            <div className="flex items-center gap-4 text-[#6b5f4f]">
              <span className="w-8 h-8 border rounded-full flex items-center justify-center">
                fb
              </span>
              <span className="w-8 h-8 border rounded-full flex items-center justify-center">
                ig
              </span>
              <span className="w-8 h-8 border rounded-full flex items-center justify-center">
                in
              </span>
            </div>
          </div>
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full 
                 border border-dashed border-[#c8b9a6]
                 flex items-center justify-center
                 bg-[#f9f6f2]"
            >
              <img
                src="/image/ArrowUp.png"
                alt="A In Hotel Logo"
                width={250}
                height={250}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT BAR */}
      <div className="bg-[#3A3125] text-white text-center py-3 text-xs tracking-wide">
        © 2025 A In Hotel
      </div>
    </footer>
  );
}
