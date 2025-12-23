import RoomAssets from "./RoomAssets";
import { File_URL } from "../../../../setting/constant/app";
import calculateRoomPrice from "./CalculateRoomPrice";
import RoomAmenities from "./RoomAmenities";

const RoomCard = ({ room, service, selected, onSelect, packageType }: any) => {
  const priceInfo = calculateRoomPrice({
    packageType,
    room,
  });

console.log(priceInfo)
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm
      ${selected ? "border-[#536DB2]" : "border-gray-200"}`}
    >
      <div className="flex gap-4">
        <img
          src={File_URL + room.images[0].url}
          className="w-44 h-32 object-cover rounded-xl"
        />

        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {room.roomName}
              </h3>
              {room.roomTypeName && (
                <p className="text-sm text-gray-500">
                  Room Type: {room.roomTypeName}
                </p>
              )}
            </div>

            <div className="text-right">
              <div className="text-xl font-semibold text-[#536DB2]">
                ${priceInfo.price}
              </div>
              <div className="text-xs text-gray-500">{priceInfo.label}</div>
            </div>
          </div>

          {/* ASSETS (SL + LABEL) */}
          <RoomAssets assets={room.assets} />
          {room.note && (
            <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-2">
              {room.note}
            </p>
          )}

          {/* AMENITIES */}
          <RoomAmenities amenities={service} />

          {/* ACTION */}
          <div className="flex justify-between items-center mt-4">
            <button className="text-[#536DB2] text-sm hover:underline">
              View Photos
            </button>
            <button
             onClick={() =>
          onSelect({
            ...room,
            price: priceInfo.price,
            priceLabel: priceInfo.label,
          })
        }
              className={`px-4 py-2 rounded-lg text-sm
              ${selected
                  ? "bg-[#42578E] text-white"
                  : "border border-[#536DB2] text-[#42578E]"
                }`}
            >
              {selected ? "Selected" : "Select Room"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
