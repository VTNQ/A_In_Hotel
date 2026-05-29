import { useEffect, useState } from "react";
import type {
  checkOutRequest,
  ConfirmCheckOutProps,
  ExtraCharge,
} from "../../../type/booking.types";
import { BedDouble, Calendar, FileText, LogOut, User, X } from "lucide-react";
import { getAll } from "../../../service/api/ExtraService";
import SelectV2 from "../../ui/SelectV2";
import { File_URL } from "../../../setting/constant/app";
import { GetBookingById, handleCheckOut } from "../../../service/api/Booking";
import { getTokens } from "../../../util/auth";
import { useAlert } from "../../alert-context";
import { useTranslation } from "react-i18next";

const ConfirmCheckOut = ({
  open,
  onCancel,
  onConfirm,
  id,
}: ConfirmCheckOutProps) => {
  const [data, setData] = useState<any>(null);
  const { t } = useTranslation();
  const [extraService, setExtraService] = useState<any[]>([]);
  const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([]);
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
      res.data.data?.details
        ?.map((d: any) => d.extraServiceId)
        .filter((x: any) => x != null) || [];

    setUsedExtraServiceIds(usedIds);
  };

  const fetchExtraService = async () => {
    const filterParts = [
      "isActive==true",
      "type==2",
      "extraCharge=gt=0",
      `hotelId==${getTokens()?.hotelId}`,
    ];

    if (usedExtraServiceIds.length > 0) {
      filterParts.push(`id=out=(${usedExtraServiceIds.join(",")})`);
    }

    const res = await getAll({
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

  if (!open || !id) return null;
  const extraTotal = extraCharges.reduce((sum, c) => sum + (c.price || 0), 0);

  const totalCharges = (data?.totalPrice ?? 0) + extraTotal;
  const outstanding = totalCharges - (data?.payment?.[0]?.paidAmount ?? 0);
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
      } as checkOutRequest;
      const response = await handleCheckOut(data.id, payload);
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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 
    bg-black/50 dark:bg-black/70 backdrop-blur-sm`}
    >
      <div
        className="
        bg-white dark:bg-[#111827]
        w-full sm:max-w-3xl 
        rounded-xl sm:rounded-2xl 
        shadow-2xl 
        overflow-hidden 
        flex flex-col max-h-[95vh] 
        ring-1 ring-black/5 dark:ring-white/10
      "
      >
        {/* ================= HEADER ================= */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 
        border-b border-gray-100 dark:border-gray-700 
        bg-white dark:bg-[#111827] sticky top-0 z-10"
        >
          <div>
            <h1 className="text-xl font-bold text-[#2A3142] dark:text-gray-100">
              {t("confirmCheckOut.title")}
            </h1>
            <p className="text-xs text-[#5F6B85] dark:text-gray-400 mt-0.5">
              {t("confirmCheckOut.subtitle")}
            </p>
          </div>

          <button
            onClick={onCancel}
            className="p-2 rounded-full 
          hover:bg-gray-50 dark:hover:bg-gray-800 
          text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white dark:bg-[#111827]">
            <div className="w-10 h-10 border-4 border-[#253150]/20 border-t-[#253150] rounded-full animate-spin" />
            <p className="mt-4 text-sm text-[#5f6b85] dark:text-gray-400">
              {t("confirmCheckOut.loading")}
            </p>
          </div>
        )}

        {/* ================= CONTENT ================= */}
        {!loading && data && (
          <>
            <div
              className="p-4 sm:px-6 py-4 sm:py-6 overflow-y-auto custom-scroll space-y-6 
            bg-white dark:bg-[#111827]"
            >
              {/* ================= GUEST + ROOM ================= */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* ===== GUEST ===== */}
                <div
                  className="relative bg-gray-50/80 dark:bg-gray-800/40 
                rounded-xl p-5 border border-gray-100 dark:border-gray-700 
                shadow-sm overflow-hidden"
                >
                  <div className="absolute top-3 right-3 opacity-10">
                    <User className="w-16 h-16 text-[#253150] dark:text-gray-300" />
                  </div>

                  <h2
                    className="text-xs font-bold uppercase tracking-wider mb-4 
                  text-[#253150] dark:text-gray-200 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    {t("confirmCheckOut.guestInfo")}
                  </h2>

                  <div className="space-y-3 relative z-10">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("confirmCheckOut.guestName")}
                      </p>
                      <p className="font-bold text-base text-gray-900 dark:text-white">
                        {data.guestName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t("confirmCheckOut.totalGuests")}
                        </p>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {data.numberOfGuests}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t("confirmCheckOut.notes")}
                        </p>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {data.note || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===== ROOM ===== */}
                <div
                  className="relative bg-gray-50/80 dark:bg-gray-800/40 
                rounded-xl p-5 border border-gray-100 dark:border-gray-700 
                shadow-sm overflow-hidden"
                >
                  <div className="absolute top-3 right-3 opacity-10">
                    <BedDouble className="w-14 h-14 text-[#253150] dark:text-gray-300" />
                  </div>

                  <h2
                    className="text-xs font-bold uppercase mb-4 
                  text-[#253150] dark:text-gray-200 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    {t("confirmCheckOut.roomInfo")}
                  </h2>

                  <div className="space-y-4 relative z-10">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t("confirmCheckOut.stayPeriod", {
                          count: data.nights,
                        })}
                      </p>

                      <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 
                      bg-white dark:bg-gray-900 
                      rounded-md border border-gray-100 dark:border-gray-700"
                      >
                        <span className="text-gray-900 dark:text-white">
                          {data.checkInDate}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="text-gray-900 dark:text-white">
                          {data.checkOutDate}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t("confirmCheckOut.roomsAssigned")}
                      </p>

                      <div className="space-y-2">
                        {data.details
                          ?.filter((d: any) => d.roomId)
                          .map((r: any) => (
                            <div
                              key={r.roomId}
                              className="flex justify-between items-center 
                              bg-white dark:bg-gray-900 
                              px-3 py-2 rounded-lg 
                              border border-gray-100 dark:border-gray-700"
                            >
                              <span className="text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#253150]" />
                                {r.roomName}
                              </span>

                              <span
                                className="text-xs font-semibold 
                              bg-gray-100 dark:bg-gray-800 
                              text-gray-800 dark:text-gray-200 
                              px-2 py-0.5 rounded-full"
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

              {/* ================= PAYMENT ================= */}
              <div
                className="bg-[#f6f8fb] dark:bg-gray-900 
              rounded-xl p-5 border border-[#d6dbea] dark:border-gray-700"
              >
                <h2 className="font-bold text-sm text-[#3A4568] dark:text-gray-200 mb-3">
                  {t("confirmCheckOut.paymentSummary")}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t("confirmCheckOut.totalCharges")}
                    </p>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">
                      {totalCharges.toLocaleString()} ₫
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t("confirmCheckOut.amountPaid")}
                    </p>
                    <p className="font-bold text-lg text-green-600">
                      {data?.payment?.[0]?.paidAmount?.toLocaleString()} ₫
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t("confirmCheckOut.outstanding")}
                    </p>
                    <p className="font-bold text-lg text-red-600">
                      {outstanding.toLocaleString()} ₫
                    </p>
                  </div>
                </div>
              </div>

              {/* ================= EXTRA CHARGES ================= */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {t("confirmCheckOut.extraCharges")}
                </h2>

                {extraCharges.map((c, idx) => (
                  <div
                    key={c.id}
                    className="flex flex-col sm:flex-row gap-3 
                    bg-white dark:bg-gray-900 
                    border border-gray-200 dark:border-gray-700 
                    rounded-xl p-3"
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
                        onChange={(serviceId) => {
                          const service = extraService.find(
                            (s) => s.id === serviceId,
                          );
                          if (!service) return;

                          const next = [...extraCharges];
                          const baseAmount = data?.totalPrice ?? 0;

                          next[idx] = {
                            id: service.id,
                            name: service.serviceName,
                            price:
                              (baseAmount * (service.extraCharge || 0)) / 100,
                            icon: service.icon,
                          };

                          setExtraCharges(next);
                        }}
                      />
                    </div>

                    <div className="w-full sm:w-40">
                      <label className="block text-xs text-gray-500 mb-1">
                        {t("confirmCheckOut.amount")}
                      </label>
                      <div className="relative">
                        <input
                          disabled
                          value={c.price.toLocaleString()}
                          className="
    w-full rounded-lg border-gray-300 dark:border-gray-600
    pr-12 py-2.5 text-right
    font-semibold text-gray-900 dark:text-white
    bg-gray-50 dark:bg-gray-800
  "
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
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
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 
                      dark:hover:bg-red-900/20 rounded-lg"
                    >
                      🗑️
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
                  className="w-full py-2.5 border-2 border-dashed rounded-xl 
                  text-gray-500 dark:text-gray-400 
                  hover:text-[#0E5E6F] dark:hover:text-white 
                  hover:border-[#0E5E6F]"
                >
                  {t("confirmCheckOut.addMoreService")}
                </button>
              </div>
            </div>

            {/* ================= FOOTER ================= */}
            <div
              className="px-6 py-5 border-t border-gray-100 dark:border-gray-700 
            bg-gray-50 dark:bg-[#0f172a] flex justify-end gap-3"
            >
              <button
                onClick={onCancel}
                className="px-5 py-2 rounded-xl 
                bg-[#EEF0F7] dark:bg-gray-800 
                text-[#2E3A8C] dark:text-gray-200"
              >
                {t("confirmCheckOut.cancel")}
              </button>

              <button
                disabled={confirming}
                onClick={handleConfirm}
                className={`px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition 
                ${
                  confirming
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-[#42578E] text-white hover:bg-[#364a7d]"
                }`}
              >
                {confirming
                  ? t("confirmCheckOut.processing")
                  : t("confirmCheckOut.confirm")}
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default ConfirmCheckOut;
