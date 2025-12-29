import { BedDouble, Users, Maximize } from "lucide-react";
import { File_URL } from "../../setting/constant/app";
import type { RoomCardProps } from "../../type/room.types";

const RoomCard = ({ room, onClick,isSelected }: RoomCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm overflow-hidden flex
        cursor-pointer transition
        ${
          isSelected
            ? "ring-2 ring-[#b38a58]"
            : "hover:ring-2 hover:ring-[#b38a58]"
        }`}
    >
      {/* Image */}
      <div className="w-[260px] h-[200px] shrink-0">
        <img
          src={File_URL + room.images[0].url}
          alt={room.images[0].altText}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-4 flex-1">
        {/* Top */}
        <div>
          <h3 className="font-semibold text-lg mb-2 uppercase">
            {room.roomName}
          </h3>

          {/* Room info */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Maximize size={16} />
              <span>{room.area || 20} m²</span>
            </div>

            <div className="flex items-center gap-1">
              <BedDouble size={16} />
              <span>double bed</span>
            </div>

            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{room.capacity} guest</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-3">
            A In Hotel Riverside cung cấp phòng nghỉ tại trung tâm Hồ Chí Minh,
            cách Bảo tàng Mỹ thuật 1.2 km. Khách sạn cung cấp WiFi miễn phí.
          </p>
        </div>

        {/* Bottom */}
        <div className="flex items-end justify-between mt-4">
          <div />

          <div className="text-right">
            <div className="text-xs text-gray-400">Price</div>
            <div className="text-lg font-semibold text-[#b38a58]">
              {room.defaultRate.toLocaleString()} ₫
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
