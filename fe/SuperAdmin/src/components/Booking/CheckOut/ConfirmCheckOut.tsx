import { useAlert } from "@/components/alert-context";
import { Button } from "@/components/ui/button";
import SelectV2 from "@/components/ui/SelectV2";
import { GetBookingById, handleCheckOut } from "@/service/api/Booking";
import { getAllFicilities } from "@/service/api/facilities";
import { File_URL } from "@/setting/constant/app";
import {
  type BookingResponse,
  type ConfirmCheckOutProps,
} from "@/type/booking.types";
import {
  BedDouble,
  Calendar,
  FileText,
  LogOut,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ConfirmCheckOut = ({
  open,
  onCancel,
  onConfirm,
  id,
}: ConfirmCheckOutProps) => {
  const [data, setData] = useState<BookingResponse | null>(null);
  const { t } = useTranslation();
  const [extraService, setExtraService] = useState<any[]>([]);
  const [extraCharges, setExtraCharges] = useState<any[]>([]);
  const [usedExtraServiceIds, setUsedExtraServiceIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { showAlert } = useAlert();
  useEffect(() => {
    if (!open) {
      setData(null);
      setExtraService([]);
      setExtraCharges([]);
      setUsedExtraServiceIds([]);
      setConfirming(false);
    }
  }, [open]);
  const fetchBooking = async () => {
    const res = await GetBookingById(id);
    setData(res.data.data);

    const usedIds =
      res.data?.details
        ?.map((d: any) => d.extraServiceId)
        .filter((x: any) => x != null) || [];

    setUsedExtraServiceIds(usedIds);
  };
  const fetchExtraService = async () => {
    const filterParts = [
      "isActive==true",
      "type==2",
      "extraCharge=gt=0",
      `hotelId==${data?.hotelId}`,
    ];

    if (usedExtraServiceIds.length > 0) {
      filterParts.push(`id=out=(${usedExtraServiceIds.join(",")})`);
    }

    const res = await getAllFicilities({
      all: true,
      filter: filterParts.join(";"),
    });

    setExtraService(res.data?.content || []);
  };
  useEffect(() => {
    if (!open || !id) return;

    const init = async () => {
      setLoading(true);
      try {
        await fetchBooking();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [open, id]);
  useEffect(() => {
    if (!open) return;
    fetchExtraService();
  }, [open, usedExtraServiceIds]);

  if (!open || !id) return <></>;
  const extraTotal = extraCharges.reduce((sum, c) => sum + (c.price || 0), 0);

  const totalCharges = (data?.totalPrice ?? 0) + extraTotal;
  const outstanding = totalCharges - (data?.payment?.[0]?.paidAmount ?? 0);
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
  const selectedServiceIds = extraCharges
    .map((c) => c.id)
    .filter((id): id is number => typeof id === "number" && id > 0);
  const handleConfirm = async () => {
    if (confirming) return;
    try {
      setConfirming(true);
      const payload = {
        paidAmount: outstanding ?? 0,
        extraCharges: extraCharges.map((c) => ({
          extraServiceId: c.id,
          serviceName: c.name,
          price: c.price,
        })),
      };
      const response = await handleCheckOut(id, payload);
      showAlert({
        title:
          response?.data?.message ||
          t("confirmCheckOut.confirmCheckOutSuccess"),
        type: "success",
        autoClose: 3000,
      });
      onConfirm();
      onCancel();
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          t("confirmCheckOut.confirmCheckOutError"),
        type: "error",
      });
    } finally {
      setConfirming(false);
    }
  };
  return (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm`}
  >
    <div
      className="
        relative w-full max-w-2xl
        rounded-2xl shadow-2xl
        overflow-hidden flex flex-col
        max-h-[90vh]
        bg-white dark:bg-neutral-900
      "
    >
      {/* HEADER */}
      <div
        className="
          flex items-center justify-between px-6 py-5
          border-b border-gray-100 dark:border-neutral-800
          bg-white dark:bg-neutral-900
          sticky top-0 z-10
        "
      >
        <div>
          <h1 className="text-xl font-bold text-[#2A3142] dark:text-neutral-100">
            {t("confirmCheckOut.title")}
          </h1>

          <p className="text-xs text-[#5F6B85] dark:text-neutral-400 mt-0.5">
            {t("confirmCheckOut.subtitle")}
          </p>
        </div>

        <button
          onClick={onCancel}
          className="
            p-2 rounded-full
            hover:bg-gray-50 dark:hover:bg-neutral-800
            text-gray-400 dark:text-neutral-500
            hover:text-gray-600 dark:hover:text-neutral-300
          "
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div
          className="
            absolute inset-0 z-30
            bg-white/70 dark:bg-neutral-900/70
            backdrop-blur-sm
            flex items-center justify-center
          "
        >
          <div className="flex flex-col items-center gap-3 mt-3">
            <div
              className="
                w-10 h-10
                border-4 border-slate-200 dark:border-neutral-700
                border-t-indigo-600
                rounded-full animate-spin
              "
            />

            <span className="text-sm text-slate-500 dark:text-neutral-400">
              {t("common.loading")}
            </span>
          </div>
        </div>
      )}

      {!loading && data && (
        <>
          <div
            className="
              p-6 overflow-y-auto custom-scrollbar space-y-6
              bg-white dark:bg-neutral-900
            "
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* GUEST */}
              <div
                className="
                  relative rounded-xl p-5 overflow-hidden shadow-sm
                  bg-gray-50/80 dark:bg-neutral-800/60
                  border border-slate-200 dark:border-neutral-700
                "
              >
                <div className="absolute top-3 right-3 opacity-10">
                  <User className="w-16 h-16 text-indigo-600" />
                </div>

                <h2
                  className="
                    text-xs font-bold uppercase tracking-wider mb-4
                    flex items-center gap-2
                    text-indigo-600 dark:text-indigo-400
                  "
                >
                  <User className="w-4 h-4" />
                  {t("confirmCheckOut.guestInfo")}
                </h2>

                <div className="space-y-3 relative z-10">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      {t("confirmCheckOut.guestName")}
                    </p>

                    <p className="font-bold text-slate-800 dark:text-neutral-100 text-base">
                      {data.guestName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-neutral-400">
                          {t("confirmCheckOut.totalGuests")}
                        </p>

                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400 dark:text-neutral-500" />

                          <p className="font-semibold text-slate-700 dark:text-neutral-200">
                            {data.numberOfGuests}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 mb-1">
                          {t("confirmCheckOut.notes")}
                        </p>

                        <div className="flex items-center gap-2 mt-[-0.7vh]">
                          <FileText className="w-4 h-4 text-slate-400 dark:text-neutral-500" />

                          <p className="font-semibold text-slate-700 dark:text-neutral-200">
                            {data.note || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROOM */}
              <div
                className="
                  relative rounded-xl p-5 overflow-hidden shadow-sm
                  bg-gray-50/80 dark:bg-neutral-800/60
                  border border-slate-200 dark:border-neutral-700
                "
              >
                <div className="absolute top-3 right-3 opacity-10">
                  <BedDouble className="w-14 h-14 text-indigo-600" />
                </div>

                <h2
                  className="
                    text-xs font-bold uppercase mb-4
                    flex items-center gap-2
                    text-indigo-600 dark:text-indigo-400
                  "
                >
                  <Calendar className="w-4 h-4" />
                  {t("confirmCheckOut.roomInfo")}
                </h2>

                <div className="space-y-4 relative z-10">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mb-1">
                      {t("confirmCheckOut.stayPeriod", {
                        count: nights,
                      })}
                    </p>

                    <div
                      className="
                        inline-flex items-center gap-2 px-3 py-1.5
                        rounded-md border text-sm font-semibold
                        bg-slate-50 dark:bg-neutral-800
                        border-slate-200 dark:border-neutral-700
                        text-slate-700 dark:text-neutral-200
                      "
                    >
                      <span>{data.checkInDate}</span>

                      <span className="text-slate-400 dark:text-neutral-500">
                        →
                      </span>

                      <span>{data.checkOutDate}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mb-1">
                      {t("confirmCheckOut.roomsAssigned")}
                    </p>

                    <div className="space-y-2">
                      {data.details
                        ?.filter((d: any) => d.roomId)
                        .map((r: any) => (
                          <div
                            key={r.roomId}
                            className="
                              flex justify-between items-center
                              px-3 py-2 rounded-lg text-sm shadow-sm
                              bg-slate-50 dark:bg-neutral-800
                              border border-slate-200 dark:border-neutral-700
                            "
                          >
                            <span
                              className="
                                flex items-center gap-2
                                font-medium
                                text-slate-700 dark:text-neutral-200
                              "
                            >
                              <span className="w-2 h-2 rounded-full bg-indigo-500" />
                              {r.roomName}
                            </span>

                            <span
                              className="
                                text-xs font-semibold px-2 py-0.5 rounded-full
                                bg-indigo-50 dark:bg-indigo-500/10
                                text-indigo-700 dark:text-indigo-300
                              "
                            >
                              {r.roomType}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div
              className="
                rounded-xl p-5
                bg-[#f6f8fb] dark:bg-neutral-800/70
                border border-slate-200 dark:border-neutral-700
              "
            >
              <h2 className="font-bold text-sm text-indigo-600 dark:text-indigo-400 mb-3">
                {t("confirmCheckOut.paymentSummary")}
              </h2>

              <div className="grid grid-cols-3 gap-6 divide-x divide-slate-200 dark:divide-neutral-700">
                <div>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    {t("confirmCheckOut.totalCharges")}
                  </p>

                  <p className="text-lg font-bold text-slate-800 dark:text-neutral-100">
                    {totalCharges.toLocaleString()} ₫
                  </p>
                </div>

                <div className="pl-6">
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    {t("confirmCheckOut.amountPaid")}
                  </p>

                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {data?.payment?.[0]?.paidAmount?.toLocaleString()} ₫
                  </p>
                </div>

                <div className="pl-6">
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    {t("confirmCheckOut.outstanding")}
                  </p>

                  <p className="text-lg font-bold text-rose-600 dark:text-rose-400">
                    {outstanding.toLocaleString()} ₫
                  </p>
                </div>
              </div>
            </div>

            {/* EXTRA SERVICES */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-800 dark:text-neutral-100">
                {t("confirmCheckOut.extraCharges")}
              </h2>

              {extraCharges.map((c, idx) => (
                <div
                  key={c.id}
                  className="
                    flex items-center gap-4 rounded-xl p-3 transition
                    bg-slate-50 dark:bg-neutral-800/70
                    border border-slate-200 dark:border-neutral-700
                    hover:border-indigo-200 dark:hover:border-indigo-500/40
                  "
                >
                  <div className="flex-1">
                    <SelectV2
                      label={t("confirmCheckOut.serviceItem")}
                      value={c.id || undefined}
                      iconSrc={
                        c.icon?.url ? File_URL + c.icon.url : undefined
                      }
                      options={extraService
                        .filter(
                          (s) =>
                            s.id === c.id ||
                            !selectedServiceIds.includes(s.id),
                        )
                        .map((s) => ({
                          value: s.id,
                          label: s.serviceName,
                        }))}
                      placeholder={t("confirmCheckOut.selectService")}
                      onChange={(serviceId) => {
                        const service = extraService.find(
                          (s) => s.id === serviceId,
                        );

                        if (!service) return;

                        const next = [...extraCharges];

                        const percent = service.extraCharge || 0;
                        const baseAmount = data?.totalPrice || 0;
                        const calculatedPrice =
                          (baseAmount * percent) / 100;

                        next[idx] = {
                          id: service.id,
                          serviceName: service.serviceName,
                          price: calculatedPrice,
                          icon: service.icon,
                        };

                        setExtraCharges(next);
                      }}
                    />
                  </div>

                  <div className="w-40">
                    <label className="block text-xs text-gray-500 dark:text-neutral-400 mb-1">
                      {t("confirmCheckOut.amount")}
                    </label>

                    <div className="relative">
                      <input
                        disabled
                        value={c.price.toLocaleString()}
                        className="
                          w-full rounded-lg pr-12 py-2.5 text-right
                          font-semibold cursor-not-allowed select-none
                          bg-slate-100 dark:bg-neutral-900
                          border border-slate-200 dark:border-neutral-700
                          text-slate-700 dark:text-neutral-200
                          focus:outline-none
                        "
                      />

                      <span
                        className="
                          absolute right-3 top-1/2 -translate-y-1/2
                          text-xs text-gray-500 dark:text-neutral-400
                        "
                      >
                        VND
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setExtraCharges(
                        extraCharges.filter((_, i) => i !== idx),
                      )
                    }
                    className="
                      mt-6 p-2 rounded-lg transition
                      text-slate-400 dark:text-neutral-500
                      hover:text-rose-600 dark:hover:text-rose-400
                      hover:bg-rose-50 dark:hover:bg-rose-500/10
                    "
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}

              <button
                onClick={() =>
                  setExtraCharges([
                    ...extraCharges,
                    { id: 0, name: "", price: 0, icon: undefined },
                  ])
                }
                className="
                  w-full mt-3 py-2.5 rounded-xl
                  border-2 border-dashed transition
                  text-sm font-medium
                  border-slate-300 dark:border-neutral-700
                  text-slate-500 dark:text-neutral-400
                  hover:text-indigo-600 dark:hover:text-indigo-400
                  hover:border-indigo-500
                  hover:bg-indigo-50 dark:hover:bg-indigo-500/10
                "
              >
                {t("confirmCheckOut.addMoreService")}
              </button>
            </div>
          </div>

          {/* FOOTER */}
          <div
            className="
              px-6 py-5 flex justify-end gap-3
              border-t border-gray-100 dark:border-neutral-800
              bg-gray-50 dark:bg-neutral-900
            "
          >
            <Button variant="outline" onClick={onCancel}>
              {t("confirmCheckOut.cancel")}
            </Button>

            <Button disabled={confirming} onClick={handleConfirm}>
              {confirming
                ? t("confirmCheckOut.processing")
                : t("confirmCheckOut.confirm")}

              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  </div>
);
};
export default ConfirmCheckOut;
