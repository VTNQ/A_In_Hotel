import { ArrowRight, Verified } from "lucide-react";
import { useTranslation } from "react-i18next";

const BookingPaymentSummary = ({
  room,
  search,
  nights,
  services,
  total,
  discountAmount = 0,
}: any) => {
  const { t } = useTranslation();
  return (
    <div className="lg:col-span-5">
      <div className="bg-white border border-outline-variant rounded-xl p-[24px] top-24 shadow-sm">
        <h2 className="text-[20px] line-clamp-1 font-semibold font-sans text-on-surface mb-[24px]">
          {t("booking.staySummary.paymentTitle")}
        </h2>
        <div className="space-y-8 pb-[24px] border-b border-outline-variant">
          <div className="flex justify-between items-center text-[14px] line-clamp-1 font-normal">
            <span className="text-on-surface">
              {room?.roomName} ({nights} {t("booking.staySummary.nights")})
            </span>

            <span className="font-semibold">
              {search.totalPrice.toLocaleString()} {t("common.vnd")}
            </span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-green-600">{t("booking.staySummary.voucherDiscount")}</span>

              <span className="font-semibold text-green-600">
                -{Number(discountAmount).toLocaleString()} {t("common.vnd")}
              </span>
            </div>
          )}
          {services.map((service: any) => (
            <div
              key={service.id}
              className="flex justify-between items-center text-[14px] line-clamp-1 font-normal"
            >
              <span className="text-on-surface">{service?.serviceName}</span>
              <span className="font-semibold">{service?.extraCharge}%</span>
            </div>
          ))}
        </div>
        <div className="py-[24px]">
          <div className="flex justify-between items-end">
            <div>
              <p className="font-sans text-[12px] text-gray-500 uppercase tracking-widest font-semibold mb-1">
                {t("booking.staySummary.totalCost")}
              </p>
              <p className="text-[28px] font-extrabold text-on-surface leading-tight">
                {Number(total).toLocaleString()} {t("common.vnd")}
              </p>
            </div>
          </div>
        </div>
        <button
          className="w-full bg-[rgb(251,247,242)] text-[rgb(24,28,32)] py-[16px] px-[24px] rounded-lg font-sans text-[14px] line-clamp-1 font-semibold 
         shadow-lg shadow-black/5 border 
         border-outline-variant hover:brightness-95 active:scale-[0.98] transition-all flex items-center justify-center gap-[16px]"
        >
          {t("booking.staySummary.confirmBooking")}
          <ArrowRight size={20} />
        </button>
        <p className="text-center font-sans text-on-surface mt-[16px] flex items-center justify-center gap-[4px]">
          <Verified size={20} className="text-[14px]" />
          {t("booking.staySummary.securePayment")}
        </p>
      </div>
    </div>
  );
};
export default BookingPaymentSummary;
