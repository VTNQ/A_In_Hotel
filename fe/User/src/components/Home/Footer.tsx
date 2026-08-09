"use client";

import { useEffect, useState } from "react";
import { type HotelResponse } from "../../type/hotel.types";
import { getHotel } from "../../service/api/Hotel";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const [hotels, setHotels] = useState<HotelResponse[]>([]);
  const {t} = useTranslation();
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
            <img loading="lazy"
              src="/image/logo.png"
              alt="A In Hotel Logo"
              className="w-40 sm:w-48 object-contain"
            />
          </div>

          {/* DESTINATION */}
          <div className="lg:col-span-3">
            <p className="font-semibold tracking-[0.2em] mb-6 text-xs text-[#866F56]">
              {t("footer.destination")}
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
             {t("footer.contact")}
            </p>

            <div className="flex flex-col gap-5 w-full">
              {/* FACEBOOK */}
              <div>
                <p className="text-[10px] uppercase font-bold mb-2 tracking-wider">Facebook</p>
                <div className="flex flex-wrap gap-2 text-xs text-[#6b5f4f]">
                  <a href="https://www.facebook.com/ainhotelriverside" target="_blank" rel="noreferrer" className="hover:text-[#B38A58] border border-[#d8cec4] hover:border-[#B38A58] px-3 py-1.5 rounded-full transition-all">Riverside</a>
                  <a href="https://www.facebook.com/ainhotelglamour" target="_blank" rel="noreferrer" className="hover:text-[#B38A58] border border-[#d8cec4] hover:border-[#B38A58] px-3 py-1.5 rounded-full transition-all">Glamour</a>
                  <a href="https://www.facebook.com/ainhoteldelluna" target="_blank" rel="noreferrer" className="hover:text-[#B38A58] border border-[#d8cec4] hover:border-[#B38A58] px-3 py-1.5 rounded-full transition-all">Delluna</a>
                  <a href="https://www.facebook.com/ainhotelatistar" target="_blank" rel="noreferrer" className="hover:text-[#B38A58] border border-[#d8cec4] hover:border-[#B38A58] px-3 py-1.5 rounded-full transition-all">Atistar</a>
                </div>
              </div>

              {/* TIKTOK */}
              <div>
                <p className="text-[10px] uppercase font-bold mb-2 tracking-wider">TikTok</p>
                <div className="flex flex-wrap gap-2 text-xs text-[#6b5f4f]">
                  <a href="https://www.tiktok.com/@ainhotelvietnam?_r=1&_t=ZS-98eL8LRSxYy" target="_blank" rel="noreferrer" className="hover:text-[#B38A58] border border-[#d8cec4] hover:border-[#B38A58] px-3 py-1.5 rounded-full transition-all">@ainhotelvietnam</a>
                </div>
              </div>

              {/* ZALO */}
              <div>
                <p className="text-[10px] uppercase font-bold mb-2 tracking-wider">Zalo OA</p>
                <div className="flex flex-wrap gap-2 text-xs text-[#6b5f4f]">
                  <a href="https://zalo.me/2995290453484355017" target="_blank" rel="noreferrer" className="hover:text-[#B38A58] border border-[#d8cec4] hover:border-[#B38A58] px-3 py-1.5 rounded-full transition-all">Glamour</a>
                  <a href="https://zalo.me/3321323852420568562" target="_blank" rel="noreferrer" className="hover:text-[#B38A58] border border-[#d8cec4] hover:border-[#B38A58] px-3 py-1.5 rounded-full transition-all">Atistar</a>
                  <a href="https://zalo.me/2064698245345781686" target="_blank" rel="noreferrer" className="hover:text-[#B38A58] border border-[#d8cec4] hover:border-[#B38A58] px-3 py-1.5 rounded-full transition-all">Riverside</a>
                </div>
              </div>
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
