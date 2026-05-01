import { useEffect, useState } from "react";
import type { RoomResponse } from "../../type/room.types";
import { File_URL } from "../../setting/constant/app";
import {
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Maximize,
  Plus,
  Tv,
  Wind,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AUTO_SLIDE_DELAY = 4000;

const RoomDetail = ({ room }: { room: RoomResponse | null }) => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const images = room?.images || [];
  const total = images.length;

  const next = () => setActive((i) => (i === total - 1 ? 0 : i + 1));

  const prev = () => setActive((i) => (i === 0 ? total - 1 : i - 1));

  useEffect(() => {
    if (!room || total <= 1) return;

    const timer = setInterval(next, AUTO_SLIDE_DELAY);
    return () => clearInterval(timer);
  }, [room, total]);

  useEffect(() => {
    if (!room) return;
    setActive(0);
  }, [room]);

  if (!room) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full">
      <div className="relative h-[200px] sm:h-[260px] lg:h-[220px] overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={File_URL + img.url}
              className="w-full h-full object-cover shrink-0"
            />
          ))}
        </div>
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2
          bg-white/80 hover:bg-white rounded-full p-1 transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2
                         bg-white/80 hover:bg-white rounded-full p-1 transition"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`
                  transition-all duration-300 rounded-full
                  ${
                    i === active
                      ? "w-6 h-2 bg-white"
                      : "w-2 h-2 bg-white/60 hover:bg-white"
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5 space-y-5">
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <span
            className="w-5 h-5 rounded-full border border-green-600
                           flex items-center justify-center text-xs"
          >
            +
          </span>
          +{room.defaultRate?.toLocaleString() || "70.000"} / giờ sau
        </div>
        <div>
          <h3
            onClick={() => navigate(`/Room/${room.id}`)}
            className="text-lg font-semibold mb-3 text-[#866F56]
    relative inline-block
    after:content-['']
    after:absolute after:left-0 after:-bottom-1
    after:w-0 after:h-[2px]
    after:bg-[#866F56]
    after:transition-all after:duration-300
    hover:after:w-full cursor-pointer
  "
          >
            Details & explore
          </h3>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li className="flex items-center gap-3">
              <Maximize size={18} /> Square area: {room.area || 20} m²
            </li>
            <li className="flex items-center gap-3">
              <BedDouble size={18} /> Double bed
            </li>
            <li className="flex items-center gap-3">
              <Coffee size={18} /> Minibar drinks
            </li>
            <li className="flex items-center gap-3">
              <Wind size={18} /> Air conditioning
            </li>
            <li className="flex items-center gap-3">
              <Tv size={18} /> Netflix
            </li>
            <li className="flex items-center gap-3">
              <Bath size={18} /> Bathrooms with shower
            </li>
          </ul>
        </div>
        <button className="flex items-center gap-2 text-[#b38a58] text-sm hover:gap-3 transition-all">
          <Plus size={16} /> More facilities
        </button>
      </div>
    </div>
  );
};
export default RoomDetail;
