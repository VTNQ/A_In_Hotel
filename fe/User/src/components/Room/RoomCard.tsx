import { BedDouble, Users, Maximize } from "lucide-react";
import { File_URL } from "../../setting/constant/app";
import type { RoomCardProps } from "../../type/room.types";
import { useTranslation } from "react-i18next";

const RoomCard = ({ room, onClick, isSelected }: RoomCardProps) => {
  const { t } = useTranslation();
  return (
    <div
      onClick={onClick}
      className={`
        bg-white 
        rounded-2xl 
        shadow-sm 
        overflow-hidden 
        cursor-pointer
        transition-all
        duration-300
        flex
        flex-col
        md:flex-row
        ${
          isSelected
            ? "ring-2 ring-[#b38a58]"
            : "hover:ring-2 hover:ring-[#b38a58]"
        }`}
    >
      {/* Image */}
      <div className="w-full md:w-[260px] h-[220px] md:h-[200px] shrink-0">
        <img
          loading="lazy"
          src={File_URL + room?.images[0]?.url}
          alt={room?.images[0]?.altText}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-4 sm:p-5 flex-1">
        {/* Top */}
        <div>
          <h3 className="font-semibold text-base sm:text-lg mb-2 uppercase">
            {room.roomName}
          </h3>

          {/* Room info */}
          <div
            className="flex flex-wrap items-center gap-3 text-xs 
          sm:text-sm text-gray-600 mb-3"
          >
            <div className="flex items-center gap-1">
              <Maximize size={16} />
              <span>{room.area || 20} m²</span>
            </div>

            <div className="flex items-center gap-1">
              <BedDouble size={16} />
              <span>{t("room.card.doubleBed")}</span>
            </div>

            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>
                {room.capacity} {t("room.card.guest")}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-3">
            {room.note?.trim() || t("room.noNote")}
          </p>
        </div>

        {/* Bottom */}
        <div className="flex items-end justify-between mt-4">
          <div />

          <div className="text-right">
            <div className="text-xs text-gray-400">{t("room.card.price")}</div>
            <div className="text-base sm:text-lg font-semibold text-[#b38a58]">
              {room.defaultRate.toLocaleString()} ₫
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
