import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { File_URL } from "@/setting/constant/app";

import calculateRoomPrice from "./calculateRoomPrice";
import RoomAssets from "./RoomAssets";
import RoomAmenities from "./RoomAmenities";

const RoomCard = ({
  room,
  bookingDate,
  service,
  selected,
  onSelect,
  packageType,
}: any) => {
  const { t } = useTranslation();
  const [specialRequest, setSpecialRequest] = useState("");

  /* ===== CALCULATE HOURS ===== */
  const calculateHours = (
    checkInDate?: string,
    checkInTime?: string,
    checkOutDate?: string,
    checkOutTime?: string,
  ): number => {
    if (!checkInDate || !checkOutDate) return 0;

    const checkIn = dayjs(`${checkInDate} ${checkInTime}`);
    const checkOut = dayjs(`${checkOutDate} ${checkOutTime}`);
    return Math.max(0, Math.round(checkOut.diff(checkIn, "hour", true)));
  };

  const hours = calculateHours(
    bookingDate?.checkInDate,
    bookingDate?.checkInTime,
    bookingDate?.checkOutDate,
    bookingDate?.checkOutTime,
  );

  const priceInfo = calculateRoomPrice({ packageType, room, hours });

  /* ===== UPDATE SPECIAL REQUEST ===== */
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
      className={`
        rounded-2xl border p-4 shadow-sm transition
        ${
          selected
            ? "border-indigo-300 bg-indigo-50/40"
            : "border-gray-200 bg-white"
        }
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
          alt={room.roomName}
          className="h-32 w-44 rounded-xl object-cover"
        />

        {/* CONTENT */}
        <div className="flex-1">
          {/* HEADER */}
          <div className="flex justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {room.roomName}
              </h3>
              {room.roomTypeName && (
                <p className="text-sm text-gray-500">
                  {t("roomSelection.roomType")}: {room.roomTypeName}
                </p>
              )}
            </div>

            <div className="text-right">
              <div className="text-xl font-semibold text-indigo-500">
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
            <label className="mb-1 block text-xs font-medium text-gray-600">
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
                w-full resize-none rounded-lg border px-3 py-2 text-sm transition
                ${
                  selected
                    ? "border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                }
              `}
            />
          </div>

          {/* ACTION */}
          <div className="mt-4 flex items-center justify-end">
            {/* <button className="text-sm text-indigo-500 hover:underline">
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
                rounded-lg px-4 py-2 text-sm font-medium transition
                ${
                  selected
                    ? "bg-indigo-400 text-white hover:bg-indigo-500"
                    : "border border-indigo-300 text-indigo-500 hover:bg-indigo-50"
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
