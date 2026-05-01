import { CalendarDays, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import calculateRoomPrice from "./calculateRoomPrice";

const BookingSummary = ({
  rooms = [],
  bookingDate,
  guests,
  onNext,
  onEditGuests,
  packageType,
}: any) => {
    
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

  const totalPrice = rooms.reduce((sum: number, room: any) => {
    const { price } = calculateRoomPrice({ packageType, room, hours });
    return sum + price;
  }, 0);

  const { t } = useTranslation();

  return (
    <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm w-[109%] sm:w-full">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-indigo-500" />
        <h3 className="font-semibold text-gray-800">
          {t("roomSelection.yourBooking")}
        </h3>
      </div>

      {/* Dates */}
      <div className="relative mb-4 grid grid-cols-[3fr_2fr] text-sm">
        <div className="absolute inset-y-2 left-[45%] w-px bg-gray-200" />

        <div className="flex min-h-[48px] flex-col justify-center pr-4">
          <p className="text-xs text-gray-400">
            {t("roomSelection.checkIn")}
          </p>
          <p className="font-medium text-gray-800">
            {bookingDate?.checkInDate || "--"}
          </p>
          <p className="text-xs text-gray-500">
            {bookingDate?.checkInTime || "--"}
          </p>
        </div>

        <div className="flex min-h-[48px] flex-col justify-center pl-4">
          <p className="text-xs text-gray-400">
            {t("roomSelection.checkOut")}
          </p>
          <p className="font-medium text-gray-800">
            {bookingDate?.checkOutDate || "--"}
          </p>
          <p className="text-xs text-gray-500">
            {bookingDate?.checkOutTime || "--"}
          </p>
        </div>
      </div>

      {/* Guests */}
      <div className="mb-4 flex items-center justify-between border-t border-gray-200 pt-4 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="h-4 w-4" />
          <span>
            {t("roomSelection.guests", {
              adults: guests?.adults || 0,
              children: guests?.children || 0,
            })}
          </span>
        </div>
        <button
          onClick={onEditGuests}
          className="text-sm text-indigo-500 hover:underline"
        >
          {t("roomSelection.edit")}
        </button>
      </div>

      {/* Rooms */}
      {rooms.length === 0 ? (
        <div className="mb-4 rounded bg-gray-50 py-4 text-center text-sm text-gray-400">
          {t("roomSelection.noRoomSelected")}
        </div>
      ) : (
        <div className="mb-4 space-y-2">
          {rooms.map((room: any) => {
            const { price } = calculateRoomPrice({
              packageType,
              room,
              hours,
            });
            return (
              <div
                key={room.id}
                className="flex justify-between text-sm font-medium"
              >
                <span>{room.roomName}</span>
                <span className="text-indigo-600">${price}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Price */}
      <div className="space-y-2 border-t border-gray-200 pt-4 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>{t("roomSelection.taxesFees")}</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span className="text-gray-800">
            {t("roomSelection.total")}
          </span>
          <span className="text-indigo-600">
            ${totalPrice}
          </span>
        </div>
      </div>

      {/* CTA */}
      <button
        disabled={rooms.length === 0}
        onClick={onNext}
        className={`
          mt-4 w-full rounded-lg py-2 text-sm font-medium transition
          ${
            rooms.length
              ? "bg-indigo-400 text-white hover:bg-indigo-500"
              : "cursor-not-allowed bg-gray-200 text-gray-400"
          }
        `}
      >
        {t("roomSelection.continue")}
      </button>

      {/* Footer */}
      <p className="mt-2 text-center text-xs text-gray-400">
        {t("roomSelection.notCharged")}
      </p>
    </div>
  );
};

export default BookingSummary;
