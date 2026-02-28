import { useTranslation } from "react-i18next";
import { File_URL } from "../../../../setting/constant/app";
import { estimateServicePrice } from "../../../../util/estimateServicePrice";
import { formatBookingDateRange } from "../../../../util/formatDate";

const BookingSummary = ({
  booking,
  services,
  onNext,
}: any) => {
  const { t } = useTranslation();
  const rooms = booking.rooms || [];
  const nights = booking.selectDate?.nights || 1;

  /* ================= ROOM TOTAL ================= */
  const roomsTotal = rooms.reduce(
    (sum: number, room: any) =>
      sum + (room.price || 0) * nights,
    0
  );

  /* ================= SERVICES ================= */
  const servicesWithPrice = services.map((s: any) => ({
    ...s,
    estimated: estimateServicePrice(s, booking),
  }));

  const servicesTotal = servicesWithPrice.reduce(
    (sum: number, s: any) => sum + s.estimated,
    0
  );

  /* ================= FINAL TOTAL ================= */
  const total = roomsTotal + servicesTotal;

  return (
    <div className="self-start">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sticky top-6">
        {/* HEADER */}
        <h3 className="font-semibold text-gray-900 mb-4">
          {t("serviceSelection.bookingSummary")}
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
              {t("serviceSelection.roomsTotal", { count: rooms.length })}
            </span>
            <span className="font-medium">
              ${roomsTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* SERVICES */}
        {servicesWithPrice.length > 0 && (
          <>
            <p className="text-xs text-[#42578E] mt-4 mb-2 font-semibold">
              {t("serviceSelection.addedServices")}
            </p>

            <div className="space-y-2 text-sm">
              {servicesWithPrice.map((s: any) => (
                <div key={s.id} className="flex justify-between">
                  <span>
                    {s.serviceName} ({s.extraCharge}%)
                  </span>
                  <span className="font-medium">
                    ${s.estimated.toFixed(2)}
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
                {t("serviceSelection.totalEstimate")}
              </p>
              <p className="text-xs text-gray-400">USD</p>
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
          {t("serviceSelection.continue")}
        </button>

        <p className="text-xs text-gray-400 mt-3 text-center">
          {t("serviceSelection.secure")}
        </p>
      </div>
    </div>
  );
};

export default BookingSummary;  