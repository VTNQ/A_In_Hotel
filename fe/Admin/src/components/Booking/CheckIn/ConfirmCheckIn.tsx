import {
  BedDouble,
  Calendar,
  CheckCircle2,
  CreditCard,
  User,
  X,
} from "lucide-react";
import type { CheckInBookingResponse } from "../../../type/booking.types";
import { useEffect, useState } from "react";
import { findByIdAndDetailsActiveTrue } from "../../../service/api/Booking";
import { useTranslation } from "react-i18next";

const ConfirmCheckIn = ({
  open,
  id,
  onCancel,
  onConfirm,
}: CheckInBookingResponse) => {
  const [data, setData] = useState<any>(null);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const [confirming, setConfirming] = useState(false);
  const handleConfirm = async () => {
    if (confirming) return;

    try {
      setConfirming(true);

      await onConfirm();

      onCancel();
    } catch (err) {
      console.error("Confirm check-in failed");
      // ❌ KHÔNG đóng popup
    } finally {
      setConfirming(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  useEffect(() => {
    if (!open || !id) return;

    const fetchBooking = async () => {
      setLoading(true);
      try {
        const res = await findByIdAndDetailsActiveTrue(id);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [open, id]);

  if (!open) return null;
  const calculateNights = (
    checkInDate: string,
    checkInTime: string,
    checkOutDate: string,
    checkOutTime: string,
  ): number => {
    const checkIn = new Date(`${checkInDate}T${checkInTime}`);
    const checkOut = new Date(`${checkOutDate}T${checkOutTime}`);

    const diffMs = checkOut.getTime() - checkIn.getTime();

    if (diffMs <= 0) return 0;

    const ONE_NIGHT = 1000 * 60 * 60 * 24;

    return Math.ceil(diffMs / ONE_NIGHT);
  };
  if (!data) return;

  const nights = calculateNights(
    data.checkInDate,
    data.checkInTime,
    data.checkOutDate,
    data.checkOutTime,
  );
  const outstanding =
    data?.totalPrice && data?.payment[0]?.paidAmount
      ? data.totalPrice - data?.payment[0]?.paidAmount
      : 0;

  const getDurationLabel = () => {
    switch (data?.bookingPackage) {
      case 1:
        return t("confirmCheckIn.twoHours");
      case 2:
        return nights === 1
          ? t("confirmCheckIn.night", { count: 1 })
          : t("confirmCheckIn.nights", { count: nights});
      case 3:
        return t("confirmCheckIn.fullDay");
      default:
        return "";
    }
  };

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div
        className={`
          relative z-10 
          w-full 
          sm:max-w-2xl 
          max-h-[95vh]
          flex flex-col 
          overflow-hidden 
          rounded-xl sm:rounded-2xl 
          bg-white dark:bg-gray-900
          shadow-2xl
          mx-auto
          transform transition-all duration-200
          ${loading ? "scale-95 opacity-70" : "scale-100 opacity-100"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-xl font-semibold text-[#253150] dark:text-gray-100">
              {t("confirmCheckIn.title")}
            </h1>
            <p className="text-sm text-[#5f6b85] dark:text-gray-400 mt-1">
              {t("confirmCheckIn.subtitle")}
            </p>
          </div>

          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#253150]/20 dark:border-gray-700 border-t-[#253150] dark:border-t-gray-300 rounded-full animate-spin" />
            <p className="mt-4 text-sm text-[#5f6b85] dark:text-gray-400">
              {t("confirmCheckIn.loading")}
            </p>
          </div>
        )}

        {!loading && data && (
          <>
            <div className="flex-1 overflow-y-auto custom-scroll bg-[#f6f8fb] dark:bg-gray-950 px-4 sm:px-6 py-4 sm:py-5 space-y-6 text-sm">

              {/* ================= GUEST INFO ================= */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-[#253150] dark:text-gray-300" />
                  <h2 className="font-semibold text-[#253150] dark:text-gray-100 uppercase">
                    {t("confirmCheckIn.guestInfo")}
                  </h2>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-[#d6dbea] dark:border-gray-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#5f6b85] dark:text-gray-400">
                      {t("confirmCheckIn.guestName")}
                    </p>
                    <p className="font-medium text-[#253150] dark:text-gray-100">
                      {data.guestName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#5f6b85] dark:text-gray-400">
                      {t("confirmCheckIn.numberOfGuests")}
                    </p>
                    <p className="font-medium text-[#253150] dark:text-gray-100">
                      {data.numberOfGuests} {t("confirmCheckIn.adults")}
                    </p>
                  </div>

                  {data.note && (
                    <div className="col-span-2">
                      <p className="text-xs text-[#5f6b85] dark:text-gray-400 mb-1">
                        {t("confirmCheckIn.notes")}
                      </p>
                      <div className="bg-[#f6f8fb] dark:bg-gray-800 border border-dashed border-[#d6dbea] dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200">
                        {data.note}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* ================= ROOM INFO ================= */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-[#253150] dark:text-gray-300" />
                  <h2 className="font-semibold text-[#253150] dark:text-gray-100 uppercase">
                    {t("confirmCheckIn.roomInfo")}
                  </h2>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-[#d6dbea] dark:border-gray-800 rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-3 bg-[#eef1f7] dark:bg-gray-800">
                    <span className="text-[#253150] dark:text-gray-200">
                      {data.checkInDate} – {data.checkOutDate}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-[#253150]/10 dark:bg-gray-700 text-[#253150] dark:text-gray-200">
                      {getDurationLabel()}
                    </span>
                  </div>

                  <div className="divide-y divide-[#d6dbea] dark:divide-gray-800">
                    {data.details
                      ?.filter((d: any) => d.roomId != null)
                      .map((room: any) => (
                        <div
                          key={room.roomId}
                          className="flex items-center gap-3 px-4 py-3"
                        >
                          <div className="w-9 h-9 rounded-full bg-[#253150]/10 dark:bg-gray-800 flex items-center justify-center">
                            <BedDouble className="w-4 h-4 text-[#253150] dark:text-gray-300" />
                          </div>
                          <div>
                            <p className="text-xs text-[#5f6b85] dark:text-gray-400">
                              {room.roomName}
                            </p>
                            <p className="font-medium text-[#253150] dark:text-gray-100">
                              {room.roomType}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </section>

              {/* ================= PAYMENT ================= */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-[#253150] dark:text-gray-300" />
                  <h2 className="font-semibold text-[#253150] dark:text-gray-100 uppercase">
                    {t("confirmCheckIn.paymentSummary")}
                  </h2>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-[#d6dbea] dark:border-gray-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-[#5f6b85] dark:text-gray-400">
                      {t("confirmCheckIn.total")}
                    </p>
                    <p className="font-semibold text-[#253150] dark:text-gray-100">
                      {data.totalPrice?.toLocaleString()} VND
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#5f6b85] dark:text-gray-400">
                      {t("confirmCheckIn.paid")}
                    </p>
                    <p className="font-semibold text-green-600">
                      {data.payment[0]?.paidAmount?.toLocaleString()} VND
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#5f6b85] dark:text-gray-400">
                      {t("confirmCheckIn.outstanding")}
                    </p>
                    <p className="font-semibold text-red-600">
                      {outstanding.toLocaleString()} VND
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* ================= FOOTER ================= */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-5 py-2 rounded-xl bg-[#EEF0F7] dark:bg-gray-800 text-[#2E3A8C] dark:text-gray-200 hover:bg-[#e2e6f3] dark:hover:bg-gray-700"
              >
                {t("common.cancelButton")}
              </button>

              <button
                onClick={handleConfirm}
                disabled={confirming}
                className={`px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition ${
                  confirming
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-[#42578E] text-white hover:bg-[#364a7d]"
                }`}
              >
                {confirming ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {t("confirmCheckIn.processing")}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    {t("confirmCheckIn.confirm")}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmCheckIn;
