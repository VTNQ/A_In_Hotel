"use client";

import { MapPin, Star } from "lucide-react";

export default function RoomShowcase() {
  const rooms = [
    {
      id: 1,
      name: "ROYAL SUITE LUX SKY",
      location: "A IN RIVERSIDE",
      address: "188 - 189 Bến Vân Đồn, P. Khánh Hội, TP.HCM ",
      oldPrice: "2.550.000 ₫",
      price: "2.050.000 ₫/đêm",
      rating: 5.0,
      image: "/image/cab5707e-b985-445e-a7b1-6e7431a4b2a3.png",
    },
    {
      id: 2,
      name: "VIP",
      location: "A IN ATISTAR",
      address: "30 Đường số 14, P. An Nhơn, TP.HCM ",
      oldPrice: "1.500.000 ₫",
      price: " 1.100.000 ₫/đêm",
      rating: 5.0,
      image: "/image/z7147491494347_a3127731f513980714c416cbf4b49917.jpg",
    },
    {
      id: 3,
      name: "Royal Suite",
      location: "A IN GLAMOUR",
      address: "63/1 - 63/3 Đường số 19, P. An Khánh, TP.HCM",
      oldPrice: "2.000.000 ₫",
      price: "1.600.000 ₫/đêm",
      rating: 5.0,
      image: "/image/z7147496142673_d0fa54bc2d9afa1d93bcb066edd6256c.jpg", // ảnh bạn thêm sau, để tượng trưng
    },
  ];

  return (
    <section className="bg-gradient-to-b from-[#fff7f0] to-[#f9f2e8] py-20">
      {/* Title */}
      <h2 className="text-center text-3xl md:text-4xl font-bold text-[#2b3a67] mb-12">
        Popular Room And Suites
      </h2>

      {/* Card grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative">
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-2 right-2 bg-white rounded-full shadow p-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
            </div>

            <div className="p-5 text-[#3A3125]">
              <h3 className="text-lg font-bold">{room.name}</h3>
              <p className="text-sm text-[#b38a58] font-medium">
                {room.location}
              </p>
              <div className="flex items-center gap-1 mt-2 text-sm text-[#6b5f52]">
                <MapPin className="w-4 h-4 text-[#b38a58] shrink-0" />
                <span className="truncate">{room.address}</span>
              </div>


              <div className="mt-4">
                <p className="text-sm text-gray-400 line-through">
                  {room.oldPrice}
                </p>
                <p className="text-lg font-semibold text-[#b38a58]">
                  {room.price}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 text-sm">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill="currentColor"
                    />
                  ))}
                  <span className="text-gray-600 ml-1">{room.rating}</span>
                </div>
              </div>

              <button className="mt-5 w-full bg-[#b38a58] text-white py-2 rounded-md font-medium hover:bg-[#3A3125] transition">
                Book now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
