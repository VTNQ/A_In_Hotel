import { CalendarDays, Users } from "lucide-react";
import calculateRoomPrice from "./CalculateRoomPrice";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const BookingSummary = ({
  rooms = [],
  bookingDate,
  guests,
  onNext,
  onEditGuests,
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
  const totalPrice = rooms.reduce((sum: number, room: any) => {
    const { price } = calculateRoomPrice({ packageType, room, hours });
    return sum + price;
  }, 0);
  const { t } = useTranslation();
return (
  <div className="
    rounded-2xl border border-gray-200 p-5 shadow-sm sticky top-6 bg-white
    dark:bg-gray-800 dark:border-gray-700
  ">

    {/* Header */}
    <div className="flex items-center gap-2 mb-4">
      <CalendarDays className="w-5 h-5 text-[#42578E] dark:text-blue-400" />
      <h3 className="text-gray-800 dark:text-gray-100">
        {t("roomSelection.yourBooking")}
      </h3>
    </div>

    {/* Dates */}
    <div className="relative grid grid-cols-[3fr_2fr] text-sm mb-4">

      <div className="absolute inset-y-2 left-[45%] w-px bg-gray-200 dark:bg-gray-600" />

      {/* CHECK-IN */}
      <div className="flex flex-col justify-center pr-4 min-h-[48px]">
        <p className="text-gray-400 dark:text-gray-500 text-xs">
          {t("roomSelection.checkIn")}
        </p>
        <p className="font-medium text-gray-800 dark:text-gray-100">
          {bookingDate?.checkInDate || "--"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {bookingDate?.checkInTime || "--"}
        </p>
      </div>

      {/* CHECK-OUT */}
      <div className="flex flex-col justify-center pl-4 min-h-[48px]">
        <p className="text-gray-400 dark:text-gray-500 text-xs">
          {t("roomSelection.checkOut")}
        </p>
        <p className="font-medium text-gray-800 dark:text-gray-100">
          {bookingDate?.checkOutDate || "--"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {bookingDate?.checkOutTime || "--"}
        </p>
      </div>
    </div>

    {/* Guests */}
    <div className="
      flex justify-between items-center mb-4 text-sm border-t pt-4
      border-gray-200 dark:border-gray-700
    ">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
        <Users className="w-4 h-4 dark:text-gray-300" />
        <span>
          {t("roomSelection.guests", {
            adults: guests?.adults || 0,
            children: guests?.children || 0,
          })}
        </span>
      </div>

      <button
        onClick={onEditGuests}
        className="text-[#42578E] text-sm hover:underline
          dark:text-blue-400"
      >
        {t("roomSelection.edit")}
      </button>
    </div>

    {/* Room */}
    {rooms.length === 0 ? (
      <div className="
        text-sm text-gray-400 text-center py-4 bg-gray-50 rounded mb-4
        dark:bg-gray-700 dark:text-gray-400
      ">
        {t("roomSelection.noRoomSelected")}
      </div>
    ) : (
      <div className="space-y-2 mb-4">
        {rooms.map((room: any) => {
          const { price } = calculateRoomPrice({ packageType, room });
          return (
            <div
              key={room.id}
              className="flex justify-between text-sm font-medium
                text-gray-800 dark:text-gray-100"
            >
              <span>{room.roomName}</span>
              <span>${price}</span>
            </div>
          );
        })}
      </div>
    )}

    {/* Price */}
    <div className="border-t border-gray-200 pt-4 text-sm space-y-2
      dark:border-gray-700">

      <div className="flex justify-between text-gray-600 dark:text-gray-300">
        <span>{t("roomSelection.taxesFees")}</span>
        <span>$0.00</span>
      </div>

      <div className="flex justify-between font-semibold text-gray-800 dark:text-gray-100">
        <span>{t("roomSelection.total")}</span>
        <span>${totalPrice}</span>
      </div>
    </div>

    {/* Button */}
    <button
      disabled={rooms.length === 0}
      onClick={onNext}
      className={`
        w-full mt-4 py-2 rounded-lg transition

        ${
          rooms.length
            ? "bg-[#42578E] text-white dark:bg-blue-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
        }
      `}
    >
      {t("roomSelection.continue")}
    </button>

    {/* Footer */}
    <p className="text-xs text-gray-400 mt-2 text-center dark:text-gray-500">
      {t("roomSelection.notCharged")}
    </p>
  </div>
);
};

export default BookingSummary;
