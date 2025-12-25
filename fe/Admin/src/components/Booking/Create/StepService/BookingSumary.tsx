import { File_URL } from "../../../../setting/constant/app";
import { estimateServicePrice } from "../../../../util/estimateServicePrice";
import { formatBookingDateRange } from "../../../../util/formatDate";

const BookingSummary = ({
  booking,
  services,
  onNext,
}: any) => {
  const rooms = booking.rooms || [];
  const nights = booking.selectDate?.nights || 1;

  // ✅ Tổng tiền phòng
  const roomsTotal = rooms.reduce(
    (sum: number, room: any) =>
      sum + (room.price || 0) * nights,
    0
  );

  // ✅ Tổng tiền service (estimate)
  const servicesTotal = services.reduce(
    (sum: number, s: any) =>
      sum + estimateServicePrice(s, booking),
    0
  );

  const total = roomsTotal + servicesTotal;

  return (
    <div className="self-start">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sticky top-6">
        {/* HEADER */}
        <h3 className="font-semibold text-gray-900 mb-4">
          Booking Summary
        </h3>

        {/* ROOMS */}
        <div className="space-y-4">
          {rooms.map((room: any) => (
            <div key={room.id} className="flex gap-3">
              <img
                src={File_URL + room?.images?.[0]?.url}
                alt=""
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />

              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">
                  {room.roomName}
                </p>
                <p className="text-sm text-gray-500">
                  {formatBookingDateRange(
                    booking.selectDate?.checkInDate,
                    booking.selectDate?.checkOutDate,
                    nights
                  )}
                </p>
              </div>

              <div className="text-sm font-medium text-gray-900">
                ${(room.price * nights).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* ROOM TOTAL */}
        <div className="text-sm border-t pt-4 mt-4 border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-500">
              Rooms Total ({rooms.length} rooms)
            </span>
            <span className="font-medium">
              ${roomsTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* SERVICES */}
        {services?.length > 0 && (
          <>
            <p className="text-xs text-[#42578E] mt-4 mb-2 font-semibold">
              ADDED SERVICES
            </p>

            <div className="space-y-2 text-sm">
              {services.map((s: any) => (
                <div
                  key={s.id}
                  className="flex justify-between"
                >
                  <span>{s.serviceName}</span>
                  <span className="font-medium">
                    ${estimateServicePrice(s, booking).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* TOTAL */}
        <div className="border-t mt-4 pt-4 border-gray-200">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-500">
                Total Estimate
              </p>
              <p className="text-xs text-gray-400">
                USD
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* ACTION */}
        <button
          onClick={onNext}
          className="w-full mt-6 py-3 rounded-lg bg-[#3d538a] text-white font-medium text-lg"
        >
          Continue to Payment →
        </button>



        <p className="text-xs text-gray-400 mt-3 text-center">
          Secure Booking Process
        </p>
      </div>
    </div>
  );
};

export default BookingSummary;
