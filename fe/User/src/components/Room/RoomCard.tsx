import React from "react";

interface RoomCardProps {
  image: string;
  type: string;
}

const RoomCard: React.FC<RoomCardProps> = ({ image, type }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden w-[320px]">
      {/* Image */}
      <div className="relative">
        <img src={image} alt={type} className="w-full h-52 object-cover" />
        {/* Expand icon */}
        <div className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 transition p-1 rounded-full cursor-pointer shadow">
          <svg
            className="w-5 h-5 text-gray-800"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M15 10l4.553 4.553a2 2 0 01-2.829 2.829L12 12.828m0 0L6.276 18.553a2 2 0 01-2.829-2.829L9 10m3 2.828V5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 text-sm text-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">{type}</span>
          <span className="text-lg">&rsaquo;</span>
        </div>
        <hr className="mb-3 border-gray-300" />
        <button className="bg-[#8c7b6c] text-white px-4 py-2 rounded-full text-sm hover:opacity-90 transition">
          View Rates
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
