import { useEffect, useMemo, useState } from "react";
import type { RoomDetailProps } from "../../type/room.types";
import { File_URL } from "../../setting/constant/app";
import {
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Maximize,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AUTO_SLIDE_DELAY = 4000;

const RoomDetail = ({ room, promotion }: RoomDetailProps) => {
  const { t } = useTranslation();
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
  const discountedPrice = useMemo(() => {
    if (!room?.defaultRate) return 0;
    if (!promotion || promotion.type === 1) {
      if (!promotion || promotion.value == null) {
        return room.defaultRate;
      }

      return room.defaultRate - (room.defaultRate * promotion.value) / 100;
    }
    if (!promotion || promotion.type === 2) {
      return Math.max(0, room.defaultRate - promotion.value);
    }
    return room.defaultRate;
  }, [room, promotion]);
  if (!room) {
    return <></>;
  }


  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#f0ece6] overflow-hidden w-full relative group">
      {/* IMAGE SLIDER */}
      <div className="relative h-[220px] sm:h-[280px] lg:h-[240px] overflow-hidden">
        {images.length > 0 ? (
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {images.map((img, i) => (
              <img
                loading="lazy"
                key={i}
                src={File_URL + img.url}
                className="w-full h-full object-cover shrink-0"
                alt={img.altText || room.roomName}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 font-medium">No Image</span>
          </div>
        )}

        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-md transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-md transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`transition-all duration-300 rounded-full shadow-sm ${
                    i === active
                      ? "w-6 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* CONTENT INFO */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex justify-between items-start mb-2 gap-2">
            <h2 className="flex-1 min-w-0 text-xl text-gray-800 leading-tight break-words">
              {room.roomName}
            </h2>

            {room.roomTypeName && (
              <span className="px-3 py-1 bg-[#9C7A55]/10 text-[#9C7A55] text-xs font-bold rounded-full border border-[#9C7A55]/20 shrink-0">
                {room.roomTypeName}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {promotion && (
              <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-200">
                {promotion.type === 1
                  ? `-${promotion.value}%`
                  : `-${promotion.value.toLocaleString()}đ`}
              </span>
            )}
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#9C7A55]" />
            <span className="line-clamp-2 leading-snug">
              {room.hotelName} <br />
              <span className="text-xs text-gray-400">{room.hotelAddress}</span>
            </span>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-2 gap-4 py-5 border-y border-gray-100">
          <div className="flex items-center gap-2.5 text-gray-700 text-sm font-medium">
            <div className="w-8 h-8 rounded-full bg-[#FBF7F2] flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-[#9C7A55]" />
            </div>
            <span>{room.capacity ? `Max ${room.capacity}` : "2 Guests"}</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-700 text-sm font-medium">
            <div className="w-8 h-8 rounded-full bg-[#FBF7F2] flex items-center justify-center shrink-0">
              <Maximize className="w-4 h-4 text-[#9C7A55]" />
            </div>
            <span>{room.area || 20} m²</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-700 text-sm font-medium">
            <div className="w-8 h-8 rounded-full bg-[#FBF7F2] flex items-center justify-center shrink-0">
              <BedDouble className="w-4 h-4 text-[#9C7A55]" />
            </div>
            <span>{t("room.detail.facilities.doubleBed") || "Double Bed"}</span>
          </div>
          {room.note && (
            <div className="flex items-center gap-2.5 text-gray-700 text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-[#FBF7F2] flex items-center justify-center shrink-0">
                <Info className="w-4 h-4 text-[#9C7A55]" />
              </div>
              <span className="truncate" title={room.note}>
                {room.note}
              </span>
            </div>
          )}
        </div>

        {/* Price Add-on */}
        <div className="flex items-center justify-between p-3.5 bg-[#FBF7F2] rounded-2xl border border-[#9C7A55]/15">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
              <Clock className="w-4 h-4 text-[#9C7A55]" />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {t("room.detail.extraHour") || "Extra hour rate"}
            </span>
          </div>
          <div className="flex flex-col items-end">
            {promotion && (
              <span className="text-xs text-gray-400 line-through">
                +{room.defaultRate?.toLocaleString()}đ
              </span>
            )}

            <span className="text-[#9C7A55] font-bold text-base">
              +{discountedPrice.toLocaleString()}đ
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate(`/Room/${room.id}`)}
          className="w-full py-3.5 bg-gradient-to-r from-[#9C7A55] to-[#8B6D4C] text-white rounded-xl font-semibold shadow-lg shadow-[#9C7A55]/30 hover:shadow-[#9C7A55]/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          <span>{t("room.detail.explore") || "View Details"}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default RoomDetail;
