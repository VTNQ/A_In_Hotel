import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { findByIdAndDetailsActiveTrue } from "@/service/api/Booking";
import type {
  BookingResponse,
  CheckInBookingResponse,
} from "@/type/booking.types";
import { BedDouble, CreditCard, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ConfirmCheckIn = ({
  open,
  id,
  onCancel,
  onConfirm,
}: CheckInBookingResponse) => {
  const { t } = useTranslation();

  const [data, setData] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!open || !id) return;

    const fetchBooking = async () => {
      setLoading(true);

      try {
        const res = await findByIdAndDetailsActiveTrue(id);
        setData(res.data.data);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [open, id]);

  const outstanding =
    data?.totalPrice && data?.payment?.[0]?.paidAmount
      ? data.totalPrice - data.payment[0].paidAmount
      : 0;

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

  const nights = data
    ? calculateNights(
        data.checkInDate,
        data.checkInTime,
        data.checkOutDate,
        data.checkOutTime,
      )
    : 0;

  const getDurationLabel = () => {
    switch (data?.bookingPackage) {
      case 1:
        return t("confirmCheckIn.twoHours");

      case 2:
        return nights === 1
          ? t("confirmCheckIn.night", { count: 1 })
          : t("confirmCheckIn.nights", { count: nights });

      case 3:
        return t("confirmCheckIn.fullDay");

      default:
        return "";
    }
  };

  const handleConfirm = async () => {
    if (confirming) return;

    try {
      setConfirming(true);

      await onConfirm();

      onCancel();
    } catch (err) {
      console.error("Confirm check-in failed");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent
        className="
          max-w-md overflow-hidden p-0
          bg-white
          dark:bg-neutral-900
          dark:border-neutral-800
        "
      >
        {/* ===== HEADER ===== */}
        <DialogHeader className="px-6 pb-2 pt-6">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("confirmCheckIn.title")}
          </DialogTitle>

          <p className="mt-0.5 text-xs text-[#5F6B85] dark:text-neutral-400">
            {t("confirmCheckIn.subtitle")}
          </p>
        </DialogHeader>

        {/* ===== LOADING ===== */}
        {loading && (
          <div className="flex justify-center py-16">
            <div
              className="
                h-7 w-7 animate-spin rounded-full border-4
                border-indigo-200 border-t-indigo-500
                dark:border-indigo-900 dark:border-t-indigo-400
              "
            />
          </div>
        )}

        {/* ===== BODY ===== */}
        {!loading && data && (
          <div className="space-y-6 px-6 pb-6 text-sm">
            {/* ===== GUEST ===== */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 font-medium text-indigo-600 dark:text-indigo-400">
                <User className="h-4 w-4" />
                {t("confirmCheckIn.guestInfo")}
              </div>

              <div
                className="
                  grid grid-cols-2 gap-4 rounded-xl border p-4
                  border-gray-200 bg-white
                  dark:border-neutral-800 dark:bg-neutral-950
                "
              >
                <div>
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    {t("confirmCheckIn.guestName")}
                  </p>

                  <p className="font-medium text-gray-900 dark:text-white">
                    {data.guestName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    {t("confirmCheckIn.numberOfGuests")}
                  </p>

                  <p className="font-medium text-gray-900 dark:text-white">
                    {data.numberOfGuests} {t("confirmCheckIn.adults")}
                  </p>
                </div>
              </div>
            </section>

            {/* ===== ROOM ===== */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 font-medium text-indigo-600 dark:text-indigo-400">
                <BedDouble className="h-4 w-4" />
                {t("confirmCheckIn.roomInfo")}
              </div>

              <div
                className="
                  divide-y overflow-hidden rounded-xl border
                  border-gray-200
                  dark:border-neutral-800
                "
              >
                <div
                  className="
                    flex items-center justify-between px-4 py-3
                    bg-[#eef1f7]
                    dark:bg-neutral-800
                  "
                >
                  <span className="text-[#253150] dark:text-neutral-200">
                    {data.checkInDate} – {data.checkOutDate}
                  </span>

                  <span
                    className="
                      rounded-md bg-[#253150]/10 px-2 py-0.5
                      text-xs font-semibold text-[#253150]
                      dark:bg-indigo-500/20 dark:text-indigo-300
                    "
                  >
                    {getDurationLabel()}
                  </span>
                </div>

                {data.details
                  ?.filter((d: any) => d.roomId != null)
                  .map((room: any) => (
                    <div
                      key={room.roomId}
                      className="
                        flex items-center gap-3 p-4
                        bg-white
                        dark:bg-neutral-900
                      "
                    >
                      <div
                        className="
                          flex h-9 w-9 items-center justify-center rounded-full
                          bg-indigo-100
                          dark:bg-indigo-500/20
                        "
                      >
                        <BedDouble className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 dark:text-neutral-500">
                          {room.roomName}
                        </p>

                        <p className="font-medium text-gray-900 dark:text-white">
                          {room.roomType}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* ===== PAYMENT ===== */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 font-medium text-indigo-600 dark:text-indigo-400">
                <CreditCard className="h-4 w-4" />
                {t("confirmCheckIn.paymentSummary")}
              </div>

              <div
                className="
                  grid grid-cols-3 gap-4 rounded-xl border p-4
                  border-gray-200 bg-white
                  dark:border-neutral-800 dark:bg-neutral-950
                "
              >
                <div>
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    {t("confirmCheckIn.total")}
                  </p>

                  <p className="font-semibold text-gray-900 dark:text-white">
                    {data.totalPrice.toLocaleString()} VND
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    {t("confirmCheckIn.paid")}
                  </p>

                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {data.payment[0]?.paidAmount?.toLocaleString()} VND
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    {t("confirmCheckIn.outstanding")}
                  </p>

                  <p className="font-semibold text-rose-600 dark:text-rose-400">
                    {outstanding.toLocaleString()} VND
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===== FOOTER ===== */}
        <DialogFooter
          className="
            flex gap-2 border-t px-6 py-4
            border-gray-200
            dark:border-neutral-800
          "
        >
          <Button
            variant="outline"
            onClick={onCancel}
            className="
              dark:border-neutral-700
              dark:bg-neutral-900
              dark:text-white
              dark:hover:bg-neutral-800
            "
          >
            {t("common.cancel")}
          </Button>

          <Button
            className="
              bg-black text-white hover:bg-black/90
             
            "
            onClick={handleConfirm}
            disabled={confirming}
          >
            {confirming
              ? t("confirmCheckIn.processing")
              : t("confirmCheckIn.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmCheckIn;