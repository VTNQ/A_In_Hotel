import { BedDouble, Expand, Users, ArrowRight } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { File_URL } from "../../setting/constant/app";

const RoomCard = ({
  id,
  title,
  price,
  image,
  size = 20,
  bed = "Double bed",
  roomTypeName,
  guests = 2,
  description = "Modern room with full amenities, suitable for short stays.",
}: any) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/room/${id}`)}
      className="
        group
        bg-white
        rounded-[28px]
        overflow-hidden
        border border-[#eee6dc]
        shadow-[0_8px_30px_rgba(0,0,0,0.05)]
        hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]
        transition-all duration-500
        cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden h-[240px]">
        <img
          loading="lazy"
          src={image ? File_URL + image : "https://picsum.photos/500/300"}
          alt={title}
          className="
            w-full h-full object-cover
            group-hover:scale-110
            transition-transform duration-700"
        />

        {/* OVERLAY */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-black/60
            via-black/10
            to-transparent"
        />

        {/* VIEW BUTTON */}
        <div
          className="
            absolute top-4 right-4
            w-10 h-10
            rounded-full
            bg-white/15
            backdrop-blur-md
            border border-white/20
            flex items-center justify-center
            text-white
            opacity-0
            group-hover:opacity-100
            transition-all duration-300"
        >
          <ArrowRight size={18} />
        </div>

        {/* TITLE */}
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <h3
            className="text-2xl
            font-black
            uppercase
            leading-tight
            line-clamp-2
            break-words
            min-h-[64px]"
          >
            {title}
          </h3>

          <p className="text-white/80 text-sm mt-1">
           {roomTypeName}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        {/* INFO */}
        <div className="flex flex-wrap gap-3">
          <div
            className="
              flex items-center gap-2
              px-3 py-2
              rounded-full
              bg-[#faf7f2]
              text-sm text-gray-700"
          >
            <Expand size={15} className="text-[#b38a58]" />
            <span>{size} m²</span>
          </div>

          <div
            className="
              flex items-center gap-2
              px-3 py-2
              rounded-full
              bg-[#faf7f2]
              text-sm text-gray-700"
          >
            <BedDouble size={15} className="text-[#b38a58]" />
            <span>{bed}</span>
          </div>

          <div
            className="
              flex items-center gap-2
              px-3 py-2
              rounded-full
              bg-[#faf7f2]
              text-sm text-gray-700"
          >
            <Users size={15} className="text-[#b38a58]" />
            <span>{guests} Guests</span>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p
          className="
            mt-5
            text-sm
            text-gray-500
            leading-relaxed
            line-clamp-2"
        >
          {description}
        </p>

        {/* FOOTER */}
        <div
          className="
            mt-6
            pt-5
            border-t border-gray-100
            flex items-end justify-between"
        >
          <div>
            <p className="text-xs uppercase tracking-[3px] text-gray-400">
              Starting from
            </p>

            <h4 className="text-2xl font-black text-[#b38a58] mt-1">
              {price.toLocaleString()}đ
            </h4>

            <p className="text-xs text-gray-400 mt-1">Price includes VAT</p>
          </div>

          <button
            className="
              flex items-center gap-2
              px-5 py-3
              rounded-full
              bg-gradient-to-r
              from-[#b38a58]
              to-[#8f6b43]
              text-white
              text-sm
              font-semibold
              hover:scale-105
              active:scale-95
              transition-all duration-300"
          >
            View Room
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
