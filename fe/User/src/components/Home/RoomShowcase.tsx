"use client";

import { MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { RoomResponse } from "../../type/room.types";
import { getRoom } from "../../service/api/Room";
import { useNavigate } from "react-router-dom";
import { useBookingSearch } from "../../context/booking/BookingSearchContext";

export default function RoomShowcase() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRooms = async () => {
      const res = await getRoom({
        page: 1,
        size: 3,
        filter: "status==3",
      });

      setRooms(res.data?.content || []);
    };

    fetchRooms();
  }, []);
  // const rooms = [
  //   {
  //     id: 1,
  //     name: "ROYAL SUITE LUX SKY",
  //     location: "A IN RIVERSIDE",
  //     address: "188 - 189 Bến Vân Đồn, P. Khánh Hội, TP.HCM ",
  //     oldPrice: "540.647 ₫",
  //     price: "2.050.000 ₫",
  //     rating: 5.0,
  //     image: "/image/cab5707e-b985-445e-a7b1-6e7431a4b2a3.png",
  //   },
  //   {
  //     id: 2,
  //     name: "VIP",
  //     location: "A IN ATISTAR",
  //     address: "30 Đường số 14, P. An Nhơn, TP.HCM ",
  //     oldPrice: "540.647 ₫",
  //     price: " 1.100.000 ₫",
  //     rating: 5.0,
  //     image: "/image/z7147491494347_a3127731f513980714c416cbf4b49917.jpg",
  //   },
  //   {
  //     id: 3,
  //     name: "Royal Suite",
  //     location: "A IN GLAMOUR",
  //     address: "63/1 - 63/3 Đường số 19, P. An Khánh, TP.HCM",
  //     oldPrice: "540.647 ₫",
  //     price: "1.600.000 ₫",
  //     rating: 5.0,
  //     image: "/image/z7147496142673_d0fa54bc2d9afa1d93bcb066edd6256c.jpg", // ảnh bạn thêm sau, để tượng trưng
  //   },
  // ];
  const {setSearch} = useBookingSearch();
  const handleBooking =(room:RoomResponse)=>{
    setSearch({
      hotelId:room.hotelId,
      roomId:room.id,
      totalPrice:room.defaultRate,
    })
    navigate("/booking");
  }
  return (
    <section className="relative z-0 py-14 sm:py-16 lg:py-20 px-4">
      {/* Title */}
      <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2b3a67] mb-10 sm:mb-12">
        {t("home.roomShowcase.title")}
      </h2>

      {/* Card grid */}
      <div className="max-w-7xl mx-auto grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  ">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white 
            rounded-2xl 
            overflow-hidden 
            shadow-md
            hover:shadow-2xl 
            hover:-translate-y-2
            transition-all duration-300"
          >
            <div className="relative">
              <img
                loading="lazy"
                src={room.images[0]?.url}
                alt={room.roomName}
                className="w-full h-48 sm:h-56 lg:h-64 object-cover"
              />
              <div className="absolute top-2 right-2 bg-white rounded-full shadow p-1">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
              </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col flex-1 text-[#3A3125]">
              <h3 className="text-base sm:text-lg font-bold line-clamp-1">
                {room.roomName}
              </h3>
              <p className="text-xs sm:text-sm text-[#b38a58] font-medium mt-1">
                {room.hotelName}
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm text-[#6b5f52]">
                <MapPin className="w-4 h-4 text-[#b38a58] shrink-0 mt-[2px]" />
                <span className="line-clamp-2">{room.hotelAddress}</span>
              </div>
              <div className="mt-4">
                {/* {room.oldPrice && (
    <p className="text-xs sm:text-sm text-gray-400 line-through">
      {room.oldPrice}
    </p>
  )} */}

                <p className="text-base sm:text-lg font-semibold text-[#b38a58]">
                  {room.defaultRate} {t("home.roomShowcase.perNight")}
                </p>
              </div>
              {/* <div className="mt-4">
                <p className="text-xs sm:text-sm text-gray-400 line-through">
                  {room.oldPrice}
                </p>
                <p className="text-base sm:text-lg font-semibold text-[#b38a58]">
                  {room.}
                  {t("home.roomShowcase.perNight")}
                </p>
              </div> */}

              <div className="flex items-center mt-3 text-xs sm:text-sm">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="currentColor"
                    />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">5</span>
              </div>

              <button onClick={()=>handleBooking(room)} className="mt-5 w-full bg-[#b38a58] text-white py-2 rounded-md font-medium hover:bg-[#3A3125] transition">
                {t("home.roomShowcase.bookNow")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
