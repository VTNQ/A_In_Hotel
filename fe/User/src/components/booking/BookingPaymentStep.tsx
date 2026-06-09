import { Calendar, Info, ShieldCheck } from "lucide-react";
import { MdKingBed } from "react-icons/md";
import BookingPaymentSummary from "./BookingPaymentSummary";
import { useEffect, useMemo, useState } from "react";
import { useBookingSearch } from "../../context/booking/BookingSearchContext";
import { formatBookingDateRange } from "../../util/formatDate";
import { getRoomById } from "../../service/api/Room";
import { estimateServicePrice } from "../../util/estimateServicePrice";
import { validateVoucher } from "../../service/api/Voucher";
import { useTranslation } from "react-i18next";

const BookingPaymentStep = ({ data, onChange, schedule, services }: any) => {
  const { t } = useTranslation();
  const nights = useMemo(() => {
    if (!schedule.checkInDate || !schedule.checkOutDate) return 0;
    const start = new Date(schedule.checkInDate);
    const end = new Date(schedule.checkOutDate);
    return Math.max(
      0,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );
  }, [schedule.checkInDate, schedule.checkOutDate]);
  const [isCheckVoucher, setIsCheckingVoucher] = useState(false);
  const [voucherError, setVoucherError] = useState("");
  const [voucherSuccess, setVoucherSuccess] = useState("");
  const { search } = useBookingSearch();
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState<any>(null);
  const handleApplyVoucher = async () => {
    if (!data.voucherCode) {
      setVoucherError(t("booking.payment.voucher.missing"));
      setVoucherSuccess("");
      return;
    }
    try {
      setIsCheckingVoucher(true);
      setVoucherError("");
      setVoucherSuccess("");
      const subtotal = Number(search?.totalPrice || 0) + Number(servicesTotal || 0);
      const res = await validateVoucher({
        voucherCode: data.voucherCode,
        totalAmount: subtotal,
        nights: nights,
        roomTypeIds: [room?.categoryId],
      });
      const discountAmount = res.data?.data?.discountAmount || 0;

      onChange((prev: any) => ({
        ...prev,
        discountAmount: discountAmount,
      }));
      setVoucherSuccess(t("booking.payment.voucher.success"));
    } catch (err: any) {
      onChange((prev: any) => ({
        ...prev,
        discountAmount: 0,
      }));

      setVoucherSuccess("");
      onChange((prev: any) => ({
        ...prev,
        voucherCode: "",
      }));
      setVoucherError(
        err?.response?.data?.message || t("booking.payment.voucher.error"),
      );
    } finally {
      setIsCheckingVoucher(false);
    }
  };
  useEffect(() => {
    if (!search?.roomId) return; // ✅ tránh gọi API sai

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getRoomById(search.roomId || 0);
        setRoom(response?.data?.data || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search?.roomId]);
  const servicesWithPrice = services.map((s: any) => ({
    ...s,
    estimated: estimateServicePrice(s, search?.totalPrice || 0),
  }));

  const servicesTotal = servicesWithPrice.reduce(
    (sum: number, s: any) => sum + s.estimated,
    0,
  );
  const subtotal = Number(search?.totalPrice || 0) + Number(servicesTotal || 0);
  const total = Math.max(0, subtotal - Number(data?.discountAmount || 0));
  const paidAmount = Number(total * 0.5);
  const outstanding = Math.max(0, Number(total) - paidAmount);
  if (loading) {
    return (
      <div className="grid lg:grid-cols-12 gap-8 animate-pulse">
        {/* LEFT */}
        <div className="lg:col-span-7 space-y-6">
          <div className="h-40 bg-gray-200 rounded-xl" />
          <div className="h-60 bg-gray-200 rounded-xl" />
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 space-y-4">
          <div className="h-80 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }
  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-white border border-outline-variant rounded-xl p-[24px]">
          <h2 className="font-sans text-[20px] line-clamp-1 font-semibold mb-[16px] text-on-surface">
            {t("booking.payment.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <div className="flex gap-[16px] p-[16px] rounded-lg bg-[rgb(241,244,249)] border border-outline-variant/30">
              <Calendar size={18} className="text-[rgb(65,71,84)]" />
              <div>
                <p
                  className="text-[12px] line-clamp-1 tracking-[0.02em] font-medium font-sans text-[rgb(65,71,84)]
                                uppercase"
                >
                  {t("booking.payment.checkInOut")}
                </p>
                <p className="text-[16px] line-clamp-1 font-semibold font-sans">
                  {formatBookingDateRange(
                    schedule?.checkInDate,
                    schedule?.checkOutDate,
                    nights,
                  )}
                </p>
                <p
                  className="text-[12px] line-clamp-1 tracking-[0.02em] font-medium font-sans text-[rgb(65,71,84)]
                                uppercase"
                >
                  {nights} {t("booking.payment.nights")}, {search?.adults} {t("booking.payment.adults")}, {search?.children}{" "}
                  {t("booking.payment.children")}
                </p>
              </div>
            </div>
            <div className="flex gap-[16px] p-[16px] rounded-lg bg-[rgb(241,244,249)] border border-outline-variant/30">
              <MdKingBed size={18} className="text-[rgb(65,71,84)]" />
              <div>
                <p
                  className="text-[12px] line-clamp-1 tracking-[0.02em] font-medium font-sans text-[rgb(65,71,84)]
                                uppercase"
                >
                  {t("booking.payment.selectedRoom")}
                </p>
                <p className="text-[16px] line-clamp-1 font-semibold font-sans">
                  {room?.roomName || "Loading..."}
                </p>
                <p
                  className="text-[12px] line-clamp-1 tracking-[0.02em] font-medium font-sans text-[rgb(65,71,84)]
                                uppercase"
                >
                  {room?.roomTypeName}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-outline-variant rounded-lg p-[24px]">
          <h2 className="font-sans text-[20px] line-clamp-1 font-semibold mb-[16px] text-on-surface">
            {t("booking.payment.methodTitle")}
          </h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-on-surface mb-2">
              {t("booking.payment.voucher.label")}
            </label>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={data.voucherCode || ""}
                  onChange={(e) =>
                    onChange((prev: any) => ({
                      ...prev,
                      voucherCode: e.target.value,
                    }))
                  }
                  placeholder={t("booking.payment.voucher.placeholder")}
                  className="flex-1 h-[44px] px-4 border border-outline-variant rounded-lg
                   outline-none transition-all text-sm
                   focus:ring-2 focus:ring-primary focus:border-primary"
                />

                <button
                  type="button"
                  disabled={isCheckVoucher}
                  onClick={handleApplyVoucher}
                  className={`min-w-[110px] h-[44px] px-5 rounded-lg text-sm font-medium
                    transition-all flex items-center justify-center
                    ${
                      isCheckVoucher
                        ? "bg-gray-400 text-white cursor-not-allowed opacity-70"
                        : "bg-on-surface text-white hover:opacity-90"
                    }`}
                >
                  {isCheckVoucher ? t("booking.payment.voucher.checking") : t("booking.payment.voucher.apply")}
                </button>
              </div>

              {voucherError && (
                <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-500">{voucherError}</p>
                </div>
              )}

              {voucherSuccess && (
                <div className="px-3 py-2 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm text-green-600 font-medium">
                    {voucherSuccess}
                  </p>

                  <p className="text-sm text-green-500 mt-1">
                    {t("booking.payment.voucher.discount")}: $
                    {Number(data?.discountAmount || 0).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* <div className="space-y-7">
            <label className="block relative cursor-pointer group">
              <input
                className="sr-only peer"
                type="radio"
                name="payment"
                checked={data.method === "card"}
                onChange={() =>
                  onChange((p: any) => ({ ...p, method: "card" }))
                }
              />
              <div
                className="p-[16px] border-2 border-outline-variant rounded-xl flex items-center gap-[16px]
                            group-hover:border-on-surface/50 peer-checked:border-on-surface peer-checked:bg-[rgb(251,247,242)]
                            transition-all"
              >
                <CreditCard size={18} className="text-on-surface" />
                <div className="flex-1">
                  <p className="font-sans font-bold">{t("booking.payment.methods.card")}</p>
                  <p className="font-sans text-on-surface">
                    {t("booking.payment.methods.cardDesc")}
                  </p>
                </div>
                <div
                  className="w-5 h-5 rounded-full border-2 border-[rgb(113,119,134)] flex items-center justify-center peer-checked:border-on-surface 
                                peer-checked:bg-on-surface"
                >
                  <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                </div>
              </div>
            </label>
            <label className="block relative cursor-pointer group">
              <input
                name="payment"
                className="sr-only peer"
                type="radio"
                checked={data.method === "bank"}
                onChange={() =>
                  onChange((p: any) => ({ ...p, method: "bank" }))
                }
              />
              <div
                className="p-[16px] border-2 border-outline-variant rounded-xl flex items-center gap-[16px]
                            group-hover:border-on-surface/50  
                            transition-all"
              >
                <Landmark size={18} className="text-on-surface" />
                <div className="flex-1">
                  <p className="font-sans font-bold">{t("booking.payment.methods.bank")}</p>
                  <p className="font-sans text-on-surface">
                    {t("booking.payment.methods.bankDesc")}
                  </p>
                </div>
                <div
                  className="w-5 h-5 rounded-full border-2 border-[rgb(113,119,134)] flex items-center justify-center peer-checked:border-on-surface 
                                peer-checked:bg-on-surface"
                >
                  <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                </div>
              </div>
            </label>
            <label className="block relative cursor-pointer group">
              <input
                name="payment"
                checked={data.method === "CASH"}
                onChange={() =>
                  onChange((p: any) => ({ ...p, method: "CASH" }))
                }
                className="sr-only peer"
                type="radio"
              />
              <div
                className="p-[16px] border-2 border-outline-variant rounded-xl flex items-center gap-[16px]
                            group-hover:border-on-surface/50 peer-checked:border-on-surface peer-checked:bg-[rgb(251,247,242)]
                            transition-all"
              >
                <HandCoins size={18} className="text-on-surface" />

                <div className="flex-1">
                  <p className="font-sans font-bold">{t("booking.payment.methods.cash")}</p>
                  <p className="font-sans text-on-surface">
                    {t("booking.payment.methods.cashDesc")}
                  </p>
                </div>
                <div
                  className="w-5 h-5 rounded-full border-2 border-[rgb(113,119,134)] flex items-center justify-center peer-checked:border-on-surface 
                                peer-checked:bg-on-surface"
                >
                  <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                </div>
              </div>
            </label>
          </div> */}
          {data.method === "CASH" && (
            <div className="mt-[24px] pt-[24px] border-t border-outline-variant space-y-6">
              {/* Deposit */}
              <div className="flex justify-between text-[14px]">
                <span className="text-gray-500">{t("booking.payment.summary.prepaid")}</span>
                <span className="font-medium">
                  {paidAmount?.toLocaleString()}₫
                </span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-gray-500">{t("booking.payment.summary.outstanding")}</span>
                <span className="font-medium text-red-500">
                  {outstanding?.toLocaleString()}₫
                </span>
              </div>

              {/* Note */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-on-surface">{t("booking.payment.summary.note")}</label>
                <textarea
                  className="border border-outline-variant rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t("booking.payment.summary.notePlaceholder")}
                  value={data.note}
                  onChange={(e) =>
                    onChange((p: any) => ({ ...p, note: e.target.value }))
                  }
                  rows={3}
                />
              </div>

              {/* Info */}
              <div className="text-xs text-gray-400 italic">
                {t("booking.payment.summary.cashInfo")}
              </div>
            </div>
          )}
          {/* <div className="mt-[24px] pt-[24px] border-t border-outline-variant space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <div className="flex flex-col gap-[4px]">
                <label className="font-sans text-on-surface">Card Number</label>
                <div
                  className="flex items-center px-[16px] py-[8px] border border-outline-variant rounded-lg 
                                focus-within:border-on-surface focus-within:ring-4 focus-within:ring-primary transition-all h-[44px]"
                >
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-[14px] line-clamp-1 font-normal outline-none"
                    placeholder="0000 0000 0000 0000"
                  />
                  <Lock size={18} className="text-[rgb(113,119,134)]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[4px]">
                <div className="flex flex-col gap-[4px]">
                  <label className="font-sans text-on-surface">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    className="px-[16px] py-[8px] border border-outline-variant rounded-lg focus:border-on-surface focus:ring-4 focus:ring-primary transition-all h-[44px] text-[14px] line-clamp-1 font-normal outline-none"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <label className="font-sans text-on-surface">CVV</label>
                  <input
                    type="text"
                    className="px-[16px] py-[8px] border border-outline-variant rounded-lg focus:border-on-surface focus:ring-4 focus:ring-primary transition-all h-[44px] text-[14px] line-clamp-1 font-normal outline-none"
                    placeholder="***"
                  />
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-[24px]">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={20} className="text-green-600" />
            <h2 className="font-sans text-[20px] font-semibold text-on-surface">
              {t("booking.payment.cancellation.title")}
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3 p-4 rounded-lg bg-green-50 border border-green-100">
              <Info size={18} className="text-green-600 shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-1">{t("booking.payment.cancellation.free")}</p>
                <p>{t("booking.payment.cancellation.freeDesc")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3 text-sm py-2 border-b border-outline-variant/50">
                <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-medium text-on-surface">{t("booking.payment.cancellation.within48")}</span>
                  <span className="ml-2 text-secondary">{t("booking.payment.cancellation.within48Desc")}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm py-2 border-b border-outline-variant/50">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-medium text-on-surface">{t("booking.payment.cancellation.under24")}</span>
                  <span className="ml-2 text-secondary">{t("booking.payment.cancellation.under24Desc")}</span>
                </div>
              </div>
            </div>

            <p className="text-[12px] text-gray-500 italic mt-2">
              {t("booking.payment.cancellation.footer")}
            </p>
          </div>
        </div>
      </div>
      <BookingPaymentSummary
        room={room}
        search={search}
        nights={nights}
        discountAmount={data.discountAmount}
        services={services}
        total={total}
      />
    </div>
  );
};
export default BookingPaymentStep;
