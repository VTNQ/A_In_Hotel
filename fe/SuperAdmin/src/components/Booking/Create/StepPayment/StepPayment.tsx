import { useTranslation } from "react-i18next";
import PaymentForm from "./PaymentForm";
import PaymentSummary from "./PaymentSummary";
import { useMemo, useState } from "react";

const StepPayment = ({ booking, onBack, onNext, onCancel }: any) => {
  const { t } = useTranslation();
  const [discount,setDisCount] = useState(0);
  const [voucherCode,setVoucherCode] = useState("");
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <PaymentForm
            booking={booking}
            total={total}
            finalTotal={finalTotal}
            discount={discount}
            setDiscount={setDisCount}
            voucherCode={voucherCode}
            setVoucherCode={setVoucherCode}
            onSubmit={onNext}
          />
        </div>

        {/* RIGHT */}
        <PaymentSummary booking={booking} />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center mt-8">
        {/* CANCEL - BÊN TRÁI */}
        <button
          onClick={onCancel}
          className="
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
          className="text-sm text-gray-500 hover:underline"
        >
         {t("payment.actions.backServices")}
        </button>
      </div>
    </div>
  );
};
export default StepPayment;