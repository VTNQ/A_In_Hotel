import { useTranslation } from "react-i18next";
import PaymentForm from "./PaymentForm";
import PaymentSummary from "./PaymentSummary";
import { useMemo, useState } from "react";

const StepPayment = ({ booking, onBack, onNext, onCancel }: any) => {
  const { t } = useTranslation();
  const [discount, setDiscount] = useState(0);
  const [voucherCode, setVoucherCode] = useState("");

  const rooms = booking.rooms || [];
  const services = booking.services || [];
  const nights = booking.selectDate?.nights || 0;
  const total = useMemo(() => {
    const roomTotal = rooms.reduce(
      (sum: number, r: any) => sum + Number(r.price || 0) * nights,
      0,
    );

    const serviceTotal = services.reduce(
      (sum: number, s: any) => sum + Number(s.price || 0),
      0,
    );

    return roomTotal + serviceTotal;
  }, [rooms, services, nights]);
  const finalTotal = Math.max(0, total - discount);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <PaymentForm
            booking={booking}
            total={total}
            finalTotal={finalTotal}
            discount={discount}
            setDiscount={setDiscount}
            voucherCode={voucherCode}
            setVoucherCode={setVoucherCode}
            onSubmit={onNext}
          />
        </div>

        {/* RIGHT */}
        <div className="lg:sticky lg:top-6 h-fit">
          <PaymentSummary booking={booking} discount={discount} />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-10 flex flex-col sm:flex-row sm:justify-between gap-4 ">
        {/* CANCEL - BÊN TRÁI */}
        <button
        onClick={onCancel}
        className="
          w-full sm:w-auto
          px-4 py-2
          rounded-lg
          text-sm font-medium
          text-red-600
          border border-red-200
          bg-red-50
          hover:bg-red-100
          hover:border-red-300
          transition
        "
      >
        {t("payment.actions.cancel")}
      </button>

        {/* BACK */}
        <button
        onClick={onBack}
        className="
          w-full sm:w-auto
          px-4 py-2
          rounded-xl
          bg-gray-100
          text-sm font-medium
          text-gray-700
          hover:bg-gray-200
          transition
        "
      >
        {t("payment.actions.backServices")}
      </button>
      </div>
    </div>
  );
};
export default StepPayment;
