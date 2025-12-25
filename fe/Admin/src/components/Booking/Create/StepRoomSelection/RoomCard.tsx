import { useEffect, useState } from "react";
import { File_URL } from "../../../../setting/constant/app";
import calculateRoomPrice from "./CalculateRoomPrice";
import RoomAssets from "./RoomAssets";
import RoomAmenities from "./RoomAmenities";

const RoomCard = ({ room, service, selected, onSelect, packageType }: any) => {
  const priceInfo = calculateRoomPrice({ packageType, room });

  const [specialRequest, setSpecialRequest] = useState("");

  useEffect(() => {
    if (!selected) return;

    onSelect({
      ...room,
      price: priceInfo.price,
      priceLabel: priceInfo.label,
      specialRequest,
      _action: "update",
    });
  }, [specialRequest]);

  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm transition
        ${selected ? "border-[#536DB2]" : "border-gray-200"}
      `}
    >
      <div className="flex gap-4">
        {/* IMAGE */}
        <img
          src={
            room?.images?.[0]?.url
              ? File_URL + room.images[0].url
              : "/images/room-placeholder.jpg"
          }
          className="w-44 h-32 object-cover rounded-xl"
        />

        <div className="flex-1">
          {/* HEADER */}
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
              <div className="text-xs text-gray-500">
                {priceInfo.label}
              </div>
            </div>
          </div>

          {/* ASSETS */}
          <RoomAssets assets={room.assets} />

          {/* NOTE */}
          {room.note && (
            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
              {room.note}
            </p>
          )}

          {/* AMENITIES */}
          <RoomAmenities amenities={service} />

          {/* SPECIAL REQUEST */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Special request (optional)
            </label>
            <textarea
              rows={2}
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder={
                selected
                  ? "e.g. High floor, near elevator, non-smoking..."
                  : "Select this room to add special request"
              }
              disabled={!selected}
              className={`
      w-full rounded-lg border px-3 py-2 text-sm resize-none
      transition  ${selected
                  ? "border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#536DB2]"
                  : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                }
    `}
            />
          </div>

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
                  specialRequest,
                  _action: selected ? "remove" : "add",
                })
              }
              className={`px-4 py-2 rounded-lg text-sm transition ${selected
                  ? "bg-[#42578E] text-white"
                  : "border border-[#536DB2] text-[#42578E]"
                }`}
            >
              {selected ? "Remove" : "Select Room"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
