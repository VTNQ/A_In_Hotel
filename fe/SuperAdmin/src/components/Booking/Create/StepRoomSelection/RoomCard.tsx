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

  const priceInfo = calculateRoomPrice({
    packageType,
    room,
    hours,
  });

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
        rounded-2xl border p-4 shadow-sm transition-colors
        ${
          selected
            ? `
              border-indigo-300 bg-indigo-50/50
              dark:border-indigo-500/40 dark:bg-indigo-950/20
            `
            : `
              border-gray-200 bg-white
              dark:border-neutral-800 dark:bg-neutral-900
            `
        }
      `}
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* IMAGE */}
        <img
          src={
            room?.images?.[0]?.url
              ? File_URL + room.images[0].url
              : "/images/room-placeholder.jpg"
          }
          alt={room.roomName}
          className="
            h-48 w-full rounded-xl object-cover
            bg-gray-100
            dark:bg-neutral-800
            sm:h-40
            lg:h-32 lg:w-44
          "
        />

        {/* CONTENT */}
        <div className="flex-1">
          {/* HEADER */}
          <div className="flex justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {room.roomName}
              </h3>

              {room.roomTypeName && (
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  {t("roomSelection.roomType")}: {room.roomTypeName}
                </p>
              )}
            </div>

            <div className="text-right">
              <div className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                ${priceInfo.price}
              </div>

              <div className="text-xs text-gray-500 dark:text-neutral-400">
                {priceInfo.label}
              </div>
            </div>
          </div>

          {/* ASSETS */}
          <RoomAssets assets={room.assets} />

          {/* NOTE */}
          {room.note && (
            <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-neutral-300">
              {room.note}
            </p>
          )}

          {/* AMENITIES */}
          <RoomAmenities amenities={service} />

          {/* SPECIAL REQUEST */}
          <div className="mt-4">
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-neutral-400">
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
                    ? `
                      border-gray-300 bg-white text-gray-900
                      focus:outline-none focus:ring-2 focus:ring-indigo-400
                      dark:border-neutral-700
                      dark:bg-neutral-800
                      dark:text-white
                      dark:focus:ring-indigo-500
                    `
                    : `
                      cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400
                      dark:border-neutral-800
                      dark:bg-neutral-950
                      dark:text-neutral-600
                    `
                }
              `}
            />
          </div>

          {/* ACTION */}
          <div className="mt-4 flex items-center justify-end">
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
                    ? `
                      bg-indigo-500 text-white hover:bg-indigo-600
                      dark:bg-indigo-600 dark:hover:bg-indigo-500
                    `
                    : `
                      border border-indigo-300 text-indigo-600 hover:bg-indigo-50
                      dark:border-indigo-500/40
                      dark:text-indigo-400
                      dark:hover:bg-indigo-950/30
                    `
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