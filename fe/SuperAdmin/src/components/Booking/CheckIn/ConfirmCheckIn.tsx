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
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* ===== HEADER ===== */}
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-lg font-semibold">
            {t("confirmCheckIn.title")}
          </DialogTitle>
          <p className="text-xs  text-[#5F6B85] mt-0.5">
            {t("confirmCheckIn.subtitle")}
          </p>
        </DialogHeader>

        {/* ===== BODY ===== */}
        {loading && (
          <div className="py-16 flex justify-center">
            <div className="w-7 h-7 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        )}

        {!loading && data && (
          <div className="px-6 pb-6 space-y-6 text-sm">
            {/* ===== GUEST ===== */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 font-medium">
                <User className="w-4 h-4" />
                {t("confirmCheckIn.guestInfo")}
              </div>

              <div className="rounded-xl border p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">
                    {t("confirmCheckIn.guestName")}
                  </p>
                  <p className="font-medium">{data.guestName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {t("confirmCheckIn.numberOfGuests")}
                  </p>
                  <p className="font-medium">
                    {data.numberOfGuests} {t("confirmCheckIn.adults")}
                  </p>
                </div>
              </div>
            </section>

            {/* ===== ROOM ===== */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 font-medium">
                <BedDouble className="w-4 h-4" />
                {t("confirmCheckIn.roomInfo")}
              </div>

              <div className="rounded-xl border divide-y">
                  <div className="flex justify-between items-center px-4 py-3 bg-[#eef1f7]">
                    <span className="text-[#253150]">
                      {data.checkInDate} – {data.checkOutDate}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-[#253150]/10 text-[#253150]">
                      {getDurationLabel()}
                    </span>
                  </div>
                {data.details
                  ?.filter((d: any) => d.roomId != null)
                  .map((room: any) => (
                    <div
                      key={room.roomId}
                      className="flex items-center gap-3 p-4"
                    >
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                        <BedDouble className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{room.roomName}</p>
                        <p className="font-medium">{room.roomType}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* ===== PAYMENT ===== */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 font-medium">
                <CreditCard className="w-4 h-4" />
                {t("confirmCheckIn.paymentSummary")}
              </div>

              <div className="rounded-xl border p-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">
                    {t("confirmCheckIn.total")}
                  </p>
                  <p className="font-semibold">
                    {data.totalPrice.toLocaleString()} VND
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    {t("confirmCheckIn.paid")}
                  </p>
                  <p className="font-semibold text-emerald-600">
                    {data.payment[0]?.paidAmount?.toLocaleString()} VND
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    {t("confirmCheckIn.outstanding")}
                  </p>
                  <p className="font-semibold text-rose-600">
                    {outstanding.toLocaleString()} VND
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===== FOOTER ===== */}
        <DialogFooter className="px-6 py-4 border-t flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button
            className="bg-black text-white hover:bg-black/90"
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
