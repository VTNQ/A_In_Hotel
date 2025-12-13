import { File_URL } from "../../setting/constant/app";
import type { RoomCardProps } from "../../type/room.types";

const RoomCard =({room}:RoomCardProps)=>{
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="relative">
            <img
              src={File_URL+room?.images[0].url}
              alt={room?.images[0].altText}
              className="h-56 w-full object-cover"
            />
            {/* {room.tag && (
              <span className="absolute top-3 left-3 bg-[#b38a58] text-white text-xs px-3 py-1 rounded-full">
                {room.tag}
              </span>
            )} */}
          </div>
    
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{room.roomName}</h3>
            <p className="text-sm text-gray-500 mb-4">
              A perfect choice for luxury stay with premium amenities.
            </p>
    
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400">Starting from</div>
                <div className="text-lg font-semibold">
                  ${room.defaultRate}
                  <span className="text-sm text-gray-500"> / night</span>
                </div>
              </div>
    
              <button className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800">
                Book Now
              </button>
            </div>
          </div>
        </div>
      );
    
}
export default RoomCard;