import { CalendarDays, Users } from "lucide-react";
import calculateRoomPrice from "./CalculateRoomPrice";

const BookingSummary = ({
  room,
  bookingDate,
  guests,
  onNext,
  onEditGuests,
  packageType
}: any) => {
  const { price } = calculateRoomPrice({
    packageType,
    room,
  });
  return (
    <div className="rounded-2xl border border-gray-200 p-5 shadow-sm sticky top-6 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-[#42578E]" />
        <h3 className=" text-gray-800">Your Booking</h3>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className="text-gray-400 text-xs">CHECK-IN</p>
          <p className="font-medium text-gray-800">
            {bookingDate?.checkInDate || "--"}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">CHECK-OUT</p>
          <p className="font-medium text-gray-800">
            {bookingDate?.checkOutDate || "--"}
          </p>
        </div>
      </div>

      {/* Guests */}
      <div className="flex justify-between items-center mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-4 h-4" />
          <span>
            {guests?.adults || 0} Adults, {guests?.children || 0} Children
          </span>
        </div>
        <button
          onClick={onEditGuests}
          className="text-[#42578E] text-sm hover:underline"
        >
          Edit
        </button>
      </div>

      {/* Room */}
      {!room ? (
        <div className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded mb-4">
          No room selected yet
        </div>
      ) : (
        <div className="flex justify-between text-sm font-medium mb-4">
          <span>{room.roomName}</span>
          <span>${price}</span>
        </div>
      )}

      {/* Price */}
      <div className="border-t border-gray-200 pt-4 text-sm space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Taxes & Fees</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-800">
          <span>Total</span>
          <span>$0.00</span>
        </div>
      </div>

      {/* Button */}
      <button
        disabled={!room}
        onClick={onNext}
        className={`w-full mt-4 py-2 rounded-lg flex items-center justify-center gap-2
        ${
          room
            ? "bg-[#42578E] text-white"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Continue to Services →
      </button>

      {/* Footer text */}
      <p className="text-xs text-gray-400 mt-2 text-center">
        You won't be charged yet
      </p>
    </div>
  );
};

export default BookingSummary;
