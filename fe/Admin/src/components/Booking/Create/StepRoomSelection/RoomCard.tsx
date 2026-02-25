import { useEffect, useState } from "react";
import { File_URL } from "../../../../setting/constant/app";
import calculateRoomPrice from "./CalculateRoomPrice";
import RoomAssets from "./RoomAssets";
import RoomAmenities from "./RoomAmenities";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const RoomCard = ({
  room,
  bookingDate,
  service,
  selected,
  onSelect,
  packageType,
}: any) => {
  const calculateHours = (
    checkInDate: string,
    checkInTime: string,
    checkOutDate: string,
    checkOutTime: string,
  ): number => {
    const checkIn = dayjs(`${checkInDate} ${checkInTime}`);
    const checkOut = dayjs(`${checkOutDate} ${checkOutTime}`);

    const hours = checkOut.diff(checkIn, "hour", true); // true = decimal
    return Math.max(0, Math.round(hours));
  };
  const hours = calculateHours(
    bookingDate.checkInDate,
    bookingDate.checkInTime,
    bookingDate.checkOutDate,
    bookingDate.checkOutTime,
  );
  const priceInfo = calculateRoomPrice({ packageType, room, hours });

  const [specialRequest, setSpecialRequest] = useState("");
  const { t } = useTranslation();

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
      <div className="flex flex-col sm:flex-row gap-4">
        {/* IMAGE */}
        <img
          src={
            room?.images?.[0]?.url
              ? File_URL + room.images[0].url
              : "/images/room-placeholder.jpg"
          }
          className="w-full sm:w-44 h-48 sm:h-32 object-cover rounded-xl"
        />

        <div className="flex-1 flex flex-col">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {room.roomName}
              </h3>
              {room.roomTypeName && (
                <p className="text-xs sm:text-sm text-gray-500">
                  {t("roomSelection.roomType")}: {room.roomTypeName}
                </p>
              )}
            </div>

            <div className="sm:text-right">
              <div className="text-lg sm:text-xl font-semibold text-[#536DB2]">
                ${priceInfo.price}
              </div>
              <div className="text-xs text-gray-500">{priceInfo.label}</div>
            </div>
          </div>

          {/* ASSETS */}
          <div className="mt-3">
            <RoomAssets assets={room.assets} />
          </div>

          {/* NOTE */}
          {room.note && (
            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
              {room.note}
            </p>
          )}

          {/* AMENITIES */}
          <div className="mt-3">
            <RoomAmenities amenities={service} />
          </div>

          {/* SPECIAL REQUEST */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t("roomSelection.specialRequest")}
            </label>
            <textarea
              rows={2}
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder={
                selected
                  ? t("roomSelection.specialRequestPlaceholder")
                  : t("roomSelection.specialRequestDisabled")
              }
              disabled={!selected}
              className={`
              w-full rounded-lg border px-3 py-2 text-sm resize-none transition
              ${
                selected
                  ? "border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#536DB2]"
                  : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
              }
            `}
            />
          </div>

          {/* ACTION */}
          <div className="flex justify-between items-center mt-4">
            {/* <button className="text-[#536DB2] text-sm hover:underline">
              {t("roomSelection.viewPhotos")}
            </button> */}

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
              className={`
              w-full sm:w-auto
              px-5 py-2
              rounded-xl
              text-sm font-medium
              transition
              ${
                selected
                  ? "bg-[#42578E] text-white"
                  : "border border-[#536DB2] text-[#42578E]"
              }
            `}
            >
              {selected
                ? t("roomSelection.removeRoom")
                : t("roomSelection.selectRoom")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
