import { useState } from "react";
import {
  BedDouble,
  Maximize,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { RoomResponse } from "../../type/room.types";
import { File_URL } from "../../setting/constant/app";

const RoomDetail = ({ room }: { room: RoomResponse | null }) => {
  const [active, setActive] = useState(0);

  if (!room) {
    return (
      <div className="bg-white rounded-xl p-6 text-gray-400 text-center">
        Select a room to see details
      </div>
    );
  }

  const images = room.images || [];
  const total = images.length;

  const prev = () =>
    setActive((i) => (i === 0 ? total - 1 : i - 1));

  const next = () =>
    setActive((i) => (i === total - 1 ? 0 : i + 1));

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden  top-24">
      {/* ===== SLIDER ===== */}
      <div className="relative overflow-hidden h-[220px]">
        {/* SLIDE TRACK */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={File_URL + img.url}
              alt=""
              className="w-full h-full object-cover flex-shrink-0"
            />
          ))}
        </div>

        {/* PREV */}
        {total > 1 && (
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2
                       bg-white/80 rounded-full p-1 hover:bg-white"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* NEXT */}
        {total > 1 && (
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2
                       bg-white/80 rounded-full p-1 hover:bg-white"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* DOT INDICATOR */}
        {total > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2.5 h-2.5 rounded-full transition
                  ${
                    i === active
                      ? "bg-[#D9D9D9] scale-110"
                      : "bg-[#D9D9D9] "
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===== CONTENT ===== */}
      <div className="p-5 space-y-4">
        <h3 className="text-lg font-semibold uppercase">
          {room.roomName}
        </h3>

        {/* INFO */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Maximize size={16} /> {room.area || 20} m²
          </div>
          <div className="flex items-center gap-2">
            <BedDouble size={16} /> Double bed
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} /> {room.capacity} guests
          </div>
        </div>

        {/* PRICE */}
        <div className="pt-3 border-t">
          <div className="text-xs text-gray-400">Price</div>
          <div className="text-xl font-semibold text-[#b38a58]">
            {room.defaultRate.toLocaleString()} ₫
          </div>
          <div className="text-xs text-gray-400">/ 2 giờ đầu</div>
        </div>

        {/* ACTION */}
        <button className="w-full h-11 rounded-lg bg-[#b38a58] text-white">
          Book this room
        </button>
      </div>
    </div>
  );
};

export default RoomDetail;
